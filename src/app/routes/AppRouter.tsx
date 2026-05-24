import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

// Layouts
import { PublicLayout } from '@/app/layouts/PublicLayout';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import { ProtectedRoute, GuestRoute } from '@/app/routes/ProtectedRoute';

// Eagerly loaded auth pages (small, needed fast)
import LoginPage from '@/app/pages/LoginPage';
import RegisterPage from '@/app/pages/RegisterPage';

// Lazy loaded pages
const LandingPage = lazy(() => import('@/app/pages/LandingPage'));
const CoursesPage = lazy(() => import('@/app/pages/CoursesPage'));
const CourseDetailPage = lazy(() => import('@/app/pages/CourseDetailPage'));

// Student pages
const StudentDashboard = lazy(() => import('@/features/student/StudentDashboard'));
const MyCoursesPage = lazy(() => import('@/features/student/MyCoursesPage'));
const LearnPage = lazy(() => import('@/features/student/LearnPage'));
const StudentProfilePage = lazy(() => import('@/features/student/StudentProfilePage'));
const NotificationsPage = lazy(() => import('@/features/student/NotificationsPage'));

// Instructor pages
const InstructorDashboard = lazy(() => import('@/features/instructor/InstructorDashboard'));
const InstructorCoursesPage = lazy(() => import('@/features/instructor/InstructorCoursesPage'));
const CreateCoursePage = lazy(() => import('@/features/instructor/CreateCoursePage'));
const EditCoursePage = lazy(() => import('@/features/instructor/EditCoursePage'));

// Admin pages
const AdminDashboard = lazy(() => import('@/features/admin/AdminDashboard'));
const AdminCategoriesPage = lazy(() => import('@/features/admin/AdminCategoriesPage'));
const AdminCoursesPage = lazy(() => import('@/features/admin/AdminCoursesPage'));
const AdminUsersPage = lazy(() => import('@/features/admin/AdminUsersPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="space-y-3 text-center">
        <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public Routes ─────────────────────────────────────────── */}
          <Route element={<PublicLayout />}>
            <Route path={ROUTES.HOME} element={<LandingPage />} />
            <Route path={ROUTES.COURSES} element={<CoursesPage />} />
            <Route path="/courses/:slug" element={<CourseDetailPage />} />
          </Route>

          {/* ── Auth Routes (guest only) ──────────────────────────────── */}
          <Route
            element={
              <GuestRoute>
                <AuthLayout />
              </GuestRoute>
            }
          >
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<LoginPage />} />
          </Route>

          {/* ── Student Routes ────────────────────────────────────────── */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['STUDENT', 'INSTRUCTOR', 'ADMIN']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.STUDENT.DASHBOARD} element={<StudentDashboard />} />
            <Route path={ROUTES.STUDENT.MY_COURSES} element={<MyCoursesPage />} />
            <Route path="/student/learn/:courseSlug/:lectureId" element={<LearnPage />} />
            <Route path={ROUTES.STUDENT.PROFILE} element={<StudentProfilePage />} />
            <Route path={ROUTES.STUDENT.NOTIFICATIONS} element={<NotificationsPage />} />
          </Route>

          {/* ── Instructor Routes ─────────────────────────────────────── */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.INSTRUCTOR.DASHBOARD} element={<InstructorDashboard />} />
            <Route path={ROUTES.INSTRUCTOR.COURSES} element={<InstructorCoursesPage />} />
            <Route path={ROUTES.INSTRUCTOR.CREATE_COURSE} element={<CreateCoursePage />} />
            <Route path="/instructor/courses/:id/edit" element={<EditCoursePage />} />
          </Route>

          {/* ── Admin Routes ──────────────────────────────────────────── */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />
            <Route path={ROUTES.ADMIN.CATEGORIES} element={<AdminCategoriesPage />} />
            <Route path={ROUTES.ADMIN.COURSES} element={<AdminCoursesPage />} />
            <Route path={ROUTES.ADMIN.USERS} element={<AdminUsersPage />} />
          </Route>

          {/* ── Catch all ─────────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
