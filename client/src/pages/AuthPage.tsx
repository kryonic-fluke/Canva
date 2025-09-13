import { useNavigate } from "react-router-dom";
import { useSocialSignIn } from "../hooks/useSignin";
import { Spinner } from "../components/Spinner";

export const AuthPage = () => {
  const navigate = useNavigate();
  const { mutate: performSignIn, isPending: isSigningIn } = useSocialSignIn({
    onSuccess: redirect,
  });

  function redirect() {
    const postLoginRedirect = localStorage.getItem("postLoginRedirect");
    if (postLoginRedirect) {
      localStorage.removeItem("postLoginRedirect");
      navigate(postLoginRedirect, { replace: true });
    } else {
      navigate("/app", { replace: true });
    }
  }

  const handleGoogleSignIn = () => {
    performSignIn("google");
  };

  const handleGitHubSignIn = () => {
    performSignIn("github");
  };

  return (
    <div 
      className="flex items-center justify-center h-[100%] w-screen bg-cover bg-center" 
      // style={{ backgroundImage: "url('/img/auth-background.jpg')" }} 
    >
      {/* <div className="absolute inset-0 bg-gray-900 bg-opacity-60" /> */}

      <div className="relative w-full max-w-md p-8 space-y-8 bg-gray-800 bg-opacity-80 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl">
        
        <div className="text-center">
          <img src="/img/image.png" alt="Synapse Logo" className="w-20 h-[4rem] mx-auto mb-4"/>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Sign in to Synapse
          </h1>
          <p className="mt-2 text-gray-400">
            Your real-time canvas for creativity.
          </p>
        </div>

        <div className="min-h-[120px] flex items-center justify-center">
          {isSigningIn ? (
            <Spinner text="Signing In..." size="md" variant="light" />
          ) : (
            <div className="w-full space-y-4">
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-800 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition-colors duration-200"
              >
                <img src="/img/google.png" alt="Google icon" className="w-6 h-6" />
                <span>Sign in with Google</span>
              </button>
              
              <button
                onClick={handleGitHubSignIn}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-700 text-white rounded-lg font-semibold shadow-md hover:bg-slate-900 transition-colors duration-200"
              >
                <img src="/img/github.png" alt="GitHub icon" className="w-6 h-6 bg-white rounded-2xl    border-white border-2" />
               
                <span>Sign in with GitHub</span>
              </button>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};