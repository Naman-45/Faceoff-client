import { ChallengeType } from "@prisma/client";
import {
    createActionHeaders,
    NextActionPostRequest,
    ActionError,
    CompletedAction,
  } from "@solana/actions";
  import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
  import dotenv from 'dotenv';
  import twilio from "twilio";

  dotenv.config();
  
  // create the standard headers for this route (including CORS)
  const headers = createActionHeaders();

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;


  const client = twilio(accountSid, authToken);

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
      const challengeId = searchParams.get('challengeId');
      const challengeType = searchParams.get('challengeType');
      const phoneNumber = searchParams.get('phoneNumber');

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
        process.env.SOLANA_RPC! || clusterApiUrl("devnet"),
      );

      const MAX_RETRIES = 5;
      const RETRY_DELAY = 2000; // 2 seconds
      
      const waitForConfirmation = async (signature: string) => {
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
          try {
            const status = await connection.getSignatureStatus(signature, {
              searchTransactionHistory: true
            });
      
            if (status.value?.confirmationStatus === 'confirmed' || 
                status.value?.confirmationStatus === 'finalized') {
              return status;
            }
      
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
          } catch (error) {
            if (attempt === MAX_RETRIES) throw error;
          }
        }
      };

      try {
        const status = await waitForConfirmation(signature);
  
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


      if(phoneNumber){
      let messageContent: string;
      if(challengeType == 'PUBLIC'){
        messageContent = `Wait for someone to accept your challenge.`
      }else{
        messageContent = `Share the challengeId with whomever you want to challenge.`
      }
        const message = await client.messages.create({
          body: `Challenge created successfully with challengeId - ${challengeId}.\n \n ${messageContent}`,
          from: twilioPhoneNumber,
          to: phoneNumber,
      });
      }
      
      const payload: CompletedAction = {
        type: "completed",
        title: "Challenge successfully created!",
        icon: 'https://images.unsplash.com/photo-1611725088431-2528430c585e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2hlc3N8ZW58MHx8MHx8fDA%3D',
        label: "Complete!",
        description:
          `You have now successfully created Chess challenge ` +
          `Here was the signature from the last action's transaction: ${signature} and this is the challengeId - ${challengeId} `,
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