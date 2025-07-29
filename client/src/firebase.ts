import { FirebaseError, initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, type UserCredential } from "firebase/auth";
import type { SignupFormValues } from "./lib/schemas";
// import { getFirestore } from "firebase/firestore";

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



export const signUpWithEmail=async({email,password}:SignupFormValues): Promise<UserCredential
>=>{
try{
  const UserCredential = await createUserWithEmailAndPassword(auth,email,password);
  return UserCredential;

}
catch(error){
  throw error as FirebaseError;
}
}
// export const db = getFirestore(app);
export default app;