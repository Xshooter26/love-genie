"use client"
import { Copy, MessageSquare } from 'lucide-react';
import { TonalitySelector } from '@/components/chat/tonality-selector';
import { useState, useRef } from 'react';
import { generateResponse, cleanGeminiResponse } from '@/lib/gemini';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface ResponseSuggestion {
  id: string;
  text: string;
  likes?: number;
  dislikes?: number;
}

export default function ReplySuggestions() {
  const [tonality, setTonality] = useState('casual');
  const [suggestions, setSuggestions] = useState<ResponseSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [theirMessage, setTheirMessage] = useState('');
  const [myMessage, setMyMessage] = useState('');
  const [context, setContext] = useState('');
  const [isUploadMode, setIsUploadMode] = useState(true);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleGenerateSuggestions = async () => {
    if (!theirMessage.trim()) {
      toast({
        title: "Input required",
        description: "Please enter their message to generate suggestions.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const prompt = `Generate reply suggestions for this message: "${theirMessage}"
      ${myMessage ? `My draft reply is: "${myMessage}"` : ''}
      ${context ? `Context: "${context}"` : ''}
      Tone: ${tonality}`;

      const raw = await generateResponse(prompt, tonality);
      const responseTexts = cleanGeminiResponse(raw.join(' '));

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

  const handleImageButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Handle file upload logic here
      console.log('File uploaded:', file);
    }
  };

  const tonalityOptions = [
    'Casual', 'Flirty', 'Nonchalant', 'Playful', 'Romantic',
    'Serious', 'Funny', 'Mysterious', 'Caring', 'Intellectual'
  ];

  return (
    <div className="flex flex-col items-center py-8 px-4 bg-black min-h-screen">
      <div className="w-full max-w-2xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" className="p-0 mr-2">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor" />
            </svg>
          </Button>
          <h1 className="text-2xl font-bold text-white">Reply Suggestions</h1>
        </div>

        <div className="mb-8 text-center">
          <p className="text-gray-300">Upload a chat screenshot for smart reply suggestions</p>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
      
            className={
              isUploadMode
                ? "bg-pink-600 text-white border-pink-600 hover:bg-pink-700 hover:border-pink-700"
                : "bg-black border-zinc-700 text-white hover:bg-zinc-800"
            }
            onClick={() => setIsUploadMode(true)}
          >
            Upload Screenshot
          </Button>
          <Button
           
            className={
              !isUploadMode
                ? "bg-pink-600 text-white border-pink-600 hover:bg-pink-700 hover:border-pink-700"
                : "bg-black border-zinc-700 text-white hover:bg-zinc-800"
            }
            onClick={() => setIsUploadMode(false)}
          >
            Type Messages
          </Button>
        </div>

        {isUploadMode ? (
          <div className="mb-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <Button 
              variant="outline" 
              className="bg-black border-zinc-700 text-white hover:bg-zinc-800"
              onClick={handleImageButtonClick}>
              Add chat screenshot
            </Button>
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-white mb-2">Their Reply</label>
            <Textarea
              placeholder="Paste their message here..."
              className="w-full bg-zinc-800 border-zinc-700 text-white"
              value={theirMessage}
              onChange={(e) => setTheirMessage(e.target.value)}
            />

            <label className="block text-white mb-2 mt-4">My Reply</label>
            <Textarea
              placeholder="Type your reply here (optional)"
              className="w-full bg-zinc-800 border-zinc-700 text-white"
              value={myMessage}
              onChange={(e) => setMyMessage(e.target.value)}
            />
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-white mb-2">Tonalities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {tonalityOptions.map((tone) => (
              <Button
                key={tone.toLowerCase()}
                variant={tonality === tone.toLowerCase() ? "default" : "outline"}
                className={`w-full ${
                  tonality === tone.toLowerCase()
                    ? "bg-pink-600 hover:bg-pink-700 text-white"
                    : "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                }`}
                onClick={() => setTonality(tone.toLowerCase())}
              >
                {tone}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-white mb-2">Personalize</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Add context (optional)"
              className="flex-1 bg-zinc-800 border-zinc-700 text-white"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
            <Button 
              variant="outline" 
              className="bg-black border-zinc-700 text-white hover:bg-zinc-800">
              Add context
            </Button>
          </div>
        </div>

        <Button
          className="w-full flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white mb-6"
          onClick={handleGenerateSuggestions}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Abracadabra 🪄"}
          {!isLoading && (
            ""
          )}
        </Button>

        {suggestions.length > 0 && (
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="p-3 bg-zinc-800 rounded-lg">
                <p className="text-white mb-2">{suggestion.text}</p>
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(suggestion.text)}
                    className="text-gray-400 hover:text-white"
                  >
                                        <Copy className='text-pink-500'/>

                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 