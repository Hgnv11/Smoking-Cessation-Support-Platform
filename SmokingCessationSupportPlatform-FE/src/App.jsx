import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/home";
import Login from "./pages/auththenPage/login/login";
import Register from "./pages/auththenPage/register/register";
import ForgotPass from "./pages/auththenPage/forgotPass/forgotPass";
import ForgotPassCode from "./pages/auththenPage/forgotPass-code/forgotPass-code";
import MakePlan from "./pages/quitPlan/makePlan";
import Community from "./pages/community/community";
import UserCoach from "./pages/userCoach/userCoach";
import Layout from "./components/layout/layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "forgot-password", element: <ForgotPass /> },
        { path: "forgot-password-code", element: <ForgotPassCode /> },
        { path: "make-plan", element: <MakePlan /> },
        { path: "community", element: <Community /> },
        { path: "user-coach", element: <UserCoach /> },
      ],
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute requiredRole="admin">
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <AdminDashboard /> },
        // Add other admin routes here
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
