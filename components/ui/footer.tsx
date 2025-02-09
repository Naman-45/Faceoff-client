import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} P2P Wager. All rights reserved.</p>
        <div className="space-x-4">
          <Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  )
}

