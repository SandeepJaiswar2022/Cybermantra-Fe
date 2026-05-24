import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import { Sidebar } from '@/components/common/Sidebar';
import { MobileSidebar } from '@/components/common/MobileSidebar';

export function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex h-[calc(100vh-3.5rem)] sticky top-14">
          <Sidebar />
        </div>

        {/* Mobile sidebar */}
        <MobileSidebar />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto min-h-[calc(100vh-3.5rem)]">
          <div className="p-6 max-w-screen-2xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
