import { Link } from 'react-router-dom';
import { useLayout } from '../context/LayoutContext';

export const HomePage = () => {

const {isSidebarOpen}  = useLayout();

  return (
    <div className="relative h-full w-full">
        <img/>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/img/hero-background.jpg')" }}
      ></div>

      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight shadow-lg">
          Bring Your Ideas to Life, Together.
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8 text-gray-200">
          Your collaborative canvas for real-time project planning. Start with an
          empty canvas and watch your vision unfold.
        </p>

      {!isSidebarOpen?  <Link 
          to="/login"
          className="px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300 shadow-xl"
         
        >
          Get Started for Free
        </Link>:""}
      </div>
    </div>
  );
};