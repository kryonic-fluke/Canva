// src/pages/NotFoundPage.tsx
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-100 text-gray-800 p-8">
      <h1 className="text-6xl font-extrabold text-blue-600 mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-lg mb-6 max-w-md">
        The page you're looking for doesn't seem to exist. It might have been moved or deleted.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md transition duration-300 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Go to Home
      </Link>
    </div>
  );
};