import axios from "axios";
import { getAuth } from "firebase/auth";

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

export const deleteCanvasApi = async (_id: string) => {
  const auth = getAuth();
  

  if (auth.currentUser) {
    const idToken = await auth.currentUser.getIdToken();

   const response = await axios.delete(
    `http://localhost:5001/api/canvases/${_id}`,
    {
      headers: { Authorization: `Bearer ${idToken}` }
    }
  );

    return response.data;
  }

 
};


export const getinviteLinkAPi= async(_id:string)=>{
   const auth = getAuth();

   if(auth.currentUser){
    const idToken = await auth.currentUser.getIdToken();

    const response =  await axios.get(

      `http://localhost:5001/api/canvases/${_id}/invite-link`,

      {
       headers: { Authorization: `Bearer ${idToken}` }
      }

    );

    return response.data;
   }
  
}


export const requestAccessApi  =  async(data:{_id:string,inviteToken:string})=>{

  const {_id,inviteToken}=  data;

  const auth = getAuth();


  if (!auth.currentUser) {
    throw new Error("User must be logged in to request access.");
  }

    const idToken = await auth.currentUser.getIdToken();

    const response = await axios.post(
       `http://localhost:5001/api/canvases/${_id}/request-access`,

       {_id,inviteToken},

       {headers:{
         Authorization: `Bearer ${idToken}`
       }}
    )

    return response.data;

}