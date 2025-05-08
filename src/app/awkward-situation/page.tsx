"use client"
import { Frown } from 'lucide-react';
import { TonalitySelector } from '@/components/chat/tonality-selector';
import { ChatInput } from '@/components/chat/chat-input';
import { ResponseSuggestions } from '@/components/chat/response-suggestions';
import { useState } from 'react';
import { generateResponse, generateImageResponse, cleanGeminiResponse } from '@/lib/gemini';
import { useToast } from '@/components/ui/use-toast';

interface ResponseSuggestion {
  id: string;
  text: string;
  likes?: number;
  dislikes?: number;
}

export default function AwkwardSituation() {
  const [tonality, setTonality] = useState('casual');
  const [suggestions, setSuggestions] = useState<ResponseSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async (message: string, image?: File) => {
    setIsLoading(true);
    try {
        let responseTexts: string[];
        if (image) {
          const raw = await generateImageResponse(image, tonality);
          responseTexts = cleanGeminiResponse(raw.join(' ')); // or however your function returns
        } else {
          const raw = await generateResponse(message, tonality);
          responseTexts = cleanGeminiResponse(raw.join(' '));
        }

      const newSuggestions = responseTexts.map((text, index) => ({
        id: Date.now().toString() + index,
        text,
        likes: 0,
        dislikes: 0,
      }));

      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate suggestions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Response copied to clipboard.',
    });
  };

  const handleLike = (id: string) => {
    setSuggestions((prev) =>
      prev.map((suggestion) =>
        suggestion.id === id
          ? { ...suggestion, likes: (suggestion.likes || 0) + 1 }
          : suggestion
      )
    );
  };

  const handleDislike = (id: string) => {
    setSuggestions((prev) =>
      prev.map((suggestion) =>
        suggestion.id === id
          ? { ...suggestion, dislikes: (suggestion.dislikes || 0) + 1 }
          : suggestion
      )
    );
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-2xl bg-zinc-900/80 rounded-2xl shadow-lg p-8 mb-8 flex flex-col items-center text-center">
        <Frown className="h-10 w-10 text-yellow-400 mb-4" />
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Awkward Situation</h1>
        <p className="text-zinc-300 mb-4">Provide the situation details for the best advice!</p>
        <TonalitySelector onTonalityChange={setTonality} disabled={isLoading} />
      </div>
      <div className="w-full max-w-2xl">
        <ChatInput onSend={handleSend} isLoading={isLoading} />
        <ResponseSuggestions
          suggestions={suggestions}
          onCopy={handleCopy}
          onLike={handleLike}
          onDislike={handleDislike}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
} 