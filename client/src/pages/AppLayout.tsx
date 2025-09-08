import { Outlet } from 'react-router-dom';

import { useLayout } from '../context/LayoutContext';
import { SideBar } from '../components/Sidebar';
import { Navbar } from '../components/AppNavBar';

export function AppLayout() {
  const { isSidebarOpen } = useLayout();


  return (
    <div
      className={`grid ${
        isSidebarOpen ? 'grid-cols-[18rem_1fr]' : 'grid-cols-[0rem_1fr]'
      } h-screen transition-all duration-300`}
    >
      <div className="bg-gray-800 overflow-hidden">
        <SideBar />
      </div>
      <div className='flex flex-col overflow-hidden'>
        <Navbar/>
        <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;