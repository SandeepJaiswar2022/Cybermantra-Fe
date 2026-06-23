import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronLeft, ChevronRight, Filter, Play, Search, SlidersHorizontal, Star } from 'lucide-react';
import { ROUTES } from '@/constants';
import { formatPrice, formatDuration } from '@/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { SkeletonCard } from '@/components/ui/Skeleton';
// import { useCourses, useCategoriesSummary } from '@/hooks/useCourse';
import type { CourseLevel, CourseListParams } from '@/services/courseService';
import { useCourses, useCategoriesSummary } from '@/hooks/useCourses';
import useDebounce from '@/hooks/useDebounce';

// ─── Constants ────────────────────────────────────────────────────────────────

const LEVELS: { label: string; value: CourseLevel | '' }[] = [
  { label: 'All Levels', value: '' },
  { label: 'Beginner', value: 'BEGINNER' },
  { label: 'Intermediate', value: 'INTERMEDIATE' },
  { label: 'Advanced', value: 'ADVANCED' },
];

const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: 'Newest' },
  { value: 'averageRating,desc', label: 'Highest Rated' },
  { value: 'totalEnrollments,desc', label: 'Most Popular' },
  { value: 'price,asc', label: 'Price: Low to High' },
  { value: 'price,desc', label: 'Price: High to Low' },
];

