import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Copy, ThumbsUp, ThumbsDown } from 'lucide-react';

interface ResponseSuggestion {
  id: string;
  text: string;
  likes?: number;
  dislikes?: number;
}

interface ResponseSuggestionsProps {
  suggestions: ResponseSuggestion[];
  onCopy: (text: string) => void;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  isLoading?: boolean;
}

export function ResponseSuggestions({
  suggestions,
  onCopy,
  onLike,
  onDislike,
  isLoading = false,
}: ResponseSuggestionsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No suggestions yet. Start a conversation to get suggestions!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {suggestions.map((suggestion) => (
        <Card key={suggestion.id} className="p-4">
          <div className="flex justify-between items-start">
            <p className="text-white text-base">{suggestion.text}</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCopy(suggestion.text)}
              className="ml-2"
            >
              <Copy className="h-4 w-4 text-pink-500" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
} 