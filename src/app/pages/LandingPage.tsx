import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BookOpen,
  ChevronRight,
  Code2,
  Globe,
  Play,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { ROUTES } from '@/constants';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { formatPrice } from '@/utils';

// ── Animation Variants ────────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};



// ── Mock Data ─────────────────────────────────────────────────────────────────
const FEATURED_COURSES = [
  {
    id: '1',
    title: 'Complete React Developer in 2025',
    instructor: 'Sarah Chen',
    rating: 4.9,
    students: 48320,
    price: 89,
    originalPrice: 199,
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
    category: 'Web Development',
    hours: 42,
  },
  {
    id: '2',
    title: 'Machine Learning & AI Fundamentals',
    instructor: 'Dr. James Liu',
    rating: 4.8,
    students: 31540,
    price: 99,
    originalPrice: 249,
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=225&fit=crop',
    category: 'AI & ML',
    hours: 56,
  },
  {
    id: '3',
    title: 'System Design for Senior Engineers',
    instructor: 'Alex Martinez',
    rating: 4.9,
    students: 22180,
    price: 129,
    originalPrice: 299,
    level: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=225&fit=crop',
    category: 'Engineering',
    hours: 38,
  },
  {
    id: '4',
    title: 'UI/UX Design Mastery',
    instructor: 'Priya Sharma',
    rating: 4.7,
    students: 19430,
    price: 79,
    originalPrice: 179,
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop',
    category: 'Design',
    hours: 34,
  },
];

const CATEGORIES = [
  { label: 'Web Development', icon: Code2, count: 1240, color: 'text-blue-500 bg-blue-500/10' },
  { label: 'AI & Machine Learning', icon: Zap, count: 843, color: 'text-violet-500 bg-violet-500/10' },
  { label: 'Design', icon: Globe, count: 692, color: 'text-pink-500 bg-pink-500/10' },
  { label: 'Business', icon: TrendingUp, count: 584, color: 'text-green-500 bg-green-500/10' },
  { label: 'Security', icon: Shield, count: 421, color: 'text-orange-500 bg-orange-500/10' },
  { label: 'Certifications', icon: Award, count: 318, color: 'text-yellow-500 bg-yellow-500/10' },
];

const STATS = [
  { value: '2.4M+', label: 'Active learners' },
  { value: '18K+', label: 'Expert courses' },
  { value: '850+', label: 'Instructors' },
  { value: '4.8', label: 'Average rating' },
];

