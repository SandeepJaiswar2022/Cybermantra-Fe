import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Filter, Play } from 'lucide-react';
import { ROUTES } from '@/constants';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';

type FilterType = 'all' | 'in-progress' | 'completed' | 'not-started';

const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'not-started', label: 'Not Started' },
  { value: 'completed', label: 'Completed' },
];

const MOCK_COURSES = [
  { id: '1', title: 'Complete React Developer 2025', instructor: 'Sarah Chen', progress: 68, status: 'in-progress', thumbnail: 'photo-1633356122544-f134324a6cee', category: 'Web Dev' },
  { id: '2', title: 'Machine Learning Fundamentals', instructor: 'Dr. James Liu', progress: 31, status: 'in-progress', thumbnail: 'photo-1677442135703-1787eea5ce01', category: 'AI & ML' },
  { id: '3', title: 'Python Basics', instructor: 'Guido V.', progress: 100, status: 'completed', thumbnail: 'photo-1607706189992-eae578626c86', category: 'Python' },
  { id: '4', title: 'UI/UX Design Bootcamp', instructor: 'Priya Sharma', progress: 0, status: 'not-started', thumbnail: 'photo-1561070791-2526d30994b5', category: 'Design' },
];

export default function MyCoursesPage() {
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = MOCK_COURSES.filter(
    (c) => filter === 'all' || c.status === filter
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Learning"
        description={`${MOCK_COURSES.length} courses enrolled`}
        action={
          <Button asChild>
            <Link to={ROUTES.COURSES}>Browse more courses</Link>
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 border ${
              filter === f.value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses here"
          description="Try a different filter or browse new courses."
          action={
            <Button variant="outline" onClick={() => setFilter('all')}>
              Show all
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card hover className="overflow-hidden group h-full flex flex-col">
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img
                    src={`https://images.unsplash.com/${course.thumbnail}?w=400&h=225&fit=crop`}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="size-10 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="size-4 text-gray-900 ml-0.5" />
                    </div>
                  </div>
                  {course.status === 'completed' && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      Completed
                    </div>
                  )}
                </div>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <Badge variant="muted" className="text-[10px] mb-2 w-fit">{course.category}</Badge>
                  <h3 className="font-semibold text-sm leading-snug flex-1 mb-2">{course.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{course.instructor}</p>

                  {/* Progress */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full gradient-brand rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={course.progress === 0 ? 'default' : 'outline'}
                    className="mt-3 w-full"
                    asChild
                  >
                    <Link to={ROUTES.STUDENT.LEARN(course.id, 'current')}>
                      {course.progress === 0 ? 'Start learning' : course.progress === 100 ? 'Review' : 'Continue'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
