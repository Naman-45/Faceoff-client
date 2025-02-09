import { 
  ActionError, 
  ActionGetResponse, 
  ActionPostRequest, 
  ActionPostResponse, 
  createActionHeaders, 
  createPostResponse, 
  LinkedAction 
} from "@solana/actions";
import crypto from 'crypto';
import dotenv from 'dotenv';
import { 
  Connection, 
  PublicKey, 
  clusterApiUrl, 
  TransactionInstruction, 
  VersionedTransaction,
  TransactionMessage
} from "@solana/web3.js";
import { Reclaim } from "../reclaim";
import { BN,  Program } from "@coral-xyz/anchor";
import axios from "axios";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { createChallengeSchema, createChallengeType } from "./types";
let ChessWebAPI = require('chess-web-api');

const IDL = require('@/app/api/chess/reclaim.json');

dotenv.config();

const headers = createActionHeaders();

export const GET = async () => {
  try {
    const baseHref = process.env.baseHref ?? "http://localhost:3000";

    const actions: LinkedAction[] = [
      { 
        type: "transaction",
        label: "Create", // button text
        href: `${baseHref}/api/chess/create-challenge?amount={amount}&username={username}&challengeType={challengeType}&phoneNumber={phoneNumber}`,
        parameters: [{
          name: "username",
          label: "Enter your ingame username.",
          required: true
        },
        {
          name: "amount",
          label: "Enter wager amount in USDC",
          required: true,
          type: "number"
        },
        {
          name: "phoneNumber",
          label: "Enter phone number to recieve updates",
          type: "number"
        },
        {
          name: "challengeType",
          label: "Choose Challenge Type",
          type: "radio",
          options: [
            {
              label: "Public",
              value: "Public",
              selected: true,
            },
            {
              label: "Private",
              value: "Private",
            }
          ],
        }
      ],        
      } ]

    const payload: ActionGetResponse = {
      type: "action",
      title: "Create Chess Wager",
      icon: 'https://imgs.search.brave.com/VmrYdxckKlGtsohCKcRm1aDHxFrMkGim0w_gma4B18o/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTcx/MjQ5MTUwL3Bob3Rv/L2NoZXNzLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1WSUp1/WHlZbWFicnJ6Qkl0/TU1JYTcwR01uNzc4/cUlLakxfRkszdURL/N3RFPQ',
      description: "Play a quick blitz match and lets see who comes out on top over the board 😎.",
      label: "Wager", // this value will be ignored since `links.actions` exists
      links: {
          actions
      },
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

// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = async () => Response.json(null, { headers });

export const POST = async (req: Request) => {
  try {

    const body: ActionPostRequest<{ amount: number, username: string, challengeType: string  }> & {
      params: ActionPostRequest<{ amount: number, username: string, challengeType: string }>["data"];
    } = await req.json();

    const { searchParams } = new URL(req.url);

    const amount = searchParams.get('amount');
    const username = searchParams.get('username');
    const challengeType = searchParams.get('challengeType') ?? 'Public';
    const phoneNumber = searchParams.get('phoneNumber') ?? null;

    const validChallengeTypes = ["PUBLIC", "PRIVATE"];
    const challengeTypeUpper = challengeType.toUpperCase();
      if (!validChallengeTypes.includes(challengeTypeUpper)) {
            return Response.json({ error: "Invalid challenge type" }, { status: 400 });
      }

    const challengeId = crypto.randomBytes(16).toString('hex');

    let signer: PublicKey;
    try {
      signer = new PublicKey(body.account);
    } catch (err) {
      throw `Invalid "account" provided ${err}`;
    }

    if (!amount) {
      throw 'Amount not found';
    }

    if (!username) {
      throw 'Username not found';
    }

    const chessAPI = new ChessWebAPI();

    const amountNumber = Number(amount);

    const parsedInput = createChallengeSchema.safeParse({
      username,
      amount: amountNumber,
      phoneNumber,
      challengeType
    });

    if(!parsedInput.success){
      throw `Runtime validation failed with error - ${parsedInput.error.message}`
    }

    try {
      const response = await chessAPI.getPlayer(username);
    } catch (err: any) {
      throw `Username- ${err.message}`;
    }
    const connection = new Connection(process.env.RPC_URL ?? clusterApiUrl('devnet'), "confirmed");

    const usdc_mint = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');

    const program: Program<Reclaim> = new Program(IDL, {connection});

    const ixs: TransactionInstruction[] = [];

    const instruction = await program.methods.createChallenge(
      challengeId,
      new BN(Number(amount) * 1000000)
    ).accounts({
      creator: signer,
      tokenMint: usdc_mint,
      tokenProgram: TOKEN_PROGRAM_ID
    }).instruction();

    ixs.push(instruction);

    const blockhash = await connection.getLatestBlockhash({commitment: "finalized"});

     const transaction = new VersionedTransaction(
          new TransactionMessage({
          payerKey: signer,
          instructions: ixs,
          recentBlockhash: blockhash.blockhash,
        }).compileToV0Message()
     );

    const challengeJson = {
      challengeId: challengeId,
      creatorUsername: username,
      wagerAmount: amount,
      creatorPublicKey: body.account,
      challengeType: challengeTypeUpper,
      creatorPhoneNumber: phoneNumber
    }

    const baseHref = process.env.baseHref ?? "http://localhost:3000"

    console.log("Payload being sent to DB:", challengeJson);

    try {
      await axios.post(`${baseHref}/api/chess/db-queries`, 
        challengeJson,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (err) {
      console.log("Full axios error:", err);
      throw `Error while saving to db - ${err}`
    }

    const simResult = await connection.simulateTransaction(transaction);
    console.log("Simulation result:", simResult);

    const message = `Challenge created Successfully 🎉!`;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        type: "transaction",
        transaction,
        message: message,
        links: {
          next: {
            type: "post",
            href: `/api/chess/create-challenge/next-action?challengeId=${challengeId}&amount=${amount}&username=${username}&challengeType=${challengeTypeUpper}&phoneNumber=${phoneNumber}`,
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