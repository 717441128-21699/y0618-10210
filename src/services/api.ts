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
  SubmittedExercise,
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
  SUBMITTED_EXERCISES: 'signlang_submitted_exercises',
  TRANSLATION_ORDERS: 'signlang_translation_orders',
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

const getStoredJSON = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const setStoredJSON = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

const getCompletedLessons = (): Set<string> => getStoredIds(STORAGE_KEYS.LESSON_PROGRESS);
const markLessonCompleted = (lessonId: string): boolean => toggleStoredId(STORAGE_KEYS.LESSON_PROGRESS, lessonId);

const getSubmittedExercises = (): Record<string, SubmittedExercise> =>
  getStoredJSON<Record<string, SubmittedExercise>>(STORAGE_KEYS.SUBMITTED_EXERCISES, {});

const saveSubmittedExercise = (ex: SubmittedExercise) => {
  const all = getSubmittedExercises();
  all[ex.lessonId] = ex;
  setStoredJSON(STORAGE_KEYS.SUBMITTED_EXERCISES, all);
};

const seedOrders = (): TranslationOrder[] => {
  const existing = getStoredJSON<TranslationOrder[] | null>(STORAGE_KEYS.TRANSLATION_ORDERS, null);
  if (existing && existing.length > 0) return existing;
  const seeded: TranslationOrder[] = [
    {
      id: 't001',
      title: '三甲医院心内科就诊陪同翻译',
      description: '需要陪同完成心内科就诊，包括挂号、问诊、检查、取药等环节。患者有高血压史，需要熟悉医疗相关手语。',
      type: 'live',
      source: '中文',
      targetLanguage: 'sign',
      urgency: 'urgent',
      budget: 400,
      status: 'pending',
      clientId: 'u001',
      clientName: mockUser.name,
      clientAvatar: mockUser.avatar,
      deadline: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      scene: 'medical',
      date: '2026-06-20',
      startTime: '09:00',
      endTime: '11:30',
      locationType: 'offline',
      address: '北京市协和医院东院区心内科门诊3诊室',
    },
    {
      id: 't002',
      title: '民事纠纷庭审手语翻译',
      description: '合同纠纷案件出庭翻译，需要熟悉法律术语和庭审流程，要求持有手语翻译资格证书。',
      type: 'live',
      source: '中文',
      targetLanguage: 'sign',
      urgency: 'vip',
      budget: 1200,
      status: 'accepted',
      clientId: 'u001',
      clientName: mockUser.name,
      clientAvatar: mockUser.avatar,
      translatorId: 'v001',
      translatorName: '周慧敏',
      translatorAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face',
      deadline: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      scene: 'court',
      date: '2026-06-22',
      startTime: '14:00',
      endTime: '17:00',
      locationType: 'offline',
      address: '朝阳区人民法院第三法庭',
    },
    {
      id: 't003',
      title: '小学家长会陪同翻译',
      description: '孩子的学期家长会，需要翻译老师的发言内容，以及帮助我与老师进行沟通交流。',
      type: 'live',
      source: '中文',
      targetLanguage: 'sign',
      urgency: 'normal',
      budget: 260,
      status: 'pending',
      clientId: 'u001',
      clientName: mockUser.name,
      clientAvatar: mockUser.avatar,
      deadline: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
      scene: 'education',
      date: '2026-06-21',
      startTime: '19:00',
      endTime: '21:00',
      locationType: 'offline',
      address: '海淀区实验小学阶梯教室',
    },
    {
      id: 't004',
      title: '商务视频会议实时翻译',
      description: '与供应商的季度业务复盘会议，需要实时进行口语和手语双向翻译。',
      type: 'video',
      source: '中文',
      targetLanguage: 'sign',
      urgency: 'urgent',
      budget: 600,
      status: 'completed',
      clientId: 'u001',
      clientName: mockUser.name,
      clientAvatar: mockUser.avatar,
      translatorId: 'v002',
      translatorName: '李志强',
      translatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      deadline: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      rating: 5,
      review: '译员非常专业，商务术语翻译准确，整个会议沟通非常顺畅，强烈推荐！',
      scene: 'business',
      date: '2026-06-19',
      startTime: '10:00',
      endTime: '12:00',
      locationType: 'online',
      address: '腾讯会议 ID: 856-234-128',
      meetingLink: 'https://meeting.tencent.com/dm/856234128',
    },
    {
      id: 't005',
      title: '产科产检陪同翻译',
      description: '孕24周常规产检陪同，需要翻译医生的各项检查建议和注意事项。',
      type: 'live',
      source: '中文',
      targetLanguage: 'sign',
      urgency: 'normal',
      budget: 300,
      status: 'pending',
      clientId: 'u001',
      clientName: mockUser.name,
      clientAvatar: mockUser.avatar,
      deadline: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      scene: 'medical',
      date: '2026-06-25',
      startTime: '08:30',
      endTime: '10:30',
      locationType: 'offline',
      address: '北京妇产医院产科门诊',
    },
    {
      id: 't006',
      title: '企业入职培训翻译协助',
      description: '新员工为期一天的入职培训，需要全程同步翻译培训内容，并协助与同事沟通。',
      type: 'live',
      source: '中文',
      targetLanguage: 'sign',
      urgency: 'normal',
      budget: 1500,
      status: 'pending',
      clientId: 'u001',
      clientName: mockUser.name,
      clientAvatar: mockUser.avatar,
      deadline: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
      scene: 'business',
      date: '2026-06-23',
      startTime: '09:00',
      endTime: '18:00',
      locationType: 'offline',
      address: '西城区金融街T3写字楼20层会议室',
    },
  ];
  setStoredJSON(STORAGE_KEYS.TRANSLATION_ORDERS, seeded);
  return seeded;
};

