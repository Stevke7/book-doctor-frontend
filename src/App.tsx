import {AuthProvider} from "./context/AuthContext.tsx";
import Login from "./pages/Login.tsx";
import {RouterProvider, createBrowserRouter,} from "react-router-dom";
import Home from "./pages/Home.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Register from "./pages/Register.tsx";
import "./index.css"

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
        path: '/patient/dashboard', element: <Dashboard />
    },
    {
        path: '/doctor/dashboard', element: <Dashboard />
    }

    ]);



  return (
    <AuthProvider >
        <RouterProvider router={router}/>
    </AuthProvider>
  )
}

export default App
