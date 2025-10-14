import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Send, 
  FileUp,
  Loader2,
  Bot,
  ScrollText,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ModelSelector } from '@/components/ModelSelector';
import { FileUploader } from '@/components/FileUploader';
import { SettingsPanel } from '@/components/SettingsPanel';
import { ChunkResultItem } from '@/components/ChunkResultItem';
import { ResponseBox } from '@/components/ResponseBox';
import { PdfList } from '@/components/PdfList';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from "@/components/ui/resizable";
import {
  fetchPdfList,
  searchDocuments,
  generateResponse,
  uploadFile
} from '@/lib/chatbot-utils';

const Index = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [model, setModel] = useState('ChatGPT');
  const [results, setResults] = useState<any[]>([]);
  const [response, setResponse] = useState('');
  const [modelUsed, setModelUsed] = useState('');
  const [useExternalKnowledge, setUseExternalKnowledge] = useState(false);
  const [useDetailedExplanation, setUseDetailedExplanation] = useState(false);
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [pdfNames, setPdfNames] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [isDocumentPanelMaximized, setIsDocumentPanelMaximized] = useState(false);
  const [showDocumentPanel, setShowDocumentPanel] = useState(true);

  const fetchPdfNames = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetchPdfList();
      setPdfNames(res.pdf_names || []);
    } catch (err) {
      console.error('Failed to fetch PDF names:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch document list',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPdfNames();
  }, []);

  const handleRetrieveChunks = async () => {
    if (!query.trim()) {
      toast({
        title: 'Query required',
        description: 'Please enter a query to search documents',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      const searchResponse = await searchDocuments(query);
      setResults(searchResponse.results);
      toast({
        title: 'Search completed',
        description: `Found ${searchResponse.results.length} relevant chunks`,
      });
    } catch (error) {
      console.error('Error retrieving chunks:', error);
      toast({
        title: 'Search failed',
        description: 'An error occurred while searching documents',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateResponse = async () => {
    if (!query.trim()) {
      toast({
        title: 'Query required',
        description: 'Please enter a query first',
        variant: 'destructive',
      });
      return;
    }

    if (results.length === 0) {
      await handleRetrieveChunks();
    }

    try {
      setIsGeneratingResponse(true);
      const generateResult = await generateResponse(
        query,
        results,
        model,
        {
          useExternalKnowledge,
          useDetailedExplanation,
          useWebSearch,
        }
      );
      setResponse(generateResult.response);
      setModelUsed(generateResult.model);
      toast({
        title: 'Response generated',
        description: `Using ${generateResult.model}`,
      });
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        title: 'Generation failed',
        description: 'An error occurred while generating the response',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let uploadedNames = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await uploadFile(file);
        uploadedNames.push(file.name);
      }

      setFileName(uploadedNames.join(', '));
      toast({
        title: 'Upload successful',
        description: `${files.length} file(s) uploaded & processed`,
      });
      setShowUploadDialog(false);
      fetchPdfNames();
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: 'Upload failed',
        description: 'One or more files failed to upload',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerateResponse();
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl animate-fade-in">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">QueryWise</h1>
        <p className="text-muted-foreground text-lg">Intelligent document search and analysis powered by AI</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        <Card className="card-hover border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Ask a Question</CardTitle>
            <CardDescription>Search through your documents and get AI-powered answers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 min-w-0">
                <Input
                  placeholder="Enter your query..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pr-10 shadow-sm border-input/50 focus:border-primary h-12"
                />
                <Button 
                  size="icon" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-md" 
                  onClick={handleGenerateResponse}
                  disabled={isGeneratingResponse}
                >
                  {isGeneratingResponse ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
                <ModelSelector model={model} setModel={setModel} />
                
                <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2 border-input/50 shadow-sm h-12">
                      <FileUp className="h-4 w-4" />
                      <span className="hidden sm:inline">Upload</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl">Upload Documents</DialogTitle>
                    </DialogHeader>
                    <FileUploader 
                      onUpload={handleUpload} 
                      isUploading={uploading} 
                      fileName={fileName} 
                    />
                  </DialogContent>
                </Dialog>
                
                <div className="relative">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setShowSettings(!showSettings)}
                    className="shadow-sm border-input/50 h-12 w-12"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                  <SettingsPanel
                    show={showSettings}
                    onClose={() => setShowSettings(false)}
                    useExternalKnowledge={useExternalKnowledge}
                    setUseExternalKnowledge={setUseExternalKnowledge}
                    useWebSearch={useWebSearch}
                    setUseWebSearch={setUseWebSearch}
                    useDetailedExplanation={useDetailedExplanation}
                    setUseDetailedExplanation={setUseDetailedExplanation}
                  />
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDocumentPanel(!showDocumentPanel)}
                  className="shadow-sm border-input/50 h-12"
                >
                  {showDocumentPanel ? "Hide Documents" : "Show Documents"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-8">
          {isDocumentPanelMaximized ? (
            <div className="h-[calc(100vh-320px)]">
              <PdfList 
                pdfNames={pdfNames} 
                onRefresh={fetchPdfNames} 
                isRefreshing={isRefreshing}
                isMaximized={true}
                onToggleMaximize={() => setIsDocumentPanelMaximized(false)}
              />
            </div>
          ) : (
            <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-320px)]">
              {showDocumentPanel && (
                <>
                  <ResizablePanel defaultSize={25} minSize={20} maxSize={40} className="h-full">
                    <Card className="h-full border-0 shadow-lg card-hover">
                      <PdfList 
                        pdfNames={pdfNames} 
                        onRefresh={fetchPdfNames} 
                        isRefreshing={isRefreshing}
                        isMaximized={false}
                        onToggleMaximize={() => setIsDocumentPanelMaximized(true)}
                      />
                    </Card>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                </>
              )}
              
              <ResizablePanel defaultSize={showDocumentPanel ? 75 : 100} className="h-full">
                <Tabs defaultValue="response" className="h-full flex flex-col">
                  <TabsList className="self-start mb-4 p-1 bg-muted/80 backdrop-blur-sm">
                    <TabsTrigger value="response" className="gap-2 rounded-md">
                      <Bot className="h-4 w-4" />
                      Response
                    </TabsTrigger>
                    <TabsTrigger value="chunks" className="gap-2 rounded-md">
                      <Search className="h-4 w-4" />
                      Search Results {results.length > 0 && `(${results.length})`}
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="response" className="flex-1 m-0 animate-slide-up">
                    <Card className="h-full border-0 shadow-lg card-hover">
                      <ResponseBox 
                        response={response} 
                        modelUsed={modelUsed} 
                        isLoading={isGeneratingResponse}
                      />
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="chunks" className="flex-1 m-0 overflow-y-auto animate-slide-up">
                    <Card className="h-full border-0 shadow-lg card-hover">
                      <CardHeader className="p-4 pb-2 border-b">
                        <div className="flex items-center">
                          <Search className="h-5 w-5 text-primary mr-2" />
                          <CardTitle className="text-lg font-medium">Relevant Document Chunks</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 overflow-y-auto">
                        {isLoading ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="flex flex-col items-center">
                              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                              <p className="text-sm mt-2 loading-dots">Searching documents</p>
                            </div>
                          </div>
                        ) : results.length > 0 ? (
                          <div className="space-y-3">
                            {results.map((result, index) => (
                              <ChunkResultItem key={index} chunk={result} />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground h-full flex items-center justify-center">
                            <div>
                              <p>No search results yet</p>
                              <p className="text-sm mt-1">Enter a query and click search</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </ResizablePanel>
            </ResizablePanelGroup>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
