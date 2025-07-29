import type { FirebaseError } from "firebase/app";
import type { UserCredential } from "firebase/auth";
import type { SignupFormValues } from "../lib/schemas";
import { signUpWithEmail } from "../firebase";
import { useMutation } from '@tanstack/react-query';


export const useSignUp  = ()=>{
    return useMutation<UserCredential,FirebaseError,SignupFormValues>({

        mutationFn:signUpWithEmail,
        onSuccess:(data)=>{
            console.log("sign up successfull",data)
        },
         onError: (error) => {
            console.error("Sign up failed:", error.message);
        }
    })
}