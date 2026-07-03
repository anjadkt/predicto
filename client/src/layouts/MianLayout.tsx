import { Outlet } from "react-router";
import Header from "../components/Header";
import NavBar from "../components/NavBar";

function MainLayout() {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <NavBar />
        </>
    )
}

export default MainLayout