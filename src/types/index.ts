// ─── Auth Types ───────────────────────────────────────────────────────────────

export type Role = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: Role;
  isEmailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}


export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: Role;
}

export interface LoginSuccessData {
  accessToken: string;

}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    expiresIn: number; // seconds
    user: User;
  };
  timestamp: string;
}
// ─── Course Types ─────────────────────────────────────────────────────────────

export type CourseStatus = 'DRAFT' | 'SUBMITTED' | 'PUBLISHED' | 'REJECTED' | 'ARCHIVED';
export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  courseCount?: number;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
  price: number;
  discountedPrice?: number;
  currency: string;
  level: CourseLevel;
  status: CourseStatus;
  category: Category;
  instructor: User;
  totalDuration: number; // seconds
  totalLectures: number;
  enrollmentCount: number;
  rating: number;
  ratingCount: number;
  tags: string[];
  requirements: string[];
  outcomes: string[];
  targetAudience: string[];
  language: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Section {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  lectures: Lecture[];
}

export type LectureType = 'VIDEO' | 'ARTICLE' | 'QUIZ' | 'RESOURCE';
export type LectureStatus = 'UPLOADING' | 'PROCESSING' | 'READY' | 'ERROR';

export interface Lecture {
  id: string;
  sectionId: string;
  title: string;
  description?: string;
  type: LectureType;
  status: LectureStatus;
  duration?: number;
  order: number;
  isFree: boolean;
  videoUrl?: string;
  resourceUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Enrollment Types ─────────────────────────────────────────────────────────

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  course: Course;
  progress: number;
  completedLectures: string[];
  lastAccessedLectureId?: string;
  enrolledAt: string;
  completedAt?: string;
}

export interface LectureProgress {
  lectureId: string;
  userId: string;
  watchedSeconds: number;
  isCompleted: boolean;
  lastWatchedAt: string;
}

// ─── API Types ────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: Record<string, string[]>;
}

export interface UploadInitResponse {
  uploadId: string;
  presignedUrl: string;
  objectKey: string;
}

// ─── UI Types ─────────────────────────────────────────────────────────────────

export type SidebarState = 'expanded' | 'collapsed' | 'hidden';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}
