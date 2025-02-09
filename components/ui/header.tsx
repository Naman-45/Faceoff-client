import Link from "next/link"
import { CastleIcon } from "lucide-react"

export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg fixed top-0 left-0 w-full z-50">
      <nav className="container mx-auto px-6 py-5 flex justify-between items-center">

        <Link href="/" className="flex items-center space-x-3">
          <CastleIcon className="w-10 h-10 text-blue-600 drop-shadow-md" />
          <span className="text-2xl font-extrabold text-gray-900 tracking-wide">
            Faceoff
          </span>
        </Link>

        <div className="flex space-x-6">
          <Link href="/about" className="text-lg font-medium text-gray-700 hover:text-blue-600 transition duration-200">
            About
          </Link>
          <Link href="/help" className="text-lg font-medium text-gray-700 hover:text-blue-600 transition duration-200">
            Help
          </Link>
        </div>
      </nav>
    </header>
  )
}
