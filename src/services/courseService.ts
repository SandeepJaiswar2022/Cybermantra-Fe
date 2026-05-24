import apiClient from '@/lib/axios';
import type {
  Course,
  Category,
  Section,
  PaginatedResponse,
  UploadInitResponse,
} from '@/types';

export interface CourseFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'rating' | 'newest' | 'popular' | 'price-asc' | 'price-desc';
}

export const courseService = {
  // ─── Public ────────────────────────────────────────────────────────────────

  getCourses: async (
    filters?: CourseFilters
  ): Promise<PaginatedResponse<Course>> => {
    const res = await apiClient.get<PaginatedResponse<Course>>('/courses', {
      params: filters,
    });
    return res.data;
  },

  getFeaturedCourses: async (): Promise<Course[]> => {
    const res = await apiClient.get<Course[]>('/courses/featured');
    return res.data;
  },

  getCourseBySlug: async (slug: string): Promise<Course> => {
    const res = await apiClient.get<Course>(`/courses/${slug}`);
    return res.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const res = await apiClient.get<Category[]>('/categories');
    return res.data;
  },

  // ─── Instructor ────────────────────────────────────────────────────────────

  getMyCourses: async (): Promise<Course[]> => {
    const res = await apiClient.get<Course[]>('/instructor/courses');
    return res.data;
  },

  createCourse: async (
    data: Partial<Course>
  ): Promise<Course> => {
    const res = await apiClient.post<Course>('/instructor/courses', data);
    return res.data;
  },

  updateCourse: async (
    id: string,
    data: Partial<Course>
  ): Promise<Course> => {
    const res = await apiClient.patch<Course>(`/instructor/courses/${id}`, data);
    return res.data;
  },

  deleteCourse: async (id: string): Promise<void> => {
    await apiClient.delete(`/instructor/courses/${id}`);
  },

  submitCourse: async (id: string): Promise<Course> => {
    const res = await apiClient.post<Course>(`/instructor/courses/${id}/submit`);
    return res.data;
  },

  publishCourse: async (id: string): Promise<Course> => {
    const res = await apiClient.post<Course>(`/instructor/courses/${id}/publish`);
    return res.data;
  },

  unpublishCourse: async (id: string): Promise<Course> => {
    const res = await apiClient.post<Course>(`/instructor/courses/${id}/unpublish`);
    return res.data;
  },

  // ─── Sections ──────────────────────────────────────────────────────────────

  getCourseSections: async (courseId: string): Promise<Section[]> => {
    const res = await apiClient.get<Section[]>(
      `/instructor/courses/${courseId}/sections`
    );
    return res.data;
  },

  createSection: async (
    courseId: string,
    data: { title: string; description?: string }
  ): Promise<Section> => {
    const res = await apiClient.post<Section>(
      `/instructor/courses/${courseId}/sections`,
      data
    );
    return res.data;
  },

  updateSection: async (
    courseId: string,
    sectionId: string,
    data: Partial<Section>
  ): Promise<Section> => {
    const res = await apiClient.patch<Section>(
      `/instructor/courses/${courseId}/sections/${sectionId}`,
      data
    );
    return res.data;
  },

  deleteSection: async (courseId: string, sectionId: string): Promise<void> => {
    await apiClient.delete(
      `/instructor/courses/${courseId}/sections/${sectionId}`
    );
  },

  // ─── Upload ────────────────────────────────────────────────────────────────

  initiateUpload: async (data: {
    filename: string;
    contentType: string;
    sectionId: string;
    lectureTitle: string;
  }): Promise<UploadInitResponse> => {
    const res = await apiClient.post<UploadInitResponse>(
      '/content/upload/initiate',
      data
    );
    return res.data;
  },

  completeUpload: async (uploadId: string): Promise<void> => {
    await apiClient.post(`/content/upload/${uploadId}/complete`);
  },

  // ─── Admin ─────────────────────────────────────────────────────────────────

  adminGetCourses: async (
    filters?: CourseFilters & { status?: string }
  ): Promise<PaginatedResponse<Course>> => {
    const res = await apiClient.get<PaginatedResponse<Course>>('/admin/courses', {
      params: filters,
    });
    return res.data;
  },

  adminApproveCourse: async (id: string): Promise<Course> => {
    const res = await apiClient.post<Course>(`/admin/courses/${id}/approve`);
    return res.data;
  },

  adminRejectCourse: async (
    id: string,
    reason: string
  ): Promise<Course> => {
    const res = await apiClient.post<Course>(`/admin/courses/${id}/reject`, {
      reason,
    });
    return res.data;
  },
};
