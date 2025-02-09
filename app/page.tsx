import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen w-full bg-cover bg-center bg-no-repeat overflow-x-hidden"
      style={{ backgroundImage: "url('https://res.cloudinary.com/dxyexbgt6/image/upload/v1739133947/Flux_Dev_Design_a_vibrant_logo_for_Faceoff_a_peertopeer_wager__3_ivisc4.jpg')" }}
    >
      <div className="bg-white/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl text-center w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">🎯 Welcome to Faceoff!</h1>

        <div className="grid gap-4 w-full">
          <Link href="/join-challenge" className="w-full">
            <Button className="w-full text-lg py-3 transition hover:scale-105" variant="primary">
              ⚔️ Join Challenge
            </Button>
          </Link>

          <Link
            href="https://dial.to/?action=solana-action:http://localhost:3000/api/chess/create-challenge"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button className="w-full text-lg py-3 transition hover:scale-105 bg-green-500 hover:bg-green-600 text-white">
              🚀 Create Challenge
            </Button>
          </Link>

          <Link href="/settle-wager" className="w-full">
            <Button className="w-full text-lg py-3 transition hover:scale-105 bg-purple-500 hover:bg-purple-600 text-white">
              💰 Settle Wager
            </Button>
          </Link>
        </div>

        <p className="mt-4 text-sm text-gray-700 flex items-center justify-center">
          <ArrowRight className="w-4 h-4 mr-1" />
          You&apos;ll be redirected to another page for challenge creation.
        </p>
      </div>
    </div>
  )
}
