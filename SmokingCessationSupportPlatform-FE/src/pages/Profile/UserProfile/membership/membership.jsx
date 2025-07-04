import "./membership.css";
import { Affix, Button, Card } from "antd";
import Header from "../../../../components/header/header";
import Footer from "../../../../components/footer/footer";
import MyAccountNav from "../../../../components/myAccount-nav/myAccount-nav";
import { CheckCircleFilled } from "@ant-design/icons";

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
          <div className="wrapper__profile-membership">
            <h1 className="wrapper__profile-membership-title">Membership</h1>
            <p className="wrapper__profile-membership-text">
              Upgrade to <span>PRO</span> to receive more features.
            </p>
            <div className="wrapper__profile-membership-plan">
              <Card
                hoverable
                className="wrapper__profile-membership-card wrapper__profile-membership-card-free"
              >
                <h2 className="wrapper__profile-membership-card-title">Free</h2>
                <ul className="wrapper__profile-membership-card-features">
                  <li>
                    <CheckCircleFilled className="CheckCircleFilled" />
                    Basic quit tracking
                  </li>
                  <li>
                    <CheckCircleFilled className="CheckCircleFilled" />
                    Community support
                  </li>
                  <li>
                    <CheckCircleFilled className="CheckCircleFilled" />
                    Daily motivation
                  </li>
                  <li>
                    <CheckCircleFilled className="CheckCircleFilled" />
                    Limited to 5 posts
                  </li>
                </ul>
              </Card>

              <Card
                hoverable
                className="wrapper__profile-membership-card wrapper__profile-membership-card-pro"
              >
                <h2 className="wrapper__profile-membership-card-title pro">
                  PRO
                </h2>
                <ul className="wrapper__profile-membership-card-features wrapper__profile-membership-card-features-pro">
                  <li>
                    <CheckCircleFilled className="CheckCircleFilled" />
                    Everything in Free
                  </li>
                  <li>
                    <CheckCircleFilled className="CheckCircleFilled" />
                    1-on-1 Consultation with Coach
                  </li>
                  <li>
                    <CheckCircleFilled className="CheckCircleFilled" />
                    Unlimited posts
                  </li>
                  <li>
                    <CheckCircleFilled className="CheckCircleFilled" />
                    Priority support
                  </li>
                </ul>
                <div className="wrapper__profile-membership-card-upgrade">
                  <Button
                    color="primary"
                    variant="filled"
                    className="wrapper__profile-membership-card-upgrade-btn"
                  >
                    Upgrade Now
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Membership;
