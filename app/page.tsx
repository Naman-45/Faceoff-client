import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Welcome to Faceoff!</h1>
      <div className="grid gap-6 w-full max-w-md">
        <Link href="/join-challenge" className="w-full">
          <Button className="w-full" variant="primary">
            Join Challenge
          </Button>
        </Link>
        <Link href="https://dial.to/?action=solana-action:http://localhost:3000/api/chess/create-challenge" target="_blank" rel="noopener noreferrer" className="w-full">
          <Button className="w-full" variant="secondary">
            Create Challenge
          </Button>
        </Link>
        <Link href="/settle-wager" className="w-full">
          <Button className="w-full" variant="tertiary">
            Settle Wager
          </Button>
        </Link>
      </div>
      <p className="mt-4 text-sm text-gray-600 flex items-center">
        <ArrowRight className="w-4 h-4 mr-1" />
        You&apos;ll be redirected to another page for challenge creation.
      </p>
    </div>
  )
}

