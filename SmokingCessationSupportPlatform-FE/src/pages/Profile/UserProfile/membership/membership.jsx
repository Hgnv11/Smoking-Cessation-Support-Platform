import "./membership.css";
import { Affix } from "antd";
import Header from "../../../../components/header/header";
import Footer from "../../../../components/footer/footer";
import MyAccountNav from "../../../../components/myAccount-nav/myAccount-nav";

function Membership() {
  return (
    <>
      <Affix offsetTop={0}>
        <Header />
      </Affix>
      <div className="wrapper">
        <div className="wrapper__title1">
          <p>My Account</p>
        </div>
        <div className="wrapper__profile">
          <MyAccountNav />
          <h1 className="wrapper__community-posts-title">Membership</h1>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Membership;
