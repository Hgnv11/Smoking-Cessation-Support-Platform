import { Affix, Avatar, Button, Card, message, Rate, Spin, Empty } from "antd";
import "./bookings.css";
import Header from "../../../../components/header/header";
import Footer from "../../../../components/footer/footer";
import MyAccountNav from "../../../../components/myAccount-nav/myAccount-nav";
import {
  CalendarTwoTone,
  ClockCircleTwoTone,
  MailTwoTone,
} from "@ant-design/icons";
import api from "../../../../config/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to get time range based on slot number
  const getSlotTimeRange = (slotNumber) => {
    const timeRanges = {
      1: "7:00 AM - 9:30 AM",
      2: "9:30 AM - 12:00 PM",
      3: "13:00 PM - 15:30 PM",
      4: "15:30 PM - 18:00 PM",
    };
    return timeRanges[slotNumber] || "";
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/consultations/user");
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      message.error("Failed to fetch bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (consultationId) => {
    try {
      await api.post(`/consultations/${consultationId}/cancel`);
      message.success("Appointment cancelled successfully");
      fetchBookings();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      message.error("Failed to cancel appointment. Please try again.");
    }
  };

  const handleViewCoach = (profileName) => {
    navigate(`/user-coach/${profileName}`);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

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
          <div className="wrapper__profile-bookings">
            <h1 className="wrapper__community-posts-title">Bookings</h1>

            {loading ? (
              <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
              </div>
            ) : bookings.length === 0 ? (
              <EmptY
                description="No Appointments Booked Available!"
                style={{ margin: "20px 0" }}
              />
            ) : (
              bookings.map((booking) => (
                <Card
                  key={booking.consultationId}
                  className="wrapper__profile-bookings-card"
                >
                  <p className="wrapper__profile-bookings-card-note">
                    Appointment Details
                  </p>
                  <div className="wrapper__profile-bookings-card-date">
                    <p className="wrapper__profile-bookings-card-date-details">
                      <CalendarTwoTone className="wrapper__profile-bookings-card-date-details-icon" />{" "}
                      {formatDate(booking.slot.slotDate)}
                    </p>
                    <p className="wrapper__profile-bookings-card-date-details">
                      <ClockCircleTwoTone className="wrapper__profile-bookings-card-date-details-icon" />{" "}
                      {getSlotTimeRange(booking.slot.slotNumber)}
                    </p>
                  </div>
                  <div className="wrapper__profile-bookings-card-coach">
                    <div className="wrapper__profile-bookings-card-coach-info">
                      <div className="wrapper__profile-bookings-card-coach-info-des">
                        <Avatar
                          src={booking.slot.mentor.avatarUrl}
                          alt="Coach Avatar"
                          className="wrapper__profile-bookings-card-coach-avatar"
                        />
                        <div>
                          <h2 className="wrapper__profile-bookings-card-coach-info-des-name">
                            {booking.slot.mentor.gender === "male"
                              ? "Mr. "
                              : "Mrs. "}
                            {booking.slot.mentor.fullName}
                          </h2>
                          <p className="wrapper__profile-bookings-card-coach-info-des-email">
                            <MailTwoTone className="wrapper__profile-bookings-card-coach-info-des-email-icon" />
                            Email: {booking.slot.mentor.email}
                          </p>
                        </div>
                      </div>
                      <div className="wrapper__profile-bookings-card-coach-info-rate">
                        <Rate disabled allowHalf defaultValue={4.5} />
                        <p className="wrapper__profile-bookings-card-coach-info-rate-number">
                          Rating 4.5
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="wrapper__profile-bookings-card-btn">
                    <Button
                      color="default"
                      variant="filled"
                      className="wrapper__profile-bookings-card-btn-detail cancel-book"
                      onClick={() =>
                        handleCancelAppointment(booking.consultationId)
                      }
                      //disabled={booking.status !== "scheduled"}
                    >
                      Cancel Appointment
                    </Button>
                    <Button
                      color="primary"
                      variant="solid"
                      className="wrapper__profile-bookings-card-btn-detail"
                      onClick={() =>
                        handleViewCoach(booking.slot.mentor.profileName)
                      }
                    >
                      View Coach
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UserBookings;
