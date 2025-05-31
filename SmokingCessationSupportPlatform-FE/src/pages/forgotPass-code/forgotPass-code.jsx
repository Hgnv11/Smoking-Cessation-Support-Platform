import { Form, Input, Button } from "antd";
import FormItem from "antd/es/form/FormItem";
import AuthenTemplate from "../../components/authen-template/authen-template";

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
            name="otp"
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

          <div className="register-login__link">
            <p>Back to login</p>
          </div>
        </Form>
      </AuthenTemplate>
    </>
  );
}

export default ForgotPassCode;
