import { Button, Popconfirm } from "antd";
import "./myAccount-nav.css";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/redux/features/userSlice";

function MyAccountNav() {
  const location = useLocation();
  const dispatch = useDispatch();

  const isActivePage = (path) => {
    if (path === "/user-profile") {
      return location.pathname === "/user-profile";
    }
    return location.pathname.includes(path);
  };

  return (
    <div className="wrapper__profile-nav">
      <a
        href="/user-profile"
        className={isActivePage("/user-profile") ? "active" : ""}
      >
        Profile
      </a>
      <a
        href="/user-profile/change-pass"
        className={isActivePage("/user-profile/change-pass") ? "active" : ""}
      >
        Change Password
      </a>
      <a
        href="/user-profile/posts"
        className={isActivePage("/user-profile/posts") ? "active" : ""}
      >
        Posts
      </a>
      <a
        href="/user-profile/membership"
        className={isActivePage("/user-profile/membership") ? "active" : ""}
      >
        Membership
      </a>
      <a
        href="/user-profile/badges"
        className={isActivePage("/user-profile/badges") ? "active" : ""}
      >
        Badges
      </a>
      <a
        href="/user-profile/bookings"
        className={isActivePage("/user-profile/bookings") ? "active" : ""}
      >
        Bookings
      </a>
      <Popconfirm
        onConfirm={() => dispatch(logout())}
        title="Do you want to Log Out ?"
        okText="Yes"
        cancelText="No"
      >
        <Button className="logout-btn" type="primary" danger>
          Log out
        </Button>
      </Popconfirm>
    </div>
  );
}

export default MyAccountNav;
