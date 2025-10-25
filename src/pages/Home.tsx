import { NavLink } from "react-router-dom";
import { Button } from "@mui/material";
import logo from "../assets/transparent.png";

const Home = () => {
	return (
		<>
			<header className="flex flex-row w-full px-12  py-6 justify-between ">
				<NavLink to="/">
					<img src={logo} alt="Book doctor logo" className="w-14"></img>
				</NavLink>
				<div className="flex flex-row gap-2">
					<NavLink to="/login">
						<Button variant="contained">Login</Button>
					</NavLink>
					<NavLink to="/register">
						<Button variant="contained">Register</Button>
					</NavLink>
				</div>
			</header>
			<div className="flex flex-col md:px-45 items-center h-svh w-full py-12 ">
				<div className=" w-full flex flex-col bg-hero h-full bg-center bg-no-repeat bg-cover">
					<h1 className="text-5xl font-medium text-center">
						Schedule an appointment <br /> at doctor of your choice
					</h1>
				</div>
			</div>
		</>
	);
};

export default Home;
