import "./ChangePass.css";
import MyAccountNav from "../../../../components/myAccount-nav/myAccount-nav";
import { Affix, Button, Input } from "antd";
import Header from "../../../../components/header/header";
import Footer from "../../../../components/footer/footer";

function ChangePass() {
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
          <div className="wrapper__profile-details">
            <h1 className="wrapper__profile-details-title">
              Change Your Password
            </h1>
            <h3>
              Confirm your email address and we'll send you instructions to
              reset your password.
            </h3>
            <div className="wrapper__profile-detail-info-label">
              Email Address
            </div>
            <Input
              disabled
              variant="filled"
              className="wrapper__profile-detail-info-form-input"
              placeholder="Email"
            />
            <Button className="send-reset-code" type="primary">
              Send Reset Code
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ChangePass;
