import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import ForgotPass from "./pages/forgotPass/forgotPass";

function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Home />,
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "register",
      element: <Register />,
    },
    {
      path: "forgot-password",
      element: <ForgotPass />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
