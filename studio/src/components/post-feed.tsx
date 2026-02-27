'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import { type Post } from '@/lib/types';
import { PostCard } from './post-card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { getPosts } from '@/lib/posts';
import { Loader2 } from 'lucide-react';

const ALL_TOPICS = 'All Topics';

export function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(ALL_TOPICS);

  useEffect(() => {
    setIsLoading(true);
    getPosts().then(fetchedPosts => {
        setPosts(fetchedPosts);
        setIsLoading(false);
    });
  }, []);

  const topics = useMemo(() => {
    return [ALL_TOPICS, ...Array.from(new Set(posts.map((p) => p.topic)))];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        return selectedTopic === ALL_TOPICS || post.topic === selectedTopic;
      })
      .filter((post) => {
        return post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.content.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [posts, searchTerm, selectedTopic]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16 h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-5xl font-bold tracking-tighter">Code Scroller Feed</h1>
        <p className="mt-2 text-muted-foreground">Your daily dose of simplified tech knowledge.</p>
      </header>

      <div className="sticky top-0 z-10 bg-background/80 py-4 backdrop-blur-md">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            className="pl-10 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {topics.map((topic) => (
            <Button
              key={topic}
              variant={selectedTopic === topic ? 'default' : 'outline'}
              size="sm"
              className="whitespace-nowrap rounded-full"
              onClick={() => setSelectedTopic(topic)}
            >
              {topic}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-8">
        <AnimatePresence>
          {filteredPosts.map((post, i) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredPosts.length === 0 && (
          <div className="text-center text-muted-foreground py-16">
            <h3 className='font-headline text-xl'>No posts found</h3>
            <p>Try adjusting your search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
