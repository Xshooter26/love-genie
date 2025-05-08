import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Wand2, MessageSquare, ImageIcon, Heart, Star, Frown } from 'lucide-react';

export default function HomePage() {
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center py-12 md:py-20">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-pink-600">Love</span>
            <span className="text-white">Genie</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
            AI-powered conversation magic for your romantic life. Get reply suggestions, conversation starters, and help with awkward situations.
          </p>
        </section>

        {/* Features Section */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
            {/* Reply Suggestions Card */}
            <Link href="/reply-suggestions" className="group">
              <div className="w-[340px] h-[240px] bg-zinc-900/80 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center transition-transform group-hover:scale-105 group-focus:scale-105 cursor-pointer border-2 border-transparent group-hover:border-pink-500 group-focus:border-pink-500 mx-auto">
                <MessageSquare className="h-10 w-10 text-pink-500 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Reply Suggestions</h2>
                <p className="text-zinc-300 mb-4">Upload a chat screenshot or type in messages for smart reply suggestions</p>
                <div className="flex items-center justify-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="text-xs text-zinc-400">2.5 million hints given</span>
              </div>
            </Link>
            {/* Start Conversation Card */}
            <Link href="/start-conversation" className="group">
              <div className="w-[340px] h-[240px] bg-zinc-900/80 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center transition-transform group-hover:scale-105 group-focus:scale-105 cursor-pointer border-2 border-transparent group-hover:border-pink-500 group-focus:border-pink-500 mx-auto">
                <ImageIcon className="h-10 w-10 text-purple-400 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Start Conversation</h2>
                <p className="text-zinc-300 mb-4">Upload a pic of a person or activity for conversation starters</p>
                <div className="flex items-center justify-center mb-1">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                  <Star className="h-4 w-4 text-zinc-600" />
                </div>
                <span className="text-xs text-zinc-400">1.7 million hints given</span>
              </div>
            </Link>
            {/* Awkward Situation Card */}
            <Link href="/awkward-situation" className="group">
              <div className="w-[340px] h-[240px] bg-zinc-900/80 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center transition-transform group-hover:scale-105 group-focus:scale-105 cursor-pointer border-2 border-transparent group-hover:border-pink-500 group-focus:border-pink-500 mx-auto">
                <Frown className="h-10 w-10 text-yellow-400 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Awkward Situation</h2>
                <p className="text-zinc-300 mb-4">Provide the situation details for the best advice!</p>
                <div className="flex items-center justify-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="text-xs text-zinc-400">1.5 million hints given</span>
              </div>
            </Link>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-center text-white mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-900/80 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
              <div className="bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mb-2">1</div>
              <h3 className="font-semibold text-white mb-1">Choose Feature</h3>
              <p className="text-zinc-400 text-sm">Select one of our three magical features based on your needs</p>
            </div>
            <div className="bg-zinc-900/80 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
              <div className="bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mb-2">2</div>
              <h3 className="font-semibold text-white mb-1">Input Details</h3>
              <p className="text-zinc-400 text-sm">Upload a screenshot, photo, or type your situation details</p>
            </div>
            <div className="bg-zinc-900/80 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
              <div className="bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mb-2">3</div>
              <h3 className="font-semibold text-white mb-1">Get Magic Advice</h3>
              <p className="text-zinc-400 text-sm">Hit "Abracadabra" and watch the relationship magic happen!</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-8">
          <Link href="/chat">
            <Button size="lg" className="bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white px-8 py-4 text-lg font-bold rounded-full shadow-md hover:scale-105 transition-transform">
              <Wand2 className="mr-2 h-5 w-5" />
              Start Your Magic
            </Button>
          </Link>
        </section>
        </div>
      <footer className="text-center text-zinc-500 text-xs py-6 mt-8">
        © 2025 LoveGenie. All rights reserved.<br />
        AI-powered conversation magic for your romantic life.
      </footer>
    </MainLayout>
  );
}
