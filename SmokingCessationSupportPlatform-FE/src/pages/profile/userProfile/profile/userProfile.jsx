import { Affix, Button, DatePicker, Form, Image, Input, Select } from "antd";
import Header from "../../../../components/header/header";
import Footer from "../../../../components/footer/footer";
import "./userProfile.css";
import { CameraOutlined } from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";
import MyAccountNav from "../../../../components/myAccount-nav/myAccount-nav";

function UserProfile() {
  const dateFormat = "DD/MM/YYYY";
  const handleChange = () => {};

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
            <div className="wrapper__profile-details-avatar">
              <Image
                className="wrapper__profile-details-avatar-img"
                src="../src/components/images/avatar1.png"
                alt="User Avatar"
              />
              <div className="wrapper__profile-details-avatar-info">
                <h1>Personal Information</h1>
                <Button
                  color="default"
                  variant="filled"
                  className="wrapper__profile-details-avatar-btn"
                >
                  <CameraOutlined />
                  Change Avatar
                </Button>
              </div>
            </div>
            <div className="wrapper__profile-detail-info">
              <Form
                labelCol={{
                  span: 24,
                }}
                onFinish={handleChange}
              >
                <div className="wrapper__profile-detail-info-label">
                  Full Name
                </div>
                <div className="wrapper__profile-detail-info-form">
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
                      className="wrapper__profile-detail-info-form-input"
                      placeholder="Full Name"
                    />
                  </FormItem>
                  <Button
                    color="default"
                    variant="filled"
                    className="update-button"
                  >
                    Update
                  </Button>
                </div>

                <div className="wrapper__profile-detail-info-label">
                  Profile Name
                </div>
                <div className="wrapper__profile-detail-info-form">
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
                      className="wrapper__profile-detail-info-form-input"
                      placeholder="Profile Name"
                    />
                  </FormItem>
                  <Button
                    color="default"
                    variant="filled"
                    className="update-button"
                  >
                    Update
                  </Button>
                </div>

                <div className="wrapper__profile-detail-info-label">Email</div>
                <div className="wrapper__profile-detail-info-form">
                  <FormItem name="email">
                    <Input
                      disabled
                      variant="filled"
                      className="wrapper__profile-detail-info-form-input"
                      placeholder="Email"
                    />
                  </FormItem>
                </div>

                <div className="wrapper__profile-detail-info-label">
                  Date Of Birth
                </div>
                <div className="wrapper__profile-detail-info-form">
                  <FormItem
                    name="birthDate"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your date of birth to update.",
                      },
                    ]}
                  >
                    <DatePicker
                      disabled
                      variant="filled"
                      className="date-picker-form"
                      format={dateFormat}
                    />
                  </FormItem>
                  <Button
                    color="default"
                    variant="filled"
                    className="update-button"
                  >
                    Update
                  </Button>
                </div>

                <div className="wrapper__profile-detail-info-label">Gender</div>
                <div className="wrapper__profile-detail-info-form">
                  <FormItem name="gender">
                    <Select
                      disabled
                      variant="filled"
                      defaultValue="Male"
                      style={{ height: 40 }}
                      options={[
                        { value: "Male", label: "Male" },
                        { value: "Female", label: "Femail" },
                      ]}
                    />
                  </FormItem>
                  <Button
                    color="default"
                    variant="filled"
                    className="update-button"
                  >
                    Update
                  </Button>
                </div>
              </Form>
            </div>
            <Button
              htmlType="submit"
              className="save-change-btn"
              type="primary"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UserProfile;
