
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { X, Globe, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SettingsPanelProps {
  show: boolean;
  onClose: () => void;
  useExternalKnowledge: boolean;
  setUseExternalKnowledge: (value: boolean) => void;
  useWebSearch: boolean;
  setUseWebSearch: (value: boolean) => void;
  useDetailedExplanation: boolean;
  setUseDetailedExplanation: (value: boolean) => void;
}

export function SettingsPanel({
  show,
  onClose,
  useExternalKnowledge,
  setUseExternalKnowledge,
  useWebSearch,
  setUseWebSearch,
  useDetailedExplanation,
  setUseDetailedExplanation,
}: SettingsPanelProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 top-12 z-50 w-80 rounded-lg border bg-card shadow-lg"
        >
          <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/30">
            <h3 className="font-semibold flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-primary" />
              AI Settings
            </h3>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-start gap-2">
                <BookOpen className="h-4 w-4 mt-0.5 text-primary" />
                <div>
                  <Label htmlFor="external-knowledge" className="font-medium">Use Training Knowledge</Label>
                  <p className="text-xs text-muted-foreground">Use the model's pre-trained knowledge</p>
                </div>
              </div>
              <Switch
                id="external-knowledge"
                checked={useExternalKnowledge}
                onCheckedChange={setUseExternalKnowledge}
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-start gap-2">
                <Globe className="h-4 w-4 mt-0.5 text-primary" />
                <div>
                  <Label htmlFor="web-search" className="font-medium">Web Search</Label>
                  <p className="text-xs text-muted-foreground">Allow model to search the web for information</p>
                </div>
              </div>
              <Switch
                id="web-search"
                checked={useWebSearch}
                onCheckedChange={setUseWebSearch}
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 mt-0.5 text-primary" />
                <div>
                  <Label htmlFor="detailed-explanation" className="font-medium">Chain of Thought</Label>
                  <p className="text-xs text-muted-foreground">Model explains reasoning step by step</p>
                </div>
              </div>
              <Switch
                id="detailed-explanation"
                checked={useDetailedExplanation}
                onCheckedChange={setUseDetailedExplanation}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
