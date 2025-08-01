import { Outlet } from 'react-router-dom';
import { PublicNavbar } from '../components/PublicNavbar'; // Adjust path if needed

export const PublicLayout = () => {
  return (
    <div>
      <PublicNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};