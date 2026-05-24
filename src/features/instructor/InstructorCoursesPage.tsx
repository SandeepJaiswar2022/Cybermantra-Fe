import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Edit2, Eye, MoreHorizontal, PlusCircle, Star, Trash2, Users } from 'lucide-react';
import { ROUTES } from '@/constants';
import { formatPrice } from '@/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';

const STATUS_VARIANTS: Record<string, 'success' | 'warning' | 'secondary' | 'destructive' | 'outline'> = {
  PUBLISHED: 'success',
  SUBMITTED: 'warning',
  DRAFT: 'secondary',
  REJECTED: 'destructive',
};

const MOCK_COURSES = [
  {
    id: '1',
    title: 'Complete React Developer 2025',
    thumbnail: 'photo-1633356122544-f134324a6cee',
    category: 'Web Development',
    students: 4832,
    revenue: 43120,
    rating: 4.9,
    status: 'PUBLISHED',
    updatedAt: '2024-11-15',
    price: 89,
  },
  {
    id: '2',
    title: 'TypeScript Mastery — From Zero to Expert',
    thumbnail: 'photo-1607706189992-eae578626c86',
    category: 'Web Development',
    students: 2140,
    revenue: 18900,
    rating: 4.7,
    status: 'PUBLISHED',
    updatedAt: '2024-10-20',
    price: 79,
  },
  {
    id: '3',
    title: 'Advanced Node.js Architecture Patterns',
    thumbnail: 'photo-1667372393119-3d4c48d07fc9',
    category: 'Backend',
    students: 0,
    revenue: 0,
    rating: 0,
    status: 'DRAFT',
    updatedAt: '2024-12-01',
    price: 99,
  },
  {
    id: '4',
    title: 'GraphQL API Design',
    thumbnail: 'photo-1558494949-ef010cbdcc31',
    category: 'Backend',
    students: 0,
    revenue: 0,
    rating: 0,
    status: 'SUBMITTED',
    updatedAt: '2024-11-28',
    price: 69,
  },
];

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState(MOCK_COURSES);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Courses"
        description={`${courses.length} courses total`}
        action={
          <Button asChild>
            <Link to={ROUTES.INSTRUCTOR.CREATE_COURSE}>
              <PlusCircle className="size-4" />
              Create course
            </Link>
          </Button>
        }
      />

      {courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses yet"
          description="Create your first course and start sharing your knowledge with the world."
          action={
            <Button asChild>
              <Link to={ROUTES.INSTRUCTOR.CREATE_COURSE}>
                <PlusCircle className="size-4" />
                Create your first course
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="size-16 sm:size-20 rounded-xl overflow-hidden bg-muted shrink-0">
                    <img
                      src={`https://images.unsplash.com/${course.thumbnail}?w=160&h=128&fit=crop`}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm leading-snug line-clamp-1">{course.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{course.category} · {formatPrice(course.price)}</p>
                      </div>
                      <Badge variant={STATUS_VARIANTS[course.status] ?? 'outline'} className="text-[10px] shrink-0">
                        {course.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-2.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="size-3.5" />
                        {course.students.toLocaleString()} students
                      </span>
                      {course.revenue > 0 && (
                        <span className="font-medium text-green-600">
                          {formatPrice(course.revenue)} earned
                        </span>
                      )}
                      {course.rating > 0 && (
                        <span className="flex items-center gap-1 text-yellow-500 font-medium">
                          <Star className="size-3.5 fill-current" />
                          {course.rating}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" asChild className="hidden sm:flex">
                      <Link to={ROUTES.INSTRUCTOR.EDIT_COURSE(course.id)}>
                        <Edit2 className="size-3.5" />
                        Edit
                      </Link>
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={ROUTES.INSTRUCTOR.EDIT_COURSE(course.id)} className="gap-2">
                            <Edit2 className="size-4" /> Edit course
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={ROUTES.COURSE_DETAIL(course.id)} className="gap-2">
                            <Eye className="size-4" /> Preview
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem destructive className="gap-2">
                          <Trash2 className="size-4" /> Delete course
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
