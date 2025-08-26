

import { Outlet } from 'react-router-dom';
import { SideBar } from '../components/Sidebar';
import { Navbar } from '../components/AppNavBar';
import { useLayout } from '../context/LayoutContext';

export function AppLayout() {
const {isSidebarOpen}  = useLayout();
  return (
    <div
      className={`grid ${
        isSidebarOpen ? 'grid-cols-[18rem_1fr]' : 'grid-cols-[0rem_1fr]'
      } h-screen transition-all duration-300`}
    >
      <div className="bg-red-400 overflow-hidden">
        <SideBar/>
      </div>
      <div className='flex flex-col'>
        <Navbar/>
        <main className="flex-1 p-6 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;