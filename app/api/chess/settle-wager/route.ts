import { Program } from "@coral-xyz/anchor";
import { 
    ActionError, 
    ActionGetResponse, 
    ActionPostRequest, 
    ActionPostResponse, 
    createActionHeaders, 
    createPostResponse 
} from "@solana/actions";
import { clusterApiUrl, Connection, PublicKey, Transaction } from "@solana/web3.js";
import axios from "axios";
import { FaceoffProgram } from "../faceoff_program";

const ChessWebAPI = require('chess-web-api');

const IDL = require('@/app/api/chess/faceoff_program.json');

// create the standard headers for this route (including CORS)
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

      const response = await axios.get(`${process.env.baseHref}/api/chess/db-queries?challengeId=${challengeId}`);
      
      // Access the data from the response
      const challenge = response.data;

    const opponentUsername = challenge.opponentUsername;
    const creatorUsername = challenge.creatorUsername;
    const createdAtUnix = Math.floor(new Date(challenge.createdAt).getTime() / 1000);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    let winnerPublicKey: string | null = null;
    const chessAPI = new ChessWebAPI();
    try {
      // Convert the chess.com API call to use async/await
    const archivesResponse = await new Promise((resolve, reject) => {
      chessAPI.getPlayerCompleteMonthlyArchives(creatorUsername, currentYear, currentMonth - 1)
        .then((response: any) => resolve(response))
        .catch((err: any) => reject(`error while getting games from chess api - ${err}`));
    });
    //@ts-ignore
    const games = archivesResponse.body.games.filter((game: any) => {
      return (game.white.username === creatorUsername || game.white.username === opponentUsername) &&
             (game.black.username === creatorUsername || game.black.username === opponentUsername) && 
             game.end_time > createdAtUnix;
    });

    if (!games || games.length === 0) {
      throw "No matching game found";
    }

    const actualgame = games[0];
    const { white, black } = actualgame;
  
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
    }catch(err){
      throw `${err}`
    }
    
  
      let signer: PublicKey;
      try {
        signer = new PublicKey(body.account);
      } catch (err) {
        throw `Invalid account provided, ${err}`;
      }
  
      const connection = new Connection(process.env.RPC_URL ?? clusterApiUrl('devnet'), "confirmed");

      const program: Program<FaceoffProgram> = new Program(IDL, {connection});
      const creatorPublicKey = new PublicKey(challenge.creatorPublicKey);
      const opponentPublicKey = new PublicKey(challenge.opponentPublicKey);

      const instruction = await program.methods.settleWager(
        winnerPublicKey ? new PublicKey(winnerPublicKey) : null,
        challengeId,
      ).accounts({
        opponent: creatorPublicKey,
        creator: opponentPublicKey
      }).instruction();
      
  
      const blockhash = await connection.getLatestBlockhash();
  
      const transaction = new Transaction({
        feePayer: signer,
        blockhash: blockhash.blockhash,
        lastValidBlockHeight: blockhash.lastValidBlockHeight,
      }).add(instruction)
    
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