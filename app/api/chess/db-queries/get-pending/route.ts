import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
      // Fetch all pending challenges
      const pendingChallenges = await prisma.challenge.findMany({
        where: {
          status: 'PENDING',
        },
      });
  
      if (!pendingChallenges || pendingChallenges.length === 0) {
        return NextResponse.json(
          { error: "No pending challenges found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(pendingChallenges, { status: 200 });
    } catch (error) {
      console.error("Error fetching pending challenges:", error);
      return NextResponse.json(
        { error: "Failed to fetch pending challenges" },
        { status: 500 }
      );
    }
  }