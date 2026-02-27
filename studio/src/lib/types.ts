export type Comment = {
  id: string;
  author: {
    name: string;
    avatarUrl: string;
    email: string;
  };
  content: string;
  createdAt: string;
};

export type Post = {
  id: string;
  author: {
    name: string;
    avatarUrl: string;
    email: string;
  };
  topic: string;
  title: string;
  imageUrl: string;
  content: string;
  createdAt: string;
  status: 'approved' | 'pending';
  likes: number;
  dislikes: number;
  comments: Comment[];
};

export type User = {
  id?: number;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role?: 'admin' | 'user';
};
