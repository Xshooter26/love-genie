'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { ChatInput } from '@/components/chat/chat-input';
import { TonalitySelector } from '@/components/chat/tonality-selector';
import { ResponseSuggestions } from '@/components/chat/response-suggestions';
import { useToast } from '@/components/ui/use-toast';
import { generateResponse, generateImageResponse } from '@/lib/gemini';

interface ResponseSuggestion {
  id: string;
  text: string;
  likes?: number;
  dislikes?: number;
}

export default function ChatPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ResponseSuggestion[]>([]);
  const [selectedTonality, setSelectedTonality] = useState('romantic');
  const { toast } = useToast();

  const handleSend = async (message: string, image?: File) => {
    setIsLoading(true);
    try {
      let responseTexts: string[];
      
      if (image) {
        responseTexts = await generateImageResponse(image, selectedTonality);
      } else {
        responseTexts = await generateResponse(message, selectedTonality);
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
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-pink-600 mb-2">LoveGenie</h1>
          <p className="text-gray-600">
            Get AI-powered suggestions for your conversations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <ChatInput onSend={handleSend} isLoading={isLoading} />
            <ResponseSuggestions
              suggestions={suggestions}
              onCopy={handleCopy}
              onLike={handleLike}
              onDislike={handleDislike}
              isLoading={isLoading}
            />
          </div>
          <div className="space-y-6">
            <TonalitySelector
              onTonalityChange={setSelectedTonality}
              disabled={isLoading}
            />
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-900 mb-2">Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Upload a chat screenshot for context</li>
                <li>• Describe the situation in detail</li>
                <li>• Choose the right tone for your response</li>
                <li>• Copy and paste the suggestions you like</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 