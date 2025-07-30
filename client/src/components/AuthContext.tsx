

import { onAuthStateChanged, type User, getRedirectResult, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { auth } from "../firebase"; 

interface AuthContextType {
user: User | null;                        //following question present for learning sessions 
isLoading: boolean;                           // what is the argument creatcontext needs,like its generic syntax , and why we are passing undefined ,                                                          
}
interface AuthProviderProps {
children: ReactNode;
}
const AuthContext  = createContext<AuthContextType |undefined>(undefined);
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);                                           
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkRedirect = async () => {                                                  //this is my understanding of useeffect working and knowledge gap aswell as misunderstanding 
                                                                                            //it loads when function is mounted and check for the redirect return result 
                                                                                            // we do nothing with the result 
                                                                                            //we can but

            try {
                const result = await getRedirectResult(auth);
               
            } catch (error) {
                console.error("Error processing redirect result", error);
            }
         
            const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
                setUser(currentUser);      //never understood this unsubscribe portion like never , is it subscribing from my youtube chanell 
                setIsLoading(false); 
            });

            return unsubscribe;
        };

        let unsubscribe: (() => void) | undefined;    // then whats this 
        checkRedirect().then(unsub => {
            unsubscribe = unsub;
        });

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }     //never understood this call back
        }; 
    }, []); 
//  from this potion onwards i understand 
    const value: AuthContextType = {             
        user,
        isLoading
    };

    return (
       <AuthContext.Provider value={value}>
         {!isLoading && children} 
       </AuthContext.Provider>
    );
};

