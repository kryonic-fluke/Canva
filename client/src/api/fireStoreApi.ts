// api/fireStoreApi.ts
import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../services/firebase';
import { type Node, type Edge } from 'reactflow'; 

interface CanvasData {
    nodes: Node[];
    edges: Edge[];
}

export const syncCanvasToFirestore = async (canvasId: string, dataToSync: Partial<CanvasData>) => {
    if (!canvasId) {
        console.error("Canvas ID is missing, cannot sync.");
        return;
    }
    const docRef = doc(db, "canvases", canvasId);

    try {
        await setDoc(docRef, dataToSync, { merge: true });
        console.log("Successfully synced to Firestore");
    } catch (error) {
        console.error("Error syncing to Firestore:", error);
        throw error;
    }
};

export const addNodeToFirestore = async (canvasId: string, newNode: Node) => {
    if (!canvasId) return;
    const docRef = doc(db, "canvases", canvasId);

    try {
        await updateDoc(docRef, {
            nodes: arrayUnion(newNode),
        });
    } catch (error) {
        console.error("Error adding node to Firestore:", error);
        throw error;
    }
};