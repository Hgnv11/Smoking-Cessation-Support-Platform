import {
  Affix,
  Avatar,
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Select,
} from "antd";
import Header from "../../../../components/header/header";
import Footer from "../../../../components/footer/footer";
import "./userProfile.css";
import { CameraOutlined, UserOutlined } from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";
import MyAccountNav from "../../../../components/myAccount-nav/myAccount-nav";
import { useState, useEffect, useRef } from "react";
import api from "../../../../config/axios";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../../store/redux/features/userSlice";
import uploadFile from "../../../../store/utils/file";

function UserProfile() {
  const dateFormat = "DD/MM/YYYY";
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  // Ref cho input file ẩn
  const fileInputRef = useRef(null);

  // State để quản lý trạng thái enable/disable của từng field
  const [fieldStates, setFieldStates] = useState({
    fullName: true,
    profileName: true,
    birthDate: true,
    gender: true,
  });

  // State để lưu giá trị gốc khi bắt đầu edit
  const [originalValues, setOriginalValues] = useState({});

  // State để track những field đã được edit
  const [editedFields, setEditedFields] = useState(new Set());

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = user.token;

      if (!token) {
        message.error("No authentication token found. Please login again.");
        return;
      }

      const response = await api.get("/profile/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const profileData = response.data;

      const formValues = {
        fullName: profileData.fullName,
        profileName: profileData.profileName,
        email: profileData.email,
        birthDate: profileData.birthDate
          ? dayjs(profileData.birthDate, "YYYY-MM-DD")
          : null,
        gender: profileData.gender,
      };

      form.setFieldsValue(formValues);
      setOriginalValues(formValues);
      setUserAvatar(profileData.avatarUrl);
    } catch (error) {
      console.error("Error fetching profile:", error);
      message.error("Failed to fetch profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Hàm xử lý khi click Change Avatar
  const handleChangeAvatar = () => {
    fileInputRef.current?.click();
  };

  // Hàm xử lý khi chọn file avatar
  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    // Kiểm tra định dạng file
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      message.error("Please select a valid image file (JPEG, PNG, GIF)");
      return;
    }

    // Kiểm tra kích thước file (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      message.error("File size must be less than 5MB");
      return;
    }

    try {
      setAvatarLoading(true);

      // Upload file lên Firebase
      const avatarUrl = await uploadFile(file);

      // Gửi API để cập nhật avatar
      const token = user.token;
      const response = await api.post(
        "/profile/my",
        { avatarUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Cập nhật avatar trong state local
        setUserAvatar(avatarUrl);

        // Cập nhật Redux store
        const updatedUser = {
          ...user,
          avatarUrl: avatarUrl,
        };
        dispatch(login(updatedUser));

        message.success("Avatar updated successfully");
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      message.error("Failed to update avatar");
    } finally {
      setAvatarLoading(false);
      // Reset file input
      event.target.value = "";
    }
  };

  // Hàm xử lý khi nhấn nút Update
  const handleUpdateClick = (fieldName) => {
    setFieldStates((prev) => ({
      ...prev,
      [fieldName]: false,
    }));

    // Add field to edited fields set
    setEditedFields((prev) => new Set([...prev, fieldName]));
  };

  // Hàm xử lý khi nhấn Cancel
  const handleCancel = () => {
    // Reset form về giá trị gốc
    form.setFieldsValue(originalValues);

    // Reset tất cả field về trạng thái disabled
    setFieldStates({
      fullName: true,
      profileName: true,
      birthDate: true,
      gender: true,
    });

    // Clear edited fields
    setEditedFields(new Set());
  };

  // Hàm xử lý khi submit form
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const token = user.token;

      if (!token) {
        message.error("No authentication token found. Please login again.");
        return;
      }

      // Chỉ gửi những field đã được edit
      const updatedData = {};

      editedFields.forEach((fieldName) => {
        if (fieldName === "birthDate" && values[fieldName]) {
          updatedData[fieldName] = values[fieldName].format("YYYY-MM-DD");
        } else if (
          values[fieldName] !== undefined &&
          values[fieldName] !== null
        ) {
          updatedData[fieldName] = values[fieldName];
        }
      });

      // Chỉ gửi API nếu có field được update
      // if (Object.keys(updatedData).length === 0) {
      //   toast.info("No changes to save");
      //   return;
      // }

      const response = await api.post("/profile/my", updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        message.success("Profile updated successfully");

        // Cập nhật Redux store nếu profileName được update
        if (updatedData.profileName) {
          const updatedUser = {
            ...user,
            profileName: updatedData.profileName,
          };
          dispatch(login(updatedUser));
        }

        // Reset states sau khi update thành công
        setFieldStates({
          fullName: true,
          profileName: true,
          birthDate: true,
          gender: true,
        });

        setEditedFields(new Set());

        // Cập nhật original values với giá trị mới
        setOriginalValues(form.getFieldsValue());
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

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
              {userAvatar ? (
                <Avatar
                  className="wrapper__profile-details-avatar-img"
                  src={userAvatar}
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
                  onClick={handleChangeAvatar}
                  loading={avatarLoading}
                >
                  <CameraOutlined />
                  {avatarLoading ? "Uploading..." : "Change Avatar"}
                </Button>
                {/* Input file ẩn */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  style={{ display: "none" }}
                />
              </div>
            </div>
            <div className="wrapper__profile-detail-info">
              <Form
                form={form}
                labelCol={{
                  span: 24,
                }}
                onFinish={handleSubmit}
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
                  <FormItem name="birthDate">
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
                      style={{ height: 40, width: 130 }}
                      options={[
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                        { value: "other", label: "Other" },
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
                  loading={loading}
                >
                  Save Changes
                </Button>
                <Button
                  disabled={!hasActiveEdits}
                  className="save-change-btn"
                  onClick={handleCancel}
                >
                  Cancel
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
