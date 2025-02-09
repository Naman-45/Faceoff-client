import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
      const pendingPublicChallenges = await prisma.challenge.findMany({
        where: {
          status: 'PENDING',
          challengeType: 'PUBLIC'
        },
      });
  
      if (!pendingPublicChallenges || pendingPublicChallenges.length === 0) {
        return NextResponse.json(
          { error: "No pending public challenges found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(pendingPublicChallenges, { status: 200 });
    } catch (error) {
      console.error("Error fetching pending public challenges:", error);
      return NextResponse.json(
        { error: "Failed to fetch pending public challenges" },
        { status: 500 }
      );
    }
  }