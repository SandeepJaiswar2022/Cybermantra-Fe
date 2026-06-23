export const APP_NAME = 'LearnForge';
export const APP_DESCRIPTION = 'Master skills that matter. Learn from the best.';

export const API_BASE_URL = '/api/v1';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  COURSES: '/courses',
  COURSE_DETAIL: (slug: string) => `/courses/${slug}`,
  INSTRUCTOR_PROFILE: (id: string) => `/instructors/${id}`,

  STUDENT: {
    DASHBOARD: '/student/dashboard',
    MY_COURSES: '/student/my-courses',
    LEARN: (courseSlug: string, lectureId: string) =>
      `/student/learn/${courseSlug}/${lectureId}`,
    PROFILE: '/student/profile',
    NOTIFICATIONS: '/student/notifications',
  },

  INSTRUCTOR: {
    DASHBOARD: '/instructor/dashboard',
    COURSES: '/instructor/courses',
    CREATE_COURSE: '/instructor/courses/new',
    EDIT_COURSE: (id: string) => `/instructor/courses/${id}/edit`,
    ANALYTICS: (id: string) => `/instructor/courses/${id}/analytics`,
  },

  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    CATEGORIES: '/admin/categories',
    COURSES: '/admin/courses',
    USERS: '/admin/users',
    ANALYTICS: '/admin/analytics',
  },
} as const;

export const QUERY_KEYS = {
  AUTH: {
    ME: ['auth', 'me'] as const,
  },
  COURSES: {
    ALL: ['courses'] as const,
    DETAIL: (slug: string) => ['courses', slug] as const,
    FEATURED: ['courses', 'featured'] as const,
    BY_CATEGORY: (categoryId: string) => ['courses', 'category', categoryId] as const,
    INSTRUCTOR: (instructorId: string) => ['courses', 'instructor', instructorId] as const,
    ADMIN_LIST: ['admin', 'courses'] as const,
  },
  CATEGORIES: {
    ALL: ['categories'] as const,
    DETAIL: (id: string) => ['categories', id] as const,
    SUMMARY: ['categories', 'summary'] as const,
    PARENTS: ['categories', 'parents'] as const,
  },
  ENROLLMENTS: {
    MY: ['enrollments', 'my'] as const,
    COURSE: (courseId: string) => ['enrollments', courseId] as const,
  },
  NOTIFICATIONS: {
    ALL: ['notifications'] as const,
  },
} as const;

export const TOAST_DURATION = 4000;

export const UPLOAD_CONFIG = {
  MAX_VIDEO_SIZE: 2 * 1024 * 1024 * 1024, // 2GB
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
} as const;

export const COURSE_LEVELS = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
] as const;
