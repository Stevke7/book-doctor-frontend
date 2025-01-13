import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { LogoutOutlined } from "@mui/icons-material";

const Logout = () => {
	const navigate = useNavigate();
	const { logout } = useAuth();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<div
			className="flex flex-row gap-2 p-3 items-center cursor-pointer hover:bg-teal-200 rounded-md"
			onClick={handleLogout}
		>
			<LogoutOutlined width={40} height={44} />
			<p className="text-sm font-medium font-black">Logout</p>
		</div>
	);
};

export default Logout;
