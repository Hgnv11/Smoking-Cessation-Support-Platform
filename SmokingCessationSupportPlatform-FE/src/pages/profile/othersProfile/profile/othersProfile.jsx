import { Affix, Avatar, Form, Input, Select, Empty, message } from "antd";
import Header from "../../../../components/header/header";
import Footer from "../../../../components/footer/footer";
import "./othersProfile.css";
import { UserOutlined } from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import OthersAccountNav from "../../../../components/othersAccount-nav/othersAccount-nav";
import api from "../../../../config/axios";

function OthersProfile() {
  const { profileName } = useParams();
  const [user, setUser] = useState(null);

  const fetchUserData = async () => {
    try {
      const response = await api.get(`/profile/by-name/${profileName}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      message.error("Failed to fetch user profile. Please try again later.");
    }
  };

  useEffect(() => {
    if (profileName) {
      fetchUserData();
    }
  }, [profileName]);

  if (!user) {
    return (
      <>
        <Affix offsetTop={0}>
          <Header />
        </Affix>
        <div className="wrapper">
          <Empty className="empty-user" description="User Not Found" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Affix offsetTop={0}>
        <Header />
      </Affix>
      <div className="wrapper">
        <div className="wrapper__title1">
          <p>{user.profileName || user.profile_name}'s Account</p>
        </div>
        <div className="wrapper__profile">
          <OthersAccountNav />
          <div className="wrapper__profile-details">
            <div className="wrapper__profile-details-avatar">
              {user.avatarUrl ? (
                <Avatar
                  className="wrapper__profile-details-avatar-img"
                  src={user.avatarUrl}
                  alt="User Avatar"
                />
              ) : (
                <Avatar
                  className="wrapper__profile-details-avatar-img"
                  icon={
                    <UserOutlined className="wrapper__profile-details-avatar-img-UserOutlined" />
                  }
                />
              )}
              <div className="wrapper__profile-details-avatar-info">
                <h1>Personal Information</h1>
              </div>
            </div>
            <div className="wrapper__profile-detail-info">
              <Form
                labelCol={{
                  span: 24,
                }}
                initialValues={{
                  fullName: user.fullName,
                  profileName: user.profileName,
                  email: user.email,
                  gender: user.gender,
                }}
              >
                <div className="wrapper__profile-detail-info-label">
                  Full Name
                </div>
                <FormItem
                  name="fullName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your full name to update.",
                    },
                  ]}
                >
                  <Input
                    disabled
                    variant="filled"
                    className="wrapper__profile-detail-info-form-input1"
                    placeholder="Full Name"
                  />
                </FormItem>

                <div className="wrapper__profile-detail-info-label">
                  Profile Name
                </div>
                <FormItem
                  name="profileName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your profile name to update.",
                    },
                  ]}
                >
                  <Input
                    disabled
                    variant="filled"
                    className="wrapper__profile-detail-info-form-input1"
                    placeholder="Profile Name"
                  />
                </FormItem>

                <div className="wrapper__profile-detail-info-label">Email</div>
                <FormItem name="email">
                  <Input
                    disabled
                    variant="filled"
                    className="wrapper__profile-detail-info-form-input1"
                    placeholder="Email"
                  />
                </FormItem>
                <div className="wrapper__profile-detail-info-label">Gender</div>
                <FormItem name="gender">
                  <Select
                    disabled
                    variant="filled"
                    style={{ height: 40 }}
                    options={[
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                      { value: "other", label: "Other" },
                    ]}
                  />
                </FormItem>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default OthersProfile;
