import { Connection, Keypair, PublicKey, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import axios from "axios";
import { FaceoffProgram } from "../faceoff_program";
import dotenv from "dotenv";

const ChessWebAPI = require('chess-web-api');

dotenv.config();

const IDL = require("@/app/api/chess/faceoff_program.json");

const connection = new Connection(process.env.RPC_URL ?? "https://api.devnet.solana.com", "confirmed");
const wallet = Keypair.fromSecretKey(new Uint8Array(JSON.parse(process.env.WALLET_PRIVATE_KEY!)));

const chessAPI = new ChessWebAPI();

const program = new Program<FaceoffProgram>(IDL, { connection });

async function checkAndSettleWagers() {
    try {
        const pendingChallenges = await axios.get(`${process.env.baseHref}/api/chess/db-queries/get-pending`);
        
        for (const challenge of pendingChallenges.data) {
            const { challengeId, creatorUsername, opponentUsername, createdAt, creatorPublicKey, opponentPublicKey } = challenge;

            const createdAtUnix = Math.floor(new Date(createdAt).getTime() / 1000);
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;

            const archivesResponse = await chessAPI.getPlayerCompleteMonthlyArchives(creatorUsername, currentYear, currentMonth);
            const games = archivesResponse.body.games.filter((game: any) =>
                (game.white.username === creatorUsername || game.white.username === opponentUsername) &&
                (game.black.username === creatorUsername || game.black.username === opponentUsername) &&
                game.end_time > createdAtUnix
            );

            if (!games.length) continue;

            const actualGame = games[0];
            const { white, black } = actualGame;

            let winnerPublicKey: string | null = null;
    
            // Determine winner or draw
            if (white.result === "win") {
              winnerPublicKey = creatorUsername === white.username ? challenge.creatorPublicKey : challenge.opponentPublicKey;
            } else if (black.result === "win") {
              winnerPublicKey = creatorUsername === black.username ? challenge.creatorPublicKey : challenge.opponentPublicKey;
            } else if (white.result === "timeout") {
              winnerPublicKey = creatorUsername === black.username ? challenge.creatorPublicKey : challenge.opponentPublicKey;
            } else if (black.result === "timeout") {
              winnerPublicKey = creatorUsername === white.username ? challenge.creatorPublicKey : challenge.opponentPublicKey;
            } else if (white.result === "draw" || black.result === "draw" || white.result === "stalemate") {
              winnerPublicKey = null;
            }

            console.log(`Settling wager for challenge ${challengeId}, winner: ${winnerPublicKey}`);
            
            let ixs: TransactionInstruction[] = []

            let instruction;
            if(winnerPublicKey != null){
            instruction = await program.methods.settleWager(
                new PublicKey(winnerPublicKey),
                challengeId,
            ).remainingAccounts([
                {pubkey: creatorPublicKey, isWritable: true, isSigner: false},
                {pubkey: opponentPublicKey, isWritable: true, isSigner: false},
            ]).instruction();
            }else {
            instruction = await program.methods.settleWager(
                null,
                challengeId,
            ).remainingAccounts([
                {pubkey: creatorPublicKey, isWritable: true, isSigner: false},
                {pubkey: opponentPublicKey, isWritable: true, isSigner: false},
            ]).instruction();
            }

            ixs.push(instruction);
        
            const blockhash = await connection.getLatestBlockhash();

            const transaction = new VersionedTransaction(
                new TransactionMessage({
                  payerKey: wallet.publicKey,
                  instructions: ixs,
                  recentBlockhash: blockhash.blockhash,
                }).compileToV0Message()
              );

            transaction.sign([wallet]);            

            const txid = await connection.sendTransaction(transaction);
        }
        } catch (error) {
        console.error("Error processing wagers:", error);
        }
}

// setInterval(checkAndSettleWagers, 60000); // Runs every minute
