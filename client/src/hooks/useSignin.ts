import { useMutation } from "@tanstack/react-query";
import { FirebaseError } from "firebase/app";
import { userBackEndSyncData } from "../api/users";
import {
  signInWithProvider,
  type AuthProviderName,
} from "../services/firebase";
import { getAdditionalUserInfo, type UserCredential } from "firebase/auth";

interface UseSocialSignInOptions {
  onSuccess?: (data: UserCredential) => void;
  onError?: (error: FirebaseError) => void;
}

export const useSocialSignIn = (options?: UseSocialSignInOptions) => {
  return useMutation<UserCredential, FirebaseError, AuthProviderName>({
    mutationFn: signInWithProvider,

    onSuccess: async (result) => {
      console.log("signIn in provider is successfull");

      const additionalInfo = getAdditionalUserInfo(result);
      //after successful sign in we add the user to firestore database
      if (additionalInfo) {
        console.log("New user detected , syncing with our backend");
        await userBackEndSyncData({
          firebaseUid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
        });
      } else {
        console.log("old user deteced");
      }

      options?.onSuccess?.(result);
    },
    onError: (error) => {
      console.error("Mutation failed in userSocialSignIn hook:", error);
      options?.onError?.(error);
    },
  });
};
