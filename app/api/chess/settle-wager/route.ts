import { web3, Program } from "@coral-xyz/anchor";
import { 
    ActionError, 
    ActionGetResponse, 
    ActionPostRequest, 
    ActionPostResponse, 
    createActionHeaders, 
    createPostResponse 
} from "@solana/actions";
import { clusterApiUrl, PublicKey, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import axios from "axios";
import { Reclaim } from "../reclaim";
const { ReclaimClient } = require('@reclaimprotocol/zk-fetch');
import { verifyProof, transformForOnchain } from "@reclaimprotocol/js-sdk";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import dotenv from 'dotenv';
dotenv.config();

const client = new ReclaimClient(process.env.RECLAIM_APP_ID, process.env.RECLAIM_APP_SECRET);

const IDL = require('@/app/api/chess/reclaim.json');

const headers = createActionHeaders();

export const GET = async (req: Request) => {
  try {

    const { searchParams } = new URL(req.url);
    const challengeId = searchParams.get('challengeId');

    const baseHref = process.env.baseHref ?? "http://localhost:3000";

    const payload: ActionGetResponse = {
      type: "action",
      title: "Settle the wager now, challenge is over!",
      icon: 'https://images.unsplash.com/photo-1591334770544-a83728c5768b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      description: `Settle wager for challenge id - ${challengeId}`,
      label: "Settle",
      links: {
        actions: [{
            type: "transaction",
            label: "Settle",
            href: `${baseHref}/api/chess/settle-wager?challengeId=${challengeId}`
        }]
      }
    };

    return Response.json(payload, {
      headers,
    });
  } catch (err) {
    console.log(err);
    const actionError: ActionError = { message: "An unknown error occurred" };
    if (typeof err == "string") actionError.message = err;
    return Response.json(actionError, {
      status: 400,
      headers,
    });
  }
};

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = async () => Response.json(null, { headers });

export const POST = async (req: Request) => {
    try {

      const body: ActionPostRequest = await req.json();

      const { searchParams } = new URL(req.url);

      const challengeId = searchParams.get("challengeId") ?? '';

      let signer: PublicKey;
      try {
        signer = new PublicKey(body.account);
      } catch (err) {
        throw `Invalid account provided, ${err}`;
      }

      const response = await axios.get(`${process.env.baseHref}/api/chess/db-queries?challengeId=${challengeId}`);
      
      // Access the data from the response
    const challenge = response.data;
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
        signer: signer,
        creator: creatorPublicKey,
        opponent: opponentPublicKey,
        tokenMint: usdc_mint,
        tokenProgram: TOKEN_PROGRAM_ID
      }).instruction();

      ixs.push(instruction);
        
      const blockhash = await connection.getLatestBlockhash();
      
      const transaction = new VersionedTransaction(
        new TransactionMessage({
        payerKey: signer,
        instructions: ixs,
        recentBlockhash: blockhash.blockhash,
      }).compileToV0Message()
   );
  
      const simulation = await connection.simulateTransaction(transaction);
      console.log(simulation);
    
      const payload: ActionPostResponse = await createPostResponse({
        fields: {
          type: "transaction",
          transaction,
          message: "Settle wager!",
          links: {
            next: {
              type: "post",
              href: `/api/chess/settle-wager/next-action?challengeId=${challengeId}`,
            },
          },
        },
      });
  
      return Response.json(payload, {
        headers,
      });
    } catch (err) {
      console.log(err);
      const actionError: ActionError = { message: "An unknown error occurred" };
      if (typeof err == "string") actionError.message = err;
      return Response.json(actionError, {
        status: 400,
        headers,
      });
    }
  };