import axios from "axios";
import { getAuth } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import type { Edge, Node } from "reactflow";

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
console.log("ran invitelink api");

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

       {inviteToken},

       {headers:{
         Authorization: `Bearer ${idToken}`
       }}
    )

    return response.data;

}



export const approveRequestApi = async (data: { canvasId: string, userIdToApprove: string }) => {
    const { canvasId, userIdToApprove } = data;

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error('You must be logged in to approve requests.');
    }
    const idToken = await currentUser.getIdToken();

    const response = await axios.post(
      `http://localhost:5001/api/canvases/${canvasId}/approve-request`, 
      { userIdToApprove }, 
      {
        headers: { Authorization: `Bearer ${idToken}` }
      }
    );
    return response.data;
};


export const declineRequest = async(data:{canvasId:string,userIdToDecline:string})=>{

  const {canvasId,userIdToDecline}= data;
  const auth = getAuth();

  if(!auth.currentUser) throw new Error('You must be logged in');


    const idToken = await auth.currentUser.getIdToken();

     const response = await axios.post(
        `http://localhost:5001/api/canvases/${canvasId}/decline-request`,
        { userIdToDecline },
        { headers: { Authorization: `Bearer ${idToken}` } }
    );
    return response.data;


}


export interface PendingRequest {
  id: string;
  userName: string;
  userEmail: string;
}

export const listenForPendingRequests = (
  canvasId: string, 
  callback: (requests: PendingRequest[]) => void
) => {
  const requestsCollectionRef = collection(db, 'canvases', canvasId, 'pendingRequests');

  const unsubscribe = onSnapshot(requestsCollectionRef, (querySnapshot) => {
    const pendingRequests: PendingRequest[] = [];
    querySnapshot.forEach((doc) => {
      if (doc.id !== '_init') {
        pendingRequests.push({
          id: doc.id,
          ...doc.data(),
        } as PendingRequest);
      }
    });
    callback(pendingRequests);
  });

  return unsubscribe;
};


export const listenForNodes=(_id:string,callback:(node:Node[])=>void)=>{
  const nodeCollectionRef =collection(db,"canvases",_id,"nodes");  
  const unsubscribe = onSnapshot(nodeCollectionRef, (snapshot) => {
    const nodes: Node[] = [];
    snapshot.forEach((doc) => {
      if (doc.id === '_init') return; 
      nodes.push({ id: doc.id, ...doc.data() } as Node);
    });
    callback(nodes);
  });

  return unsubscribe;
};


export const listenForEdges =(
  _id:string,
  callback:(edges:Edge[])=>void
)=>{

  const edgeCollectionRef=collection(db,'canvases',_id,
    'edges'
  )

  const unsubscribe=onSnapshot(edgeCollectionRef,(snapshot)=>{
    const edges: Edge[] = [];
    snapshot.forEach((doc)=>{
      if(doc.id==='_init')return;
      edges.push({id:doc.id,...doc.data()} as Edge);
    })

  callback(edges)

  })

return unsubscribe;
}
