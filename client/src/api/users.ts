import axios from 'axios';

interface UserSyncDataBackEnd {
  firebaseUid: string;
  email: string | null;
  displayName: string | null;
}

export const userBackEndSyncDaata = async (userData: UserSyncDataBackEnd) => {
  try {
    const response = await axios.post('http://localhost:5001/api/users', userData);
    console.log('Backend sync successful:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error syncing user with backend:", error);
    throw error;
  }
};