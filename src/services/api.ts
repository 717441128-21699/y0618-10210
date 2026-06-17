import type {
  ApiResponse,
  User,
  UserStats,
  UserProfileUpdate,
  Course,
  Lesson,
  ExerciseSubmission,
  ExerciseResult,
  Word,
  Dictionary,
  DictionaryGroup,
  Post,
  Comment,
  NewPost,
  NewComment,
  TranslationOrder,
  NewOrder,
  Badge,
  WeeklyTrendPoint,
  CategoryRadarPoint,
} from '@/types';
import {
  mockUser,
  mockUserStats,
  mockCourses,
  mockLessons,
  mockWords,
  mockDictionary,
  mockPosts,
  mockComments,
  mockOrders,
  mockBadges,
  mockWeeklyTrend,
  mockCategoryRadar,
} from '../mock/data';

const delay = () => new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

const ok = <T>(data: T): Promise<ApiResponse<T>> =>
  delay().then(() => ({ code: 0, message: 'success', data }));

const STORAGE_KEYS = {
  FAVORITES: 'signlang_favorites',
  LIKES: 'signlang_likes',
  LESSON_PROGRESS: 'signlang_lesson_progress',
  DICTIONARY_GROUPS: 'signlang_dictionary_groups',
} as const;

const getStoredIds = (key: string): Set<string> => {
  try {
    const raw = localStorage.getItem(key);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
};

const setStoredIds = (key: string, ids: Set<string>) => {
  try {
    localStorage.setItem(key, JSON.stringify([...ids]));
  } catch {}
};

const toggleStoredId = (key: string, id: string): boolean => {
  const set = getStoredIds(key);
  if (set.has(id)) {
    set.delete(id);
    setStoredIds(key, set);
    return false;
  } else {
    set.add(id);
    setStoredIds(key, set);
    return true;
  }
};

export const api = {
  async getUser(): Promise<ApiResponse<User>> {
    return ok({ ...mockUser });
  },

  async getUserStats(): Promise<ApiResponse<UserStats>> {
    return ok({ ...mockUserStats });
  },

  async updateUserProfile(update: UserProfileUpdate): Promise<ApiResponse<User>> {
    return ok({ ...mockUser, ...update });
  },

  async getCourses(level?: string, category?: string): Promise<ApiResponse<Course[]>> {
    let result = [...mockCourses];
    if (level) result = result.filter((c) => c.level === level);
    if (category) result = result.filter((c) => c.category === category);
    return ok(result);
  },

  async getCourse(id: string): Promise<ApiResponse<Course>> {
    const course = mockCourses.find((c) => c.id === id);
    return ok({ ...course! });
  },

  async getLesson(id: string): Promise<ApiResponse<Lesson>> {
    for (const lessons of Object.values(mockLessons)) {
      const lesson = lessons.find((l) => l.id === id);
      if (lesson) {
        const completedSet = getStoredIds(STORAGE_KEYS.LESSON_PROGRESS);
        return ok({ ...lesson, completed: completedSet.has(lesson.id) });
      }
    }
    return ok({ ...mockLessons['c001'][0] });
  },

  async submitExercise(submission: ExerciseSubmission): Promise<ApiResponse<ExerciseResult>> {
    const correct = Math.random() > 0.3;
    return ok({
      correct,
      points: correct ? 10 : 0,
      feedback: correct ? '回答正确！做得好！' : '回答错误，再试一次吧。',
    });
  },

  async markLessonComplete(lessonId: string): Promise<ApiResponse<boolean>> {
    const result = toggleStoredId(STORAGE_KEYS.LESSON_PROGRESS, lessonId);
    return ok(true);
  },

  async getVocabulary(category?: string, keyword?: string): Promise<ApiResponse<Word[]>> {
    const favorites = getStoredIds(STORAGE_KEYS.FAVORITES);
    let result = mockWords.map((w) => ({ ...w, isFavorite: favorites.has(w.id) }));
    if (category) result = result.filter((w) => w.category === category);
    if (keyword) {
      const kw = keyword.toLowerCase();
      result = result.filter(
        (w) =>
          w.word.toLowerCase().includes(kw) ||
          w.translation.toLowerCase().includes(kw) ||
          w.example.toLowerCase().includes(kw)
      );
    }
    return ok(result);
  },

  async getWord(id: string): Promise<ApiResponse<Word>> {
    const favorites = getStoredIds(STORAGE_KEYS.FAVORITES);
    const word = mockWords.find((w) => w.id === id) || mockWords[0];
    return ok({ ...word, isFavorite: favorites.has(word.id) });
  },

  async toggleFavorite(wordId: string): Promise<ApiResponse<{ wordId: string; isFavorite: boolean }>> {
    const isFavorite = toggleStoredId(STORAGE_KEYS.FAVORITES, wordId);
    return ok({ wordId, isFavorite });
  },

  async getDictionary(): Promise<ApiResponse<Dictionary>> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DICTIONARY_GROUPS);
      if (raw) {
        const groups: DictionaryGroup[] = JSON.parse(raw);
        return ok({ groups, totalWords: mockDictionary.totalWords });
      }
    } catch {}
    return ok({ ...mockDictionary });
  },

  async createDictionaryGroup(name: string): Promise<ApiResponse<DictionaryGroup>> {
    const newGroup: DictionaryGroup = {
      id: `g${Date.now()}`,
      name,
      wordIds: [],
      createdAt: new Date().toISOString(),
    };
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DICTIONARY_GROUPS);
      const groups: DictionaryGroup[] = raw ? JSON.parse(raw) : [...mockDictionary.groups];
      groups.push(newGroup);
      localStorage.setItem(STORAGE_KEYS.DICTIONARY_GROUPS, JSON.stringify(groups));
    } catch {}
    return ok(newGroup);
  },

  async getPosts(channel?: string): Promise<ApiResponse<Post[]>> {
    const likes = getStoredIds(STORAGE_KEYS.LIKES);
    let result = mockPosts.map((p) => ({
      ...p,
      isLiked: likes.has(p.id),
      likes: likes.has(p.id) ? p.likes + 1 : p.likes,
    }));
    if (channel) result = result.filter((p) => p.channel === channel);
    return ok(result);
  },

  async getPost(id: string): Promise<ApiResponse<Post>> {
    const likes = getStoredIds(STORAGE_KEYS.LIKES);
    const post = mockPosts.find((p) => p.id === id) || mockPosts[0];
    return ok({
      ...post,
      isLiked: likes.has(post.id),
      likes: likes.has(post.id) ? post.likes + 1 : post.likes,
    });
  },

  async getComments(postId: string): Promise<ApiResponse<Comment[]>> {
    const comments = mockComments.filter((c) => c.postId === postId);
    return ok([...comments]);
  },

  async toggleLike(postId: string): Promise<ApiResponse<{ postId: string; isLiked: boolean; likes: number }>> {
    const isLiked = toggleStoredId(STORAGE_KEYS.LIKES, postId);
    const post = mockPosts.find((p) => p.id === postId);
    const baseLikes = post?.likes || 0;
    return ok({ postId, isLiked, likes: isLiked ? baseLikes + 1 : baseLikes });
  },

  async createPost(data: NewPost): Promise<ApiResponse<Post>> {
    const newPost: Post = {
      id: `p${Date.now()}`,
      authorId: mockUser.id,
      authorName: mockUser.name,
      authorAvatar: mockUser.avatar,
      channel: data.channel,
      title: data.title,
      content: data.content,
      images: data.images,
      likes: 0,
      comments: 0,
      views: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
    };
    mockPosts.unshift(newPost);
    return ok(newPost);
  },

  async addComment(data: NewComment): Promise<ApiResponse<Comment>> {
    const newComment: Comment = {
      id: `cm${Date.now()}`,
      postId: data.postId,
      authorId: mockUser.id,
      authorName: mockUser.name,
      authorAvatar: mockUser.avatar,
      content: data.content,
      likes: 0,
      createdAt: new Date().toISOString(),
      replyTo: data.replyTo,
    };
    mockComments.push(newComment);
    return ok(newComment);
  },

  async getOrders(status?: string, role?: 'client' | 'translator'): Promise<ApiResponse<TranslationOrder[]>> {
    let result = [...mockOrders];
    if (status) result = result.filter((o) => o.status === status);
    if (role === 'client') result = result.filter((o) => o.clientId === mockUser.id);
    if (role === 'translator') result = result.filter((o) => o.translatorId === mockUser.id);
    return ok(result);
  },

  async createOrder(data: NewOrder): Promise<ApiResponse<TranslationOrder>> {
    const newOrder: TranslationOrder = {
      id: `t${Date.now()}`,
      title: data.title,
      description: data.description,
      type: data.type,
      source: data.source,
      targetLanguage: data.targetLanguage,
      urgency: data.urgency,
      budget: data.budget,
      status: 'pending',
      clientId: mockUser.id,
      clientName: mockUser.name,
      clientAvatar: mockUser.avatar,
      deadline: data.deadline,
      createdAt: new Date().toISOString(),
    };
    mockOrders.unshift(newOrder);
    return ok(newOrder);
  },

  async acceptOrder(orderId: string): Promise<ApiResponse<TranslationOrder>> {
    const order = mockOrders.find((o) => o.id === orderId);
    if (order) {
      order.status = 'accepted';
      order.translatorId = mockUser.id;
      order.translatorName = mockUser.name;
      order.translatorAvatar = mockUser.avatar;
    }
    return ok({ ...order! });
  },

  async completeOrder(
    orderId: string,
    rating: number,
    review: string
  ): Promise<ApiResponse<TranslationOrder>> {
    const order = mockOrders.find((o) => o.id === orderId);
    if (order) {
      order.status = 'completed';
      order.rating = rating;
      order.review = review;
    }
    return ok({ ...order! });
  },

  async getBadges(): Promise<ApiResponse<Badge[]>> {
    return ok([...mockBadges]);
  },

  async getWeeklyTrend(): Promise<ApiResponse<WeeklyTrendPoint[]>> {
    return ok([...mockWeeklyTrend]);
  },

  async getCategoryRadar(): Promise<ApiResponse<CategoryRadarPoint[]>> {
    return ok([...mockCategoryRadar]);
  },
};
