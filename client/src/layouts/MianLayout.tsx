import { Outlet } from "react-router";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import { useAuth } from "../hooks/UseAuth";
import { MAIN_LAYOUT_DATA } from "../config/site.config";

function MainLayout() {

    const {user} = useAuth()

    const data = MAIN_LAYOUT_DATA[user?.role || "predictor"]

    return (
        <>
            <Header title={data.heading}  />
            <main className="bg-slate-950 relative">

                {user?.role !== "creator" && (<>
                    <div className="fixed -top-32 -left-32 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-pulse"></div>
                    <div className="fixed -bottom-32 -right-32 w-96 h-96 bg-cyan-600 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
                </>)}

                <Outlet />
            </main>
            <NavBar navlinks={data.navlinks} />
        </>
    )
}

export default MainLayout