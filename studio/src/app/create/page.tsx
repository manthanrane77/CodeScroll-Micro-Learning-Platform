
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Sparkles, Wand2, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { generatePostAssist } from '@/ai/flows/generate-post-assist';
import { addPost } from '@/lib/posts';
import { InlineGrammarChecker } from '@/components/inline-grammar-checker';
import { useAuth } from '@/lib/auth-context';

const formSchema = z.object({
  title: z.string().min(5, { message: 'Please enter a title with at least 5 characters.' }),
  topic: z.string().min(2, { message: 'Please enter a topic.' }),
  content: z.string().min(50, { message: 'Content must be at least 50 characters.' }),
  media: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type AssistType = 'title';

type TitleSuggestions = {
    type: 'title',
    data: string[]
}

type Suggestions = TitleSuggestions | { type: null, data: null };

export default function CreatePostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to create a post',
        variant: 'destructive',
      });
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router, toast]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestions>({ type: null, data: null });
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      topic: '',
      content: '',
    },
  });

  const currentContent = form.watch('content');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setFileType('image');
      } else if (file.type.startsWith('video/')) {
        setFileType('video');
      } else {
        toast({ title: "Unsupported File Type", description: "Please upload an image or video file.", variant: "destructive"});
        setFileType(null);
        setPreview(null);
        return;
      }
      form.setValue('media', file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAiAssist = async (assistType: AssistType) => {
    setIsGenerating(true);
    setSuggestions({ type: null, data: null });
    
    try {
        const content = form.getValues('content');

        if (!content || content.length < 20) {
            toast({ title: 'Content too short', description: 'Please write at least 20 characters of content before using AI assistance.', variant: 'destructive'});
            return;
        }
        
        if (assistType === 'title') {
            const result = await generatePostAssist({ content, assistType: 'title' });
            if (result.titles) {
                setSuggestions({ type: 'title', data: result.titles });
            }
        }
    } catch (error) {
        console.error(error);
        toast({ title: 'Error', description: `Failed to get AI assistance. Please try again.`, variant: 'destructive' });
    } finally {
        setIsGenerating(false);
    }
  }

  const handleSelectSuggestion = (suggestion: string) => {
    if (suggestions.type) {
      form.setValue(suggestions.type, suggestion);
      toast({ title: 'Suggestion Applied!', description: `The ${suggestions.type} has been updated.` });
    }
    setSuggestions({ type: null, data: null });
  };
  
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      // Prepare post payload. If the user selected a file, include it as imageFile so addPost will upload it first.
      const payload: any = {
        title: values.title!,
        content: values.content!,
        imageUrl: preview || `https://placehold.co/600x400.png?text=${encodeURIComponent(values.title)}`,
        topic: values.topic!,
      };
      const mediaFile = form.getValues('media') as File | undefined;
      if (mediaFile instanceof File) payload.imageFile = mediaFile;

      // Use authenticated user instead of defaultUser
      await addPost(payload, user!);

      toast({ 
        title: '✅ Post Submitted Successfully!', 
        description: 'Your post is pending admin approval. It will be visible on the feed once approved.',
        duration: 6000,
      });
      router.push('/');
    } catch (err) {
      console.error('Failed to submit post', err);
      toast({ title: 'Submission Failed', description: 'Could not submit post. Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto max-w-4xl py-8">
       <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight flex items-center gap-3">
            <Wand2 className="h-8 w-8 text-primary" />
            Create a New Post
        </h1>
        <p className="mt-2 text-muted-foreground">
            Write your own post below, and use the AI assistant tools to help you along the way.
        </p>
      </header>

      <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
        <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
          ℹ️ <strong>Note:</strong> All posts require admin approval before appearing on the public feed. You'll be notified once your post is reviewed.
        </AlertDescription>
      </Alert>

      <Dialog open={suggestions.type !== null} onOpenChange={() => setSuggestions({ type: null, data: null })}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>AI Suggestions</DialogTitle>
                <DialogDescription>
                    Select one of the AI-generated {suggestions.type}s below.
                </DialogDescription>
            </DialogHeader>
            {suggestions.type === 'title' && suggestions.data && (
                <div className='flex flex-col gap-2'>
                    {suggestions.data.map((item, i) => (
                        <Button key={i} variant="outline" onClick={() => handleSelectSuggestion(item)}>
                            {item}
                        </Button>
                    ))}
                </div>
            )}
        </DialogContent>
      </Dialog>


      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
           <Card>
              <CardHeader>
                  <CardTitle>Write Your Post</CardTitle>
                  <CardDescription>Fill in the details for your new tech snap. Use the AI buttons for assistance.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                 <FormField
                    control={form.control}
                    name="media"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-lg font-semibold">Header Media (Image/Video)</FormLabel>
                            <FormControl>
                                <div 
                                    className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                {preview ? (
                                    <>
                                        {fileType === 'image' && <Image src={preview} alt="Media preview" fill className="object-cover rounded-lg" />}
                                        {fileType === 'video' && <video src={preview} controls className="w-full h-full object-cover rounded-lg" />}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <p className="text-white font-semibold">Click to change</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                                        <Upload className="w-8 h-8 mb-4" />
                                        <p className="mb-2 text-sm">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs">Image or Video (e.g., PNG, JPG, MP4)</p>
                                    </div>
                                )}
                                </div>
                            </FormControl>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                onChange={handleFileChange} 
                                accept="image/*,video/*"
                            />
                            <FormMessage />
                        </FormItem>
                     )}
                  />

                   <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel className="text-lg font-semibold flex justify-between items-center">
                                Content
                              </FormLabel>
                              <FormControl>
                                <InlineGrammarChecker
                                    value={field.value}
                                    onChange={field.onChange}
                                    onAccept={suggestion => form.setValue('content', suggestion)}
                                />
                               </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                   <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel className="text-lg font-semibold flex justify-between items-center">
                                Title
                                <Button type="button" size="sm" variant="outline" onClick={() => handleAiAssist('title')} disabled={isGenerating || !currentContent || currentContent.length < 20}>
                                    {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    <Sparkles className="mr-2 h-4 w-4" /> Suggest Titles
                                </Button>
                              </FormLabel>
                              <FormControl><Input {...field} placeholder="e.g., A Guide to React Hooks" /></FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                   <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                          <FormItem>
                               <FormLabel className="text-lg font-semibold">
                                Topic
                              </FormLabel>
                              <FormControl><Input {...field} placeholder="e.g., Web Development"/></FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
              </CardContent>
              <CardFooter className="flex justify-end">
                   <Button type="submit" disabled={isSubmitting || isGenerating}>
                      {isSubmitting && <Loader2 className="animate-spin" />}
                       Submit for Approval
                   </Button>
              </CardFooter>
           </Card>
        </form>
      </Form>
    </div>
  );
}
