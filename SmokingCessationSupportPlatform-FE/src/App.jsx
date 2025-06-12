import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useSearchParams,
} from "react-router-dom";
import "./App.css";
import Home from "./pages/home/home";
import Login from "./pages/auththenPage/login/login";
import Register from "./pages/auththenPage/register/register";
import ForgotPass from "./pages/auththenPage/forgotPass/forgotPass";
import ForgotPassCode from "./pages/auththenPage/forgotPass-code/forgotPass-code";
import VerifyCode from "./pages/auththenPage/verifyCode/verifyCode";
import MakePlan from "./pages/quitPlan/makePlan";
import Community from "./pages/community/postList/community";
import UserCoach from "./pages/userCoach/userCoach";
import Layout from "./components/layout/layout";
import UserProfile from "./pages/profile/userProfile/profile/userProfile";
import ChangePass from "./pages/profile/userProfile/changePass/changePass";
import NewPass from "./pages/auththenPage/newPass/newPass";
import PostDetail from "./pages/community/postDetail/postDetail";
import UserManagement from "./pages/admin/UserManagement/UserManagement.jsx";
import BlogManagement from "./pages/admin/BlogManagement/BlogManagement.jsx";
import MembershipPayment from "./pages/admin/MembershipPayment/MembershipPayment.jsx";
import CoachManagement from "./pages/admin/CoachManagement/CoachManagement.jsx";
import Overview from "./pages/admin/Dashboard/Overview.jsx";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ProtectRouteAuth = ({ children }) => {
  const user = useSelector((store) => store.user);
  if (user == null) {
    return children;
  }
  return <Navigate to="/" />;
};

const ProtectUserProfile = ({ children }) => {
  const user = useSelector((store) => store.user);
  if (user != null) {
    return children;
  }
  toast.error("Login to access this page!");
  return <Navigate to={"/"} />;
};

const ProtectForgotPasswordCode = ({ children }) => {
  const user = useSelector((store) => store.user);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  if (user != null) {
    toast.error("Cannot access this page while logged in!");
    return <Navigate to="/" />;
  }
  if (!email) {
    toast.error("Please enter your email first to reset password!");
    return <Navigate to="/forgot-password" />;
  }

  return children;
};

const ProtectVerifyCode = ({ children }) => {
  const user = useSelector((store) => store.user);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  if (user != null) {
    toast.error("Cannot access this page while logged in!");
    return <Navigate to="/" />;
  }
  if (!email) {
    toast.error("Please register first to verify your account!");
    return <Navigate to="/register" />;
  }

  return children;
};

const ProtectNewPassword = ({ children }) => {
  const user = useSelector((store) => store.user);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  if (user != null) {
    toast.error("Cannot access this page while logged in!");
    return <Navigate to="/" />;
  }
  if (!token) {
    toast.error("Invalid access! Please go through forgot password process!");
    return <Navigate to="/forgot-password" />;
  }
  return children;
};

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "login",
          element: (
            <ProtectRouteAuth>
              <Login />
            </ProtectRouteAuth>
          ),
        },
        {
          path: "register",
          element: (
            <ProtectRouteAuth>
              <Register />
            </ProtectRouteAuth>
          ),
        },
        {
          path: "forgot-password",
          element: (
            <ProtectRouteAuth>
              <ForgotPass />
            </ProtectRouteAuth>
          ),
        },
        {
          path: "forgot-password-code",
          element: (
            <ProtectForgotPasswordCode>
              <ForgotPassCode />
            </ProtectForgotPasswordCode>
          ),
        },
        {
          path: "new-pass",
          element: (
            <ProtectNewPassword>
              <NewPass />
            </ProtectNewPassword>
          ),
        },
        {
          path: "verify-code",
          element: (
            <ProtectVerifyCode>
              <VerifyCode />
            </ProtectVerifyCode>
          ),
        },
        {
          path: "user-profile/change-pass",
          element: (
            <ProtectUserProfile>
              <ChangePass />
            </ProtectUserProfile>
          ),
        },
        {
          path: "user-profile",
          element: (
            <ProtectUserProfile>
              <UserProfile />
            </ProtectUserProfile>
          ),
        },
        { path: "make-plan", element: <MakePlan /> },
        { path: "community", element: <Community /> },
        { path: "community/:postId", element: <PostDetail /> },
        { path: "user-coach", element: <UserCoach /> },
        { path: "admin", element: <Overview /> },
        { path: "admin/user-management", element: <UserManagement /> },
        { path: "admin/blog-management", element: <BlogManagement /> },
        { path: "admin/membership-payment", element: <MembershipPayment /> },
        { path: "admin/coach-management", element: <CoachManagement /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
