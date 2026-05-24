import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  GraduationCap,
  LayoutDashboard,
  Library,
  PlusCircle,
  Settings,
  Shield,
  Tag,
  Users,
  Video,
  Bell,
} from 'lucide-react';
import { cn } from '@/utils';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { ROUTES } from '@/constants';
import type { Role } from '@/types';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
}

const STUDENT_NAV: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: ROUTES.STUDENT.DASHBOARD },
  { label: 'My Learning', icon: BookOpen, href: ROUTES.STUDENT.MY_COURSES },
  { label: 'Notifications', icon: Bell, href: ROUTES.STUDENT.NOTIFICATIONS },
  { label: 'Browse Courses', icon: Library, href: ROUTES.COURSES },
  { label: 'Profile', icon: Settings, href: ROUTES.STUDENT.PROFILE },
];

const INSTRUCTOR_NAV: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: ROUTES.INSTRUCTOR.DASHBOARD },
  { label: 'My Courses', icon: Video, href: ROUTES.INSTRUCTOR.COURSES },
  { label: 'Create Course', icon: PlusCircle, href: ROUTES.INSTRUCTOR.CREATE_COURSE },
  { label: 'Browse Courses', icon: Library, href: ROUTES.COURSES },
  { label: 'Profile', icon: Settings, href: ROUTES.STUDENT.PROFILE },
];

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: ROUTES.ADMIN.DASHBOARD },
  { label: 'Categories', icon: Tag, href: ROUTES.ADMIN.CATEGORIES },
  { label: 'Courses', icon: GraduationCap, href: ROUTES.ADMIN.COURSES },
  { label: 'Users', icon: Users, href: ROUTES.ADMIN.USERS },
  { label: 'Analytics', icon: BarChart3, href: ROUTES.ADMIN.ANALYTICS },
];

function getNavItems(role: Role): NavItem[] {
  switch (role) {
    case 'ADMIN': return ADMIN_NAV;
    case 'INSTRUCTOR': return INSTRUCTOR_NAV;
    default: return STUDENT_NAV;
  }
}

interface SidebarProps {
  mobile?: boolean;
}

export function Sidebar({ mobile }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuthStore();
  const { sidebarState, toggleSidebar, setMobileMenuOpen } = useUIStore();
  const isCollapsed = sidebarState === 'collapsed' && !mobile;

  if (!user) return null;

  const navItems = getNavItems(user.role);
  const roleLabel = user.role === 'ADMIN' ? 'Admin' : user.role === 'INSTRUCTOR' ? 'Instructor' : 'Student';
  const RoleIcon = user.role === 'ADMIN' ? Shield : user.role === 'INSTRUCTOR' ? Video : GraduationCap;

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 64 : 220 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        'relative flex flex-col h-full overflow-hidden',
        'border-r bg-sidebar',
        mobile && 'w-full'
      )}
    >
      {/* Header */}
      <div className={cn(
        'flex items-center h-14 px-3 border-b border-sidebar-border shrink-0',
        isCollapsed ? 'justify-center' : 'justify-between'
      )}>
        {!isCollapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <RoleIcon className="size-4 text-primary" />
            </div>
            <span className="text-sm font-semibold truncate">{roleLabel} Portal</span>
          </div>
        )}
        {isCollapsed && (
          <div className="p-1.5 rounded-lg bg-primary/10">
            <RoleIcon className="size-4 text-primary" />
          </div>
        )}
        {!mobile && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors shrink-0"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="size-4 text-muted-foreground" />
            </motion.div>
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href ||
            (item.href !== '/' && location.pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => mobile && setMobileMenuOpen(false)}
              className={cn(
                'group flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium',
                'transition-all duration-150',
                isCollapsed && 'justify-center px-2',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={cn(
                'shrink-0 transition-colors',
                isCollapsed ? 'size-5' : 'size-4',
                isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
              )} />
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }}
                    transition={{ duration: 0.15 }}
                    className="truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {item.badge && !isCollapsed && (
                <span className="ml-auto text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}
