import { FirebaseError } from "firebase/app"
import { useMutation } from '@tanstack/react-query';
import {type AuthProviderName } from "../firebase";
import { signInWithProvider } from "../firebase";
import type { UserCredential } from "firebase/auth";

export const useSignInWithRedirect = () => {
    return useMutation<UserCredential, FirebaseError, AuthProviderName>({
        mutationFn: signInWithProvider,
        onSuccess: () => {
            console.log("Redirecting to provider for sign-in...");
        },
        onError: (error) => {
            console.error("Error starting redirect sign-in:", error.message);
        }
    });
}