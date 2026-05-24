import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3, BookOpen, ChevronRight, DollarSign,
  PlusCircle, Star, Users,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/constants';
import { formatPrice } from '@/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatCard } from '@/components/common/StatCard';
import { PageHeader } from '@/components/common/PageHeader';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const REVENUE_DATA = [
  { month: 'Jan', revenue: 2800, students: 42 },
  { month: 'Feb', revenue: 3200, students: 58 },
  { month: 'Mar', revenue: 2600, students: 39 },
  { month: 'Apr', revenue: 4100, students: 71 },
  { month: 'May', revenue: 3700, students: 64 },
  { month: 'Jun', revenue: 5200, students: 89 },
  { month: 'Jul', revenue: 4800, students: 82 },
  { month: 'Aug', revenue: 6100, students: 104 },
  { month: 'Sep', revenue: 5500, students: 93 },
  { month: 'Oct', revenue: 7200, students: 121 },
  { month: 'Nov', revenue: 6800, students: 115 },
  { month: 'Dec', revenue: 8400, students: 142 },
];

const MOCK_COURSES = [
  { id: '1', title: 'Complete React Developer 2025', students: 4832, revenue: 43120, rating: 4.9, status: 'PUBLISHED' },
  { id: '2', title: 'TypeScript Mastery', students: 2140, revenue: 18900, rating: 4.7, status: 'PUBLISHED' },
  { id: '3', title: 'Advanced Node.js Patterns', students: 890, revenue: 7890, rating: 4.8, status: 'DRAFT' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="surface-overlay rounded-xl px-3 py-2 text-sm space-y-1">
      <p className="font-medium text-foreground">{label}</p>
      <p className="text-primary">${payload[0]?.value?.toLocaleString()} revenue</p>
      <p className="text-muted-foreground">{payload[1]?.value} students</p>
    </div>
  );
};

export default function InstructorDashboard() {
  const { user } = useAuthStore();

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
      <motion.div variants={fadeUp}>
        <PageHeader
          title={`Welcome back, ${user?.firstName} 🎓`}
          description="Here's how your courses are performing this month."
          action={
            <Button asChild>
              <Link to={ROUTES.INSTRUCTOR.CREATE_COURSE}>
                <PlusCircle className="size-4" />
                New course
              </Link>
            </Button>
          }
        />
      </motion.div>

      {/* Stats */}
      <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total revenue', value: '$69,910', icon: DollarSign, color: 'green' as const, trend: { value: 18, label: 'vs last month' } },
          { title: 'Total students', value: '7,862', icon: Users, color: 'blue' as const, trend: { value: 12, label: 'vs last month' } },
          { title: 'Active courses', value: 2, icon: BookOpen, color: 'violet' as const },
          { title: 'Avg. rating', value: '4.8', icon: Star, color: 'orange' as const, trend: { value: 2, label: 'this quarter' } },
        ].map((stat, i) => (
          <motion.div key={i} variants={fadeUp}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Revenue Chart */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Revenue Overview</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Monthly revenue and student enrollment</p>
            </div>
            <Badge variant="secondary">2024</Badge>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={REVENUE_DATA} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.55 0.22 264)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="oklch(0.55 0.22 264)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="oklch(0.55 0.22 264)" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Courses table */}
      <motion.div variants={fadeUp} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-semibold">My Courses</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to={ROUTES.INSTRUCTOR.COURSES}>
              View all <ChevronRight className="size-4" />
            </Link>
          </Button>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  {['Course', 'Students', 'Revenue', 'Rating', 'Status', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {MOCK_COURSES.map((course) => (
                  <tr key={course.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium line-clamp-1">{course.title}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {course.students.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-medium text-green-600">
                      {formatPrice(course.revenue)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-yellow-500 font-semibold">
                        <Star className="size-3.5 fill-current" />
                        {course.rating}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={course.status === 'PUBLISHED' ? 'success' : 'secondary'}
                        className="text-[10px]"
                      >
                        {course.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={ROUTES.INSTRUCTOR.EDIT_COURSE(course.id)}>Edit</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
