import apiClient from '@/lib/axios';
import type { Course, Section, UploadInitResponse } from '@/types';

// ─── Response shapes matching backend DTOs ──────────────────────────────────

export interface CourseSummaryResponse {
  id: string;
  title: string;
  subtitle: string | null;
  instructorId: string;
  instructorName: string;
  categoryName: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  price: number | null;
  thumbnailUrl: string | null;
  status: CourseStatus;
  isPublished: boolean;
  totalDurationSeconds: number | null;
  totalLectures: number | null;
  averageRating: number | null;
  totalRatings: number | null;
  totalEnrollments: number | null;
  createdAt: string;
  publishedAt: string | null;
}

export type CourseStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'PUBLISHED';

export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

/** Spring Page<T> wrapper */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;        // current page (0-indexed)
  first: boolean;
  last: boolean;
  empty: boolean;
}

/** Anthropic ApiResponse<T> wrapper */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ─── Category response shapes ────────────────────────────────────────────────

export interface CategorySummaryResponse {
  id: string;
  name: string;
  slug: string;
  iconUrl: string | null;
}

export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconUrl: string | null;
  parentId: string | null;
  parentName: string | null;
  isActive: boolean;
  courseCount: number;
  createdAt: string;
  updatedAt: string;
  subcategories: CategoryResponse[];
}

// ─── Query params matching backend @RequestParam names ───────────────────────

export interface CourseListParams {
  categoryId?: string;
  subcategoryId?: string;
  level?: CourseLevel;
  instructorId?: string;
  status?: CourseStatus;
  isPublished?: boolean;
  search?: string;      // maps to `search` param, backend calls it `searchTerm` internally
  page?: number;        // 0-indexed
  size?: number;
  sort?: string;        // e.g. "createdAt,desc"
}

// ─── Public endpoints ────────────────────────────────────────────────────────

export const courseService = {

  /**
   * GET /api/v1/courses
   * Role-aware: public sees only published, instructors see own courses,
   * admins see everything — all driven by the JWT the gateway forwards.
   */
  listCourses: async (
    params?: CourseListParams
  ): Promise<PageResponse<CourseSummaryResponse>> => {
    const res = await apiClient.get<ApiResponse<PageResponse<CourseSummaryResponse>>>(
      '/courses',
      { params }
    );
    return res.data.data;
  },

  /**
   * GET /api/v1/courses/:courseId
   * Public for published, auth required for drafts.
   */
  getCourseById: async (courseId: string): Promise<Course> => {
    const res = await apiClient.get<ApiResponse<Course>>(`/courses/${courseId}`);
    return res.data.data;
  },

  // ─── Category ─────────────────────────────────────────────────────────────

  /** GET /api/v1/categories/summary — flat list for dropdowns */
  getCategoriesSummary: async (): Promise<CategorySummaryResponse[]> => {
    const res = await apiClient.get<ApiResponse<CategorySummaryResponse[]>>(
      '/categories/summary'
    );
    return res.data.data;
  },

  /** GET /api/v1/categories/parents — parent cats with their subcategories */
  getParentCategories: async (): Promise<CategoryResponse[]> => {
    const res = await apiClient.get<ApiResponse<CategoryResponse[]>>(
      '/categories/parents'
    );
    return res.data.data;
  },

  // ─── Instructor mutations ─────────────────────────────────────────────────

  createCourse: async (data: Partial<Course>): Promise<Course> => {
    const res = await apiClient.post<ApiResponse<Course>>('/courses', data);
    return res.data.data;
  },

  updateCourse: async (courseId: string, data: Partial<Course>): Promise<Course> => {
    const res = await apiClient.put<ApiResponse<Course>>(`/courses/${courseId}`, data);
    return res.data.data;
  },

  deleteCourse: async (courseId: string): Promise<void> => {
    await apiClient.delete(`/courses/${courseId}`);
  },

  submitForReview: async (courseId: string): Promise<Course> => {
    const res = await apiClient.post<ApiResponse<Course>>(
      `/courses/${courseId}/submit-for-review`
    );
    return res.data.data;
  },

  publishCourse: async (courseId: string): Promise<Course> => {
    const res = await apiClient.post<ApiResponse<Course>>(
      `/courses/${courseId}/publish`
    );
    return res.data.data;
  },

  unpublishCourse: async (courseId: string): Promise<Course> => {
    const res = await apiClient.post<ApiResponse<Course>>(
      `/courses/${courseId}/unpublish`
    );
    return res.data.data;
  },

  // ─── Admin mutations ──────────────────────────────────────────────────────

  reviewCourse: async (
    courseId: string,
    action: 'APPROVED' | 'REJECTED',
    reason?: string
  ): Promise<Course> => {
    const res = await apiClient.post<ApiResponse<Course>>(
      `/courses/${courseId}/review`,
      { action, reason }
    );
    return res.data.data;
  },

  // ─── Sections ─────────────────────────────────────────────────────────────

  getCourseSections: async (courseId: string): Promise<Section[]> => {
    const res = await apiClient.get<ApiResponse<Section[]>>(
      `/courses/${courseId}/sections`
    );
    return res.data.data;
  },

  createSection: async (
    courseId: string,
    data: { title: string; description?: string }
  ): Promise<Section> => {
    const res = await apiClient.post<ApiResponse<Section>>(
      `/courses/${courseId}/sections`,
      data
    );
    return res.data.data;
  },

  updateSection: async (
    courseId: string,
    sectionId: string,
    data: Partial<Section>
  ): Promise<Section> => {
    const res = await apiClient.patch<ApiResponse<Section>>(
      `/courses/${courseId}/sections/${sectionId}`,
      data
    );
    return res.data.data;
  },

  deleteSection: async (courseId: string, sectionId: string): Promise<void> => {
    await apiClient.delete(`/courses/${courseId}/sections/${sectionId}`);
  },

  // ─── Upload ───────────────────────────────────────────────────────────────

  initiateUpload: async (data: {
    filename: string;
    contentType: string;
    sectionId: string;
    lectureTitle: string;
  }): Promise<UploadInitResponse> => {
    const res = await apiClient.post<ApiResponse<UploadInitResponse>>(
      '/content/upload/initiate',
      data
    );
    return res.data.data;
  },

  completeUpload: async (uploadId: string): Promise<void> => {
    await apiClient.post(`/content/upload/${uploadId}/complete`);
  },
};