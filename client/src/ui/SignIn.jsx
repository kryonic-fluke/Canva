import { useSignInWithRedirect } from './hooks/useSignInWithRedirect';

const LoginPage = () => {
  const { mutate: signIn, isPending } = useSignInWithRedirect();

  const handleGoogleSignIn = () => {
    signIn('google');
  };

  return (
    <div>
      <button onClick={handleGoogleSignIn} disabled={isPending}>
        {isPending ? 'Redirecting...' : 'Sign in with Google'}
      </button>
    </div>
  );
};