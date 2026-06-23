import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Award, BookOpen, CheckCircle2, Clock, Globe,
  Play, Star, Users,
} from 'lucide-react';
import { ROUTES } from '@/constants';
import { formatPrice, formatDuration } from '@/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Separator } from '@/components/ui/Separator';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { useAuthStore } from '@/store/authStore';

const MOCK_COURSE = {
  id: '1',
  title: 'Complete React Developer in 2025 — Build Modern Web Apps',
  instructor: { firstName: 'Sarah', lastName: 'Chen', avatar: '', bio: 'Senior Engineer at Meta. 10+ years building React applications.', students: 48320, courses: 12 },
  rating: 4.9,
  ratingCount: 12840,
  students: 48320,
  price: 89,
  originalPrice: 199,
  level: 'Intermediate',
  language: 'English',
  duration: 151200,
  lectureCount: 342,
  lastUpdated: 'November 2024',
  description: 'The most comprehensive React course on the internet. Master React 19, TypeScript, Next.js, testing, and real-world patterns used at top tech companies.',
  outcomes: [
    'Build production-ready React applications from scratch',
    'Master React 19 features including Server Components',
    'Write clean, maintainable code with TypeScript',
    'Test React apps with Jest, Vitest, and React Testing Library',
    'Implement complex state management patterns',
    'Deploy apps to Vercel, AWS, and other platforms',
  ],
  requirements: [
    'Basic JavaScript knowledge (ES6+)',
    'Familiarity with HTML & CSS',
    'A computer with internet access',
  ],
  sections: [
    { title: 'Getting Started with React', lectures: 12, duration: 7200 },
    { title: 'Components & Props Deep Dive', lectures: 18, duration: 10800 },
    { title: 'State Management Mastery', lectures: 24, duration: 14400 },
    { title: 'Advanced Patterns & Performance', lectures: 20, duration: 12000 },
    { title: 'Testing React Applications', lectures: 16, duration: 9600 },
  ],
};

export default function CourseDetailPage() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuthStore();
  const course = MOCK_COURSE; // In production: useQuery by slug

  const discount = Math.round((1 - course.price / course.originalPrice) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Back */}
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
        <Link to={ROUTES.COURSES}>
          <ArrowLeft className="size-4" />
          Back to courses
        </Link>
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ── Left: Course info ──────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{course.level}</Badge>
              <Badge variant="muted">{course.language}</Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold leading-snug tracking-tight">
              {course.title}
            </h1>

            <p className="text-muted-foreground leading-relaxed">{course.description}</p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <span className="flex items-center gap-1 text-yellow-500 font-semibold">
                <Star className="size-4 fill-current" />
                {course.rating}
              </span>
              <span className="text-muted-foreground">({course.ratingCount.toLocaleString()} ratings)</span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Users className="size-4" />
                {course.students.toLocaleString()} students
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="size-4" />
                {formatDuration(course.duration)}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <BookOpen className="size-4" />
                {course.lectureCount} lectures
              </span>
            </div>

            {/* Instructor */}
            <div className="flex items-center gap-3">
              <Avatar size="md">
                <AvatarFallback>{course.instructor.firstName[0]}{course.instructor.lastName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">Instructor</p>
                <p className="font-medium text-sm text-primary hover:underline cursor-pointer">
                  {course.instructor.firstName} {course.instructor.lastName}
                </p>
              </div>
            </div>
          </motion.div>

          <Separator />

          {/* What you'll learn */}
          <div className="space-y-4">
            <h2 className="text-xl font-display font-bold">What you'll learn</h2>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {course.outcomes.map((outcome) => (
                <div key={outcome} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="size-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Requirements */}
          <div className="space-y-4">
            <h2 className="text-xl font-display font-bold">Requirements</h2>
            <ul className="space-y-2">
              {course.requirements.map((req) => (
                <li key={req} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Curriculum */}
          <div className="space-y-4">
            <h2 className="text-xl font-display font-bold">Course curriculum</h2>
            <div className="space-y-2">
              {course.sections.map((section, i) => (
                <div key={i} className="border rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-muted/40">
                    <h3 className="font-medium text-sm">{section.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                      <span>{section.lectures} lectures</span>
                      <span>{formatDuration(section.duration)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Enroll card ─────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card className="overflow-hidden shadow-xl border-border/60">
              {/* Preview */}
              <div className="relative aspect-video bg-muted overflow-hidden group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=338&fit=crop"
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="size-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <Play className="size-6 text-gray-900 ml-1" />
                  </div>
                </div>
                <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-white/90 bg-black/50 px-2 py-0.5 rounded">
                  Preview this course
                </p>
              </div>

              <CardContent className="p-5 space-y-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold">{formatPrice(course.price)}</span>
                  <span className="text-muted-foreground line-through text-sm">
                    {formatPrice(course.originalPrice)}
                  </span>
                  <Badge variant="destructive" className="ml-auto">{discount}% off</Badge>
                </div>

                <p className="text-xs text-destructive font-medium text-center">
                  🔥 2 days left at this price
                </p>

                <Button size="lg" className="w-full" asChild={!isAuthenticated}>
                  {isAuthenticated ? (
                    <span>Enroll now</span>
                  ) : (
                    <Link to={`${ROUTES.LOGIN}?redirect=/courses/${slug}`}>
                      Enroll now
                    </Link>
                  )}
                </Button>

                <Button size="lg" variant="outline" className="w-full">
                  Try for free
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  30-day money-back guarantee
                </p>

                <Separator />

                <div className="space-y-2.5 text-sm">
                  {[
                    { icon: Clock, label: `${formatDuration(course.duration)} of content` },
                    { icon: BookOpen, label: `${course.lectureCount} lectures` },
                    { icon: Globe, label: 'Full lifetime access' },
                    { icon: Award, label: 'Certificate of completion' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 text-muted-foreground">
                      <Icon className="size-4 shrink-0" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
