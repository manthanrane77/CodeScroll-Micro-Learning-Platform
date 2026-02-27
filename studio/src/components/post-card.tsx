'use client';

import Image from 'next/image';
// @ts-ignore - missing type declarations for 'lucide-react'
import { Bookmark, MessageCircle, Share2, Sparkles, ThumbsDown, ThumbsUp } from 'lucide-react';
import { type Post } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useSavedPosts } from '@/hooks/use-saved-posts';
import { SimplifyContentDialog } from './simplify-content-dialog';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { useState, useTransition } from 'react';
import { dislikePost, likePost } from '@/lib/posts';
import { CommentSection } from './comment-section';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';


export function PostCard({ post }: { post: Post }) {
  const { toast } = useToast();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { savedPostIds, toggleSavedPost } = useSavedPosts();
  const [isPending, startTransition] = useTransition();
  const [isExpanded, setIsExpanded] = useState(false);
  const [interactions, setInteractions] = useState({
    likes: post.likes,
    dislikes: post.dislikes,
    userVote: null as 'like' | 'dislike' | null,
  });

  const isSaved = savedPostIds.includes(post.id);
  const MAX_CONTENT_LENGTH = 200;
  const shouldTruncate = post.content.length > MAX_CONTENT_LENGTH;
  const displayContent = shouldTruncate && !isExpanded 
    ? post.content.substring(0, MAX_CONTENT_LENGTH) + '...' 
    : post.content;

  const handleSaveToggle = () => {
    toggleSavedPost(post.id);
    toast({
      title: isSaved ? 'Post Unsaved' : 'Post Saved!',
      description: isSaved ? `"${post.title}" removed from your saved posts.` : `"${post.title}" added to your saved posts.`,
    });
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login or register to like posts.',
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }
    
    if (interactions.userVote === 'like') return;
    startTransition(() => {
        likePost(post.id);
        setInteractions((prev) => ({
            ...prev,
            likes: prev.likes + 1,
            dislikes: prev.userVote === 'dislike' ? prev.dislikes -1 : prev.dislikes,
            userVote: 'like',
        }));
    });
  }
  
  const handleDislike = () => {
      if (!isAuthenticated) {
        toast({
          title: 'Login Required',
          description: 'Please login or register to dislike posts.',
          variant: 'destructive',
        });
        router.push('/login');
        return;
      }
      
      if (interactions.userVote === 'dislike') return;
      startTransition(() => {
          dislikePost(post.id);
          setInteractions((prev) => ({
              ...prev,
              dislikes: prev.dislikes + 1,
              likes: prev.userVote === 'like' ? prev.likes - 1 : prev.likes,
              userVote: 'dislike',
          }));
      });
  }

  const handleShare = () => {
    // We can't create a unique URL per post yet without a dedicated page for each.
    // For now, we'll copy the current page URL and add a hash to the post ID.
    const postUrl = `${window.location.origin}${window.location.pathname}#${post.id}`;
    navigator.clipboard.writeText(postUrl).then(() => {
        toast({
            title: 'Link Copied!',
            description: 'The post link has been copied to your clipboard.',
        });
    }).catch(err => {
        console.error('Failed to copy: ', err);
        toast({
            title: 'Error',
            description: 'Could not copy the link.',
            variant: 'destructive',
        });
    });
  };

  return (
    <Collapsible>
    <Card id={post.id} className="overflow-hidden rounded-xl shadow-md transition-shadow hover:shadow-lg scroll-mt-20 flex flex-col h-full">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Avatar>
          <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
          <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{post.author.name}</p>
          <p className="text-xs text-muted-foreground">{post.createdAt}</p>
        </div>
        <Badge variant="secondary">{post.topic}</Badge>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="relative aspect-video w-full">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint="tech abstract"
          />
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h2 className="font-headline text-xl font-bold">{post.title}</h2>
          <p className="mt-2 text-sm text-foreground/80 flex-1">
            {displayContent}
          </p>
          {shouldTruncate && (
            <Button 
              variant="link" 
              size="sm" 
              className="mt-2 p-0 h-auto font-semibold text-primary self-start"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </Button>
          )}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-between p-2">
        <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={handleLike} disabled={isPending}>
                <ThumbsUp className={cn('h-5 w-5', interactions.userVote === 'like' && 'fill-primary text-primary')} />
                <span className="ml-2 text-sm font-medium">{interactions.likes}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDislike} disabled={isPending}>
                <ThumbsDown className={cn('h-5 w-5', interactions.userVote === 'dislike' && 'fill-destructive text-destructive')} />
                <span className="ml-2 text-sm font-medium">{interactions.dislikes}</span>
            </Button>
            <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                    <MessageCircle className="h-5 w-5" />
                    <span className="ml-2 text-sm font-medium">{post.comments.length}</span>
                </Button>
            </CollapsibleTrigger>
            <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
            </Button>
            <SimplifyContentDialog content={post.content} title={post.title} />
        </div>
        <Button variant="ghost" size="icon" onClick={handleSaveToggle} aria-label="Save post">
          <Bookmark className={cn('h-5 w-5', isSaved && 'fill-primary text-primary')} />
        </Button>
      </CardFooter>
      <CollapsibleContent>
        <Separator />
        <CommentSection postId={post.id} initialComments={post.comments} />
      </CollapsibleContent>
    </Card>
    </Collapsible>
  );
}
