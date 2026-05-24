import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Play, Search, SlidersHorizontal, Star } from 'lucide-react';
import { ROUTES } from '@/constants';
import { formatPrice } from '@/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';

const MOCK_COURSES = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  title: [
    'Complete React Developer 2025',
    'Python for Data Science & ML',
    'AWS Solutions Architect',
    'UI/UX Design Bootcamp',
    'Node.js Advanced Concepts',
    'Kubernetes & Docker Mastery',
    'TypeScript Deep Dive',
    'System Design Interview Prep',
    'iOS Development with Swift',
    'Flutter Cross-Platform Apps',
    'GraphQL: The Complete Guide',
    'Cybersecurity Fundamentals',
  ][i],
  instructor: ['Sarah Chen', 'Dr. James Liu', 'Alex M.', 'Priya S.', 'Tom K.', 'Elena V.'][i % 6],
  rating: Number((4.5 + Math.random() * 0.5).toFixed(1)),
  students: Math.floor(8000 + Math.random() * 50000),
  price: [49, 59, 79, 89, 99, 109, 119, 129][i % 8],
  level: ['Beginner', 'Intermediate', 'Advanced'][i % 3],
  category: ['Web Dev', 'ML/AI', 'Cloud', 'Design', 'Backend', 'DevOps'][i % 6],
  hours: Math.floor(20 + Math.random() * 60),
  thumbnail: [
    'photo-1633356122544-f134324a6cee',
    'photo-1677442135703-1787eea5ce01',
    'photo-1558494949-ef010cbdcc31',
    'photo-1561070791-2526d30994b5',
    'photo-1607706189992-eae578626c86',
    'photo-1667372393119-3d4c48d07fc9',
  ][i % 6],
}));

const LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export default function CoursesPage() {
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('All Levels');
  const [sort, setSort] = useState('popular');
  const [isLoading] = useState(false);

  const filtered = MOCK_COURSES.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) &&
    (level === 'All Levels' || c.level === level)
  );

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Browse Courses</h1>
        <p className="text-muted-foreground mt-1">
          {MOCK_COURSES.length.toLocaleString()} courses to power your career
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 border ${
                level === l
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:ml-auto">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm bg-background border border-input rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Filter className="size-12 text-muted-foreground/40 mb-4" />
          <h3 className="font-semibold text-lg">No courses found</h3>
          <p className="text-muted-foreground text-sm mt-1">Try adjusting your search or filters</p>
          <Button variant="outline" className="mt-4" onClick={() => { setSearch(''); setLevel('All Levels'); }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filtered.length}</span> courses
          </p>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filtered.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
              >
                <Link to={ROUTES.COURSE_DETAIL(course.id)}>
                  <Card hover className="overflow-hidden group h-full">
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <img
                        src={`https://images.unsplash.com/${course.thumbnail}?w=400&h=225&fit=crop`}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <div className="size-10 rounded-full bg-white/90 flex items-center justify-center">
                          <Play className="size-4 text-gray-900 ml-0.5" />
                        </div>
                      </div>
                      <Badge variant="secondary" className="absolute top-2 left-2 text-[10px]">
                        {course.category}
                      </Badge>
                    </div>
                    <CardContent className="p-4 space-y-2.5">
                      <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">{course.instructor}</p>
                      <div className="flex items-center gap-1.5 text-xs">
                        <Star className="size-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{course.rating}</span>
                        <span className="text-muted-foreground">({course.students.toLocaleString()})</span>
                        <span className="text-muted-foreground">· {course.hours}h</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{formatPrice(course.price)}</span>
                        <Badge variant="outline" className="text-[10px] py-0">{course.level}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}
