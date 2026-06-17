import { useSyncExternalStore } from 'react';

const PROGRESS_KEY = 'signlang_lesson_progress';
const COMPLETED_TIMES_KEY = 'signlang_lesson_completed_times';
const LAST_LEARNED_KEY = 'signlang_last_learned';
const CHANGE_EVENT = 'signlang:lesson-progress-changed';

type CompletedLessonRecord = {
  id: string;
  completedAt: number;
  courseId: string;
  lessonTitle: string;
};

type LastLearnedRecord = {
  courseId: string;
  lessonId: string;
  visitedAt: number;
};

let cachedProgressRaw: string | null | undefined = undefined;
let cachedCompletedIds: string[] = [];

let cachedTimesRaw: string | null | undefined = undefined;
let cachedTimesMap: Record<string, CompletedLessonRecord> = {};

let cachedLastRaw: string | null | undefined = undefined;
let cachedLastMap: Record<string, LastLearnedRecord> = {};

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function readCompletedIds(): string[] {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw !== cachedProgressRaw) {
      cachedProgressRaw = raw;
      cachedCompletedIds = raw ? (JSON.parse(raw) as string[]) : [];
    }
    return cachedCompletedIds;
  } catch {
    cachedCompletedIds = [];
    return cachedCompletedIds;
  }
}

function readCompletedTimes(): Record<string, CompletedLessonRecord> {
  try {
    const raw = localStorage.getItem(COMPLETED_TIMES_KEY);
    if (raw !== cachedTimesRaw) {
      cachedTimesRaw = raw;
      cachedTimesMap = raw ? (JSON.parse(raw) as Record<string, CompletedLessonRecord>) : {};
    }
    return cachedTimesMap;
  } catch {
    cachedTimesMap = {};
    return cachedTimesMap;
  }
}

function readLastLearned(): Record<string, LastLearnedRecord> {
  try {
    const raw = localStorage.getItem(LAST_LEARNED_KEY);
    if (raw !== cachedLastRaw) {
      cachedLastRaw = raw;
      cachedLastMap = raw ? (JSON.parse(raw) as Record<string, LastLearnedRecord>) : {};
    }
    return cachedLastMap;
  } catch {
    cachedLastMap = {};
    return cachedLastMap;
  }
}

function subscribe(callback: () => void): () => void {
  const handler = () => {
    cachedProgressRaw = undefined;
    cachedTimesRaw = undefined;
    cachedLastRaw = undefined;
    callback();
  };
  window.addEventListener(CHANGE_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

function notify() {
  cachedProgressRaw = undefined;
  cachedTimesRaw = undefined;
  cachedLastRaw = undefined;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function markLessonCompletedExtended(
  lessonId: string,
  meta: { courseId: string; lessonTitle: string }
): boolean {
  const ids = new Set(readCompletedIds());
  if (ids.has(lessonId)) return false;
  ids.add(lessonId);
  localStorage.setItem(PROGRESS_KEY, JSON.stringify([...ids]));

  const times = readCompletedTimes();
  times[lessonId] = {
    id: lessonId,
    completedAt: Date.now(),
    courseId: meta.courseId,
    lessonTitle: meta.lessonTitle,
  };
  writeJSON(COMPLETED_TIMES_KEY, times);

  notify();
  return true;
}

export function markLessonVisited(courseId: string, lessonId: string) {
  const map = readLastLearned();
  map[courseId] = {
    courseId,
    lessonId,
    visitedAt: Date.now(),
  };
  map['__global__'] = {
    courseId,
    lessonId,
    visitedAt: Date.now(),
  } as LastLearnedRecord;
  writeJSON(LAST_LEARNED_KEY, map);
  notify();
}

export function useCompletedLessonIds(): string[] {
  return useSyncExternalStore(subscribe, readCompletedIds, readCompletedIds);
}

export function useCompletedLessonSet(): Set<string> {
  const ids = useCompletedLessonIds();
  return new Set(ids);
}

export function useCompletedTimes(): Record<string, CompletedLessonRecord> {
  return useSyncExternalStore(subscribe, readCompletedTimes, readCompletedTimes);
}

export function useCompletedTime(lessonId: string): CompletedLessonRecord | null {
  const times = useCompletedTimes();
  return times[lessonId] || null;
}

export function useLastLearned(courseId?: string): LastLearnedRecord | null {
  const map = useSyncExternalStore(subscribe, readLastLearned, readLastLearned);
  if (courseId) return map[courseId] || null;
  return map['__global__'] || null;
}

export function getCompletedTimeSync(lessonId: string): CompletedLessonRecord | null {
  return readCompletedTimes()[lessonId] || null;
}

export function getLastLearnedSync(courseId?: string): LastLearnedRecord | null {
  const map = readLastLearned();
  if (courseId) return map[courseId] || null;
  return map['__global__'] || null;
}

export function formatCompletedAt(ts: number | undefined | null): string {
  if (!ts) return '';
  const diff = Date.now() - ts;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) return '刚刚完成';
  if (diff < hour) return `${Math.floor(diff / minute)} 分钟前完成`;
  if (diff < day) return `${Math.floor(diff / hour)} 小时前完成`;
  if (diff < 7 * day) return `${Math.floor(diff / day)} 天前完成`;
  return new Date(ts).toLocaleDateString('zh-CN');
}

export type { CompletedLessonRecord, LastLearnedRecord };
