import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { courseService, type CourseFilters } from '@/services/courseService';
import { QUERY_KEYS } from '@/constants';

// ── Course Queries ─────────────────────────────────────────────────────────────

export function useCourses(filters?: CourseFilters) {
  return useQuery({
    queryKey: [...QUERY_KEYS.COURSES.ALL, filters],
    queryFn: () => courseService.getCourses(filters),
  });
}

export function useFeaturedCourses() {
  return useQuery({
    queryKey: QUERY_KEYS.COURSES.FEATURED,
    queryFn: courseService.getFeaturedCourses,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCourseBySlug(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.COURSES.DETAIL(slug),
    queryFn: () => courseService.getCourseBySlug(slug),
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.ALL,
    queryFn: courseService.getCategories,
    staleTime: 1000 * 60 * 30,
  });
}

// ── Instructor Mutations ───────────────────────────────────────────────────────

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: courseService.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COURSES.ALL });
      toast.success('Course draft created!');
    },
  });
}

export function useUpdateCourse(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof courseService.updateCourse>[1]) =>
      courseService.updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COURSES.ALL });
      toast.success('Course updated');
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: courseService.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COURSES.ALL });
      toast.success('Course deleted');
    },
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
  });
}

export function useSubmitCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: courseService.submitCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COURSES.ALL });
      toast.success('Course submitted for review!');
    },
  });
}

// ── Admin Mutations ────────────────────────────────────────────────────────────

export function useAdminApproveCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: courseService.adminApproveCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COURSES.ADMIN_LIST });
      toast.success('Course approved and published!');
    },
  });
}

export function useAdminRejectCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      courseService.adminRejectCourse(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COURSES.ADMIN_LIST });
      toast.error('Course rejected.');
    },
  });
}
