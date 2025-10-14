
import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface ModelSelectorProps {
  model: string;
  setModel: (model: string) => void;
}

const models = [
  { id: 'ChatGPT', name: 'ChatGPT', description: 'OpenAI GPT model' },
  { id: 'Google Gemini', name: 'Google Gemini', description: 'Google\'s Gemini model' },
  { id: 'Claude', name: 'Claude', description: 'Anthropic\'s Claude model' },
  { id: 'Auto', name: 'Auto Select', description: 'Automatically select the best model' },
];

export function ModelSelector({ model, setModel }: ModelSelectorProps) {
  const selectedModel = models.find((m) => m.id === model) || models[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex justify-between items-center w-44 h-10 px-3">
          <span className="truncate">{selectedModel.name}</span>
          <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {models.map((m) => (
          <DropdownMenuItem
            key={m.id}
            onClick={() => setModel(m.id)}
            className={cn(
              "flex items-center justify-between px-3 py-2 cursor-pointer",
              model === m.id && "bg-accent"
            )}
          >
            <div>
              <p className="font-medium">{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.description}</p>
            </div>
            {model === m.id && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
