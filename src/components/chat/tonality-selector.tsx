import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TONALITIES = [
  { value: 'romantic', label: 'Romantic 💕' },
  { value: 'flirty', label: 'Flirty 😘' },
  { value: 'cute', label: 'Cute 🥰' },
  { value: 'funny', label: 'Funny 😂' },
  { value: 'sweet', label: 'Sweet 🍬' },
  { value: 'playful', label: 'Playful 🎮' },
  { value: 'sincere', label: 'Sincere 💝' },
  { value: 'mysterious', label: 'Mysterious 🔮' },
  { value: 'passionate', label: 'Passionate 🔥' },
  { value: 'gentle', label: 'Gentle 🌸' },
];

interface TonalitySelectorProps {
  onTonalityChange: (tonality: string) => void;
  disabled?: boolean;
}

export function TonalitySelector({ onTonalityChange, disabled = false }: TonalitySelectorProps) {
  const [selectedTonality, setSelectedTonality] = useState('romantic');

  const handleTonalityChange = (value: string) => {
    setSelectedTonality(value);
    onTonalityChange(value);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Select Tone</label>
      <Select
        value={selectedTonality}
        onValueChange={handleTonalityChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a tone" />
        </SelectTrigger>
        <SelectContent>
          {TONALITIES.map((tonality) => (
            <SelectItem key={tonality.value} value={tonality.value}>
              {tonality.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 