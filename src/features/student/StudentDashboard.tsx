import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, Clock, Play, Star, TrendingUp, Award, ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/constants';
import { formatDuration } from '@/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { StatCard } from '@/components/common/StatCard';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const MOCK_ENROLLMENTS = [
  {
    id: '1',
    title: 'Complete React Developer 2025',
    instructor: 'Sarah Chen',
    progress: 68,
    lastLecture: 'State Management with Zustand',
    totalLectures: 342,
    completedLectures: 233,
    thumbnail: 'photo-1633356122544-f134324a6cee',
    category: 'Web Dev',
    totalDuration: 151200,
  },
  {
    id: '2',
    title: 'Machine Learning Fundamentals',
    instructor: 'Dr. James Liu',
    progress: 31,
    lastLecture: 'Neural Networks Introduction',
    totalLectures: 280,
    completedLectures: 87,
    thumbnail: 'photo-1677442135703-1787eea5ce01',
    category: 'AI & ML',
    totalDuration: 201600,
  },
  {
    id: '3',
    title: 'UI/UX Design Bootcamp',
    instructor: 'Priya Sharma',
    progress: 14,
    lastLecture: 'Typography Fundamentals',
    totalLectures: 195,
    completedLectures: 27,
    thumbnail: 'photo-1561070791-2526d30994b5',
    category: 'Design',
    totalDuration: 108000,
  },
];

function CourseProgressCard({ enrollment }: { enrollment: typeof MOCK_ENROLLMENTS[0] }) {
  return (
    <motion.div variants={fadeUp}>
      <Card hover className="overflow-hidden group">
        <div className="flex gap-0 flex-col sm:flex-row">
          <div className="relative w-full sm:w-36 aspect-video sm:aspect-auto shrink-0 overflow-hidden bg-muted">
            <img
              src={`https://images.unsplash.com/${enrollment.thumbnail}?w=280&h=160&fit=crop`}
              alt={enrollment.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="size-9 rounded-full bg-white/90 flex items-center justify-center">
                <Play className="size-4 text-gray-900 ml-0.5" />
              </div>
            </div>
          </div>
          <div className="flex-1 p-4 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Badge variant="muted" className="text-[10px] mb-1.5">{enrollment.category}</Badge>
                <h3 className="font-semibold text-sm leading-snug line-clamp-1">{enrollment.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{enrollment.instructor}</p>
              </div>
              <Button size="sm" variant="outline" asChild className="shrink-0">
                <Link to={ROUTES.STUDENT.LEARN(enrollment.id, 'current')}>
                  Continue
                </Link>
              </Button>
            </div>

            {/* Progress */}
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {enrollment.completedLectures} / {enrollment.totalLectures} lectures
                </span>
                <span className="font-semibold text-primary">{enrollment.progress}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${enrollment.progress}%` }}
                  transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
                  className="h-full gradient-brand rounded-full"
                />
              </div>
              <p className="text-xs text-muted-foreground truncate">
                Next: {enrollment.lastLecture}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuthStore();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={fadeUp}>
        <PageHeader
          title={`${greeting}, ${user?.firstName ?? 'Learner'} 👋`}
          description="Track your progress and continue where you left off."
          action={
            <Button asChild>
              <Link to={ROUTES.COURSES}>
                Browse courses
                <ChevronRight className="size-4" />
              </Link>
            </Button>
          }
        />
      </motion.div>

      {/* Stats */}
      <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={fadeUp}>
          <StatCard
            title="Enrolled courses"
            value={3}
            icon={BookOpen}
            color="blue"
            trend={{ value: 50, label: 'this month' }}
          />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatCard
            title="Hours learned"
            value="47h"
            icon={Clock}
            color="violet"
            trend={{ value: 12, label: 'vs last week' }}
          />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatCard
            title="Avg. completion"
            value="38%"
            icon={TrendingUp}
            color="green"
            trend={{ value: 8, label: 'vs last month' }}
          />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatCard
            title="Certificates"
            value={1}
            icon={Award}
            color="orange"
          />
        </motion.div>
      </motion.div>

      {/* In-progress courses */}
      <motion.div variants={fadeUp} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-semibold">Continue learning</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to={ROUTES.STUDENT.MY_COURSES}>
              View all
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        </div>

        {MOCK_ENROLLMENTS.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No courses yet"
            description="You haven't enrolled in any courses yet. Start learning today!"
            action={
              <Button asChild>
                <Link to={ROUTES.COURSES}>Browse courses</Link>
              </Button>
            }
          />
        ) : (
          <motion.div variants={stagger} className="space-y-3">
            {MOCK_ENROLLMENTS.map((enrollment) => (
              <CourseProgressCard key={enrollment.id} enrollment={enrollment} />
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Recommended */}
      <motion.div variants={fadeUp} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-semibold">Recommended for you</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to={ROUTES.COURSES}>
              See all
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'TypeScript Deep Dive', instructor: 'Matt Pocock', rating: 4.9, price: 79, category: 'Web Dev' },
            { title: 'Node.js Advanced Concepts', instructor: 'Stephen Grider', rating: 4.8, price: 89, category: 'Backend' },
            { title: 'AWS for Developers', instructor: 'Neal Davis', rating: 4.7, price: 99, category: 'Cloud' },
          ].map((course) => (
            <Card key={course.title} hover className="p-4">
              <Badge variant="muted" className="text-[10px] mb-2">{course.category}</Badge>
              <h3 className="font-semibold text-sm leading-snug mb-1">{course.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">{course.instructor}</p>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-yellow-500 font-semibold">
                  <Star className="size-3 fill-current" /> {course.rating}
                </span>
                <span className="font-bold text-sm">${course.price}</span>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
