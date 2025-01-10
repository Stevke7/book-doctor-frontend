import {AuthProvider} from "./context/AuthContext.tsx";
import Login from "./pages/Login.tsx";
import {RouterProvider, createBrowserRouter,} from "react-router-dom";
import Home from "./pages/Home.tsx";
import DoctorDashboard from "./pages/DoctorDashboard.tsx";
import Register from "./pages/Register.tsx";
import "./index.css"
import MakeAnAppointment from "./pages/PatientDashboard.tsx";

function App() {
const router = createBrowserRouter([
    {
        path: '/', element: <Home />
    },
    {
        path: '/login', element: <Login />,
    },
    {
        path: '/register', element: <Register />,

    },
    {
        path: '/patient/dashboard', element: <MakeAnAppointment />
    },
    {
        path: '/doctor/dashboard', element: <DoctorDashboard />
    }

    ]);



  return (
    <AuthProvider >
        <RouterProvider router={router}/>
    </AuthProvider>
  )
}

export default App
