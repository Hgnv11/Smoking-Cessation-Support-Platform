import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "@ant-design/v5-patch-for-react-19";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <>
    <ToastContainer />
    <App />
  </>
);
