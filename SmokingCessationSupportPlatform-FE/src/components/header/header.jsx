import { Button } from "antd";
import "./header.css";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <>
      <header className="header">
        <div className="header__container">
          <div className="header__inner">
            <img
              className="header__inner-logo"
              src="../src/components/images/Quitlt-logo.png"
              alt="Quitlt Logo"
            />
            <nav className="header__nav">
              <a href="/">Home</a>

              <a href="/#">Coach</a>

              <a href="/#">Community</a>
              <a href="/#">About Us</a>
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
