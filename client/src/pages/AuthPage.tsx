import { useSocialSignIn } from '../hooks/useSignin'; 
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';



export const AuthPage = () => {
    const { mutate: performSignIn, isPending, error } = useSocialSignIn();
    
    const { user:currentUser, isLoading } = useAuth();

    const handleSignIn = (provider: 'google' | 'github') => {
        performSignIn(provider);
    };

    if (isLoading) {
        return <div>Loading session...</div>;
    }

    if (currentUser) {
        return <Navigate to="/app" replace />;
    }
    
    const errorMessage = (error as FirebaseError)?.code === 'auth/popup-closed-by-user' 
        ? 'Sign-in cancelled.' 
        : error?.message;

   return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white shadow-md rounded-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
                    <p className="mt-2 text-sm text-gray-600">to continue to Creative Canvas</p>
                </div>
                
                <div className="space-y-4">
                    {/* Google Button */}
                    <button
                        onClick={() => handleSignIn('google')}
                        disabled={isPending}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                                             <p>google</p>

                        {isPending ? 'Signing In...' : 'Sign In with Google'}
                    </button>
                    
                    {/* GitHub Button */}
                    <button
                        onClick={() => handleSignIn('github')}
                        disabled={isPending}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-800 rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50"
                    >
                      <p>github</p>
                        {isPending ? 'Signing In...' : 'Sign In with GitHub'}
                    </button>
                </div>

                {error && (<div className="text-center text-sm text-red-500"><p>{errorMessage}</p></div>)}
            </div>
        </div>
    );
};
