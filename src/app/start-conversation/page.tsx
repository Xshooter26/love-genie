"use client"
import { useState, useRef } from 'react';
import { Copy, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateImageResponse, cleanGeminiResponse } from '@/lib/gemini';
import { useToast } from '@/components/ui/use-toast';

interface ResponseSuggestion {
  id: string;
  text: string;
  likes?: number;
  dislikes?: number;
}

export default function StartConversation() {
  const [tonality, setTonality] = useState('casual');
  const [suggestions, setSuggestions] = useState<ResponseSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState('');
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleGenerateSuggestions = async (image?: File) => {
    if (!image) {
      toast({
        title: "Input required",
        description: "Please upload an image to generate suggestions.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const raw = await generateImageResponse(image, tonality);
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

  const handleImageButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      handleGenerateSuggestions(file);
    }
  };

  const tonalityOptions = [
    'Casual', 'Flirty', 'Nonchalant', 'Playful', 'Romantic',
    'Serious', 'Funny', 'Mysterious', 'Caring', 'Intellectual'
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Response copied to clipboard.',
    });
  };

  return (
    <div className="flex flex-col items-center py-8 px-4 bg-black min-h-screen">
      <div className="w-full max-w-2xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" className="p-0 mr-2">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor" />
            </svg>
          </Button>
          <h1 className="text-2xl font-bold text-white">Start Conversation</h1>
        </div>

        <div className="mb-8 text-center">
          <p className="text-gray-300">Upload a pic of a person or activity for conversation starters</p>
        </div>

        <div className="mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <div className="border-dashed border-2 border-zinc-700 rounded-lg p-4 text-center min-h-[140px] flex items-center justify-center">
            {imagePreviewUrl ? (
              <div className="flex flex-col items-center w-full">
                <img
                  src={imagePreviewUrl}
                  alt="Preview"
                  className="max-h-40 rounded-lg object-contain border border-zinc-700 mb-2"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-pink-500 hover:text-pink-700 mb-2"
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreviewUrl(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full">
                <ImageIcon className="h-10 w-10 text-pink-500 mb-4" />
                <Button 
                  variant="outline" 
                  className="bg-black border-zinc-700 text-white hover:bg-zinc-800"
                  onClick={handleImageButtonClick}>
                  Add pic of person
                </Button>
              </div>
            )}
          </div>
        </div>

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
          onClick={() => selectedImage ? handleGenerateSuggestions(selectedImage) : null}
          disabled={isLoading || !selectedImage}
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
                    className="text-grey-400 hover:text-white"
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