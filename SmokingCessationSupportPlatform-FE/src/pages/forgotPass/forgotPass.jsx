import { Form, Input, Button, Checkbox } from "antd";
import FormItem from "antd/es/form/FormItem";
import AuthenTemplate from "../../components/authen-template/authen-template";
import { ArrowLeftOutlined } from "@ant-design/icons";

function ForgotPass() {
  const handleForgotPass = () => {};
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
            name="username"
            rules={[
              { required: true, message: "Please enter your email address." },
            ]}
          >
            <Input
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
