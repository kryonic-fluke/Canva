import { FirebaseError } from "firebase/app"
import { useMutation } from '@tanstack/react-query';
import {startRedirectSignIn} from "../firebase";
import {type AuthProviderName } from "../firebase";
export const useSignInWithRedirect = () => {
    return useMutation<void, FirebaseError, AuthProviderName>({
        mutationFn: startRedirectSignIn,
        onSuccess: () => {
            console.log("Redirecting to provider for sign-in...");
        },
        onError: (error) => {
            console.error("Error starting redirect sign-in:", error.message);
        }
    });
}