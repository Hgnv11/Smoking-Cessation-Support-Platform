import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/home";
import Login from "./pages/auththenPage/login/login";
import Register from "./pages/auththenPage/register/register";
import ForgotPass from "./pages/auththenPage/forgotPass/forgotPass";
import ForgotPassCode from "./pages/auththenPage/forgotPass-code/forgotPass-code";

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
    {
      path: "forgot-password-code",
      element: <ForgotPassCode />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
