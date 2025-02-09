import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
      const acceptedChallenges = await prisma.challenge.findMany({
        where: {
          status: 'ACCEPTED',
        },
      });
  
      if (!acceptedChallenges || acceptedChallenges.length === 0) {
        return NextResponse.json(
          { error: "No accepted challenges found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(acceptedChallenges, { status: 200 });
    } catch (error) {
      console.error("Error fetching accepted challenges:", error);
      return NextResponse.json(
        { error: "Failed to fetch accepted challenges" },
        { status: 500 }
      );
    }
  }