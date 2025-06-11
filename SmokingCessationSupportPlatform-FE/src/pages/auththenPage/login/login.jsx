import { Form, Input, Button, Checkbox, Divider } from "antd";
import FormItem from "antd/es/form/FormItem";
import AuthenTemplate from "../../../components/authen-template/authen-template";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (values) => {
    try {
      const response = await api.post("auth/login", values);
      const { user, token } = response.data;
      
      // Store user data and token in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      toast.success("Đăng nhập thành công");
      
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        // If there's a redirect path in location state, use it
        const from = location.state?.from?.pathname || '/';
        navigate(from);
      }
    } catch (err) {
      toast.error("Đăng nhập thất bại");
      console.log(err);
    }
  };

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
          <FormItem
            label="Password"
            className="input-box custom-label"
            name="password"
            rules={[{ required: true, message: "Please enter your password." }]}
          >
            <Input.Password
              variant="filled"
              type="password"
              placeholder="Enter your password"
            />
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
          </Divider>

          <Button
            htmlType="submit"
            className="google-login_btn"
            color="default"
            variant="filled"
          >
            <img
              className="google-logo"
              src="../src/components/images/google-logo.png"
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
