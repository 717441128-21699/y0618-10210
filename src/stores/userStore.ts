import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { User, UserStats, UserProfileUpdate } from '@/types';
import { api } from '@/services/api';

interface UserStore {
  user: User | null;
  userStats: UserStats | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
  fetchUserStats: () => Promise<void>;
  updateUserProfile: (update: UserProfileUpdate) => Promise<void>;
}

export const useUserStore = create<UserStore>()(
  immer((set) => ({
    user: null,
    userStats: null,
    loading: false,

    fetchUser: async () => {
      set((state) => {
        state.loading = true;
      });
      try {
        const res = await api.getUser();
        if (res.code === 0) {
          set((state) => {
            state.user = res.data;
          });
        }
      } finally {
        set((state) => {
          state.loading = false;
        });
      }
    },

    fetchUserStats: async () => {
      set((state) => {
        state.loading = true;
      });
      try {
        const res = await api.getUserStats();
        if (res.code === 0) {
          set((state) => {
            state.userStats = res.data;
          });
        }
      } finally {
        set((state) => {
          state.loading = false;
        });
      }
    },

    updateUserProfile: async (update: UserProfileUpdate) => {
      set((state) => {
        state.loading = true;
      });
      try {
        const res = await api.updateUserProfile(update);
        if (res.code === 0) {
          set((state) => {
            state.user = res.data;
          });
        }
      } finally {
        set((state) => {
          state.loading = false;
        });
      }
    },
  }))
);
