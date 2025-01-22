"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ArrowLeft } from "lucide-react"
import {Button} from "@/components/button"

// Mock data for challenges
const mockChallenges = [
  { id: "1234", creator: "Alice", wager: "100 USDC" },
  { id: "5678", creator: "Bob", wager: "50 USDC" },
  { id: "9012", creator: "Charlie", wager: "200 USDC" },
]

export default function JoinChallenge() {
  const [challengeId, setChallengeId] = useState("");

  function handleClick() {
    window.open(`https://dial.to/?action=solana-action:http://localhost:3000/api/chess/join-challenge?challengeId=${challengeId}`, "_blank");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:underline mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Join a Challenge</h1>
      <div className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter Challenge ID"
            value={challengeId}
            onChange={(e) => setChallengeId(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button onClick={handleClick}>
            <Search className="w-5 h-5 mr-2" />
            Search
          </Button>
        </div>
      </div>
      <div className="grid gap-6">
        {mockChallenges.map((challenge) => (
          <div key={challenge.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Challenge #{challenge.id}</h2>
              <span className="text-sm text-gray-600">Created by {challenge.creator}</span>
            </div>
            <p className="text-gray-700 mb-4">Wager: {challenge.wager}</p>
            <Button variant="secondary">Join Challenge</Button>
          </div>
        ))}
      </div>
    </div>
  )
}

