import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useSearchParams,
} from "react-router-dom";
import "./App.css";
import { useSelector } from "react-redux";
import { message, notification } from "antd";
import Home from "./pages/Home/home.jsx";
import Login from "./pages/Authentication/Login/login.jsx";
import Register from "./pages/Authentication/Register/register.jsx";
import ForgotPass from "./pages/Authentication/ForgotPass/forgotPass.jsx";
import ForgotPassCode from "./pages/Authentication/ForgotPass-code/forgotPass-code.jsx";
import VerifyCode from "./pages/Authentication/VerifyCode/verifyCode.jsx";
import MakePlan from "./pages/QuitPlan/MakePlan/makePlan.jsx";
import Community from "./pages/Community/PostList/community.jsx";
import UserCoach from "./pages/UserCoach/CoachList/userCoach.jsx";
import Layout from "./components/layout/layout";
import UserProfile from "./pages/Profile/UserProfile/profile/userProfile.jsx";
import ChangePass from "./pages/Profile/UserProfile/changePass/changePass.jsx";
import NewPass from "./pages/Authentication/NewPass/newPass.jsx";
import PostDetail from "./pages/Community/PostDetail/postDetail.jsx";
import UserManagement from "./pages/AdminPages/UserManagement/UserManagement.jsx";
import BlogManagement from "./pages/AdminPages/BlogManagement/BlogManagement.jsx";
import MembershipPayment from "./pages/AdminPages/MembershipPayment/MembershipPayment.jsx";
import CoachManagement from "./pages/AdminPages/CoachManagement/CoachManagement.jsx";
import Overview from "./pages/AdminPages/Dashboard/Overview.jsx";
import ChangePassCode from "./pages/Authentication/ChangePass-code/changePass-code.jsx";
import OthersProfile from "./pages/Profile/OthersProfile/profile/othersProfile.jsx";
import OthersPosts from "./pages/Profile/OthersProfile/posts/othersPosts.jsx";
import UserPosts from "./pages/Profile/UserProfile/posts/userPosts.jsx";
import UserBookings from "./pages/Profile/UserProfile/bookings/bookings.jsx";
import PlanDetail from "./pages/QuitPlan/PlanDetail/planDetail.jsx";
import Membership from "./pages/Profile/UserProfile/membership/membership.jsx";
import UserCoachDetail from "./pages/UserCoach/CoachDetail/userCoachDetail.jsx";
import UserBadges from "./pages/Profile/UserProfile/badges/badges.jsx";

const ProtectRouteAuth = ({ children }) => {
  const user = useSelector((store) => store.user);
  if (user == null) {
    return children;
  } else if (user && user.role === "admin") {
    return <Navigate to="/admin" />;
  } else {
    return <Navigate to="/" />;
  }
};

const ProtectUserProfile = ({ children }) => {
  const user = useSelector((store) => store.user);
  if (user != null) {
    return children;
  }
  message.error("Login to access this page!");
  return <Navigate to={"/"} />;
};

const ProtectForgotPasswordCode = ({ children }) => {
  const user = useSelector((store) => store.user);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  if (user != null) {
    message.error("Cannot access this page while logged in!");
    return <Navigate to="/" />;
  }
  if (!email) {
    message.error("Please enter your email first to reset password!");
    return <Navigate to="/forgot-password" />;
  }

  return children;
};

const ProtectVerifyCode = ({ children }) => {
  const user = useSelector((store) => store.user);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  if (user != null) {
    message.error("Cannot access this page while logged in!");
    return <Navigate to="/" />;
  }
  if (!email) {
    message.error("Please register first to verify your account!");
    return <Navigate to="/register" />;
  }

  return children;
};

const ProtectNewPassword = ({ children }) => {
  const user = useSelector((store) => store.user);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  if (user != null) {
    message.error("Cannot access this page while logged in!");
    return <Navigate to="/" />;
  }
  if (!token) {
    message.error("Invalid access! Please go through forgot password process!");
    return <Navigate to="/forgot-password" />;
  }
  return children;
};

const ProtectMakePlan = ({ children }) => {
  const user = useSelector((store) => store.user);
  if (user != null) {
    return children;
  }
  notification.warning({
    message: "Login or Register to make your plan!",
    description:
      "Please register or login with your account to make your own quitting plan.",
    placement: "top",
    duration: 3,
  });
  return <Navigate to={"/"} />;
};

const ProtectAdminRoute = ({ children }) => {
  const user = useSelector((store) => store.user);
  if (user == null) {
    return <Navigate to="/" />;
  }
  if (user.role !== "admin") {
    notification.error({
      message: "Access denied!",
      description: "Admin privileges required.",
      duration: 2,
    });
    return <Navigate to="/" />;
  }
  return children;
};

const ProtectCoachRoute = ({ children }) => {
  const user = useSelector((store) => store.user);
  if (user == null) {
    return <Navigate to="/" />;
  }
  if (user.role !== "mentor") {
    notification.error({
      message: "Access denied!",
      description: "Coach privileges required.",
      duration: 2,
    });
    return <Navigate to="/" />;
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
          path: "change-password-code",
          element: <ChangePassCode />,
        },
        {
          path: "new-pass",
          element: <NewPass />,
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
          path: "user-profile",
          element: (
            <ProtectUserProfile>
              <UserProfile />
            </ProtectUserProfile>
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
          path: "user-profile/posts",
          element: (
            <ProtectUserProfile>
              <UserPosts />
            </ProtectUserProfile>
          ),
        },
        {
          path: "user-profile/membership",
          element: (
            <ProtectUserProfile>
              <Membership />
            </ProtectUserProfile>
          ),
        },
        {
          path: "user-profile/badges",
          element: (
            <ProtectUserProfile>
              <UserBadges />
            </ProtectUserProfile>
          ),
        },
        {
          path: "user-profile/bookings",
          element: (
            <ProtectUserProfile>
              <UserBookings />
            </ProtectUserProfile>
          ),
        },
        {
          path: "users/:profileName",
          element: <OthersProfile />,
        },
        {
          path: "users/:profileName/posts",
          element: <OthersPosts />,
        },
        {
          path: "make-plan",
          element: (
            <ProtectMakePlan>
              <MakePlan />
            </ProtectMakePlan>
          ),
        },
        {
          path: "plan-detail",
          element: (
            <ProtectMakePlan>
              <PlanDetail />
            </ProtectMakePlan>
          ),
        },
        { path: "community", element: <Community /> },
        { path: "community/:postId", element: <PostDetail /> },
        { path: "user-coach", element: <UserCoach /> },
        { path: "user-coach/:profileName", element: <UserCoachDetail /> },
        { path: "coach-detail", element: <UserCoachDetail /> },
        {
          path: "admin",
          element: (
            <ProtectAdminRoute>
              <Overview />
            </ProtectAdminRoute>
          ),
        },
        {
          path: "admin/user-management",
          element: (
            <ProtectAdminRoute>
              <UserManagement />
            </ProtectAdminRoute>
          ),
        },
        {
          path: "admin/blog-management",
          element: (
            <ProtectAdminRoute>
              <BlogManagement />
            </ProtectAdminRoute>
          ),
        },
        {
          path: "admin/membership-payment",
          element: (
            <ProtectAdminRoute>
              <MembershipPayment />
            </ProtectAdminRoute>
          ),
        },
        {
          path: "admin/coach-management",
          element: (
            <ProtectAdminRoute>
              <CoachManagement />
            </ProtectAdminRoute>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
