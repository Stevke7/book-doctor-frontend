import {Button} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext.tsx";

const Logout = () => {
    const navigate = useNavigate();
    const {logout} = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
            <header className="flex flex-row w-full px-12 justify-end py-6">
                <Button variant="contained" onClick={handleLogout}>
                    Logout
                </Button>
            </header>
        </>

    );
}

export default Logout;