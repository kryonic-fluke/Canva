import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import {  getAuth,  signInWithPopup,  GoogleAuthProvider,  GithubAuthProvider,  type UserCredential,  type AuthProvider,} from "firebase/auth";
import { getStorage } from "firebase/storage";
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
export const storage = getStorage(app);
export type AuthProviderName = "google" | "github";

export const signInWithProvider = async (
  providerName: AuthProviderName |undefined
): Promise<UserCredential> => {
  let provider: AuthProvider | null = null;

  if (providerName == "github") {
    provider = new GithubAuthProvider();
  } else if (providerName == "google") {
    provider = new GoogleAuthProvider();

  }

   if (!provider) {
       const err = new Error("Invalid provider name passed to signInWithProvider.");
       console.error(err);
       throw err; 
   }

  try {
    const result = await signInWithPopup(auth, provider);
    // console.log(`Successfull signin with ${result.user.displayName}`);
    return result;
  }catch (error) {
     console.error(`Error during ${providerName} sign-In`, error);
     throw error; 
   }
};


export const firebaseSignOut = async () => {
   const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account", 
  });

  try {
    await auth.signOut();
  } catch (error) {
    console.error("Failed to log out:", error);
    throw new Error("Failed to log out");
  }
};



export const firebaseSwitchAccount = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account", 
  });
//to get the account selection card 
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Firebase account switch failed:", error);
    throw new Error("Failed to switch accounts.");
  }
};

export const db = getFirestore(app);