// ── Course Card ───────────────────────────────────────────────────────────────
function CourseCard({ course }: { course: typeof FEATURED_COURSES[0] }) {
  return (
    <motion.div variants={fadeUp}>
      <Link to={ROUTES.COURSE_DETAIL(course.id)}>
        <Card hover className="overflow-hidden group">
          <div className="relative aspect-video overflow-hidden">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <div className="size-12 rounded-full bg-white/90 flex items-center justify-center">
                <Play className="size-5 text-gray-900 ml-0.5" />
              </div>
            </div>
            <Badge variant="secondary" className="absolute top-2.5 left-2.5 text-[10px]">
              {course.category}
            </Badge>
          </div>
          <CardContent className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {course.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{course.instructor}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="flex items-center gap-0.5 text-yellow-500 font-semibold">
                <Star className="size-3 fill-current" />
                {course.rating}
              </span>
              <span className="text-muted-foreground">
                ({course.students.toLocaleString()})
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{course.hours}h</span>
              <Badge variant="outline" className="ml-auto text-[10px] py-0">
                {course.level}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base">{formatPrice(course.price)}</span>
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(course.originalPrice)}
              </span>
              <Badge variant="destructive" className="ml-auto text-[10px] py-0">
                {Math.round((1 - course.price / course.originalPrice) * 100)}% off
              </Badge>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

// ── Landing Page ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center py-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-violet-500/5" />
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20 blur-3xl"
            style={{
              background: 'radial-gradient(circle, oklch(0.55 0.22 264 / 0.3) 0%, transparent 70%)',
            }}
          />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)`,
              backgroundSize: '64px 64px',
            }}
          />
        </div>

        <div className="max-w-screen-xl mx-auto px-4 w-full">
          <div className="max-w-3xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="space-y-6"
            >
              <motion.div variants={fadeUp}>
                <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-xs">
                  <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                  50,000+ learners enrolled this month
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] text-balance"
              >
                Master skills that{' '}
                <span className="gradient-text">shape tomorrow</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg text-muted-foreground max-w-xl leading-relaxed"
              >
                World-class courses from industry experts. Learn at your own pace with
                hands-on projects, live sessions, and a community that lifts you up.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Button size="xl" asChild className="group">
                  <Link to={ROUTES.COURSES}>
                    Explore courses
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline" asChild>
                  <Link to={ROUTES.REGISTER}>
                    <Play className="size-4" />
                    Watch preview
                  </Link>
                </Button>
              </motion.div>

              {/* Trust signals */}
              <motion.div
                variants={fadeUp}
                className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2"
              >
                {[
                  'No credit card required',
                  '7-day free trial',
                  'Cancel anytime',
                ].map((item) => (
                  <span key={item} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <svg viewBox="0 0 16 16" className="size-4 text-green-500" fill="currentColor">
                      <path d="M12.72 3.28a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06L6.25 8.75l5.47-5.47a.75.75 0 0 1 1.06 0z" />
                    </svg>
                    {item}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────────────── */}
      <section className="border-y bg-muted/30">
        <div className="max-w-screen-xl mx-auto px-4 py-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="text-center"
              >
                <p className="text-3xl sm:text-4xl font-display font-bold gradient-text">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-screen-xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="space-y-10"
          >
            <motion.div variants={fadeUp} className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
                  Explore Topics
                </p>
                <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">
                  Learn anything you want
                </h2>
              </div>
              <Button variant="ghost" asChild className="hidden sm:flex shrink-0">
                <Link to={ROUTES.COURSES}>
                  View all categories
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              variants={stagger}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
            >
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <motion.div key={cat.label} variants={fadeUp}>
                    <Link to={ROUTES.COURSES}>
                      <div className="group p-4 rounded-xl border bg-card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center space-y-3">
                        <div className={`size-10 rounded-xl ${cat.color} flex items-center justify-center mx-auto`}>
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-tight group-hover:text-primary transition-colors">
                            {cat.label}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {cat.count.toLocaleString()} courses
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Featured Courses ─────────────────────────────────────────── */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-screen-xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="space-y-10"
          >
            <motion.div variants={fadeUp} className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
                  Featured Courses
                </p>
                <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">
                  Trending right now
                </h2>
              </div>
              <Button variant="ghost" asChild className="hidden sm:flex shrink-0">
                <Link to={ROUTES.COURSES}>
                  Browse all
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {FEATURED_COURSES.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Why LearnForge ───────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-screen-xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="space-y-12"
          >
            <motion.div variants={fadeUp} className="text-center max-w-2xl mx-auto">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
                Why LearnForge
              </p>
              <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">
                Built for serious learners
              </h2>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                We obsess over learning outcomes. Every feature is designed to help you
                learn faster, retain more, and achieve your goals.
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                {
                  icon: Zap,
                  title: 'Learn at your pace',
                  desc: 'Lifetime access to all course content. Pick up exactly where you left off, on any device.',
                  color: 'text-yellow-500 bg-yellow-500/10',
                },
                {
                  icon: Users,
                  title: 'Expert instructors',
                  desc: 'Every instructor is vetted by our team. Real practitioners with real industry experience.',
                  color: 'text-blue-500 bg-blue-500/10',
                },
                {
                  icon: Award,
                  title: 'Verified certificates',
                  desc: 'Earn certificates recognized by top companies. Add them to LinkedIn with one click.',
                  color: 'text-purple-500 bg-purple-500/10',
                },
                {
                  icon: BookOpen,
                  title: 'Hands-on projects',
                  desc: 'Build a portfolio of real projects. Learn by doing, not just watching.',
                  color: 'text-green-500 bg-green-500/10',
                },
                {
                  icon: Globe,
                  title: '40+ languages',
                  desc: 'Course subtitles and UI available in 40+ languages. Learning without language barriers.',
                  color: 'text-pink-500 bg-pink-500/10',
                },
                {
                  icon: Shield,
                  title: '30-day guarantee',
                  desc: "Not satisfied? Full refund within 30 days. No questions asked. We stand by our quality.",
                  color: 'text-orange-500 bg-orange-500/10',
                },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <motion.div key={feature.title} variants={fadeUp}>
                    <Card className="p-6 h-full hover:shadow-md transition-shadow duration-200">
                      <div className={`size-10 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                        <Icon className="size-5" />
                      </div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.desc}
                      </p>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-screen-xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <div className="relative overflow-hidden rounded-3xl gradient-brand p-10 sm:p-16 text-center text-white">
              {/* Background pattern */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)`,
                  backgroundSize: '48px 48px',
                }}
              />
              <div className="relative space-y-6 max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
                  Start learning for free today
                </h2>
                <p className="text-white/80 text-lg leading-relaxed">
                  Join 2.4 million learners already on LearnForge. No credit card required.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    size="xl"
                    className="bg-white text-gray-900 hover:bg-white/90"
                    asChild
                  >
                    <Link to={ROUTES.REGISTER}>
                      Get started free
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    size="xl"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                    asChild
                  >
                    <Link to={ROUTES.COURSES}>Browse courses</Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
