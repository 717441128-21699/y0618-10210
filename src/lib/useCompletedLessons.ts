import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'signlang_lesson_progress';
const CHANGE_EVENT = 'signlang:lesson-progress-changed';

let cachedRaw: string | null | undefined = undefined;
let cachedIds: string[] = [];

function readIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedIds = raw ? (JSON.parse(raw) as string[]) : [];
    }
    return cachedIds;
  } catch {
    cachedIds = [];
    return cachedIds;
  }
}

function subscribe(callback: () => void): () => void {
  const handler = () => {
    cachedRaw = undefined;
    callback();
  };
  window.addEventListener(CHANGE_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

export function notifyLessonProgressChanged() {
  cachedRaw = undefined;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useCompletedLessonIds(): string[] {
  return useSyncExternalStore(subscribe, readIds, readIds);
}

export function useCompletedLessonSet(): Set<string> {
  const ids = useCompletedLessonIds();
  return new Set(ids);
}

export function isLessonCompleted(lessonId: string): boolean {
  return readIds().includes(lessonId);
}
