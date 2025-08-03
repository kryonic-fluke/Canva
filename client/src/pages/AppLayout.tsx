import { Outlet } from "react-router-dom";
import { Navbar } from "../components/AppNavBar";
import { SideBar } from "../components/SideBAr";

export const AppLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
