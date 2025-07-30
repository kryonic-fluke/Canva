import { useState } from "react";
import Signup from "./singUp";
import SignIn from './SignIn'

const AuthPage=()=>{
    const [isLoginView,setIsLoginView] = useState(true);

    return (
        <div>
            <div>
                {isLoginView? <SignIn/> : <Signup/>}
            </div>
        </div>
    )
}