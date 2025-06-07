import { Form, Input, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";
import AuthenTemplate from "../../../components/authen-template/authen-template";

function ForgotPassCode() {
  const handleForgotPassCode = () => {};

  return (
    <>
      <AuthenTemplate>
        <Form
          labelCol={{
            span: 24,
          }}
          onFinish={handleForgotPassCode}
        >
          <h1>Enter Your Code</h1>
          <p className="description">Enter your code we sent to your email</p>
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
            Next
          </Button>

          <div className="register-login__link">
            <ArrowLeftOutlined />
            <a href="/login"> Back to Login</a>
          </div>
        </Form>
      </AuthenTemplate>
    </>
  );
}

export default ForgotPassCode;
