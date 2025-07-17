import "./badges.css";
import { Affix, Card, Row, Col, Spin, message, Empty } from "antd";
import Header from "../../../../components/header/header";
import Footer from "../../../../components/footer/footer";
import MyAccountNav from "../../../../components/myAccount-nav/myAccount-nav";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import api from "../../../../config/axios";

function UserBadges() {
  const user = useSelector((store) => store.user);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserBadges = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/achievements/badges/${user.userId}`);
        setBadges(response.data);
      } catch (error) {
        console.error("Error fetching badges:", error);
        message.error("Failed to load badges");
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) {
      fetchUserBadges();
    }
  }, [user?.userId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
          <div className="wrapper__profile-badges">
            <h1 className="wrapper__profile-details-title">Badges</h1>
            <h3 className="wrapper__profile-badges-description">
              Earn badges as you overcome cravings and build a healthier life.
            </h3>
            <div className="wrapper__profile-badges-list">
              {loading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "400px",
                    width: "100%",
                  }}
                >
                  <Spin size="large" />
                </div>
              ) : badges.length > 0 ? (
                <Row gutter={[24, 24]}>
                  {badges.map((badge) => (
                    <Col
                      xs={24}
                      sm={24}
                      md={12}
                      lg={12}
                      xl={12}
                      key={badge.badgeId}
                    >
                      <Card
                        hoverable
                        cover={
                          <div style={{ textAlign: "center" }}>
                            <img
                              alt={badge.badgeName}
                              src={badge.badgeImageUrl}
                              style={{
                                width: "180px",
                                height: "180px",
                                objectFit: "contain",
                              }}
                            />
                          </div>
                        }
                        style={{ height: "100%", minHeight: "290px" }}
                      >
                        <Card.Meta
                          title={badge.badgeName}
                          description={
                            <p
                              style={{
                                marginBottom: 0,
                                color: "#458FF6",
                                fontSize: "14px",
                              }}
                            >
                              Earned: {formatDate(badge.earnedDate)}
                            </p>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "400px",
                    width: "100%",
                  }}
                >
                  <Empty
                    description="No badges earned yet. Keep going to earn your first badge!"
                    imageStyle={{
                      height: 100,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UserBadges;
