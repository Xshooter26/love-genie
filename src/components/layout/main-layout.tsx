"use client"
import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-zinc-900/80 shadow-md border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold">
                  <span className="text-pink-500">Love</span>
                  <span className="text-white">Genie</span>
                </h1>
              </Link>
            </div>
            {/* Hamburger menu for all screen sizes */}
            <div className="relative">
              <button
                className="p-2 rounded-md hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Open menu"
              >
                <Menu className="h-7 w-7 text-zinc-200" />
              </button>
              {menuOpen && (
                <ul className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg py-2 z-50 flex flex-col">
                  <li><Link href="/" className="block px-4 py-2 text-zinc-300 hover:text-pink-500 hover:bg-zinc-800 transition-colors" onClick={() => setMenuOpen(false)}>Home</Link></li>
                  <li><Link href="/chat" className="block px-4 py-2 text-zinc-300 hover:text-pink-500 hover:bg-zinc-800 transition-colors" onClick={() => setMenuOpen(false)}>Chat</Link></li>
                  <li><Link href="/reply-suggestions" className="block px-4 py-2 text-zinc-300 hover:text-pink-500 hover:bg-zinc-800 transition-colors" onClick={() => setMenuOpen(false)}>Reply</Link></li>
                  <li><Link href="/start-conversation" className="block px-4 py-2 text-zinc-300 hover:text-pink-500 hover:bg-zinc-800 transition-colors" onClick={() => setMenuOpen(false)}>Start</Link></li>
                  <li><Link href="/awkward-situation" className="block px-4 py-2 text-zinc-300 hover:text-pink-500 hover:bg-zinc-800 transition-colors" onClick={() => setMenuOpen(false)}>Awkward</Link></li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-zinc-900/80 shadow-md border-t border-zinc-800 mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-zinc-400">
          <p>© 2024 LoveGenie. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 