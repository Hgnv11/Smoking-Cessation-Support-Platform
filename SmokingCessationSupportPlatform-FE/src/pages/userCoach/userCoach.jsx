import React from "react";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import { Affix } from "antd";

function UserCoach() {
  return (
    <>
      <Affix offsetTop={0}>
        <Header />
      </Affix>
      <div>coach</div>
      <Footer />
    </>
  );
}

export default UserCoach;
