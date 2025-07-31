import {onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useEffect, useState ,type ReactNode } from "react";
import { auth } from "../firebase";


interface AuthContextType{
    user:User|null;
    isLoading:boolean;
    
}

const AuthContext = createContext<AuthContextType|undefined> (undefined)
interface AuthProviderProps{
    children:ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

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
};
    return (
        <AuthContext.Provider value  ={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};



export const useAuth = (context:AuthContextType)=>{
if(context ==undefined) return new Error('calling context out of scope')

    return context;
}