const getTranslationOrders = (): TranslationOrder[] => {
  const seeded = seedOrders();
  return seeded;
};

const saveTranslationOrders = (orders: TranslationOrder[]) => {
  setStoredJSON(STORAGE_KEYS.TRANSLATION_ORDERS, orders);
};

const mockVolunteers = [
  {
    id: 'v001',
    name: '周慧敏',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face',
    rating: 4.9,
    completedOrders: 128,
  },
  {
    id: 'v002',
    name: '李志强',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    rating: 4.8,
    completedOrders: 96,
  },
  {
    id: 'v003',
    name: '王雅琴',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    rating: 5.0,
    completedOrders: 156,
  },
];

export const api = {
  async getUser(): Promise<ApiResponse<User>> {
    return ok({ ...mockUser });
  },

  async getUserStats(): Promise<ApiResponse<UserStats>> {
    const completed = getCompletedLessons();
    const submitted = getSubmittedExercises();
    return ok({
      ...mockUserStats,
      completedLessons: completed.size,
      totalLessons: Object.values(mockLessons).flat().length,
      correctExercises: Object.values(submitted).filter((s) => s.status === 'approved').length,
      totalExercises: Object.keys(submitted).length || mockUserStats.totalExercises,
    });
  },

  async updateUserProfile(update: UserProfileUpdate): Promise<ApiResponse<User>> {
    return ok({ ...mockUser, ...update });
  },

  async getCourses(level?: string, category?: string): Promise<ApiResponse<Course[]>> {
    const completedSet = getCompletedLessons();
    let result = mockCourses.map((c) => {
      const lessons = mockLessons[c.id] || [];
      const done = lessons.filter((l) => completedSet.has(l.id)).length;
      return { ...c, completedLessons: done };
    });
    if (level) result = result.filter((c) => c.level === level);
    if (category) result = result.filter((c) => c.category === category);
    return ok(result);
  },

  async getCourse(id: string): Promise<ApiResponse<Course>> {
    const completedSet = getCompletedLessons();
    const course = mockCourses.find((c) => c.id === id) || mockCourses[0];
    const lessons = mockLessons[id] || [];
    const done = lessons.filter((l) => completedSet.has(l.id)).length;
    return ok({ ...course, completedLessons: done });
  },

  async getLesson(id: string): Promise<ApiResponse<Lesson>> {
    for (const lessons of Object.values(mockLessons)) {
      const lesson = lessons.find((l) => l.id === id);
      if (lesson) {
        const completedSet = getCompletedLessons();
        return ok({ ...lesson, completed: completedSet.has(lesson.id) });
      }
    }
    return ok({ ...mockLessons['c001'][0] });
  },

  async submitExercise(submission: ExerciseSubmission): Promise<ApiResponse<ExerciseResult>> {
    const correct = Math.random() > 0.25;
    const score = correct ? Math.floor(85 + Math.random() * 15) : Math.floor(50 + Math.random() * 30);
    const result: ExerciseResult = {
      correct,
      points: correct ? 10 : 0,
      feedback: correct
        ? '动作非常标准！手型准确，位置也很到位。继续保持！'
        : '整体动作不错，但手型的细节还有提升空间，建议对着镜子多练习手腕的灵活性。',
    };

    const saved: SubmittedExercise = {
      id: `ex_${Date.now()}`,
      lessonId: submission.exerciseId,
      submittedAt: new Date().toISOString(),
      status: correct ? 'approved' : 'needs_revision',
      score,
      feedback: result.feedback,
      highlights: correct
        ? ['手掌放平正确', '挥动幅度标准', '表情配合自然', '动作流畅度好']
        : ['位置基本正确', '整体节奏稳定'],
      improvements: correct
        ? []
        : ['手腕稍显僵硬', '拇指翘起不够明显', '动作幅度可以再大一些'],
      gradedBy: '系统AI批改',
      gradedAt: new Date().toISOString(),
    };
    saveSubmittedExercise(saved);

    return ok(result);
  },

  async getSubmittedExercise(lessonId: string): Promise<ApiResponse<SubmittedExercise | null>> {
    const all = getSubmittedExercises();
    return ok(all[lessonId] || null);
  },

  async markLessonComplete(lessonId: string): Promise<ApiResponse<boolean>> {
    markLessonCompleted(lessonId);
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
    let result = [...getTranslationOrders()];
    if (status && status !== 'all') result = result.filter((o) => o.status === status);
    if (role === 'client') result = result.filter((o) => o.clientId === mockUser.id);
    if (role === 'translator') result = result.filter((o) => o.translatorId === mockUser.id);
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return ok(result);
  },

  async getOrder(orderId: string): Promise<ApiResponse<TranslationOrder | null>> {
    const orders = getTranslationOrders();
    const order = orders.find((o) => o.id === orderId) || null;
    return ok(order);
  },

  async createOrder(data: NewOrder): Promise<ApiResponse<TranslationOrder>> {
    const orders = getTranslationOrders();
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
      scene: data.scene,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      locationType: data.locationType,
      address: data.address,
      meetingLink: data.meetingLink,
    };
    orders.unshift(newOrder);
    saveTranslationOrders(orders);
    return ok(newOrder);
  },

  async acceptOrder(orderId: string): Promise<ApiResponse<TranslationOrder>> {
    const orders = getTranslationOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx !== -1) {
      const volunteer = mockVolunteers[Math.floor(Math.random() * mockVolunteers.length)];
      orders[idx] = {
        ...orders[idx],
        status: 'accepted',
        translatorId: volunteer.id,
        translatorName: volunteer.name,
        translatorAvatar: volunteer.avatar,
      };
      saveTranslationOrders(orders);
      return ok({ ...orders[idx] });
    }
    return ok(orders[0]);
  },

  async completeOrder(
    orderId: string,
    rating: number,
    review: string
  ): Promise<ApiResponse<TranslationOrder>> {
    const orders = getTranslationOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx !== -1) {
      orders[idx] = {
        ...orders[idx],
        status: 'completed',
        rating,
        review,
      };
      saveTranslationOrders(orders);
      return ok({ ...orders[idx] });
    }
    return ok(orders[0]);
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
