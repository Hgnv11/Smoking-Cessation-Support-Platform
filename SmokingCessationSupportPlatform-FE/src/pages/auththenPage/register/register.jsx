import AuthenTemplate from "../../../components/authen-template/authen-template";
import { Button, Divider, Form, Input } from "antd";
import FormItem from "antd/es/form/FormItem";

function Register() {
  const handleRegister = () => {};
  return (
    <>
      <AuthenTemplate>
        <Form
          labelCol={{
            span: 24,
          }}
          onFinish={handleRegister}
        >
          <h1>Create Account</h1>
          <FormItem
            label="Full Name"
            className="input-box custom-label"
            name="fullname"
            rules={[
              {
                required: true,
                message: "Please enter your full name.",
              },
            ]}
          >
            <Input
              variant="filled"
              className="input"
              type="text"
              placeholder="Enter your full name"
            />
          </FormItem>

          <FormItem
            label="Email Address"
            className="input-box custom-label"
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter your email address.",
              },
            ]}
          >
            <Input
              variant="filled"
              className="input"
              type="text"
              placeholder="Enter your email address"
            />
          </FormItem>

          <FormItem
            label="Password"
            className="input-box custom-label"
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your password.",
              },
            ]}
          >
            <Input.Password
              variant="filled"
              type="password"
              placeholder="Enter your password"
            />
          </FormItem>

          <FormItem
            label="Confirm Password"
            className="input-box custom-label"
            name="confirmpassword"
            rules={[
              {
                required: true,
                message: "Please confirm your password.",
              },
            ]}
          >
            <Input.Password
              variant="filled"
              type="password"
              placeholder="Enter your password"
            />
          </FormItem>

          <Button
            type="primary"
            htmlType="submit"
            className="register-login__btn"
          >
            Sign Up
          </Button>

          <Divider plain style={{ borderColor: "#ccc" }} className="divider">
            or
          </Divider>          <Button className="google-login_btn" color="default" variant="filled">
            <img
              className="google-logo"
              src="/src/components/images/google-logo.png"
              alt="google-logo"
            />
            <p>
              Continue with <span className="gg">Google</span>
            </p>
          </Button>
          <div className="register-login__link">
            <p>
              Already have an account?
              <a className="link" href="/login">
                Sign In
              </a>
            </p>
          </div>
        </Form>
      </AuthenTemplate>
    </>
  );
}

export default Register;
