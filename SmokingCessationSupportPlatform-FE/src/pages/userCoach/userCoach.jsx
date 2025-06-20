import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import { Affix, Divider } from "antd";

function UserCoach() {
  return (
    <>
      <Affix offsetTop={0}>
        <Header />
      </Affix>
      <div className="wrapper">
        <div className="wrapper__title">
          <p>Coach Consultation</p>
        </div>
        <Divider className="divider" />
        <div className="wrapper__content">
          <div className="wrapper__content-des">
            <h2>Get Help From Experts</h2>
            <p>
              Getting quit support from an expert, like a health care
              professional or trained quit counselor, can increase your chances
              of success. Ask how they might be able to help you quit.
            </p>
          </div>
          <Divider className="divider" />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UserCoach;
