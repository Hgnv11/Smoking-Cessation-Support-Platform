<<<<<<< HEAD
import React from "react";
import Header from "../../components/Header";
=======
import Header from "../../components/header/header";
>>>>>>> origin/MinhThien
import Poster from "../../components/poster/poster";
import Footer from "../../components/footer/footer";
import "./home.css";
import { Affix, Card } from "antd";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const testimonials = [
    {
      id: 1,
      text: "After 15 years of smoking, I never thought I'd quit. BreakFree's personalized plan and supportive community made it possible. I'm 8 months smoke-free now!",
      avatar: "../src/components/images/avatar1.png",
      name: "John Doe",
      role: "Quit Smoker - 8 Months",
    },
    {
      id: 2,
      text: "After 15 years of smoking, I never thought I'd quit. BreakFree's personalized plan and supportive community made it possible. I'm 8 months smoke-free now!",
      avatar: "../src/components/images/avatar2.png",
      name: "Matthew Paul",
      role: "Quit Smoker - 12 Months",
    },
    {
      id: 3,
      text: "After 15 years of smoking, I never thought I'd quit. BreakFree's personalized plan and supportive community made it possible. I'm 8 months smoke-free now!",
      avatar: "../src/components/images/avatar3.png",
      name: "Thien Phung",
      role: "Quit Smoker - 6 Months",
    },
  ];

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
          <Card
            hoverable
            className="wrapper__card-card"
            onClick={() => navigate("/make-plan")}
          >
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
          <Card
            hoverable
            className="wrapper__card-card"
            onClick={() => navigate("/community")}
          >
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
        <div className="custom-divider"></div>
        <div className="wrapper__title">
          <p>What other users say about Quitlt</p>
        </div>
        <div className="wrapper__card">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} hoverable className="wrapper__card-card">
              <h3 className="wrapper__card-des">"{testimonial.text}"</h3>
              <div className="wrapper__card-user">
                <img
                  alt="user"
                  className="wrapper__card-user-img"
                  src={testimonial.avatar}
                />
                <div className="wrapper__card-user-info">
                  <h3 className="wrapper__card-user-name">
                    {testimonial.name}
                  </h3>
                  <p className="wrapper__card-user-role">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
