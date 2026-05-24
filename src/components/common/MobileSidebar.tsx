import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { Sidebar } from './Sidebar';

export function MobileSidebar() {
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
          >
            <div className="flex h-full flex-col bg-sidebar border-r shadow-2xl">
              {/* Close button */}
              <div className="flex items-center justify-end px-4 h-14 border-b border-sidebar-border">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors"
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <Sidebar mobile />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
