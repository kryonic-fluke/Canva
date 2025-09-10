import { Link } from 'react-router-dom';

export const AboutPage = () => {
  return (
    <div 
      className="relative flex items-center justify-center h-full bg-cover bg-center"
      style={{ backgroundImage: "url('/img/hero.jpeg')" }} 
    >
      <div className="absolute inset-0 bg-gray-900 bg-opacity-70" />

      <div className="relative z-10 text-center text-white px-4">
        
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
          Tired of Scattered Ideas?
        </h1>
        
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-300">
          Synapse is your real-time visual workspace, designed to transform the chaos of creativity into clear, actionable plans. Map your thoughts, connect the dots, and collaborate with your team instantly.
        </p>
        
        <p className="mt-4 max-w-2xl mx-auto text-md text-cyan-300 font-semibold">
          Supercharged with an AI Intelligence Suite to automatically categorize ideas and provide deep project insights.
        </p>

        <div className="mt-8">
          <Link
            to="/app" 
            className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            Go to Your Workspace
          </Link>
        </div>

      </div>
    </div>
  );
};