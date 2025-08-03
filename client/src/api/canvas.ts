import axios from "axios";
import { getAuth } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { auth } from "../services/firebase";

interface NewCanvasData {
  name: string;
}
export const createCanvasRequestAPI = async (canvasData: NewCanvasData) => {
  try {
    const auth = getAuth();

    if (auth.currentUser) {
      const idToken = await auth.currentUser.getIdToken();
      const response = await axios.post(
        "http://localhost:5001/api/canvases",
        canvasData,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      console.log("Successfully created canvas", response.data);
      return response.data;
    } else {
      console.error("No user is signed in.");

      throw new Error("No user signed in.");
    }
  } catch (error) {
    console.error("Error while created canvas:", error);
    throw error;
  }
};

export const getCanvasesApi = async () => {
  const auth = getAuth();

  if (auth.currentUser) {
    const idToken = await auth.currentUser.getIdToken();
    const config = { headers: { Authorization: `Bearer ${idToken}` } };

    const response = await axios.get(
      "http://localhost:5001/api/canvases",

      config
    );
    return response.data;
  }
};
