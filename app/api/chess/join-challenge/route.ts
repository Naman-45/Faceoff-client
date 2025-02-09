import { 
    ActionError, 
    ActionGetResponse, 
    ActionPostRequest, 
    ActionPostResponse, 
    createActionHeaders, 
    createPostResponse 
} from "@solana/actions";
import { 
    clusterApiUrl, 
    Connection, 
    PublicKey, 
    Transaction 
} from "@solana/web3.js";
import dotenv from 'dotenv'
import { Reclaim } from "../reclaim";
import { BN, Program } from "@coral-xyz/anchor";
import axios from "axios";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { joinChallengeSchema } from "./types";
import { parse } from "path";

let ChessWebAPI = require('chess-web-api');

const IDL = require('@/app/api/chess/reclaim.json');

dotenv.config();

// create the standard headers for this route (including CORS)
const headers = createActionHeaders();

export const GET = async (req: Request) => {
  try {

    const { searchParams } = new URL(req.url);
    const challengeId = searchParams.get('challengeId');

    const baseHref = process.env.baseHref ?? "http://localhost:3000";

    const payload: ActionGetResponse = {
      type: "action",
      title: "Join Chess challenge and show the opponent who is the real boss 😎.",
      icon: 'https://images.unsplash.com/photo-1591334770544-a83728c5768b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      description: `Join challenge, challenge id - ${challengeId}`,
      label: "Join",
      links: {
        actions: [{
            type: "transaction",
            label: "Join",
            href: `${baseHref}/api/chess/join-challenge?challengeId=${challengeId}&username={username}&phoneNumber={phoneNumber}`,
            parameters: [{
              name: "username",
              label: "Enter your ingame username.",
              required: true
            },
            {
              name: "phoneNumber",
              label: "Enter phone number to recieve updates",
              type: 'number'
            }
          ]
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

export const OPTIONS = async () => Response.json(null, { headers });

export const POST = async (req: Request) => {
    try {

      const body: ActionPostRequest<{ username: string, challengeId: string }> & {
        params: ActionPostRequest<{ username: string, challengeId: string }>["data"];
      } = await req.json();

      const { searchParams } = new URL(req.url);

      const username = searchParams.get('username')
      const challengeId = searchParams.get("challengeId");
      const opponentPhoneNumber = searchParams.get("phoneNumber") ?? 0

      if (!challengeId) {
         throw "Invalid challengeId provided";
      }

      const parsedInput = joinChallengeSchema.safeParse({
        username,
        phoneNumber: opponentPhoneNumber
      })

      if(!parsedInput.success){
        throw `Runtime validation failed with error - ${parsedInput.error.message}`;
      }

      const chessAPI = new ChessWebAPI();

      try {
        const response = await chessAPI.getPlayer(username);
      } catch (err: any) {
        throw `Username- ${err.message}`;
      }

      const response = await axios.get(`${process.env.baseHref}/api/chess/db-queries?challengeId=${challengeId}`);

      // Access the data from the response
      const challenge = response.data;
      const amount = challenge.wagerAmount;
      const creatorPhoneNumber = challenge.creatorPhoneNumber ?? null;

      let signer: PublicKey;
      try {
        signer = new PublicKey(body.account);
      } catch (err) {
        throw `Invalid account provided, ${err}`;
      }
      
      const usdc_mint = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');
      const connection = new Connection(process.env.RPC_URL ?? clusterApiUrl('devnet'), "confirmed");

      const program: Program<Reclaim> = new Program(IDL, {connection});

      const instruction = await program.methods.joinChallenge(
        challengeId,
        new BN(amount * 1000000)
      ).accounts({
        opponent: signer,
        tokenMint: usdc_mint,
        tokenProgram: TOKEN_PROGRAM_ID
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
          message: "Challenge joined successfully 🎉!",
          links: {
            next: {
              type: "post",
              href: `/api/chess/join-challenge/next-action?challengeId=${challengeId}&username=${username}&opponentPhoneNumber=${opponentPhoneNumber}&creatorPhonenumber=${creatorPhoneNumber}`,
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