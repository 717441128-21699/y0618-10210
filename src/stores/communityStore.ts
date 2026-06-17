import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Post, Comment, NewPost, NewComment } from '@/types';
import { api } from '@/services/api';

interface CommunityStore {
  posts: Post[];
  currentPost: Post | null;
  comments: Comment[];
  likedPostIds: Set<string>;
  loading: boolean;
  fetchPosts: (channel?: string) => Promise<void>;
  fetchPost: (id: string) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  createPost: (data: NewPost) => Promise<Post | null>;
  addComment: (data: NewComment) => Promise<Comment | null>;
}

export const useCommunityStore = create<CommunityStore>()(
  immer((set, get) => ({
    posts: [],
    currentPost: null,
    comments: [],
    likedPostIds: new Set(),
    loading: false,

    fetchPosts: async (channel) => {
      set((state) => {
        state.loading = true;
      });
      try {
        const res = await api.getPosts(channel);
        if (res.code === 0) {
          set((state) => {
            state.posts = res.data;
            const liked = new Set<string>();
            res.data.forEach((p) => {
              if (p.isLiked) liked.add(p.id);
            });
            state.likedPostIds = liked;
          });
        }
      } finally {
        set((state) => {
          state.loading = false;
        });
      }
    },

    fetchPost: async (id) => {
      set((state) => {
        state.loading = true;
      });
      try {
        const [postRes, commentsRes] = await Promise.all([
          api.getPost(id),
          api.getComments(id),
        ]);
        if (postRes.code === 0) {
          set((state) => {
            state.currentPost = postRes.data;
            if (postRes.data.isLiked) {
              state.likedPostIds.add(postRes.data.id);
            }
          });
        }
        if (commentsRes.code === 0) {
          set((state) => {
            state.comments = commentsRes.data;
          });
        }
      } finally {
          set((state) => {
            state.loading = false;
          });
      }
    },

    toggleLike: async (postId) => {
      const prevLiked = get().likedPostIds.has(postId);
      set((state) => {
        const post = state.posts.find((p) => p.id === postId);
        if (post) {
          if (prevLiked) {
            post.likes = Math.max(0, post.likes - 1);
            post.isLiked = false;
            state.likedPostIds.delete(postId);
          } else {
            post.likes += 1;
            post.isLiked = true;
            state.likedPostIds.add(postId);
          }
        }
        if (state.currentPost && state.currentPost.id === postId) {
          if (prevLiked) {
            state.currentPost.likes = Math.max(0, state.currentPost.likes - 1);
            state.currentPost.isLiked = false;
          } else {
            state.currentPost.likes += 1;
            state.currentPost.isLiked = true;
          }
        }
      });
      try {
        await api.toggleLike(postId);
      } catch {
          set((state) => {
            const post = state.posts.find((p) => p.id === postId);
            if (post) {
              if (prevLiked) {
                post.likes += 1;
                post.isLiked = true;
                state.likedPostIds.add(postId);
              } else {
                  state.likedPostIds.delete(postId);
                post.likes = Math.max(0, post.likes - 1);
                post.isLiked = false;
              }
            }
            if (state.currentPost && state.currentPost.id === postId) {
              if (prevLiked) {
                state.currentPost.likes += 1;
                state.currentPost.isLiked = true;
              } else {
                state.currentPost.likes = Math.max(0, state.currentPost.likes - 1);
                state.currentPost.isLiked = false;
              }
            }
          });
        }
    },

    createPost: async (data) => {
      set((state) => {
        state.loading = true;
      });
      try {
        const res = await api.createPost(data);
        if (res.code === 0) {
          set((state) => {
            state.posts.unshift(res.data);
          });
          return res.data;
        }
        return null;
      } finally {
        set((state) => {
          state.loading = false;
        });
      }
    },

    addComment: async (data) => {
      try {
        const res = await api.addComment(data);
        if (res.code === 0) {
          set((state) => {
            state.comments.push(res.data);
            if (state.currentPost) {
              state.currentPost.comments += 1;
            }
            const post = state.posts.find((p) => p.id === data.postId);
            if (post) {
              post.comments += 1;
            }
          });
          return res.data;
        }
        return null;
      } finally {}
    },
  }))
);
