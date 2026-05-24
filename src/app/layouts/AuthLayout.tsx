import { Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { APP_NAME } from '@/constants';
import { ROUTES } from '@/constants';

export function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left - decorative */}
      <div className="hidden lg:flex flex-col justify-between p-10 gradient-brand text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />

        <Link to={ROUTES.HOME} className="flex items-center gap-2 relative">
          <div className="size-8 rounded-lg bg-white/20 flex items-center justify-center">
            <BookOpen className="size-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg">{APP_NAME}</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <blockquote className="space-y-4">
            <p className="text-xl font-medium leading-relaxed">
              "LearnForge transformed how I approach skill development. The course quality and learning experience is unmatched."
            </p>
            <footer className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                SR
              </div>
              <div>
                <p className="font-semibold">Sophia Rodriguez</p>
                <p className="text-sm text-white/70">Senior Engineer at Stripe</p>
              </div>
            </footer>
          </blockquote>
        </motion.div>

        <p className="text-sm text-white/60 relative">
          © 2025 {APP_NAME}. Empowering learners worldwide.
        </p>
      </div>

      {/* Right - auth form */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-10">
        {/* Mobile logo */}
        <Link to={ROUTES.HOME} className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="size-7 rounded-lg gradient-brand flex items-center justify-center">
            <BookOpen className="size-4 text-white" />
          </div>
          <span className="font-display font-bold text-base">{APP_NAME}</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
