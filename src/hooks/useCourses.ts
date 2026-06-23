import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  courseService,
  type CourseListParams,
  type CourseStatus,
} from '@/services/courseService';
import { QUERY_KEYS } from '@/constants';

// ─── Courses ──────────────────────────────────────────────────────────────────

/**
 * Fetches paginated, filtered courses from GET /api/v1/courses.
 * The backend is fully role-aware — public callers see only published courses,
 * instructors see their own, admins see everything.
 */
export function useCourses(params?: CourseListParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.COURSES.ALL, params],
    queryFn: () => courseService.listCourses(params),
  });
}

/** Fetch a single course by ID (GET /api/v1/courses/:courseId). */
export function useCourseById(courseId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.COURSES.DETAIL(courseId),
    queryFn: () => courseService.getCourseById(courseId),
    enabled: !!courseId,
  });
}

// ─── Categories ───────────────────────────────────────────────────────────────

/** Flat summary list — used in filter dropdowns. */
export function useCategoriesSummary() {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.SUMMARY,
    queryFn: courseService.getCategoriesSummary,
    staleTime: 1000 * 60 * 30,
  });
}

/** Full parent → subcategory tree. */
export function useParentCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.PARENTS,
    queryFn: courseService.getParentCategories,
    staleTime: 1000 * 60 * 30,
  });
}

// ─── Instructor mutations ─────────────────────────────────────────────────────

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: courseService.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COURSES.ALL });
      toast.success('Course draft created!');
    },
    onError: () => toast.error('Failed to create course.'),
  });
}

export function useUpdateCourse(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof courseService.updateCourse>[1]) =>
      courseService.updateCourse(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COURSES.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COURSES.DETAIL(courseId) });
      toast.success('Course updated.');
    },
    onError: () => toast.error('Failed to update course.'),
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: courseService.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COURSES.ALL });
      toast.success('Course deleted.');
    },
    onError: () => toast.error('Failed to delete course.'),
  });
}

export function useSubmitForReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: courseService.submitForReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COURSES.ALL });
      toast.success('Course submitted for review!');
    },
    onError: () => toast.error('Submission failed.'),
  });
}

export function usePublishCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: courseService.publishCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COURSES.ALL });
      toast.success('Course published!');
    },
    onError: () => toast.error('Publish failed.'),
  });
}

export function useUnpublishCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: courseService.unpublishCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COURSES.ALL });
      toast.success('Course unpublished.');
    },
    onError: () => toast.error('Unpublish failed.'),
  });
}

// ─── Admin mutations ──────────────────────────────────────────────────────────

export function useReviewCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseId,
      action,
      reason,
    }: {
      courseId: string;
      action: 'APPROVED' | 'REJECTED';
      reason?: string;
    }) => courseService.reviewCourse(courseId, action, reason),
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COURSES.ALL });
      if (action === 'APPROVED') toast.success('Course approved.');
      else toast.success('Course rejected.');
    },
    onError: () => toast.error('Review action failed.'),
  });
}