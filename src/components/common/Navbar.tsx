import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bell,
  BookOpen,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User2,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { useLogout } from '@/hooks/useAuth';
import { ROUTES, APP_NAME } from '@/constants';
import { getInitials } from '@/utils';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';

export function Navbar() {
  const { user, isAuthenticated } = useAuthStore();
  const { theme, toggleTheme, toggleMobileMenu } = useUIStore();
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();

  const isDark = theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const dashboardRoute = user?.role === 'ADMIN'
    ? ROUTES.ADMIN.DASHBOARD
    : user?.role === 'INSTRUCTOR'
    ? ROUTES.INSTRUCTOR.DASHBOARD
    : ROUTES.STUDENT.DASHBOARD;

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass-strong border-b">
        <div className="flex h-14 items-center px-4 gap-4 max-w-screen-2xl mx-auto">
          {/* Mobile menu toggle */}
          {isAuthenticated && (
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
          )}

          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2 shrink-0">
            <motion.div
              className="size-7 rounded-lg gradient-brand flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BookOpen className="size-4 text-white" />
            </motion.div>
            <span className="font-display font-bold text-base tracking-tight">
              {APP_NAME}
            </span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-md hidden sm:block">
            <button
              onClick={() => navigate(ROUTES.COURSES)}
              className="w-full flex items-center gap-2 h-8 px-3 rounded-lg bg-muted/60 border border-border/50 text-sm text-muted-foreground hover:bg-muted hover:border-border transition-all duration-150"
            >
              <Search className="size-3.5 shrink-0" />
              <span>Search courses...</span>
              <kbd className="ml-auto hidden md:flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs bg-background border text-muted-foreground/70">
                <span>⌘</span><span>K</span>
              </kbd>
            </button>
          </div>

          <div className="ml-auto flex items-center gap-1">
            {/* Courses link */}
            <Button variant="ghost" size="sm" asChild className="hidden md:flex">
              <Link to={ROUTES.COURSES}>Browse</Link>
            </Button>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <motion.div
                key={isDark ? 'dark' : 'light'}
                initial={{ rotate: -30, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </motion.div>
            </Button>

            {isAuthenticated && user ? (
              <>
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  asChild
                >
                  <Link
                    to={ROUTES.STUDENT.NOTIFICATIONS}
                    aria-label="Notifications"
                    className="relative"
                  >
                    <Bell className="size-4" />
                    {/* Unread dot */}
                    <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" />
                  </Link>
                </Button>

                {/* Dashboard shortcut */}
                <Button variant="ghost" size="sm" asChild className="hidden md:flex">
                  <Link to={dashboardRoute}>Dashboard</Link>
                </Button>

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-accent transition-colors">
                      <Avatar size="sm">
                        <AvatarImage src={user.avatarUrl} alt={user.firstName} />
                        <AvatarFallback>
                          {getInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:block text-sm font-medium">
                        {user.firstName}
                      </span>
                      <ChevronDown className="size-3.5 opacity-50 hidden md:block" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-0.5">
                        <p className="text-sm font-semibold text-foreground">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={dashboardRoute} className="gap-2">
                        <BookOpen className="size-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={ROUTES.STUDENT.PROFILE} className="gap-2">
                        <User2 className="size-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Settings className="size-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      destructive
                      onClick={() => logout()}
                      className="gap-2"
                    >
                      <LogOut className="size-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to={ROUTES.LOGIN}>Sign in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to={ROUTES.REGISTER}>Get started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
