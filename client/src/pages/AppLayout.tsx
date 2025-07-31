import { Outlet } from "react-router-dom"
import { Navbar } from "../components/Navbar"
import { Sidebar } from "../components/SideBAr"



export const AppLayout=()=>{
    return(
        <div>
            <Sidebar/>
            <div>
                <Navbar/>
            </div>

         <main className="">
          <Outlet />
        </main>
        </div>
    )
}