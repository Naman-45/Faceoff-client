import { 
    ActionError, 
    ActionGetResponse, 
    ActionPostRequest, 
    ActionPostResponse, 
    createActionHeaders, 
    createPostResponse 
} from "@solana/actions";
import { clusterApiUrl, 
    ComputeBudgetProgram, 
    Connection, 
    LAMPORTS_PER_SOL, 
    PublicKey, 
    Transaction 
} from "@solana/web3.js";
import dotenv from 'dotenv'
import { FaceoffProgram } from "../faceoff_program";
import { BN, Program } from "@coral-xyz/anchor";
import axios from "axios";

const IDL = require('@/app/api/chess/faceoff_program.json');

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
            href: `${baseHref}/api/chess/join-challenge?challengeid=${challengeId}&username={username}`,
            parameters: [{
              name: "username",
              label: "Enter your ingame username.",
              required: true
            }]
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

      const body: ActionPostRequest<{ username: string, }> & {
        params: ActionPostRequest<{ username: string }>["data"];
      } = await req.json();

      const { searchParams } = new URL(req.url);

      const username = (body.params?.username || body.data?.username) as
      | string
      | undefined;

      const challengeId = searchParams.get("challengeId") ?? '';

      const response = await axios.get(`${process.env.baseHref}/api/chess/db-queries`, {
        params: {
          challengeId,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Access the data from the response
      const challenge = response.data;

      const amount = challenge.wagerAmount;

      let signer: PublicKey;
      try {
        signer = new PublicKey(body.account);
      } catch (err) {
        throw `Invalid account provided, ${err}`;
      }
  
      const connection = new Connection(process.env.RPC_URL ?? clusterApiUrl('devnet'), "confirmed");

      const program: Program<FaceoffProgram> = new Program(IDL, {connection});

      const instruction = await program.methods.joinChallenge(
        challengeId,
        new BN(amount * LAMPORTS_PER_SOL)
      ).accounts({
        opponent: signer,
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
          message: "Join challenge!",
          links: {
            next: {
              type: "post",
              href: `/api/chess/join-challenge/next-action?challengeId=${challengeId}&username=${username}`,
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