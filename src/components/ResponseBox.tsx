
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ResponseBoxProps {
  response: string;
  modelUsed: string;
  isLoading?: boolean;
}

export function ResponseBox({ response, modelUsed, isLoading = false }: ResponseBoxProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-4 pb-2 border-b flex flex-row items-center bg-muted/30">
        <Bot className="h-5 w-5 mr-2 text-primary" />
        <CardTitle className="text-lg font-medium">Model Response</CardTitle>
        {modelUsed && (
          <Badge variant="outline" className="ml-auto">
            {modelUsed}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-1 overflow-y-auto scrollbar-thin">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
              <p className="text-sm mt-2 loading-dots">Generating response</p>
            </div>
          </div>
        ) : response ? (
          <div className="prose prose-blue max-w-none dark:prose-invert">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        ) : (
          <div className="text-center text-muted-foreground h-full flex items-center justify-center">
            <div>
              <p>No response generated yet</p>
              <p className="text-sm mt-1">Enter a query and click "Generate Response"</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
