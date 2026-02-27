
'use client';

import { useState, useMemo, useTransition, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { checkGrammar } from '@/ai/flows/check-grammar';
import { CheckGrammarOutput } from '@/ai/schemas';
import { Button } from './ui/button';
import { FileCheck2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

interface InlineGrammarCheckerProps {
  value: string;
  onChange: (value: string) => void;
  onAccept: (value: string) => void;
}

export function InlineGrammarChecker({ value, onChange, onAccept }: InlineGrammarCheckerProps) {
  const [results, setResults] = useState<CheckGrammarOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleCheckGrammar = () => {
    if (!value || value.length < 20) {
      toast({ title: 'Content too short', description: 'Please write at least 20 characters before checking grammar.', variant: 'destructive'});
      return;
    }

    startTransition(async () => {
      try {
        const grammarResult = await checkGrammar({ content: value });
        setResults(grammarResult);
        if (grammarResult.corrections.length > 0) {
            toast({ title: 'Grammar Checked', description: `${grammarResult.corrections.length} suggestions found.`});
        } else {
            toast({ title: 'Grammar Checked', description: 'Looks good! No suggestions found.'});
        }
      } catch (error) {
        console.error('Failed to check grammar:', error);
        toast({ title: 'Error', description: 'Failed to check grammar. Please try again.', variant: 'destructive' });
      }
    });
  };

  useEffect(() => {
    // Clear previous results when the text changes
    setResults(null);
  }, [value]);


  const highlightedText = useMemo(() => {
    if (!results || results.corrections.length === 0) {
      return value;
    }

    let lastIndex = 0;
    const parts: (string | JSX.Element)[] = [];
    
    // Create a sorted list of corrections to handle them in order
    const sortedCorrections = [...results.corrections].sort((a, b) => {
        const aIndex = value.indexOf(a.original);
        const bIndex = value.indexOf(b.original);
        return aIndex - bIndex;
    });

    sortedCorrections.forEach((correction, i) => {
      const index = value.indexOf(correction.original, lastIndex);
      if (index !== -1) {
        // Add the text before the correction
        parts.push(value.substring(lastIndex, index));

        // Add the highlighted correction
        parts.push(
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <span className="bg-yellow-200 dark:bg-yellow-800/50 rounded-md px-1 cursor-pointer underline decoration-red-500 decoration-wavy decoration-2">
                {correction.original}
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-center">
              <p className="font-semibold">Suggestion:</p>
              <p className="text-green-600 dark:text-green-400 font-bold mb-2">{correction.corrected}</p>
              <p className="text-xs text-muted-foreground">{correction.explanation}</p>
            </TooltipContent>
          </Tooltip>
        );

        lastIndex = index + correction.original.length;
      }
    });

    // Add the remaining text
    parts.push(value.substring(lastIndex));

    return parts;
  }, [results, value]);

  return (
    <TooltipProvider>
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-48"
          placeholder="Explain your topic... AI will provide inline grammar suggestions."
        />
        <div className="absolute top-2 right-2 flex items-center gap-2">
           {results && (
             <Badge variant={results.corrections.length > 0 ? "destructive" : "default"}>
                {results.corrections.length} Suggestions
             </Badge>
           )}
           <Button type="button" size="sm" variant="outline" onClick={handleCheckGrammar} disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileCheck2 className="mr-2 h-4 w-4" />}
              Check Grammar
           </Button>
        </div>

        {results && (
            <div className="relative mt-4">
                <div className="absolute inset-0 bg-background/80 z-10" />
                <div className="relative z-20 min-h-48 rounded-md border border-input bg-transparent px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm whitespace-pre-wrap">
                    {highlightedText}
                </div>
                <div className='absolute bottom-2 right-2 z-30'>
                    <Button type="button" size="sm" onClick={() => onAccept(results.correctedContent)}>Accept All</Button>
                </div>
            </div>
        )}
      </div>
    </TooltipProvider>
  );
}
