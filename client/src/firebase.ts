import {  FirebaseError, initializeApp } from "firebase/app";
import { getAuth,type AuthProvider, GoogleAuthProvider, GithubAuthProvider, type UserCredential, signInWithRedirect, getRedirectResult } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export type AuthProviderName = 'google' |'github';

export const startRedirectSignIn = async (providerName: AuthProviderName): Promise<void> => {
    let provider: AuthProvider;

    if (providerName === 'google') {
        provider = new GoogleAuthProvider();
    } else {
        provider = new GithubAuthProvider();
    }

    await signInWithRedirect(auth, provider);
};

export const handleRedirectResult = async () => {
  try {
    const result: UserCredential | null = await getRedirectResult(auth);

    if (result) {
      const user = result.user;
      console.log("Signed-in user from redirect:", user);

      if (result.providerId === GoogleAuthProvider.PROVIDER_ID) {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        console.log("Google Access Token:", token);
      } else if (result.providerId === GithubAuthProvider.PROVIDER_ID) {
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        console.log("GitHub Access Token:", token);
      }
    }
    
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`Firebase Error (${errorCode}): ${errorMessage}`);
    } else {
      console.error("An unknown error occurred while getting redirect result:", error);
    }
  }
};



export default app;