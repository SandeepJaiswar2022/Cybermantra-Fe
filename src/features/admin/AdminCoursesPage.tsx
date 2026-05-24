import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Search, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { PageHeader } from '@/components/common/PageHeader';

type StatusFilter = 'ALL' | 'SUBMITTED' | 'PUBLISHED' | 'REJECTED' | 'DRAFT';

const STATUS_VARIANTS: Record<string, 'success' | 'warning' | 'destructive' | 'secondary' | 'outline'> = {
  PUBLISHED: 'success',
  SUBMITTED: 'warning',
  REJECTED: 'destructive',
  DRAFT: 'secondary',
};

const MOCK_COURSES = [
  { id: '1', title: 'Advanced GraphQL Patterns', instructor: 'Tom Kurtis', initials: 'TK', category: 'Backend', status: 'SUBMITTED', price: 89, students: 0, submittedAt: '2024-12-01' },
  { id: '2', title: 'Flutter 3.0 Complete Guide', instructor: 'Ana Silva', initials: 'AS', category: 'Mobile', status: 'SUBMITTED', price: 79, students: 0, submittedAt: '2024-11-30' },
  { id: '3', title: 'AWS Solutions Architecture', instructor: 'Neal Davis', initials: 'ND', category: 'Cloud', status: 'SUBMITTED', price: 129, students: 0, submittedAt: '2024-11-28' },
  { id: '4', title: 'Complete React Developer 2025', instructor: 'Sarah Chen', initials: 'SC', category: 'Web Dev', status: 'PUBLISHED', price: 89, students: 4832, submittedAt: '2024-10-15' },
  { id: '5', title: 'Python for Data Science', instructor: 'James Liu', initials: 'JL', category: 'AI/ML', status: 'PUBLISHED', price: 99, students: 3120, submittedAt: '2024-09-20' },
  { id: '6', title: 'Outdated Web Concepts', instructor: 'Old Dev', initials: 'OD', category: 'Web Dev', status: 'REJECTED', price: 49, students: 0, submittedAt: '2024-11-01' },
];

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'SUBMITTED', label: 'Pending Review' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'DRAFT', label: 'Draft' },
];

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [search, setSearch] = useState('');

  const filtered = courses.filter((c) => {
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const approveCourse = (id: string) => {
    setCourses((prev) => prev.map((c) => c.id === id ? { ...c, status: 'PUBLISHED' } : c));
    toast.success('Course approved and published!');
  };

  const rejectCourse = (id: string) => {
    setCourses((prev) => prev.map((c) => c.id === id ? { ...c, status: 'REJECTED' } : c));
    toast.error('Course rejected.');
  };

  const pendingCount = courses.filter((c) => c.status === 'SUBMITTED').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Management"
        description={`${pendingCount} course${pendingCount !== 1 ? 's' : ''} pending review`}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses..." className="pl-9" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${statusFilter === f.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:text-foreground'
                }`}
            >
              {f.label}
              {f.value === 'SUBMITTED' && pendingCount > 0 && (
                <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Courses table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                {['Course', 'Instructor', 'Category', 'Price', 'Students', 'Status', 'Submitted', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((course, i) => (
                <motion.tr
                  key={course.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3 max-w-[220px]">
                    <p className="font-medium line-clamp-1">{course.title}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        <AvatarFallback className="text-[10px]">{course.initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground whitespace-nowrap">{course.instructor}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="text-[10px]">{course.category}</Badge>
                  </td>
                  <td className="px-4 py-3 font-medium">${course.price}</td>
                  <td className="px-4 py-3 text-muted-foreground">{course.students.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANTS[course.status] ?? 'outline'} className="text-[10px]">
                      {course.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(course.submittedAt)}
                  </td>
                  <td className="px-4 py-3">
                    {course.status === 'SUBMITTED' ? (
                      <div className="flex gap-1.5">
                        <Button
                          size="sm"
                          className="h-7 text-xs px-2.5 gap-1"
                          onClick={() => approveCourse(course.id)}
                        >
                          <CheckCircle2 className="size-3.5" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs px-2.5 gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                          onClick={() => rejectCourse(course.id)}
                        >
                          <XCircle className="size-3.5" />
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No courses match your filters.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
