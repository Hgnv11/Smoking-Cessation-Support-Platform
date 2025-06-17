import { Form, Input, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";
import AuthenTemplate from "../../../components/authen-template/authen-template";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../../config/axios";
import { toast } from "react-toastify";

function ChangePassCode() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const handleVerifyCode = async (values) => {
    try {
      const response = await api.post(
        `auth/verify-otp?otpCode=${values.otpCode}&purpose=change_password`
      );
      console.log(response.data);
      toast.success("Verify code successfully!");
      navigate(`/new-pass?token=${encodeURIComponent(response.data)}`);
    } catch (err) {
      console.log(err.response?.data);
      toast.error("The verify code is incorrect or has expired!");
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await api.post(
        `auth/resend-otp?email=${email}&purpose=change_password`
      );
      console.log(response.data);
      toast.success("OTP code resent successfully!");
    } catch (err) {
      console.log(err.response?.data);
      toast.error("OTP code resend failed! Please try again later");
    }
  };

  return (
    <>
      <AuthenTemplate>
        <Form
          labelCol={{
            span: 24,
          }}
          onFinish={handleVerifyCode}
        >
          <h1>Enter Your Code</h1>
          <p className="description">
            Enter your code we sent to your email {email}
          </p>
          <FormItem
            className="input-box-otp"
            name="otpCode"
            rules={[{ required: true, message: "Please enter your OTP code." }]}
          >
            <Input.OTP variant="filled" />
          </FormItem>

          <Button
            type="primary"
            htmlType="submit"
            className="register-login__btn reset"
          >
            Submit
          </Button>
          <div className="resend-otp">
            <p className="resend-otp-des">Haven't received your code?</p>
            <a className="resend-otp-link" onClick={handleResendOTP}>
              Resend OTP
            </a>
          </div>
          <div className="register-login__link">
            <ArrowLeftOutlined />
            <a href="/user-profile/change-pass"> Back to Profile</a>
          </div>
        </Form>
      </AuthenTemplate>
    </>
  );
}

export default ChangePassCode;
