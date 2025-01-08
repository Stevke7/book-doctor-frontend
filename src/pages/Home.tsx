import {NavLink} from "react-router-dom";
import {Button} from "@mui/material";

const Home = () => {
    return (
        <>
            <header className="flex flex-row w-full px-12  py-6 justify-between ">
                <p className="text-2xl font-bold">Book A Doctor</p>
                <div className='flex flex-row gap-2'>
                    <NavLink to='/login' >
                        <Button variant="contained">Login</Button>
                    </NavLink>
                    <NavLink to='/register' >
                        <Button variant="contained">Register</Button>
                    </NavLink>
                </div>

            </header>
            <div className='flex flex-col md:px-45 items-center bg-hero h-svh w-full py-12'>
                <div className=' w-full flex flex-col'>
                    <h1 className='text-5xl font-medium text-center'>Schedule an appointment <br/> at doctor of your
                        choice</h1>
                </div>

            </div>

        </>
    )
}

export default Home;