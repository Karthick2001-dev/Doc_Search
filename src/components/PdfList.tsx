
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, RefreshCw, Trash2, ChevronUp, ChevronDown, Maximize2, Minimize2 } from 'lucide-react';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface PdfListProps {
  pdfNames: string[];
  onRefresh: () => Promise<void>;
  isRefreshing?: boolean;
  isMaximized?: boolean; 
  onToggleMaximize?: () => void;
}

export function PdfList({ 
  pdfNames, 
  onRefresh, 
  isRefreshing = false, 
  isMaximized = false,
  onToggleMaximize 
}: PdfListProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleDelete = (pdfName: string) => {
    // This would connect to your backend to delete the PDF
    toast.success(`Deleted ${pdfName}`);
  };

  return (
    <Card className="h-full flex flex-col">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex-1 flex flex-col">
        <CardHeader className="p-4 pb-2 border-b flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <div className="flex items-center cursor-pointer">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              <CardTitle className="text-lg font-medium">Uploaded Documents</CardTitle>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 ml-2" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-2" />
              )}
            </div>
          </CollapsibleTrigger>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onRefresh}
              disabled={isRefreshing}
              className={isRefreshing ? 'animate-spin' : ''}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            {onToggleMaximize && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onToggleMaximize}
                title={isMaximized ? "Minimize" : "Maximize"}
              >
                {isMaximized ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CollapsibleContent className="flex-1">
          <CardContent className="p-4 flex-1 overflow-y-auto scrollbar-thin h-full">
            {pdfNames.length > 0 ? (
              <ul className="space-y-2">
                {pdfNames.map((name, idx) => (
                  <li key={idx} className="flex items-center justify-between group p-2 rounded-md hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm truncate max-w-[200px]">{name}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(name)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-muted-foreground h-full flex items-center justify-center">
                <div>
                  <p>No documents uploaded</p>
                  <p className="text-sm mt-1">Upload PDFs to get started</p>
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
