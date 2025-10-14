
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { File } from 'lucide-react';

interface ChunkResultItemProps {
  chunk: {
    pdf_name: string;
    chunk_index: number;
    text: string;
  };
}

export function ChunkResultItem({ chunk }: ChunkResultItemProps) {
  return (
    <Card className="mb-4 overflow-hidden border shadow-sm hover:shadow-md transition-all duration-200 border-border/50 animate-fade-in">
      <CardHeader className="p-4 pb-2 flex flex-row items-center gap-2 bg-muted/30">
        <File className="h-4 w-4 text-primary" />
        <div className="flex-1">
          <CardTitle className="text-sm font-medium truncate">
            {chunk.pdf_name}
          </CardTitle>
        </div>
        <Badge variant="outline" className="ml-auto text-xs">
          Chunk {chunk.chunk_index}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="text-sm text-muted-foreground max-h-24 overflow-y-auto scrollbar-thin">
          {chunk.text}
        </div>
      </CardContent>
    </Card>
  );
}
