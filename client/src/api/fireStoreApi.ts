import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../services/firebase';
import { type Node } from 'reactflow';

export const addNodeToFirestore = async (canvasId: string, newNode: Node) => {
  if (!canvasId) return;
  const docRef = doc(db, 'canvases', canvasId);

  await updateDoc(docRef, {
    nodes: arrayUnion(newNode)
  });
};






export const updateNodesInFirestore = async (canvasId: string, nodes: Node[]) => {
    if (!canvasId) return;
    const docRef = doc(db, 'canvases', canvasId);
    await updateDoc(docRef, {
        nodes: nodes
    });
};