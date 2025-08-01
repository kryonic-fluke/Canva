import {onAuthStateChanged, signOut, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useState ,type ReactNode } from "react";
import { auth } from "../services/firebase";


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
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
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