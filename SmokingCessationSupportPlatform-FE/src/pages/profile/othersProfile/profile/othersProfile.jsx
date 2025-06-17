import { Affix, Avatar, Button, Form, Image, Input, Select, Empty } from "antd";
import Header from "../../../../components/header/header";
import Footer from "../../../../components/footer/footer";
import "./othersProfile.css";
import { UserOutlined } from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import UsersData from "../../../../config/userData";
import OthersAccountNav from "../../../../components/othersAccount-nav/othersAccount-nav";

function OthersProfile() {
  const { profileName } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const decodedProfileName = decodeURIComponent(profileName);
    const foundUser = UsersData.find(
      (u) => u.profile_name === decodedProfileName
    );
    setUser(foundUser);
  }, [profileName]);

  if (!user) {
    return (
      <>
        <Affix offsetTop={0}>
          <Header />
        </Affix>
        <Empty className="empty-user" description="User Not Found" />
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
          <p>{user.profile_name}'s Account</p>
        </div>
        <div className="wrapper__profile">
          <OthersAccountNav />
          <div className="wrapper__profile-details">
            <div className="wrapper__profile-details-avatar">
              {user.avatar_url ? (
                <Avatar
                  className="wrapper__profile-details-avatar-img"
                  src={user.avatar_url}
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
                  fullName: user.full_name,
                  profileName: user.profile_name,
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
                      { value: "MALE", label: "Male" },
                      { value: "FEMALE", label: "Female" },
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
