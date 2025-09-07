import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/AppNavBar';
import { SideBar } from '../components/Sidebar';
import { useLayout } from '../context/LayoutContext';




export const PublicLayout = () => {
const {isSidebarOpen,isAuthPage }= useLayout();



  return (
      <div
         className={`grid ${
           isSidebarOpen &&!isAuthPage ? 'grid-cols-[18rem_1fr]' : 'grid-cols-[0rem_1fr]'
         } h-screen transition-all duration-300`}
       >
         <div className="bg-red-400 overflow-hidden">
         <SideBar/>
         </div>
         <div className='flex flex-col'>
           <Navbar/>
           <main className="flex-1 ">
             <Outlet />
           </main>
         </div>
       </div>
  );
};