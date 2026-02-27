import { notFound } from 'next/navigation';
import { getPosts } from '@/lib/posts';
import { PostCard } from '@/components/post-card';

type Props = { params: { id: string } };

export default async function PostPage({ params }: Props) {
  const posts = await getPosts('approved');
  const post = posts.find(p => p.id === params.id);
  if (!post) return notFound();

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Reuse the PostCard client component by rendering on client */}
      {/* We wrap with a client boundary by importing the PostCard which is 'use client' */}
      {/* The PostCard expects a Post prop */}
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <PostCard post={post} />
    </div>
  );
}
