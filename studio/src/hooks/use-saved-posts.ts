'use client';

import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

export const useSavedPosts = () => {
  const [savedPostIds, setSavedPostIds] = useState<string[]>(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem('savedPostIds') : null;
      return raw ? JSON.parse(raw) as string[] : [];
    } catch (e) {
      return [];
    }
  });
  const { toast } = useToast();

  const persist = (ids: string[]) => {
    try {
      if (typeof window !== 'undefined') window.localStorage.setItem('savedPostIds', JSON.stringify(ids));
    } catch (e) { /* ignore */ }
  };

  const toggleSavedPost = useCallback((postId: string) => {
    setSavedPostIds((prev) => {
      const wasSaved = prev.includes(postId);
      const next = wasSaved 
        ? prev.filter(id => id !== postId)
        : [...prev, postId];
      
      persist(next);
      
      // Schedule toast for after render completes
      setTimeout(() => {
        if (wasSaved) {
          toast({ title: 'Post Unsaved', description: 'Removed from saved posts.' });
        } else {
          toast({ title: 'Post Saved', description: 'Added to saved posts.' });
        }
      }, 0);
      
      return next;
    });
  }, [toast]);

  return { savedPostIds, toggleSavedPost, isLoading: false };
};
