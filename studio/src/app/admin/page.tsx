
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldCheck, FileText, Users, MessageSquare, Loader2 } from 'lucide-react';
import { AdminPostsTab } from './_components/admin-posts-tab';
import { AdminUsersTab } from './_components/admin-users-tab';
import { AdminCommentsTab } from './_components/admin-comments-tab';
import { getPosts } from '@/lib/posts';
import { useAuth } from '@/lib/auth-context';

interface DashboardStats {
    totalPosts: number;
    pendingPosts: number;
    totalUsers: number;
    totalComments: number;
}

export default function AdminDashboardPage() {
    const router = useRouter();
    const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        totalPosts: 0,
        pendingPosts: 0,
        totalUsers: 0,
        totalComments: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    // Auth check
    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (!isAdmin) {
                router.push('/');
            }
        }
    }, [isAuthenticated, isAdmin, authLoading, router]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [approved, pending] = await Promise.all([
                    getPosts('approved'),
                    getPosts('pending')
                ]);
                
                // Calculate total comments across all posts
                const totalComments = [...approved, ...pending].reduce((sum, post) => sum + (post.comments?.length || 0), 0);
                
                setStats({
                    totalPosts: approved.length,
                    pendingPosts: pending.length,
                    totalUsers: 1, // This would require a users API endpoint
                    totalComments: totalComments,
                });
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated && isAdmin) {
            fetchStats();
        }
    }, [isAuthenticated, isAdmin]);

    // Show loading while checking auth
    if (authLoading || (!isAuthenticated || !isAdmin)) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-primary" />
          Admin Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">Manage posts, users, and comments.</p>
      </header>

        {isLoading ? (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
            <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalPosts}</div>
                        <p className="text-xs text-muted-foreground">approved posts on the platform</p>
                    </CardContent>
                    </Card>
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                        <FileText className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">{stats.pendingPosts}</div>
                        <p className="text-xs text-muted-foreground">posts waiting for review</p>
                    </CardContent>
                    </Card>
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                         <p className="text-xs text-muted-foreground">active users</p>
                    </CardContent>
                    </Card>
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalComments}</div>
                         <p className="text-xs text-muted-foreground">comments across all posts</p>
                    </CardContent>
                    </Card>
                </div>
            </>
        )}


        <Tabs defaultValue="posts">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="posts">Post Management</TabsTrigger>
                <TabsTrigger value="users">User Management</TabsTrigger>
                <TabsTrigger value="comments">Comment Management</TabsTrigger>
            </TabsList>
            <TabsContent value="posts">
                <AdminPostsTab />
            </TabsContent>
            <TabsContent value="users">
                <AdminUsersTab />
            </TabsContent>
            <TabsContent value="comments">
                <AdminCommentsTab />
            </TabsContent>
        </Tabs>
    </div>
  );
}
