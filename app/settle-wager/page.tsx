'use client'
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import {Button }from "@/components/ui/button"
import { useState } from "react";

export default function SettleWager() {

 const [challengeId, setChallengeId] = useState("");

 function handleClick() {
    window.open(`https://dial.to/?action=solana-action:http://localhost:3000/api/chess/settle-wager?challengeId=${challengeId}`, "_blank");
 }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:underline mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Settle Wager</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label htmlFor="challengeId" className="block text-sm font-medium text-gray-700 mb-2">
              Challenge ID
            </label>
            <input
              type="text"
              id="challengeId"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              onChange={(e) => setChallengeId(e.target.value)}
            />
          </div>
          <Button type="submit" variant="primary" onClick={handleClick}>
            Settle Wager
          </Button>
        </form>
      </div>
    </div>
  )
}

