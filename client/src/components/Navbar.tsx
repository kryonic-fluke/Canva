import { Link } from "react-router-dom"



 export const Navbar = ()=>{
    return (
        <div className="bg-blue-300">
            <Link to='/'>App logo here </Link>
            <Link to='/login' replace={true}>
            
            Login</Link>

            <Link to='/info'>
            
            About </Link>

           
        </div>
    )
}