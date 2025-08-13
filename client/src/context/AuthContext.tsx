import {onAuthStateChanged, signOut, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useState ,type ReactNode } from "react";
import { auth } from "../services/firebase";
import { userBackEndSyncData } from "../api/users";
import type { UserSyncDataBackEnd } from "../types";


interface AuthContextType{
    user:User|null;
    isLoading:boolean;
    logout:()=>void;
    
}

const AuthContext = createContext<AuthContextType|undefined> (undefined)
interface AuthProviderProps{
    children:ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const logout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully.');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
   useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);

                try {
                    const userDataToSync: UserSyncDataBackEnd = {
                        firebaseUid: user.uid, 
                        email: user.email || '',
                        displayName: user.displayName || 'New User',
                    };
                    
                    console.log("AuthProvider: Syncing user to backend...", userDataToSync);
                    await userBackEndSyncData(userDataToSync);
                    console.log("AuthProvider: User sync successful.");

                } catch (error) {
                    console.error("AuthProvider: Failed to sync user on auth state change.", error);
                }
                // --- END OF NEW LOGIC ---
                
            } else {
                // User is signed out
                setCurrentUser(null);
            }
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

const value = {
    user: currentUser, 
    isLoading,
    logout
};
    return (
        <AuthContext.Provider value  ={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};




export const useAuth = ():AuthContextType=>{
    const context = useContext(AuthContext);
 if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}