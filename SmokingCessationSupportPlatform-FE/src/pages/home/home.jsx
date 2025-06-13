import Header from "../../components/header/header";
import Poster from "../../components/poster/poster";
import Footer from "../../components/footer/footer";
import "./home.css";
import { Affix, Card } from "antd";

function Home() {
  return (
    <>
      <Affix offsetTop={0}>
        <Header />
      </Affix>
      <Poster />
      <div className="wrapper">
        <div className="wrapper__title">
          <p>Explore</p>
        </div>
        <div className="wrapper__card">
          <Card hoverable className="wrapper__card-card">
            <img
              alt="example"
              className="wrapper__card-img"
              src="../src/components/images/card-asset1.png"
            />
            <h2 className="wrapper__card-title">I want to Quit</h2>
            <p className="wrapper__card-des">
              Quitting smoking is one of the best decisions for your health and
              future
            </p>
          </Card>
          <Card hoverable className="wrapper__card-card">
            <img
              alt="example"
              className="wrapper__card-img"
              src="../src/components/images/card-asset2.png"
            />
            <h2 className="wrapper__card-title">Community</h2>
            <p className="wrapper__card-des">
              Buy your medicines with our mobile application with a simple
              delivery system
            </p>
          </Card>
          <Card hoverable className="wrapper__card-card">
            <img
              alt="example"
              className="wrapper__card-img"
              src="../src/components/images/card-asset3.png"
            />
            <h2 className="wrapper__card-title">Consulation</h2>
            <p className="wrapper__card-des">
              Free consultation with our trusted doctors and get the best
              recomendations
            </p>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
