// src/hooks/usePresence.ts

import { useState, useEffect } from 'react';
import { collection, onSnapshot,  } from 'firebase/firestore';
import { db } from '../services/firebase';

export const usePresence = (canvasId: string | undefined) => {
    
    const [activeNodeIds, setActiveNodeIds] = useState<Map<string, string>>(new Map());

    useEffect(() => {
        if (!canvasId) {
            return;
        }

        const presenceCollectionRef =collection(db, "canvases", canvasId, "presence");
        const unsubscribe = onSnapshot(presenceCollectionRef, (querySnapshot) => {
           const newPresenceMap = new Map<string, string>();
            // console.log(`LISTENER FIRED: Found ${querySnapshot.size} presence documents.`);
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const editorId = doc.id;
                  const nodeId = data.editingNodeId;
                if (nodeId && editorId) {
                     newPresenceMap.set(nodeId, editorId);
                }
            });

            setActiveNodeIds(newPresenceMap);
        });

        return () => unsubscribe();

    }, [canvasId]); 

    return activeNodeIds;
};