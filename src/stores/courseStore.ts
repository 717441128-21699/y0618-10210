import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Course, Lesson, Exercise, ExerciseSubmission, ExerciseResult } from '@/types';
import { api } from '@/services/api';

interface CourseStore {
  courses: Course[];
  currentCourse: Course | null;
  currentLesson: Lesson | null;
  exercises: Exercise[];
  loading: boolean;
  fetchCourses: (level?: string, category?: string) => Promise<void>;
  fetchCourse: (id: string) => Promise<void>;
  fetchLesson: (id: string) => Promise<void>;
  submitExercise: (submission: ExerciseSubmission) => Promise<ExerciseResult | null>;
  markLessonComplete: (lessonId: string) => Promise<void>;
}

export const useCourseStore = create<CourseStore>()(
  immer((set) => ({
    courses: [],
    currentCourse: null,
    currentLesson: null,
    exercises: [],
    loading: false,

    fetchCourses: async (level, category) => {
      set((state) => {
        state.loading = true;
      });
      try {
        const res = await api.getCourses(level, category);
        if (res.code === 0) {
          set((state) => {
            state.courses = res.data;
          });
        }
      } finally {
        set((state) => {
          state.loading = false;
        });
      }
    },

    fetchCourse: async (id) => {
      set((state) => {
        state.loading = true;
      });
      try {
        const res = await api.getCourse(id);
        if (res.code === 0) {
          set((state) => {
            state.currentCourse = res.data;
          });
        }
      } finally {
        set((state) => {
          state.loading = false;
        });
      }
    },

    fetchLesson: async (id) => {
      set((state) => {
        state.loading = true;
      });
      try {
        const res = await api.getLesson(id);
        if (res.code === 0) {
          set((state) => {
            state.currentLesson = res.data;
            state.exercises = res.data.exercises;
          });
        }
      } finally {
        set((state) => {
          state.loading = false;
        });
      }
    },

    submitExercise: async (submission) => {
      set((state) => {
        state.loading = true;
      });
      try {
        const res = await api.submitExercise(submission);
        if (res.code === 0) {
          return res.data;
        }
        return null;
      } finally {
        set((state) => {
          state.loading = false;
        });
      }
    },

    markLessonComplete: async (lessonId) => {
      set((state) => {
        state.loading = true;
      });
      try {
        await api.markLessonComplete(lessonId);
        set((state) => {
          if (state.currentLesson && state.currentLesson.id === lessonId) {
            state.currentLesson.completed = true;
          }
          if (state.currentCourse) {
            state.currentCourse.completedLessons = Math.min(
              state.currentCourse.completedLessons + 1,
              state.currentCourse.totalLessons
            );
          }
        });
      } finally {
        set((state) => {
          state.loading = false;
        });
      }
    },
  }))
);
