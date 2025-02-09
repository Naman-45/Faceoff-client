"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from 'axios'

interface PublicChallenges {
  id: string;
  challengerUsername: string;
  blitzRating: number;
  wagerAmount: number;
}

export default function JoinChallenge() {
  const [challengeId, setChallengeId] = useState("");
  const [publicChallenges, setPublicChallenges] = useState<PublicChallenges[]>([]);

  useEffect(() => {
    async function getPublicChallenges() {
      try {
        const response = await axios.get(`/api/chess/db-queries/get-all-public-challenges`);
        
        const challengeData = await Promise.all(
          response.data.map(async (challenge: any) => {
            try {
              const chessResponse = await axios.get(`https://api.chess.com/pub/player/${challenge.creatorUsername}/stats`);
              const blitz_rating = chessResponse.data.chess_blitz.last.rating;
              return {
                id: challenge.id, 
                challengerUsername: challenge.creatorUsername,
                blitzRating: blitz_rating,
                wagerAmount: challenge.wagerAmount
              };
            } catch (error) {
              console.error(`Error fetching blitz rating for ${challenge.creatorUsername}:`, error);
              return null;
            }
          })
        );

        setPublicChallenges(challengeData.filter(challenge => challenge !== null));
      } catch (error) {
        console.error("Error fetching challenges:", error);
      }
    }

    getPublicChallenges();
  }, []);

  function handleClick() {
    window.open(
      `https://dial.to/?action=solana-action:http://localhost:3000/api/chess/join-challenge?challengeId=${challengeId}`, 
      "_blank"
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:underline mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Join a Challenge</h1>
      <div className="mb-8">
      <div className="flex gap-4 items-center">
  <Input
    type="text"
    placeholder="Enter Challenge ID"
    value={challengeId}
    onChange={(e) => setChallengeId(e.target.value)}
    className="flex-grow h-12"
  />
  <Button onClick={handleClick} className="h-12 px-4 flex items-center">
    <Search className="w-5 h-5 mr-2" />
    Join
  </Button>
</div>

      </div>

      <div className="grid gap-6">
  {publicChallenges.map((challenge) => (
    <div 
      key={challenge.id} 
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200"
    >
      {/* Challenge Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">Challenge Id: <span className="text-blue-600">{challenge.id}</span></h2>
        <span className="text-sm text-gray-500 font-medium">
          Challenger: <span className="text-gray-800">{challenge.challengerUsername}</span>
        </span>
      </div>

      {/* Stats Section */}
      <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-4">
        <p className="text-md font-medium text-gray-700">
          ⚡ Blitz Rating: <span className="font-semibold text-gray-900">{challenge.blitzRating}</span>
        </p>
        <p className="text-md font-medium text-gray-700">
          💰 Wager Amount: <span className="font-semibold text-green-600">{challenge.wagerAmount} USDC</span>
        </p>
      </div>

      {/* Join Button */}
      <Button variant="secondary" className="w-full py-3 text-lg font-semibold">
        Join Challenge
      </Button>
    </div>
  ))}
</div>

    </div>
  );
}
