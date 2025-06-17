import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useSearchParams,
} from "react-router-dom";
import "./App.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ChangePassCode from "./pages/auththenPage/changePass-code/changePass-code.jsx";
// Import mentor pages từ các file có sẵn
import MentorLayout from "./components/mentor/Layout";
import MentorOverview from "./pages/mentor/Overview/Overview.jsx";
import MentorAppointments from "./pages/mentor/Appointments/Appointment.jsx";
import MentorClients from "./pages/mentor/Clients/Client.jsx";
import MentorReports from "./pages/mentor/Reports/Report.jsx";
import { MentorClientDetails } from "./pages/mentor/Clients/ClientDetails.jsx";
import Home from "./pages/Home/home.jsx";
import Login from "./pages/Authentication/Login/login.jsx";
import Register from "./pages/Authentication/Register/register.jsx";
import ForgotPass from "./pages/Authentication/ForgotPass/forgotPass.jsx";
import ForgotPassCode from "./pages/Authentication/ForgotPass-code/forgotPass-code.jsx";
import VerifyCode from "./pages/Authentication/VerifyCode/verifyCode.jsx";
import MakePlan from "./pages/QuitPlan/makePlan.jsx";
import Community from "./pages/Community/PostList/community.jsx";
import UserCoach from "./pages/UserCoach/userCoach.jsx";
import Layout from "./components/layout/layout";
import UserProfile from "./pages/Profile/UserProfile/profile/userProfile.jsx";
import ChangePass from "./pages/Profile/UserProfile/changePass/changePass.jsx";
import NewPass from "./pages/Authentication/NewPass/newPass.jsx";
import PostDetail from "./pages/Community/postDetail/postDetail.jsx";
import UserManagement from "./pages/AdminPages/UserManagement/UserManagement.jsx";
import BlogManagement from "./pages/AdminPages/BlogManagement/BlogManagement.jsx";
import MembershipPayment from "./pages/AdminPages/MembershipPayment/MembershipPayment.jsx";
import CoachManagement from "./pages/AdminPages/CoachManagement/CoachManagement.jsx";
import Overview from "./pages/AdminPages/Dashboard/Overview.jsx";
import ChangePassCode from "./pages/Authentication/ChangePass-code/changePass-code.jsx";
import OthersProfile from "./pages/Profile/othersProfile/profile/othersProfile.jsx";
import OthersPosts from "./pages/Profile/othersProfile/posts/othersPosts.jsx";
import UserPosts from "./pages/Profile/UserProfile/posts/userPosts.jsx";
import { message, notification } from "antd";

const ProtectRouteAuth = ({ children }) => {
  const user = useSelector((store) => store.user);
  
  // Nếu chưa đăng nhập, cho phép truy cập trang auth
  if (user == null) {
    return children;
  }
  
  // Nếu đã đăng nhập, chuyển hướng dựa theo role
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  } else if (user.role === "mentor") {
    return <Navigate to="/mentor" replace />;
  } else {
    return <Navigate to="/" replace />;
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

const ProtectMentorRoute = ({ children }) => {
  const user = useSelector((store) => store.user);
  if (user == null) {
    return <Navigate to="/" />;
  }
  if (user.role !== "mentor") {
    toast.error("Access denied! Mentor privileges required.");
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
        {
          path: "user-profile/posts",
          element: (
            <ProtectUserProfile>
              <UserPosts />
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
        { path: "make-plan", element: <MakePlan /> },
        { path: "community", element: <Community /> },
        { path: "community/:postId", element: <PostDetail /> },
        { path: "user-coach", element: <UserCoach /> },
        // Admin Routes
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
        // Mentor Routes
        {
          path: "mentor",
          element: (
            <ProtectMentorRoute>
              <MentorLayout />
            </ProtectMentorRoute>
          ),
          children: [
            { index: true, element: <MentorOverview /> },
            { path: "overview", element: <MentorOverview /> },
            { path: "appointments", element: <MentorAppointments /> },
            { path: "clients", element: <MentorClients /> },
            { path: "clients/:clientId", element: <MentorClientDetails /> },
            { path: "reports", element: <MentorReports /> },
          ]
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
