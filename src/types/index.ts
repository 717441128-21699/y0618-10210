export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  level: number;
  exp: number;
  dailyStreak: number;
  signLanguageLevel: 'beginner' | 'intermediate' | 'advanced';
  bio: string;
  createdAt: string;
}

export interface UserStats {
  totalLessons: number;
  completedLessons: number;
  totalWords: number;
  learnedWords: number;
  totalExercises: number;
  correctExercises: number;
  totalPosts: number;
  totalLikes: number;
  translationOrders: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt: string;
}

export interface UserProfileUpdate {
  name?: string;
  avatar?: string;
  bio?: string;
  signLanguageLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  cover: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  totalLessons: number;
  completedLessons: number;
  rating: number;
  students: number;
  duration: number;
  tags: string[];
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  videoUrl?: string;
  order: number;
  duration: number;
  completed: boolean;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  lessonId: string;
  type: 'choice' | 'match' | 'sign';
  question: string;
  options?: string[];
  answer: string | number[];
  points: number;
}

export interface ExerciseSubmission {
  exerciseId: string;
  answer: string | number[];
}

export interface ExerciseResult {
  correct: boolean;
  points: number;
  feedback: string;
}

export interface Word {
  id: string;
  word: string;
  translation: string;
  pronunciation?: string;
  videoUrl?: string;
  imageUrl?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  example: string;
  isFavorite: boolean;
}

export interface DictionaryGroup {
  id: string;
  name: string;
  wordIds: string[];
  createdAt: string;
}

export interface Dictionary {
  groups: DictionaryGroup[];
  totalWords: number;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  channel: 'discussion' | 'share' | 'help' | 'news';
  title: string;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  views: number;
  isLiked: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  likes: number;
  createdAt: string;
  replyTo?: string;
}

export interface NewPost {
  channel: 'discussion' | 'share' | 'help' | 'news';
  title: string;
  content: string;
  images?: string[];
}

export interface NewComment {
  postId: string;
  content: string;
  replyTo?: string;
}

export interface SubmittedExercise {
  id: string;
  lessonId: string;
  videoUrl?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'needs_revision';
  score?: number;
  feedback?: string;
  highlights?: string[];
  improvements?: string[];
  gradedBy?: string;
  gradedAt?: string;
}

export interface TranslationOrder {
  id: string;
  title: string;
  description: string;
  type: 'text' | 'video' | 'live';
  source: string;
  targetLanguage: 'sign' | 'chinese' | 'english';
  urgency: 'normal' | 'urgent' | 'vip';
  budget: number;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  clientId: string;
  clientName: string;
  clientAvatar: string;
  translatorId?: string;
  translatorName?: string;
  translatorAvatar?: string;
  deadline: string;
  rating?: number;
  review?: string;
  createdAt: string;
  scene: 'medical' | 'court' | 'education' | 'business' | 'meeting' | 'interview' | 'other';
  date: string;
  startTime: string;
  endTime: string;
  locationType: 'online' | 'offline';
  address: string;
  meetingLink?: string;
}

export interface NewOrder {
  title: string;
  description: string;
  type: 'text' | 'video' | 'live';
  source: string;
  targetLanguage: 'sign' | 'chinese' | 'english';
  urgency: 'normal' | 'urgent' | 'vip';
  budget: number;
  deadline: string;
  scene: 'medical' | 'court' | 'education' | 'business' | 'meeting' | 'interview' | 'other';
  date: string;
  startTime: string;
  endTime: string;
  locationType: 'online' | 'offline';
  address: string;
  meetingLink?: string;
}

export interface WeeklyTrendPoint {
  day: string;
  studyMinutes: number;
  wordsLearned: number;
}

export interface CategoryRadarPoint {
  category: string;
  value: number;
  fullMark: number;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
