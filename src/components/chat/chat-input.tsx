import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon, Send, X } from 'lucide-react';
import { Textarea } from '../ui/textarea';

interface ChatInputProps {
  onSend: (message: string, image?: File) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSend, isLoading = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || image) {
      onSend(message, image || undefined);
      setMessage('');
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleImageButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  return (
    <div className="bg-zinc-900/70 rounded-xl shadow-lg p-6 w-full max-w-2xl mx-auto mb-4">
      {imagePreview && (
        <div className="mb-4 relative w-full flex justify-center">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-h-48 rounded-lg object-contain border border-zinc-700"
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80"
            onClick={handleRemoveImage}
            aria-label="Remove image"
          >
            <X className="h-5 w-5 text-white" />
          </Button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch gap-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message or describe the situation..."
            className="flex-1 min-h-[100px] bg-zinc-800 text-white border-zinc-700"
            disabled={isLoading}
          />
          <div className="flex flex-row md:flex-col gap-2 md:gap-4 items-center md:items-stretch">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={isLoading}
              onClick={handleImageButtonClick}
              className="border-pink-600 text-pink-400 hover:bg-pink-900/20"
            >
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Button type="submit" disabled={isLoading || (!message.trim() && !image)} className="bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white">
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
} 