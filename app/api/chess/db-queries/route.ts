import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
 
    const { 
      challengeId,
      creatorUsername, 
      wagerAmount, 
      creatorPublicKey,
      challengeType 
    } = body;

    // Validate required fields
    if (!challengeId || !creatorUsername || !wagerAmount || !creatorPublicKey) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save challenge details
    const challenge = await prisma.challenge.create({
      data: {
        challengeId,
        creatorUsername,
        wagerAmount: Number(wagerAmount),
        creatorPublicKey,
        challengeType,
        status: 'PENDING'
      }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Challenge saved successfully',
      challenge 
    });

  } catch (error) {
    console.error('Error saving challenge:', error);
    return NextResponse.json(
      { error: 'Failed to save challenge' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const challengeId = searchParams.get("challengeId");

    if (!challengeId) {
      return NextResponse.json(
        { error: "Missing challengeId" },
        { status: 400 }
      );
    }

    const challenge = await prisma.challenge.findUnique({
      where: { challengeId },
    });

    return NextResponse.json(challenge, { status: 200 });
  } catch (error) {
    console.error("Error fetching challenge:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenge" },
      { status: 500 }
    );
  }
}