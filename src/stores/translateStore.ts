import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { TranslationOrder, NewOrder } from '@/types';
import { api } from '@/services/api';

interface TranslateStore {
  orders: TranslationOrder[];
  currentOrder: TranslationOrder | null;
  loading: boolean;
  fetchOrders: (status?: string, role?: 'client' | 'translator') => Promise<void>;
  fetchOrder: (orderId: string) => Promise<TranslationOrder | null>;
  createOrder: (data: NewOrder) => Promise<TranslationOrder | null>;
  acceptOrder: (orderId: string) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  completeOrder: (orderId: string, rating: number, review: string) => Promise<void>;
}

export const useTranslateStore = create<TranslateStore>()(
  immer((set, get) => ({
    orders: [],
    currentOrder: null,
    loading: false,

    fetchOrders: async (status, role) => {
      set((state) => {
        state.loading = true;
      });
      try {
        const res = await api.getOrders(status, role);
        if (res.code === 0) {
          set((state) => {
            state.orders = res.data;
          });
        }
      } finally {
        set((state) => {
          state.loading = false;
        });
      }
    },

    fetchOrder: async (orderId) => {
      set((state) => {
        state.loading = true;
      });
      try {
        const res = await api.getOrder(orderId);
        if (res.code === 0 && res.data) {
          set((state) => {
            state.currentOrder = res.data;
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

    createOrder: async (data) => {
      set((state) => {
        state.loading = true;
      });
      try {
        const res = await api.createOrder(data);
        if (res.code === 0) {
          set((state) => {
            state.orders.unshift(res.data);
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

    acceptOrder: async (orderId) => {
      set((state) => {
        state.loading = true;
      });
      try {
        const res = await api.acceptOrder(orderId);
        if (res.code === 0) {
          set((state) => {
            const idx = state.orders.findIndex((o) => o.id === orderId);
            if (idx !== -1) {
              state.orders[idx] = res.data;
            }
            if (state.currentOrder && state.currentOrder.id === orderId) {
              state.currentOrder = res.data;
            }
          });
        }
      } finally {
        set((state) => {
          state.loading = false;
        });
      }
    },

    cancelOrder: async (orderId) => {
      set((state) => {
        state.loading = true;
      });
      try {
        const res = await api.cancelOrder(orderId);
        if (res.code === 0) {
          set((state) => {
            const idx = state.orders.findIndex((o) => o.id === orderId);
            if (idx !== -1) {
              state.orders[idx] = res.data;
            }
            if (state.currentOrder && state.currentOrder.id === orderId) {
              state.currentOrder = res.data;
            }
          });
        }
      } finally {
        set((state) => {
          state.loading = false;
        });
      }
    },

    completeOrder: async (orderId, rating, review) => {
      set((state) => {
        state.loading = true;
      });
      try {
        const res = await api.completeOrder(orderId, rating, review);
        if (res.code === 0) {
          set((state) => {
            const idx = state.orders.findIndex((o) => o.id === orderId);
            if (idx !== -1) {
              state.orders[idx] = res.data;
            }
            if (state.currentOrder && state.currentOrder.id === orderId) {
              state.currentOrder = res.data;
            }
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
