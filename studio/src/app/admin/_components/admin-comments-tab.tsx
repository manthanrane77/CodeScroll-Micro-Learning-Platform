
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPosts } from "@/lib/posts";
import { useEffect, useState, useTransition } from "react";
import { Loader2, MoreHorizontal, Trash2 } from "lucide-react";
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
import { type Comment } from "@/lib/types";

type CommentRowData = Comment & {
    postTitle: string;
    postId: string;
}

// In a real app, this would call a server action to delete the comment
const deleteComment = async (commentId: string) => {
    console.log(`Deleting comment ${commentId}`);
    // Here you would find the post and remove the comment from its array
    return new Promise(resolve => setTimeout(resolve, 500));
}

export function AdminCommentsTab() {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [comments, setComments] = useState<CommentRowData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const [approved, pending] = await Promise.all([
                    getPosts('approved'),
                    getPosts('pending')
                ]);
                
                const posts = [...approved, ...pending];
                const allComments: CommentRowData[] = [];
                
                posts.forEach(post => {
                    post.comments.forEach(comment => {
                        allComments.push({
                            ...comment,
                            postTitle: post.title,
                            postId: post.id
                        });
                    });
                });
                
                setComments(allComments);
            } catch (error) {
                console.error('Failed to fetch comments:', error);
                toast({
                    title: "Error",
                    description: "Failed to load comments. Please try again.",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchComments();
    }, [toast]);

    const handleDeleteComment = (commentId: string) => {
        startTransition(async () => {
            await deleteComment(commentId);
            setComments(prev => prev.filter(c => c.id !== commentId));
            toast({
                title: "Comment Deleted",
                description: "The comment has been successfully deleted.",
                variant: "destructive"
            });
        });
    };
    
    if (isLoading) {
        return (
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Manage Comments</CardTitle>
                    <CardDescription>View and moderate all comments on the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                </CardContent>
            </Card>
        );
    }
    
    if (comments.length === 0) {
        return (
             <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Manage Comments</CardTitle>
                    <CardDescription>View and moderate all comments on the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-12 text-center h-64 mt-4">
                        <h2 className="font-headline text-2xl font-semibold">No Comments Found</h2>
                        <p className="mt-2 max-w-md text-muted-foreground">
                            There are no comments to display at this time.
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Manage Comments</CardTitle>
                <CardDescription>View and moderate all comments on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Author</TableHead>
                            <TableHead>Comment</TableHead>
                            <TableHead>In Response To</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {comments.map(comment => (
                            <TableRow key={comment.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
                                            <AvatarFallback>{comment.author.name.substring(0,1)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{comment.author.name}</div>
                                            <div className="text-sm text-muted-foreground">{comment.author.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p className="max-w-xs truncate">{comment.content}</p>
                                </TableCell>
                                <TableCell>
                                    <a href={`/#${comment.postId}`} className="text-primary hover:underline truncate">
                                        {comment.postTitle}
                                    </a>
                                </TableCell>
                                 <TableCell>{comment.createdAt}</TableCell>
                                <TableCell>
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                                                 <Trash2 className="h-4 w-4 mr-2" /> Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the comment.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="bg-destructive hover:bg-destructive/90"
                                                disabled={isPending}
                                            >
                                                {isPending ? <Loader2 className="animate-spin"/> : 'Yes, delete comment'}
                                            </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
