import { useMutation } from '@tanstack/react-query';
import { FirebaseError } from 'firebase/app';
import {type  UserCredential, getAdditionalUserInfo } from 'firebase/auth'; 
import { userBackEndSyncData } from '../api/users'; 
import { signInWithProvider, type AuthProviderName } from '../services/firebase';

export const useSocialSignIn = () => {
  return useMutation<UserCredential, FirebaseError, AuthProviderName>({
    mutationFn: signInWithProvider,
    onSuccess: async (result) => {
      const additionalInfo = getAdditionalUserInfo(result);
        
      if (additionalInfo?.isNewUser) {
        console.log("New user detected, syncing with backend...");
        await userBackEndSyncData({
          firebaseUid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
        });
      } else {
        console.log("Returning user detected, no sync needed.");
      }
    },
    onError: (error) => {
        console.error("Error during social sign-in:", error.message);
    }
  });
};