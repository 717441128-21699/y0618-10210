import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Word, Dictionary, DictionaryGroup } from '@/types';
import { api } from '@/services/api';

interface VocabStore {
  words: Word[];
  currentWord: Word | null;
  dictionary: Dictionary | null;
  loading: boolean;
  searchKeyword: string;
  fetchVocabulary: (category?: string, keyword?: string) => Promise<void>;
  fetchWord: (id: string) => Promise<void>;
  toggleFavorite: (wordId: string) => Promise<void>;
  fetchDictionary: () => Promise<void>;
  createDictionaryGroup: (name: string) => Promise<DictionaryGroup | null>;
}

export const useVocabStore = create<VocabStore>()(
  immer((set) => ({
    words: [],
    currentWord: null,
    dictionary: null,
    loading: false,
    searchKeyword: '',

    fetchVocabulary: async (category, keyword) => {
      set((state) => {
        state.loading = true;
        if (keyword !== undefined) state.searchKeyword = keyword;
      });
      try {
        const res = await api.getVocabulary(category, keyword);
        if (res.code === 0) {
          set((state) => {
            state.words = res.data;
          });
        }
      } finally {
        set((state) => {
          state.loading = false;
        });
      }
    },

    fetchWord: async (id) => {
      set((state) => {
        state.loading = true;
      });
      try {
        const res = await api.getWord(id);
        if (res.code === 0) {
          set((state) => {
            state.currentWord = res.data;
          });
        }
      } finally {
        set((state) => {
          state.loading = false;
        });
      }
    },

    toggleFavorite: async (wordId) => {
      try {
        const res = await api.toggleFavorite(wordId);
        if (res.code === 0) {
          set((state) => {
            const word = state.words.find((w) => w.id === wordId);
            if (word) {
              word.isFavorite = res.data.isFavorite;
            }
            if (state.currentWord && state.currentWord.id === wordId) {
              state.currentWord.isFavorite = res.data.isFavorite;
            }
          });
        }
      } finally {}
    },

    fetchDictionary: async () => {
      set((state) => {
        state.loading = true;
      });
      try {
        const res = await api.getDictionary();
        if (res.code === 0) {
          set((state) => {
            state.dictionary = res.data;
          });
        }
      } finally {
        set((state) => {
          state.loading = false;
        });
      }
    },

    createDictionaryGroup: async (name) => {
      set((state) => {
        state.loading = true;
      });
      try {
        const res = await api.createDictionaryGroup(name);
        if (res.code === 0) {
          set((state) => {
            if (state.dictionary) {
              state.dictionary.groups.push(res.data);
            }
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
  }))
);
