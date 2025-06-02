import { Form, Input, Button, Checkbox, Divider } from "antd";
import FormItem from "antd/es/form/FormItem";
import AuthenTemplate from "../../components/authen-template/authen-template";

function Login() {
  const handleLogin = () => {};

  return (
    <>
      <AuthenTemplate>
        <Form
          labelCol={{
            span: 24,
          }}
          onFinish={handleLogin}
        >
          <h1>Sign In</h1>
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
          <FormItem
            label="Password"
            className="input-box custom-label"
            name="password"
            rules={[{ required: true, message: "Please enter your password." }]}
          >
            <Input type="password" placeholder="Enter your password" />
          </FormItem>

          <div className="remember-forgot">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a href="/forgot-password">Forgot your password?</a>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            className="register-login__btn"
          >
            Sign in
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
              Don't have an account?
              <a className="link" href="/register">
                Sign Up
              </a>
            </p>
          </div>
        </Form>
      </AuthenTemplate>
    </>
  );
}

export default Login;
