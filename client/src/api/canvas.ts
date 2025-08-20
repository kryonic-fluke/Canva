import axios from "axios";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import type { Connection, Edge, Node } from "reactflow";
import { use, useId } from "react";

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
        headers: { Authorization: `Bearer ${idToken}` },
      }
    );

    return response.data;
  }
};

export const getinviteLinkAPi = async (_id: string) => {
  const auth = getAuth();
  console.log("ran invitelink api");

  if (auth.currentUser) {
    const idToken = await auth.currentUser.getIdToken();

    const response = await axios.get(
      `http://localhost:5001/api/canvases/${_id}/invite-link`,

      {
        headers: { Authorization: `Bearer ${idToken}` },
      }
    );


    return response.data;
  }
};

export const requestAccessApi = async (data: {
  _id: string;
  inviteToken: string;
}) => {
  const { _id, inviteToken } = data;

  const auth = getAuth();

  if (!auth.currentUser) {
    throw new Error("User must be logged in to request access.");
  }

  const idToken = await auth.currentUser.getIdToken();

  const response = await axios.post(
    `http://localhost:5001/api/canvases/${_id}/request-access`,

    { inviteToken },

    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );

  return response.data;
};

export const approveRequestApi = async (data: {
  canvasId: string;
  userIdToApprove: string;
}) => {
  const { canvasId, userIdToApprove } = data;

  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("You must be logged in to approve requests.");
  }
  const idToken = await currentUser.getIdToken();

  const response = await axios.post(
    `http://localhost:5001/api/canvases/${canvasId}/approve-request`,
    { userIdToApprove },
    {
      headers: { Authorization: `Bearer ${idToken}` },
    }
  );
  return response.data;
};

export const declineRequest = async (data: {
  canvasId: string;
  userIdToDecline: string;
}) => {
  const { canvasId, userIdToDecline } = data;
  const auth = getAuth();

  if (!auth.currentUser) throw new Error("You must be logged in");

  const idToken = await auth.currentUser.getIdToken();

  const response = await axios.post(
    `http://localhost:5001/api/canvases/${canvasId}/decline-request`,
    { userIdToDecline },
    { headers: { Authorization: `Bearer ${idToken}` } }
  );
  return response.data;
};

export interface PendingRequest {
  id: string;
  userName: string;
  userEmail: string;
}

export const listenForPendingRequests = (
  canvasId: string,
  callback: (requests: PendingRequest[]) => void
) => {
  const requestsCollectionRef = collection(
    db,
    "canvases",
    canvasId,
    "pendingRequests"
  );

  const unsubscribe = onSnapshot(requestsCollectionRef, (querySnapshot) => {
    const pendingRequests: PendingRequest[] = [];
    querySnapshot.forEach((doc) => {
      if (doc.id !== "_init") {
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

export const listenForNodes = (
  _id: string,
  callback: (node: Node[]) => void
) => {
  const nodeCollectionRef = collection(db, "canvases", _id, "nodes");
  const unsubscribe = onSnapshot(nodeCollectionRef, (snapshot) => {
    const nodes: Node[] = [];
    snapshot.forEach((doc) => {
      if (doc.id === "_init") return;
      nodes.push({ id: doc.id, ...doc.data() } as Node);
    });
    callback(nodes);
  });

  return unsubscribe;
};

export const listenForEdges = (
  _id: string,
  callback: (edges: Edge[]) => void
) => {
  const edgeCollectionRef = collection(db, "canvases", _id, "edges");

  const unsubscribe = onSnapshot(edgeCollectionRef, (snapshot) => {
    const edges: Edge[] = [];
    snapshot.forEach((doc) => {
      if (doc.id === "_init") return;
      edges.push({ id: doc.id, ...doc.data() } as Edge);
    });

    callback(edges);
  });

  return unsubscribe;
};

export interface NodeData {
  label: string;
}


type NewNodeData = Partial<Node> & { id: string };

export const createNode = async (
  canvasId: string,
  newData: NewNodeData
) => {
  //using node id get the node doc and then if exists update the changes or if not create a new doc

  if (!canvasId)
    throw new Error("Canvas ID must be provided to create a node.");
console.log("new Data",newData);


  try {
    const nodeDocRef = doc(db, "canvases", canvasId, "nodes", newData.id);
    await setDoc(nodeDocRef, newData);
    console.log("Successfully created new node with ID:", newData.id);

    return nodeDocRef;
  } catch (error) {
    console.log("Error creating node:", error);
    throw Error;
  }
};

export const updateNodes = async (
  canvasId: string,
  nodeId: string,
  dataToUpadte: Partial<Node>
) => {
  if (!canvasId || !nodeId) {
    throw new Error("canvas ID and Node ID must be provided for an update");
  }

  const nodeDocRef = doc(db, "canvases", canvasId, "nodes", nodeId);

  try {
    await updateDoc(nodeDocRef, dataToUpadte);
  } catch (error) {
    console.error("Error updating node:", nodeId, error);
    throw error;
  }
};

export const createEdge = async (canvasId: string, connection: Connection) => {
  if (!canvasId || !connection.source || !connection.target) {
    throw new Error("Missing data for edge coreation");
  }

  const edgesCollectionRef = collection(db, "canvases", canvasId, "edges");

  const newEdgeData = {
    source: connection.source,
    target: connection.target,
  };

  await addDoc(edgesCollectionRef, newEdgeData);
};

export const deleteNode = async (canvasId: string, nodeId: string) => {
  if (!canvasId || !nodeId) throw new Error("Missing IDs for node deletion");
  const nodeDocRef = doc(db, "canvases", canvasId, "nodes", nodeId);
  await deleteDoc(nodeDocRef);
};

export const deleteEdge = async (canvasId: string, edgeId: string) => {
  if (!canvasId || !edgeId) throw new Error("Missing IDs for edge deletion");
  const edgeDocRef = doc(db, "canvases", canvasId, "edges", edgeId);
  await deleteDoc(edgeDocRef);
};



export const setEditingPresence=async(canvasId:string, userId:string, nodeId: string)=>{
 if (!canvasId || !userId || !nodeId) throw new Error("Mising Ids for node or user or Canvas")

    const presenceDocRef =doc(db,"canvases",canvasId,'presence',userId)
//got the 
    await setDoc(presenceDocRef,{editingNodeId:nodeId});


}


export const clearEditingPresence=async(canvasId:string ,userId:string)=>{
 if (!canvasId || !userId) {

        throw new Error("Missing canvasId or userId for clearing presence");
    }  
    
    const signalDoc= doc(db,'canvases',canvasId,'presence',userId);
console.log(`API: Clearing presence for user ${userId} in canvas ${canvasId}`);
  await deleteDoc(signalDoc);
}




