import {
  Affix,
  Avatar,
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  Select,
} from "antd";
import Header from "../../../../components/header/header";
import Footer from "../../../../components/footer/footer";
import "./userProfile.css";
import { CameraOutlined, UserOutlined } from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";
import MyAccountNav from "../../../../components/myAccount-nav/myAccount-nav";
import { useState } from "react";
import { useSelector } from "react-redux";

function UserProfile() {
  const dateFormat = "DD/MM/YYYY";
  const user = useSelector((store) => store.user);

  // State để quản lý trạng thái enable/disable của từng field
  const [fieldStates, setFieldStates] = useState({
    fullName: true,
    profileName: true,
    birthDate: true,
    gender: true,
  });

  const handleChange = () => {};

  // Hàm xử lý khi nhấn nút Update
  const handleUpdateClick = (fieldName) => {
    setFieldStates((prev) => ({
      ...prev,
      [fieldName]: false,
    }));
  };

  // Kiểm tra xem có field nào đang được edit không
  const hasActiveEdits = Object.values(fieldStates).some(
    (disabled) => !disabled
  );

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
              {user.avatar ? (
                <Avatar
                  className="wrapper__profile-details-avatar-img"
                  src={user.avatar}
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
                      disabled={fieldStates.fullName}
                      variant="filled"
                      className="wrapper__profile-detail-info-form-input"
                      placeholder="Full Name"
                    />
                  </FormItem>
                  <Button
                    color="default"
                    variant="filled"
                    className="update-button"
                    disabled={!fieldStates.fullName}
                    onClick={() => handleUpdateClick("fullName")}
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
                      disabled={fieldStates.profileName}
                      variant="filled"
                      className="wrapper__profile-detail-info-form-input"
                      placeholder="Profile Name"
                    />
                  </FormItem>
                  <Button
                    color="default"
                    variant="filled"
                    className="update-button"
                    disabled={!fieldStates.profileName}
                    onClick={() => handleUpdateClick("profileName")}
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
                      disabled={fieldStates.birthDate}
                      variant="filled"
                      className="date-picker-form"
                      format={dateFormat}
                    />
                  </FormItem>
                  <Button
                    color="default"
                    variant="filled"
                    className="update-button"
                    disabled={!fieldStates.birthDate}
                    onClick={() => handleUpdateClick("birthDate")}
                  >
                    Update
                  </Button>
                </div>

                <div className="wrapper__profile-detail-info-label">Gender</div>
                <div className="wrapper__profile-detail-info-form">
                  <FormItem name="gender">
                    <Select
                      disabled={fieldStates.gender}
                      variant="filled"
                      style={{ height: 40 }}
                      options={[
                        { value: "Male", label: "Male" },
                        { value: "Female", label: "Female" },
                      ]}
                    />
                  </FormItem>
                  <Button
                    color="default"
                    variant="filled"
                    className="update-button"
                    disabled={!fieldStates.gender}
                    onClick={() => handleUpdateClick("gender")}
                  >
                    Update
                  </Button>
                </div>
                <Button
                  htmlType="submit"
                  disabled={!hasActiveEdits}
                  className="save-change-btn"
                  type="primary"
                >
                  Save Changes
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UserProfile;
