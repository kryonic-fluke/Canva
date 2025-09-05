import axios from 'axios';
import { getAuth } from 'firebase/auth';
import type { UserSyncDataBackEnd } from '../types';


const apiBaseUrl = import.meta.env.VITE_API_URL;
export const userBackEndSyncData = async (userData: UserSyncDataBackEnd) => {
  try {
    const auth = getAuth();
    
    if (auth.currentUser) {
      const idToken = await auth.currentUser.getIdToken(); 

      const response = await axios.post(
        `${apiBaseUrl}/api/users`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      console.log('Backend sync successful:', response.data);
      return response.data;
    } else {
      console.error("No user is signed in.");
      throw new Error("No user signed in."); 
    }
  } catch (error) {
    console.error("Error syncing user with backend:", error);
    throw error;
  }
};