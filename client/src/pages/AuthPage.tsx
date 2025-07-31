import { useState } from "react";


export const AuthPage=()=>{
    const [isLoginView,setIsLoginView] = useState(true);

    return (
        <div>
            <div>
                {isLoginView? <Login/> : <Signup/>}
            </div>
        </div>
    )
}