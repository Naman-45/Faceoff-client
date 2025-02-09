import {
    createActionHeaders,
    NextActionPostRequest,
    ActionError,
    CompletedAction,
  } from "@solana/actions";
  import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
  import dotenv from 'dotenv';
  import { PrismaClient } from '@prisma/client';

  const prisma = new PrismaClient();

  dotenv.config();
  
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
  
      console.log("body:", body);
  
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
  
      try {
        const status = await connection.getSignatureStatus(signature);
  
        if (!status) throw "Unknown signature status";

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

    await prisma.challenge.update({
        where : {
            challengeId: challengeId
        },
        data: {
            status: "COMPLETED",
        }
    })
  
      const payload: CompletedAction = {
        type: "completed",
        title: "Wager settled suuccessfully",
        icon: 'https://images.unsplash.com/photo-1611725088431-2528430c585e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2hlc3N8ZW58MHx8MHx8fDA%3D',
        label: "Complete!",
        description:
          `As per the result of the matchup, wagers are settled successfully!` +
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