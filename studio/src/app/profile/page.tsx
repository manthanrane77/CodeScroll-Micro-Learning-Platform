
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User as UserIcon, FileText, Clock, CheckCircle, Loader2, Settings } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { getPosts } from '@/lib/posts';
import { Post } from '@/lib/types';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [approvedPosts, setApprovedPosts] = useState<Post[]>([]);
  const [pendingPosts, setPendingPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  const fetchUserPosts = async () => {
    try {
      setIsLoading(true);
      const [approved, pending] = await Promise.all([
        getPosts('approved'),
        getPosts('pending')
      ]);

      // Filter posts by current user's email
      const userApproved = approved.filter(post => post.author.email === user?.email);
      const userPending = pending.filter(post => post.author.email === user?.email);

      setApprovedPosts(userApproved);
      setPendingPosts(userPending);
    } catch (error) {
      console.error('Failed to fetch user posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="container mx-auto max-w-4xl py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl py-8">
      {/* User Info Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.photoURL || ''} alt={user.displayName || user.email || 'User'} />
                <AvatarFallback>
                  <UserIcon className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-headline text-3xl font-bold">{user.displayName || user.email || 'User'}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex gap-4 mt-2">
                  <Badge variant="secondary">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {approvedPosts.length} Published
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    {pendingPosts.length} Pending
                  </Badge>
                </div>
              </div>
            </div>
            <Link href="/profile/edit">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </CardHeader>
      </Card>

      {/* Posts Tabs */}
      <Tabs defaultValue="published" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="published">
            <CheckCircle className="h-4 w-4 mr-2" />
            Published ({approvedPosts.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            <Clock className="h-4 w-4 mr-2" />
            Pending Approval ({pendingPosts.length})
          </TabsTrigger>
        </TabsList>

        {/* Published Posts Tab */}
        <TabsContent value="published">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : approvedPosts.length === 0 ? (
            <Card className="mt-4">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg">No Published Posts Yet</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Your approved posts will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {approvedPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video w-full">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">{post.topic}</Badge>
                      <span className="text-xs text-muted-foreground">{post.createdAt}</span>
                    </div>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>
                    <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                      <span>👍 {post.likes}</span>
                      <span>👎 {post.dislikes}</span>
                      <span>💬 {post.comments.length}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Pending Posts Tab */}
        <TabsContent value="pending">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : pendingPosts.length === 0 ? (
            <Card className="mt-4">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg">No Pending Posts</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Posts waiting for admin approval will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {pendingPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden border-orange-200 dark:border-orange-900">
                  <div className="relative aspect-video w-full">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover opacity-75"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className="bg-orange-100 dark:bg-orange-950 border-orange-300 dark:border-orange-700">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">{post.topic}</Badge>
                      <span className="text-xs text-muted-foreground">{post.createdAt}</span>
                    </div>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>
                    <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-900">
                      <p className="text-xs text-orange-900 dark:text-orange-100">
                        ⏳ <strong>Waiting for Admin Approval</strong>
                        <br />
                        <span className="text-orange-700 dark:text-orange-300">
                          Your post will be visible on the feed once approved by an admin.
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
