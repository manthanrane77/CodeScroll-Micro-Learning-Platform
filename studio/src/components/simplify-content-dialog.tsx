'use client';

import { useState } from 'react';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { simplifyParagraph } from '@/ai/flows/simplify-paragraph';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from './ui/separator';

export function SimplifyContentDialog({ content, title }: { content: string; title: string }) {
  const [simplifiedContent, setSimplifiedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSimplify = async () => {
    setIsLoading(true);
    setError('');
    setSimplifiedContent('');
    try {
      const result = await simplifyParagraph({ paragraph: content });
      if (result.simplifiedParagraph) {
        setSimplifiedContent(result.simplifiedParagraph);
      } else {
        setError('Could not simplify the content. Please try again.');
      }
    } catch (e) {
      setError('An unexpected error occurred.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={() => {
        setSimplifiedContent('');
        setError('');
    }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Sparkles className="mr-2 h-4 w-4 text-accent" />
          Simplify
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-headline flex items-center gap-2 text-2xl">
            <Wand2 className="h-6 w-6 text-primary" />
            Simplify Topic
          </DialogTitle>
          <DialogDescription>
            AI-powered simplification for: <span className="font-semibold text-foreground">{title}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 max-h-[60vh]">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-muted-foreground">Original Content</h3>
            <ScrollArea className="rounded-md border p-4 h-full">
              <p className="text-sm">{content}</p>
            </ScrollArea>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-muted-foreground">Simplified Version</h3>
            <ScrollArea className="rounded-md border p-4 h-full bg-muted/50">
              {isLoading && (
                <div className="flex h-full items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p>Simplifying...</p>
                  </div>
                </div>
              )}
              {error && <p className="text-sm text-destructive">{error}</p>}
              {simplifiedContent && <p className="text-sm">{simplifiedContent}</p>}
              {!isLoading && !simplifiedContent && !error && (
                 <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                    <p>Click "Simplify with AI" to generate a simplified version of the text.</p>
                 </div>
              )}
            </ScrollArea>
          </div>
        </div>
        <Separator />
        <div className="flex justify-end">
            <Button onClick={handleSimplify} disabled={isLoading}>
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Processing...' : 'Simplify with AI'}
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
