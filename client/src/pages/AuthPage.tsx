// src/pages/AuthPage.tsx

import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { app } from '../services/firebase';
import { useSocialSignIn } from '../hooks/useSignin';

export const AuthPage = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);

   const redirect=()=>{
                const postLoginRedirect  = localStorage.getItem('postLoginRedirect');
                if(postLoginRedirect){
                  localStorage.removeItem('postLoginRedirect');
                  navigate(postLoginRedirect,{replace:true})
                }
                else{
                  navigate('/app',{replace:true})
                }
          }
const handleGoogleSignIn = () => {
  
        performSignIn('google'
        );
    };


const {mutate:performSignIn,isPending:isSigningIn} =useSocialSignIn({onSuccess:()=>redirect()});



  

    const handleGitHubSignIn = () => {
        performSignIn('github'
        );
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