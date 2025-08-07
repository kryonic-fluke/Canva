// src/pages/AuthPage.tsx

import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { app } from '../services/firebase';

export const AuthPage = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleSignIn = async (provider: GoogleAuthProvider | GithubAuthProvider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      
      console.log("User successfully signed in:", result.user);

    //get the url stored in local storage
      const postLoginRedirect = localStorage.getItem('postLoginRedirect');

      if (postLoginRedirect) {
        console.log(`Redirecting to stored destination: ${postLoginRedirect}`);
       
        localStorage.removeItem('postLoginRedirect');            //navigate to stored url, user came through invite link
        navigate(postLoginRedirect, { replace: true });
      } else {
        console.log("Redirecting to default dashboard.");
        navigate('/app', { replace: true });        //usual login , give acess to the app
      }

    } catch (error) {
      console.error("Authentication failed:", error);
      // Handle login errors here (e.g., show a message to the user)      
    }
  };

  const handleGoogleSignIn = () => {
    handleSignIn(new GoogleAuthProvider());
  };

  const handleGitHubSignIn = () => {
    handleSignIn(new GithubAuthProvider());
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="p-10 bg-gray-800 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Login to Creative Canvas</h1>
        <div className="flex flex-col gap-4">
          <button onClick={handleGoogleSignIn} className="p-3 bg-red-600 text-white rounded font-semibold hover:bg-red-500">
            Sign in with Google
          </button>
          <button onClick={handleGitHubSignIn} className="p-3 bg-gray-600 text-white rounded font-semibold hover:bg-gray-500">
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  );
};