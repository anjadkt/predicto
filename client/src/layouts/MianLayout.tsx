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
            <main>
                <Outlet />
            </main>
            <NavBar navlinks={data.navlinks} />
        </>
    )
}

export default MainLayout