import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    GithubAuthProvider,
    type UserCredential,
    type AuthProvider,
    type Auth
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export type AuthProviderName = 'google' | 'github';


export const signInWithProvider = async (providerName: AuthProviderName): Promise<UserCredential> => {

   let provider:AuthProvider;

   if(providerName=="github"){
    provider = new GithubAuthProvider();

   }
   else if(providerName =="google"){
    provider = new GoogleAuthProvider();

   }

   try{
  const result   =await signInWithPopup(auth,provider);
  console.log(`Successfull signin with ${result.user.displayName}`);
  return result;
   }
   catch(error){
    console.log(`Error during ${providerName} sign-In`,error);
    
   }
};


export const db = getFirestore(app);

