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
import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL, clusterApiUrl, ComputeBudgetProgram, TransactionInstruction, VersionedTransaction, TransactionMessage } from "@solana/web3.js";
import { FaceoffProgram } from "../faceoff_program";
import { BN, Program } from "@coral-xyz/anchor";
import axios from "axios";
let ChessWebAPI = require('chess-web-api');
const IDL = require('@/app/api/chess/faceoff_program.json');

dotenv.config();

const headers = createActionHeaders();

export const GET = async () => {
  try {
    const baseHref = process.env.baseHref ?? "http://localhost:3000";

    const actions: LinkedAction[] = [
      { 
        type: "transaction",
        label: "Create", // button text
        href: `${baseHref}/api/chess/create-challenge?amount={amount}&username={username}&challengeType={challengeType}`,
        parameters: [{
          name: "username",
          label: "Enter your ingame username.",
          required: true
        },
        {
          name: "amount",
          label: "Enter wager amount in SOL",
          required: true,
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
        }]
      } ]

    const payload: ActionGetResponse = {
      type: "action",
      title: "Create Chess Wager",
      icon: 'https://images.unsplash.com/photo-1611725088431-2528430c585e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2hlc3N8ZW58MHx8MHx8fDA%3D',
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

    try {
      await chessAPI.getPlayer(username);
    } catch (err: any) {
      throw `Username- ${err.message}`;
    }

    const connection = new Connection(process.env.RPC_URL ?? clusterApiUrl('devnet'), "confirmed");

    const program: Program<FaceoffProgram> = new Program(IDL, {connection});

    const ixs: TransactionInstruction[] = [];

    const instruction = await program.methods.createChallenge(
      challengeId,
      new BN(Number(amount) * LAMPORTS_PER_SOL)
    ).accounts({
      creator: signer,
    }).instruction();

    ixs.push(instruction);

    const blockhash = await connection.getLatestBlockhash({commitment: "finalized"});

    const transaction = new Transaction({
      feePayer: signer,
      blockhash: blockhash.blockhash,
      lastValidBlockHeight: blockhash.lastValidBlockHeight,
    }).add( instruction)

    const serialTx = transaction.serialize({requireAllSignatures: false, verifySignatures: false}).toString('base64');


    const challengeJson = {
      challengeId: challengeId,
      creatorUsername: username,
      wagerAmount: amount,
      creatorPublicKey: body.account,
      challengeType: challengeTypeUpper
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
      console.log("Full axios error:", err);  // Add this log
      throw `Error while saving to db - ${err}`
    }

    // const transaction = new VersionedTransaction(
    //   new TransactionMessage({
    //     payerKey: signer,
    //     recentBlockhash: blockhash.blockhash,
    //     instructions: ixs,
    //   }).compileToV0Message()
    // );

    const message = `Your challenge has been created successfully!\nJoin with challengeId: ${challengeId}`;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        type: "transaction",
        transaction,
        message: message,
        // links: {
        //   next: {
        //     type: "post",
        //     href: `/api/chess/create-challenge/next-action?challengeId=${challengeId}&amount=${amount}&username=${username}&challengeType=${challengeType}`,
        //   },
        // },
      },
    });

    // const actionResponse: ActionPostResponse = {
    //   type: 'transaction',
    //   transaction: serialTx,
    //   message: message
    // }

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