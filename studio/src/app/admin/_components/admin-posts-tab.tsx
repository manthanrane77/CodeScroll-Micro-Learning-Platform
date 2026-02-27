
'use client';

import { useEffect, useState, useTransition } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Check, Loader2, X } from 'lucide-react';

import { type Post } from '@/lib/types';
import { getPosts, updatePostStatus, deletePost } from '@/lib/posts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
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
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function PostList({ posts, onApprove, onReject }: { posts: Post[], onApprove: (id: string) => void, onReject: (id: string) => void }) {
    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-12 text-center h-64 mt-4">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                    <Check className="h-8 w-8 text-secondary-foreground" />
                </div>
                <h2 className="font-headline text-2xl font-semibold">All Caught Up!</h2>
                <p className="mt-2 max-w-md text-muted-foreground">
                    There are no posts in this category.
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-col">
              <CardHeader>
                <div className="relative aspect-video w-full">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex justify-between items-center mb-2">
                    <Badge variant="secondary">{post.topic}</Badge>
                    <span className="text-xs text-muted-foreground">{post.createdAt}</span>
                </div>
                <h2 className="font-headline text-xl font-bold">{post.title}</h2>
                <p className="mt-2 text-sm text-foreground/80 line-clamp-3">{post.content}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-destructive hover:text-destructive">
                      <X className="h-4 w-4 mr-2" /> Reject
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the post.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onReject(post.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Yes, reject post
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {post.status === 'pending' && (
                    <Button onClick={() => onApprove(post.id)}>
                        <Check className="h-4 w-4 mr-2" /> Approve
                    </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
    )
}

export function AdminPostsTab() {
  const [pendingPosts, setPendingPosts] = useState<Post[]>([]);
  const [approvedPosts, setApprovedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const fetchPosts = () => {
    setIsLoading(true);
    Promise.all([
        getPosts('pending'),
        getPosts('approved')
    ]).then(([pending, approved]) => {
        setPendingPosts(pending);
        setApprovedPosts(approved);
        setIsLoading(false);
    });
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleApprove = (postId: string) => {
    startTransition(() => {
      (async () => {
        try {
          await updatePostStatus(postId, 'approved');
          fetchPosts(); // Refetch all posts to update lists
          toast({
            title: 'Post Approved!',
            description: 'The post is now live on the feed.',
          });
          router.refresh();
        } catch (err: any) {
          console.error('Failed to update post status', err);
          toast({ title: 'Failed to update status', description: err?.message || 'Could not approve post. Please try again.', variant: 'destructive' });
        }
      })();
    });
  };

  const handleReject = (postId: string) => {
     startTransition(() => {
      (async () => {
        try {
          await deletePost(postId);
          fetchPosts(); // Refetch all posts
          toast({
            title: 'Post Rejected',
            description: 'The post has been deleted.',
            variant: 'destructive',
          });
          router.refresh();
        } catch (err: any) {
          console.error('Failed to delete post', err);
          toast({ title: 'Failed to delete', description: err?.message || 'Could not delete post. Please try again.', variant: 'destructive' });
        }
      })();
    });
  };

  return (
    <Card className="mt-4">
        <CardHeader>
            <CardTitle>Manage All Posts</CardTitle>
            <CardDescription>Review pending submissions and manage already approved posts.</CardDescription>
        </CardHeader>
        <CardContent>
             <Tabs defaultValue="pending">
                <TabsList>
                    <TabsTrigger value="pending">Pending <Badge className="ml-2">{pendingPosts.length}</Badge></TabsTrigger>
                    <TabsTrigger value="approved">Approved <Badge variant="secondary" className="ml-2">{approvedPosts.length}</Badge></TabsTrigger>
                </TabsList>
                <TabsContent value="pending">
                    {isLoading ? <Loader2 className="animate-spin mt-4" /> : <PostList posts={pendingPosts} onApprove={handleApprove} onReject={handleReject} />}
                </TabsContent>
                <TabsContent value="approved">
                    {isLoading ? <Loader2 className="animate-spin mt-4" /> : <PostList posts={approvedPosts} onApprove={handleApprove} onReject={handleReject} />}
                </TabsContent>
             </Tabs>
        </CardContent>
    </Card>
  );
}
