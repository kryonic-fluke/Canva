import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    GithubAuthProvider,
    type UserCredential,
    type AuthProvider
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export type AuthProviderName = 'google' | 'github';


export const signInWithProvider = async (providerName: AuthProviderName): Promise<UserCredential> => {
    let provider: AuthProvider;

    if (providerName === 'google') {
        provider = new GoogleAuthProvider();
    } else if (providerName === 'github') {
        provider = new GithubAuthProvider();
    } else {
        throw new Error("Unsupported provider specified.");
    }

    try {
        const result = await signInWithPopup(auth, provider);
        console.log(`Successfully signed in with ${providerName}:`, result.user.displayName);
        return result;
    } catch (error) {
        console.error(`Error during ${providerName} sign-in:`, error);
        throw error;
    }
};


export const db = getFirestore(app);

