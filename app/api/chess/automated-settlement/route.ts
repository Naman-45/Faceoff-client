import { clusterApiUrl, Connection, Keypair, PublicKey, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { AnchorProvider,web3, Program, Wallet } from "@coral-xyz/anchor";
import axios from "axios";
import { Reclaim } from "../reclaim";
import dotenv from "dotenv";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { verifyProof, transformForOnchain } from "@reclaimprotocol/js-sdk";
const { ReclaimClient } = require('@reclaimprotocol/zk-fetch');

const ChessWebAPI = require('chess-web-api');
const client = new ReclaimClient(process.env.RECLAIM_APP_ID, process.env.RECLAIM_APP_SECRET);

dotenv.config();

const IDL = require("@/app/api/chess/reclaim.json");

const connection = new Connection(process.env.RPC_URL ?? "https://api.devnet.solana.com", "confirmed");
const keypair = Keypair.fromSecretKey(new Uint8Array(JSON.parse(process.env.WALLET_PRIVATE_KEY!)));
const wallet = new Wallet(keypair);

const provider = new AnchorProvider(connection, wallet);

const chessAPI = new ChessWebAPI();

const program = new Program<Reclaim>(IDL, provider);

async function checkAndSettleWagers() {
    try {
        const pendingChallenges = await axios.get(`${process.env.baseHref}/api/chess/db-queries/get-pending`);
        
        for (const challenge of pendingChallenges.data) {

            let proof;
            let proofData;
            try {
              const createdAtUnix = Math.floor(new Date(challenge.createdAt).getTime() / 1000);
              const currentDate = new Date();
              const currentYear = currentDate.getFullYear();
              const currentMonth = currentDate.getMonth() + 1;
              const monthStr = currentMonth < 10 ? `0${currentMonth}` : currentMonth.toString();
              
              const url = `https://api.chess.com/pub/player/${challenge.creatorUsername}/games/${currentYear}/${monthStr}`;
              
              // First, let's fetch and log the raw games data
              const rawResponse = await fetch(url);
              const rawData = await rawResponse.json();
              
              // Find the first valid game between the players after wager creation
              const validGame = rawData.games?.find((game: any) => {
                const isValidPlayers = (
                  (game.white.username === challenge.creatorUsername && game.black.username === challenge.opponentUsername) ||
                  (game.white.username === challenge.opponentUsername && game.black.username === challenge.creatorUsername)
                );
                const isAfterWager = parseInt(game.end_time) > createdAtUnix;
                return isValidPlayers && isAfterWager;
              });
        
              if (!validGame) {
                throw new Error("No valid game found between the players after wager creation");
              }
        
              const responseMatches = [
                {
                  type: "regex",
                  value: `"end_time":\\s*${validGame.end_time}`
                },
                {
                  type: "regex",
                  value: `"white":\\s*\\{[^}]*"result":\\s*"${validGame.white.result}"[^}]*"username":\\s*"${validGame.white.username}"[^}]*\\}`
                },
                {
                  type: "regex",
                  value: `"black":\\s*\\{[^}]*"result":\\s*"${validGame.black.result}"[^}]*"username":\\s*"${validGame.black.username}"[^}]*\\}`
                }
              ];
          
              proof = await client.zkFetch(url, {
                method: 'GET',
              }, {
                responseMatches
              });
          
              // Verify the proof
              const isVerified = await verifyProof(proof);
              if (!isVerified) {
                throw new Error('Chess.com API proof verification failed.');
              }
               
              proofData = transformForOnchain(proof);
        
            } catch (error) {
              console.error('Error getting game proof:', error);
              throw error;
            }  
          
              const connection = new web3.Connection(process.env.RPC_URL ?? clusterApiUrl('devnet'), "confirmed");
        
              const program: Program<Reclaim> = new Program(IDL,{connection});
        
              const usdc_mint = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');
              const creatorPublicKey = new PublicKey(challenge.creatorPublicKey);
              const opponentPublicKey = new PublicKey(challenge.opponentPublicKey);
        
              let ixs: TransactionInstruction[] = [];
              const instruction = await program.methods.settleWager(
                challengeId,
                proofData
              ).accounts({
                signer: keypair.publicKey,
                creator: creatorPublicKey,
                opponent: opponentPublicKey,
                tokenMint: usdc_mint,
                tokenProgram: TOKEN_PROGRAM_ID
              }).instruction();
        
              ixs.push(instruction);
                
              const blockhash = await connection.getLatestBlockhash();
              
              const transaction = new VersionedTransaction(
                new TransactionMessage({
                payerKey: keypair.publicKey,
                instructions: ixs,
                recentBlockhash: blockhash.blockhash,
              }).compileToV0Message()
           );
          
            transaction.sign([keypair]);            

            const txid = await connection.sendTransaction(transaction);
        }
        } catch (error) {
        console.error("Error processing wagers:", error);
        }
}

checkAndSettleWagers();
// setInterval(checkAndSettleWagers, 60000); // Runs every minute
