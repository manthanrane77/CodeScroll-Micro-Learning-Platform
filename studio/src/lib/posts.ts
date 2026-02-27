import { type Post, type Comment, User } from './types';

// Use relative path so Next.js can proxy API calls during dev; fallback to env if provided
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '/api';

export const getPosts = async (status: 'approved' | 'pending' = 'approved', userId?: string): Promise<Post[]> => {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (userId) params.set('userId', userId);
  const res = await fetch(`${API_BASE}/posts?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return (await res.json()) as Post[];
};

export const getPostsSync = (): Post[] => {
  // For SSR/client sync use-case keep empty array; use getPosts for async fetches
  return [];
};

export const addPost = async (post: Omit<Post, 'id' | 'createdAt' | 'author' | 'likes' | 'dislikes' | 'comments' | 'status'>, user: User): Promise<Post> => {
  // Backend expects an `author` object (name, avatarUrl, email) in the DTO.
  // If caller provided a File in the `imageFile` property, upload it first and replace `imageUrl`.
  let imageUrl = (post as any).imageUrl;
  const imageFile: File | undefined = (post as any).imageFile;
  if (imageFile) {
    const form = new FormData();
    form.append('file', imageFile);
    const up = await fetch(`${API_BASE}/uploads`, { method: 'POST', body: form });
    if (!up.ok) {
      const text = await up.text().catch(() => '');
      throw new Error(`Failed to upload image: ${up.status} ${text}`);
    }
    // backend returns JSON { url: '/uploads/<file>' } — parse it, but tolerate plain text responses
    try {
      const j = await up.json().catch(() => null);
      if (j && typeof j.url === 'string') imageUrl = j.url;
      else {
        const t = await up.text().catch(() => '');
        imageUrl = t || imageUrl;
      }
    } catch (e) {
      const t = await up.text().catch(() => '');
      imageUrl = t || imageUrl;
    }
  }

  const body = { ...post, imageUrl, author: { name: user.displayName || user.email, email: user.email, avatarUrl: (user as any).photoURL || null } };
  const res = await fetch(`${API_BASE}/posts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to create post: ${res.status} ${text}`);
  }
  return await res.json();
};

export const addComment = async (postId: string, commentContent: string, user: User): Promise<Comment> => {
  const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: commentContent, authorName: user.displayName, authorEmail: user.email })
  });
  if (!res.ok) throw new Error('Failed to add comment');
  return (await res.json()) as Comment;
};

export const updatePostStatus = async (postId: string, status: 'approved' | 'pending'): Promise<Post> => {
  const res = await fetch(`${API_BASE}/posts/${postId}/status`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to update status: ${res.status} ${text}`);
  }
  return await res.json();
};

export const deletePost = async (postId: string): Promise<boolean> => {
  const res = await fetch(`${API_BASE}/posts/${postId}`, { method: 'DELETE' });
  return res.ok;
};

export const likePost = async (postId: string): Promise<Post> => {
  const res = await fetch(`${API_BASE}/posts/${postId}/like`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to like post');
  return await res.json();
};

export const dislikePost = async (postId: string): Promise<Post> => {
  const res = await fetch(`${API_BASE}/posts/${postId}/dislike`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to dislike post');
  return await res.json();
};
