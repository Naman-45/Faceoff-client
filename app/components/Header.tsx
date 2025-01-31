import Link from "next/link"
import { CastleIcon as ChessKnight } from "lucide-react"

export default function HeaderComponent() {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <ChessKnight className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">P2P Wager</span>
        </Link>
        <div className="space-x-4">
          <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
            About
          </Link>
          <Link href="/help" className="text-gray-600 hover:text-blue-600 transition-colors">
            Help
          </Link>
        </div>
      </nav>
    </header>
  )
}

