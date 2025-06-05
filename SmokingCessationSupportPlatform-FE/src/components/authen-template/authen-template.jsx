import React from "react";
import "./authen-template.css";

function AuthenTemplate({ children }) {
  return (
    <>
<<<<<<< HEAD
      <div>        <img
          onClick={() => navigate("/")}
          className="quitlt_logo"
          src="/src/components/images/Quitlt-logo.png"
          alt="quitlt-logo"
        />
=======
      <div>
        <a href="/">
          <img
            className="quitlt_logo"
            src="../src/components/images/Quitlt-logo.png"
            alt="quitlt-logo"
          />
        </a>
>>>>>>> origin/MinhThien
      </div>
      <div className="authen-template">
        <div className="authen-template__form">{children}</div>
      </div>
    </>
  );
}

export default AuthenTemplate;
