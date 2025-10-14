
import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FileUploaderProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  isUploading: boolean;
  fileName: string;
}

export function FileUploader({ onUpload, isUploading, fileName }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.files = e.dataTransfer.files;
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
      }
    }
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-lg p-4 ${
        dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
      }`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <label 
        htmlFor="file-upload" 
        className="flex flex-col items-center justify-center gap-2 cursor-pointer"
      >
        <Upload className="h-8 w-8 text-muted-foreground" />
        <div className="text-center">
          <p className="text-sm font-medium">
            {isUploading ? 'Uploading...' : 'Drag & drop files or click to upload'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supports PDF, DOC, DOCX, TXT, CSV, XLS, XLSX
          </p>
        </div>
        <input
          id="file-upload"
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
          multiple
          className="hidden"
          onChange={onUpload}
          disabled={isUploading}
        />
      </label>
      
      {fileName && (
        <div className="mt-4 flex items-center gap-2 p-2 bg-primary/10 rounded">
          <p className="text-sm truncate flex-1">{fileName}</p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0"
            onClick={() => toast.success("File removed")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {isUploading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            <p className="text-sm mt-2">Processing files...</p>
          </div>
        </div>
      )}
    </div>
  );
}
