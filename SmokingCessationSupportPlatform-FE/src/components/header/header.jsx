import { Button } from "antd";
import "./header.css";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActivePage = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.includes(path);
  };

  return (
    <>
      <header className="header">
        <div className="header__container">
          <div className="header__inner">
            <a href="/">
              <img
                className="header__inner-logo"
                src="../src/components/images/Quitlt-logo.png"
                alt="Quitlt Logo"
              />
            </a>
            <nav className="header__nav">
              <a href="/" className={isActivePage("/") ? "active" : ""}>
                Home
              </a>

              <a
                href="/user-coach"
                className={isActivePage("/user-coach") ? "active" : ""}
              >
                Coach
              </a>

              <a
                href="/community"
                className={isActivePage("/community") ? "active" : ""}
              >
                Community
              </a>

              <a href="/#" className={isActivePage("/#") ? "active" : ""}>
                Article & Information
              </a>
            </nav>
          </div>
          <div className="header__login-register">
            <SearchOutlined className="search" />
            <Button
              type="primary"
              onClick={() => navigate("/login")}
              className="login-btn"
            >
              Login
            </Button>
            <Button
              color="primary"
              variant="filled"
              onClick={() => navigate("/register")}
              className="register-btn"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
