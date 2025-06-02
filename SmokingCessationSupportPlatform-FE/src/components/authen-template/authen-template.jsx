import React from "react";
import "./authen-template.css";
import { useNavigate } from "react-router-dom";

function AuthenTemplate({ children }) {
  const navigate = useNavigate();
  return (
    <>
      <div>        <img
          onClick={() => navigate("/")}
          className="quitlt_logo"
          src="/src/components/images/Quitlt-logo.png"
          alt="quitlt-logo"
        />
      </div>
      <div className="authen-template">
        <div className="authen-template__form">{children}</div>
      </div>
    </>
  );
}

export default AuthenTemplate;
