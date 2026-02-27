
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSavedPosts } from '@/hooks/use-saved-posts';
import { getPosts } from '@/lib/posts';
import { PostCard } from '@/components/post-card';
import type { Post } from '@/lib/types';

export default function SavedPage() {
  const { savedPostIds } = useSavedPosts();
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        if (savedPostIds.length === 0) {
          setSavedPosts([]);
          setIsLoading(false);
          return;
        }

        // Fetch all approved posts and filter by saved IDs
        const allPosts = await getPosts('approved');
        const filtered = allPosts.filter(post => savedPostIds.includes(post.id));
        setSavedPosts(filtered);
      } catch (error) {
        console.error('Failed to fetch saved posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedPosts();
  }, [savedPostIds]);

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Saved Posts</h1>
        <p className="mt-2 text-muted-foreground">
          Your collection of insightful tech snaps. {savedPostIds.length > 0 && `(${savedPostIds.length} saved)`}
        </p>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : savedPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-12 text-center h-96">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <Bookmark className="h-8 w-8 text-secondary-foreground" />
          </div>
          <h2 className="font-headline text-2xl font-semibold">No Saved Posts Yet</h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            Start saving posts by clicking the bookmark icon on any post card. Your saved posts will appear here.
          </p>
          <Button asChild className="mt-4">
            <Link href="/">Browse Feed</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {savedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
