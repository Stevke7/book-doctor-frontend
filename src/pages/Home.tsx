import {NavLink} from "react-router-dom";

const Home = () => {
    return (
        <>
            <header className="flex flex-row w-full px-12  py-4 justify-between bg-cyan-400">
                <p>Book A Doctor</p>
                <NavLink to='/login' className="flex items-center justify-center cursor-pointer hover:bg-gray-200 bg-gray-400 border-2 rounded-sm px-2">
                    Login
                </NavLink>
            </header>
            <h1>FIND THE BEST DOCTOR FOR YOU</h1>
        </>
    )
}

export default Home;