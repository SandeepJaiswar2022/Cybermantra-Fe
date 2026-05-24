import { useState } from 'react';
import { motion } from 'framer-motion';
import { Ban, MoreHorizontal, Search, UserCheck, Users } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { PageHeader } from '@/components/common/PageHeader';

type RoleFilter = 'ALL' | 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

const ROLE_VARIANTS: Record<string, 'success' | 'warning' | 'secondary' | 'destructive'> = {
  ADMIN: 'destructive',
  INSTRUCTOR: 'warning',
  STUDENT: 'secondary',
};

const MOCK_USERS = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@example.com', initials: 'SC', role: 'INSTRUCTOR', courses: 3, joinedAt: '2024-01-15', status: 'ACTIVE' },
  { id: '2', name: 'James Liu', email: 'james@example.com', initials: 'JL', role: 'INSTRUCTOR', courses: 5, joinedAt: '2024-02-20', status: 'ACTIVE' },
  { id: '3', name: 'Alex Johnson', email: 'alex@example.com', initials: 'AJ', role: 'STUDENT', courses: 8, joinedAt: '2024-03-10', status: 'ACTIVE' },
  { id: '4', name: 'Maria Garcia', email: 'maria@example.com', initials: 'MG', role: 'STUDENT', courses: 3, joinedAt: '2024-04-05', status: 'ACTIVE' },
  { id: '5', name: 'Tom Kurtis', email: 'tom@example.com', initials: 'TK', role: 'INSTRUCTOR', courses: 2, joinedAt: '2024-05-12', status: 'SUSPENDED' },
  { id: '6', name: 'Admin User', email: 'admin@learnforge.com', initials: 'AU', role: 'ADMIN', courses: 0, joinedAt: '2024-01-01', status: 'ACTIVE' },
  { id: '7', name: 'Priya Sharma', email: 'priya@example.com', initials: 'PS', role: 'INSTRUCTOR', courses: 4, joinedAt: '2024-06-01', status: 'ACTIVE' },
  { id: '8', name: 'Daniel Kim', email: 'daniel@example.com', initials: 'DK', role: 'STUDENT', courses: 12, joinedAt: '2024-07-15', status: 'ACTIVE' },
];

const ROLE_FILTERS: { value: RoleFilter; label: string }[] = [
  { value: 'ALL', label: 'All users' },
  { value: 'STUDENT', label: 'Students' },
  { value: 'INSTRUCTOR', label: 'Instructors' },
  { value: 'ADMIN', label: 'Admins' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL');
  const [search, setSearch] = useState('');

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const toggleSuspend = (id: string) => {
    setUsers((prev) => prev.map((u) => {
      if (u.id !== id) return u;
      const next = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
      toast.success(next === 'SUSPENDED' ? 'User suspended' : 'User reactivated');
      return { ...u, status: next };
    }));
  };

  const promoteToInstructor = (id: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role: 'INSTRUCTOR' } : u));
    toast.success('User promoted to Instructor');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description={`${users.length} total users`}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="pl-9" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {ROLE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setRoleFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                roleFilter === f.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                {['User', 'Role', 'Courses', 'Status', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.025 }}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarFallback className="text-[10px]">{user.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={ROLE_VARIANTS[user.role] ?? 'secondary'} className="text-[10px]">
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {user.courses}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={user.status === 'ACTIVE' ? 'success' : 'destructive'}
                      className="text-[10px]"
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {formatDate(user.joinedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {user.role === 'STUDENT' && (
                          <DropdownMenuItem className="gap-2" onClick={() => promoteToInstructor(user.id)}>
                            <UserCheck className="size-4" />
                            Promote to Instructor
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          destructive
                          className="gap-2"
                          onClick={() => toggleSuspend(user.id)}
                        >
                          <Ban className="size-4" />
                          {user.status === 'ACTIVE' ? 'Suspend user' : 'Reactivate user'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Users className="size-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No users found</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
