
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getPosts } from "@/lib/posts";
import { useEffect, useState, useTransition } from "react";
import { Loader2, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";

type UserData = {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    postCount: number;
    lastPostDate: string;
};

// In a real app, this would call a server action to delete the user from the database
const deleteUser = async (userId: string) => {
    console.log(`Deleting user ${userId}`);
    return new Promise(resolve => setTimeout(resolve, 500));
}

export function AdminUsersTab() {
    const { toast } = useToast();
    const { user: currentUser } = useAuth();
    const [isPending, startTransition] = useTransition();
    const [allUsers, setAllUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const [approved, pending] = await Promise.all([
                    getPosts('approved'),
                    getPosts('pending')
                ]);
                
                const posts = [...approved, ...pending];
                const usersMap = new Map<string, UserData>();

                posts.forEach(post => {
                    const userId = post.author.email.replace(/[^a-zA-Z0-9]/g, ''); 
                    if (usersMap.has(post.author.email)) {
                        const userData = usersMap.get(post.author.email)!;
                        userData.postCount++;
                        if (post.createdAt > userData.lastPostDate) {
                            userData.lastPostDate = post.createdAt;
                        }
                    } else {
                        usersMap.set(post.author.email, {
                            id: userId,
                            email: post.author.email,
                            name: post.author.name,
                            avatarUrl: post.author.avatarUrl,
                            postCount: 1,
                            lastPostDate: post.createdAt
                        });
                    }
                });
                
                // Add current logged-in user if not in the list
                if (currentUser?.email && !usersMap.has(currentUser.email)) {
                    usersMap.set(currentUser.email, {
                        id: currentUser.email.replace(/[^a-zA-Z0-9]/g, ''),
                        email: currentUser.email,
                        name: currentUser.displayName || 'User',
                        avatarUrl: currentUser.photoURL || 'https://placehold.co/40x40',
                        postCount: 0,
                        lastPostDate: 'Never'
                    });
                }

                setAllUsers(Array.from(usersMap.values()));
            } catch (error) {
                console.error('Failed to fetch users:', error);
                toast({
                    title: "Error",
                    description: "Failed to load users. Please try again.",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [currentUser, toast]);

    const handleDeleteUser = (userId: string) => {
        startTransition(async () => {
            await deleteUser(userId);
            setAllUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
            toast({
                title: "User Deleted",
                description: "The user has been successfully deleted.",
                variant: "destructive"
            });
        });
    };

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Manage Users</CardTitle>
                <CardDescription>View and manage all registered users on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : allUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-12 text-center">
                        <h2 className="font-headline text-2xl font-semibold">No Users Found</h2>
                        <p className="mt-2 max-w-md text-muted-foreground">
                            There are no users to display at this time.
                        </p>
                    </div>
                ) : (
                    <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Avatar</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Posts</TableHead>
                            <TableHead>Last Active</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allUsers.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                                        <AvatarFallback>{user.name.substring(0,1)}</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.postCount > 0 ? "default" : "outline"}>
                                        {user.postCount} posts
                                    </Badge>
                                </TableCell>
                                 <TableCell>{user.lastPostDate}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost" disabled={isPending}>
                                            {isPending ? <Loader2 className="animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem disabled>View Profile</DropdownMenuItem>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem
                                                        onSelect={(e) => e.preventDefault()}
                                                        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                    >
                                                        Delete User
                                                    </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the user
                                                        and all of their associated data.
                                                    </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="bg-destructive hover:bg-destructive/90"
                                                    >
                                                        Yes, delete user
                                                    </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            </CardContent>
        </Card>
    );
}
