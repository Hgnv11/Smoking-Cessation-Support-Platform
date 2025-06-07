import { Form, Input, Button } from "antd";
import FormItem from "antd/es/form/FormItem";
import AuthenTemplate from "../../../components/authen-template/authen-template";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";

function ForgotPass() {
  const navigate = useNavigate();

  const handleForgotPass = async (values) => {
    try {
      const response = await api.post(
        `auth/forgot-password?email=${encodeURIComponent(values.email)}`
      );
      console.log(response.data);
      toast.success("Reset code sent to your email!");
      navigate(
        `/forgot-password-code?email=${encodeURIComponent(values.email)}`
      );
    } catch (err) {
      console.log(err.response?.data);
      toast.error(
        "Failed to send reset code. Please check your email address."
      );
    }
  };
  return (
    <>
      <AuthenTemplate>
        <Form
          labelCol={{
            span: 24,
          }}
          onFinish={handleForgotPass}
        >
          <h1>Reset Password</h1>
          <p className="description">
            Enter your email address and we'll send you instructions to reset
            your password.
          </p>
          <FormItem
            label="Email Address"
            className="input-box custom-label"
            name="email"
            rules={[
              { required: true, message: "Please enter your email address." },
            ]}
          >
            <Input
              variant="filled"
              className="input"
              type="text"
              placeholder="Enter your email address"
            />
          </FormItem>

          <Button
            type="primary"
            htmlType="submit"
            className="register-login__btn reset"
          >
            Send Reset Code
          </Button>

          <div className="register-login__link">
            <a href="/login">
              <ArrowLeftOutlined /> Back to login
            </a>
          </div>
        </Form>
      </AuthenTemplate>
    </>
  );
}

export default ForgotPass;
