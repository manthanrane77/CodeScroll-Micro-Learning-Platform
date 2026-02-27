'use client';

import { useState, useTransition } from 'react';
import { type Comment } from '@/lib/types';
import { addComment } from '@/lib/posts';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Send, Loader2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardDescription, CardHeader } from './ui/card';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

export function CommentSection({ postId, initialComments }: { postId: string; initialComments: Comment[] }) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const handleAddComment = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: 'Login Required',
        description: 'Please login or register to comment on posts.',
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }

    if (!newComment.trim()) return;

    startTransition(async () => {
      try {
        const addedComment = await addComment(postId, newComment.trim(), user);
        setComments((prev) => [...prev, addedComment]);
        setNewComment('');
        toast({
          title: 'Comment Added!',
          description: 'Your comment has been posted.',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to add comment. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  const handleDeleteComment = (commentId: string) => {
    startTransition(async () => {
      try {
        // In a real app, this would make an API call to delete the comment
        // await deleteComment(postId, commentId);
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        toast({
          title: 'Comment Deleted',
          description: 'Your comment has been removed.',
          variant: 'destructive',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete comment. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className="p-4 space-y-4 bg-muted/50">
      <h3 className="font-headline text-lg font-semibold">Comments ({comments.length})</h3>
      
      {/* Add Comment Form */}
      {isAuthenticated ? (
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || "Your avatar"} />
            <AvatarFallback>{(user?.displayName || user?.email || 'A').charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Add your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-background"
            />
            <div className="flex justify-end">
              <Button size="sm" onClick={handleAddComment} disabled={isPending || !newComment.trim()}>
                {isPending ? <Loader2 className="animate-spin" /> : <Send />}
                {isPending ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-4 bg-background rounded-lg border border-dashed">
          <p className="text-sm text-muted-foreground mb-2">
            Want to join the conversation?
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/login')}
          >
            Login or Register to Comment
          </Button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={comment.author?.avatarUrl || undefined} alt={comment.author?.name || 'User'} />
              <AvatarFallback>{(comment.author?.name || 'A').substring(0, 1).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 rounded-lg border bg-background p-3 text-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold">{comment.author?.name || 'Anonymous'}</p>
                  <p className="mt-1">{comment.content}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground whitespace-nowrap">{comment.createdAt}</p>
                  {isAuthenticated && user?.email === comment.author?.email && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          disabled={isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Comment?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this comment? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteComment(comment.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
         {comments.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
}
