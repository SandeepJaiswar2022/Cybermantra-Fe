import apiClient from '@/lib/axios';
import type { Enrollment, LectureProgress } from '@/types';

export const enrollmentService = {
  getMyEnrollments: async (): Promise<Enrollment[]> => {
    const res = await apiClient.get<Enrollment[]>('/enrollments/me');
    return res.data;
  },

  getEnrollment: async (courseId: string): Promise<Enrollment> => {
    const res = await apiClient.get<Enrollment>(`/enrollments/${courseId}`);
    return res.data;
  },

  enrollInCourse: async (courseId: string): Promise<Enrollment> => {
    const res = await apiClient.post<Enrollment>('/enrollments', { courseId });
    return res.data;
  },

  updateLectureProgress: async (
    lectureId: string,
    data: { watchedSeconds: number; isCompleted: boolean }
  ): Promise<LectureProgress> => {
    const res = await apiClient.post<LectureProgress>(
      `/progress/${lectureId}`,
      data
    );
    return res.data;
  },

  getLectureProgress: async (lectureId: string): Promise<LectureProgress> => {
    const res = await apiClient.get<LectureProgress>(`/progress/${lectureId}`);
    return res.data;
  },
};
