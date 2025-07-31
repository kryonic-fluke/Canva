import { FirebaseError } from "firebase/app"
import { useMutation } from '@tanstack/react-query';
import {type AuthProviderName } from "../services/firebase";
import { signInWithProvider } from "../services/firebase";
import type { UserCredential } from "firebase/auth";


export const useSocialSignIn = () => {
    return useMutation<UserCredential, FirebaseError, AuthProviderName>({
        mutationFn: signInWithProvider,
        
        onSuccess: (data) => {
            console.log(`Successfully signed in with ${data.providerId}:`, data.user.displayName);
        },
        onError: (error) => {
            console.error("Error during social sign-in:", error.message);
        }
    });
};