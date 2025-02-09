import {
    createActionHeaders,
    NextActionPostRequest,
    ActionError,
    CompletedAction,
  } from "@solana/actions";
  import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
  import dotenv from 'dotenv';
  import { PrismaClient } from '@prisma/client';
  import twilio from "twilio";

  const prisma = new PrismaClient();

  dotenv.config();

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

  const client = twilio(accountSid, authToken);
  
  const headers = createActionHeaders();

  export const GET = async () => {
    return Response.json({ message: "Method not supported" } as ActionError, {
      status: 403,
      headers,
    });
  };

  export const OPTIONS = async () => Response.json(null, { headers });
  
  export const POST = async (req: Request) => {
    try {

      const body: NextActionPostRequest = await req.json();

      const { searchParams } = new URL(req.url);
      const challengeId = searchParams.get('challengeId') ?? '';
      const username = searchParams.get('username');
      let opponentPhoneNumber = searchParams.get('opponentPhoneNumber');
      let creatorPhoneNumber = searchParams.get('creatorPhoneNumber');

      let account: PublicKey;
      try {
        account = new PublicKey(body.account);
      } catch (err) {
        throw `Invalid "account" provided ${err}`;
      }
  
      let signature: string | undefined;
      try {
        signature = body.signature;
        if (!signature) throw "Invalid signature";
      } catch (err) {
        throw `Invalid "signature" provided ${err}`;
      }
  
      const connection = new Connection(
        process.env.SOLANA_RPC ?? clusterApiUrl("devnet"),
      );
  
      try {
        const status = await connection.getSignatureStatus(signature);
  
        if (!status) throw "Unknown signature status";
  
        // only accept `confirmed` and `finalized` transactions
        if (status.value?.confirmationStatus) {
          if (
            status.value.confirmationStatus != "confirmed" &&
            status.value.confirmationStatus != "finalized"
          ) {
            throw "Unable to confirm the transaction";
          }
        }

      } catch (err) {
        if (typeof err == "string") throw err;
        throw "Unable to confirm the provided signature";
      }

      const transaction = await connection.getParsedTransaction(
        signature,
        "confirmed",
      );
      
      if(opponentPhoneNumber){
        opponentPhoneNumber = `+91${opponentPhoneNumber}`;
          const message = await client.messages.create({
            body: `You have successfully joined the challenge. \n \n ChallengeId - ${challengeId}.`,
            from: twilioPhoneNumber,
            to: opponentPhoneNumber,
        });
      }
      if(creatorPhoneNumber){
        creatorPhoneNumber = `+91${creatorPhoneNumber}`;
        const message = await client.messages.create({
          body: `${username} joined your challenge having challengeId - ${challengeId}.`,
          from: twilioPhoneNumber,
          to: creatorPhoneNumber
        })
      }

    await prisma.challenge.update({
        where : {
            challengeId: challengeId
        },
        data: {
            status: "ACCEPTED",
            opponentPublicKey: body.account,
            opponentUsername: username,
            opponentPhoneNumber: opponentPhoneNumber
        }
    })
  
      const payload: CompletedAction = {
        type: "completed",
        title: "Challenge joined successfully",
        icon: 'https://res.cloudinary.com/dxyexbgt6/image/upload/v1738417677/challenge-joined-successfully_zzam4f.jpg',
        label: "Complete!",
        description:
          `You have now successfully joined the challenge against ${username},Play the match and settle the wager.` +
          `\n Here was the signature from the last action's transaction:\n ${signature} \n and this is the challengeId -\n ${challengeId} `,
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