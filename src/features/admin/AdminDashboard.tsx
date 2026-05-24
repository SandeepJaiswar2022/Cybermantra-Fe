import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3, BookOpen, ChevronRight, DollarSign,
  GraduationCap, Shield, TrendingUp, Users,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { ROUTES } from '@/constants';
import { formatPrice } from '@/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatCard } from '@/components/common/StatCard';
import { PageHeader } from '@/components/common/PageHeader';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const MONTHLY_DATA = [
  { month: 'Jul', users: 1240, revenue: 42000, courses: 18 },
  { month: 'Aug', users: 1580, revenue: 58000, courses: 24 },
  { month: 'Sep', users: 1320, revenue: 49000, courses: 21 },
  { month: 'Oct', users: 1890, revenue: 71000, courses: 31 },
  { month: 'Nov', users: 2140, revenue: 84000, courses: 38 },
  { month: 'Dec', users: 2680, revenue: 102000, courses: 45 },
];

const CATEGORY_DATA = [
  { name: 'Web Dev', courses: 420, students: 84200 },
  { name: 'AI/ML', courses: 280, students: 56400 },
  { name: 'Design', courses: 195, students: 38900 },
  { name: 'Backend', courses: 165, students: 33100 },
  { name: 'Cloud', courses: 142, students: 28400 },
  { name: 'Security', courses: 98, students: 19600 },
];

const PENDING_COURSES = [
  { id: '1', title: 'Advanced GraphQL Patterns', instructor: 'Tom Kurtis', submitted: '2024-12-01', category: 'Backend' },
  { id: '2', title: 'Flutter 3.0 Complete Guide', instructor: 'Ana Silva', submitted: '2024-11-30', category: 'Mobile' },
  { id: '3', title: 'AWS Solutions Architecture', instructor: 'Neal Davis', submitted: '2024-11-28', category: 'Cloud' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="surface-overlay rounded-xl px-3 py-2 text-sm space-y-1">
      <p className="font-semibold">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.name === 'revenue' ? formatPrice(p.value) : p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
      <motion.div variants={fadeUp}>
        <PageHeader
          title="Platform Overview"
          description="Real-time analytics and platform health"
          action={
            <Badge variant="success" className="gap-1.5 px-3 py-1.5">
              <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
              All systems operational
            </Badge>
          }
        />
      </motion.div>

      {/* Stats */}
      <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Revenue', value: '$406K', icon: DollarSign, color: 'green' as const, trend: { value: 22, label: 'vs last month' } },
          { title: 'Total Users', value: '48,320', icon: Users, color: 'blue' as const, trend: { value: 15, label: 'vs last month' } },
          { title: 'Active Courses', value: '1,240', icon: BookOpen, color: 'violet' as const, trend: { value: 8, label: 'vs last month' } },
          { title: 'Instructors', value: '284', icon: GraduationCap, color: 'orange' as const, trend: { value: 5, label: 'this quarter' } },
        ].map((stat, i) => (
          <motion.div key={i} variants={fadeUp}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div variants={stagger} className="grid lg:grid-cols-2 gap-6">
        {/* Revenue + Users trend */}
        <motion.div variants={fadeUp}>
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Growth</CardTitle>
              <p className="text-sm text-muted-foreground">Monthly revenue and new user registrations</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={MONTHLY_DATA}>
                  <defs>
                    <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.55 0.22 264)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="oklch(0.55 0.22 264)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.6 0.18 145)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="oklch(0.6 0.18 145)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" name="revenue" stroke="oklch(0.55 0.22 264)" strokeWidth={2} fill="url(#revGrad2)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category distribution */}
        <motion.div variants={fadeUp}>
          <Card>
            <CardHeader>
              <CardTitle>Courses by Category</CardTitle>
              <p className="text-sm text-muted-foreground">Distribution of published courses</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={CATEGORY_DATA} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} width={50} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="courses" name="courses" fill="oklch(0.55 0.22 264)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Pending reviews */}
      <motion.div variants={fadeUp} className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-display font-semibold">Pending Course Reviews</h2>
            <p className="text-sm text-muted-foreground">{PENDING_COURSES.length} courses awaiting approval</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to={ROUTES.ADMIN.COURSES}>
              View all <ChevronRight className="size-4" />
            </Link>
          </Button>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  {['Course', 'Instructor', 'Category', 'Submitted', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {PENDING_COURSES.map((course) => (
                  <tr key={course.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium">{course.title}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{course.instructor}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="text-[10px]">{course.category}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{course.submitted}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button size="sm" className="h-7 text-xs px-3">Approve</Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs px-3 text-destructive border-destructive/30 hover:bg-destructive/10">
                          Reject
                        </Button>
                      </div>
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