const PAGE_SIZE = 20;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDurationHours(seconds: number | null): string {
  if (!seconds) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// ─── CoursesPage ─────────────────────────────────────────────────────────────

export default function CoursesPage() {
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState<CourseLevel | ''>('');
  const [categoryId, setCategoryId] = useState('');
  const [sort, setSort] = useState('createdAt,desc');
  const [page, setPage] = useState(0);

  // Debounce search so we don't hammer the backend on every keystroke
  const debouncedSearch = useDebounce(search, 400);

  const params: CourseListParams = {
    page,
    size: PAGE_SIZE,
    sort,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(level && { level }),
    ...(categoryId && { categoryId }),
  };

  const { data, isLoading, isError } = useCourses(params);
  const { data: categories } = useCategoriesSummary();

  const courses = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  const resetFilters = useCallback(() => {
    setSearch('');
    setLevel('');
    setCategoryId('');
    setSort('createdAt,desc');
    setPage(0);
  }, []);

  // Reset to page 0 whenever a filter changes
  const handleLevelChange = (v: CourseLevel | '') => { setLevel(v); setPage(0); };
  const handleCategoryChange = (v: string) => { setCategoryId(v); setPage(0); };
  const handleSortChange = (v: string) => { setSort(v); setPage(0); };
  const handleSearchChange = (v: string) => { setSearch(v); setPage(0); };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10 space-y-8">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Browse Courses</h1>
        {!isLoading && (
          <p className="text-muted-foreground mt-1">
            {totalElements.toLocaleString()} courses to power your career
          </p>
        )}
      </div>

      {/* ── Filters ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">

        {/* Row 1: Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search courses..."
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2 sm:ml-auto">
            <SlidersHorizontal className="size-4 text-muted-foreground shrink-0" />
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="text-sm bg-background border border-input rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Level pills + Category dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          {LEVELS.map((l) => (
            <button
              key={l.value}
              onClick={() => handleLevelChange(l.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 border ${level === l.value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'
                }`}
            >
              {l.label}
            </button>
          ))}

          {/* Category filter — populated from /api/v1/categories/summary */}
          {categories && categories.length > 0 && (
            <select
              value={categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="ml-auto text-sm bg-background border border-input rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* ── Results ────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>

      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <BookOpen className="size-12 text-muted-foreground/40 mb-4" />
          <h3 className="font-semibold text-lg">Something went wrong</h3>
          <p className="text-muted-foreground text-sm mt-1">Could not load courses. Please try again.</p>
          <Button variant="outline" className="mt-4" onClick={resetFilters}>
            Reset filters
          </Button>
        </div>

      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Filter className="size-12 text-muted-foreground/40 mb-4" />
          <h3 className="font-semibold text-lg">No courses found</h3>
          <p className="text-muted-foreground text-sm mt-1">Try adjusting your search or filters</p>
          <Button variant="outline" className="mt-4" onClick={resetFilters}>
            Clear filters
          </Button>
        </div>

      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Showing{' '}
            <span className="font-medium text-foreground">
              {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, totalElements)}
            </span>{' '}
            of <span className="font-medium text-foreground">{totalElements.toLocaleString()}</span> courses
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${page}-${debouncedSearch}-${level}-${categoryId}-${sort}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {courses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                >
                  <Link to={ROUTES.COURSE_DETAIL(course.id)}>
                    <Card hover className="overflow-hidden group h-full">
                      {/* Thumbnail */}
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        {course.thumbnailUrl ? (
                          <img
                            src={course.thumbnailUrl}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <BookOpen className="size-8 text-muted-foreground/40" />
                          </div>
                        )}

                        {/* Play overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <div className="size-10 rounded-full bg-white/90 flex items-center justify-center">
                            <Play className="size-4 text-gray-900 ml-0.5" />
                          </div>
                        </div>

                        <Badge variant="secondary" className="absolute top-2 left-2 text-[10px]">
                          {course.categoryName}
                        </Badge>

                        {/* Status badge — only visible to instructors/admins seeing non-published */}
                        {!course.isPublished && course.status && (
                          <StatusBadge status={course.status} />
                        )}
                      </div>

                      {/* Card body */}
                      <CardContent className="p-4 space-y-2.5">
                        <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">{course.instructorName}</p>

                        {/* Rating + meta */}
                        <div className="flex items-center gap-1.5 text-xs">
                          {course.averageRating != null && (
                            <>
                              <Star className="size-3 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">{Number(course.averageRating).toFixed(1)}</span>
                              {course.totalRatings != null && (
                                <span className="text-muted-foreground">
                                  ({course.totalRatings.toLocaleString()})
                                </span>
                              )}
                            </>
                          )}
                          {course.totalDurationSeconds != null && (
                            <span className="text-muted-foreground">
                              · {formatDurationHours(course.totalDurationSeconds)}
                            </span>
                          )}
                          {course.totalLectures != null && (
                            <span className="text-muted-foreground">
                              · {course.totalLectures} lectures
                            </span>
                          )}
                        </div>

                        {/* Price + level */}
                        <div className="flex items-center justify-between">
                          <span className="font-bold">
                            {course.price != null ? formatPrice(course.price) : 'Free'}
                          </span>
                          <LevelBadge level={course.level} />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* ── Pagination ───────────────────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 0}
              >
                <ChevronLeft className="size-4" />
              </Button>

              {/* Page number pills */}
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                // Show first, last, current ±1, and ellipsis otherwise
                const target = totalPages <= 7
                  ? i
                  : i === 0 ? 0
                    : i === 6 ? totalPages - 1
                      : page - 2 + i; // rough centering; good enough for most cases
                if (target < 0 || target >= totalPages) return null;
                return (
                  <button
                    key={target}
                    onClick={() => setPage(target)}
                    className={`size-8 rounded-lg text-sm font-medium border transition-colors ${page === target
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    {target + 1}
                  </button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages - 1}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LevelBadge({ level }: { level: CourseLevel }) {
  const label = level === 'BEGINNER' ? 'Beginner'
    : level === 'INTERMEDIATE' ? 'Intermediate'
      : 'Advanced';
  return <Badge variant="outline" className="text-[10px] py-0">{label}</Badge>;
}

const STATUS_META: Record<string, { label: string; className: string }> = {
  DRAFT: { label: 'Draft', className: 'bg-gray-500/80' },
  PENDING_REVIEW: { label: 'Under Review', className: 'bg-amber-500/80' },
  APPROVED: { label: 'Approved', className: 'bg-emerald-600/80' },
  REJECTED: { label: 'Rejected', className: 'bg-red-600/80' },
};

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status];
  if (!meta) return null;
  return (
    <span
      className={`absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-semibold text-white ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}