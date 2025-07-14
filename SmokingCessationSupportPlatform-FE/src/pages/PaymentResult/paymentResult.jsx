import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../store/redux/features/userSlice";
import { FaCheckCircle, FaTimesCircle, FaHome } from "react-icons/fa";
import "./paymentResult.css";

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null); // "success" | "fail"

  // Lấy profile mới nhất và cập nhật redux + localStorage
  const fetchUserProfile = async () => {
    try {
      const res = await axios.get("/api/profile/my");
      localStorage.setItem("user", JSON.stringify(res.data));
      dispatch(login(res.data)); // Update redux store!
    } catch (error) {
      console.error("Lỗi lấy profile mới:", error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const transactionId = params.get("transaction_id");
    const responseCode = params.get("vnp_ResponseCode");
    if (!transactionId || !responseCode) {
      setResult("fail");
      setLoading(false);
      return;
    }
    axios
      .get("/api/subscription/payment/return", {
        params: {
          transaction_id: transactionId,
          vnp_ResponseCode: responseCode,
        },
      })
      .then(async () => {
        if (responseCode === "00") {
          setResult("success");
          setLoading(true);
          await fetchUserProfile();
          setLoading(false);
        } else {
          setResult("fail");
        }
      })
      .catch(() => setResult("fail"))
      .finally(() => {
        if (responseCode !== "00") setLoading(false);
      });
  }, [location]);

  if (loading) {
    return (
      <div className="payment-result-background">
        <div className="payment-result-loading">
          Đang xác nhận thanh toán, vui lòng chờ...
        </div>
      </div>
    );
  }

  return (
    <div className="payment-result-background">
      <div className="payment-result-card">
        {result === "success" ? (
          <>
            <div className="icon-success">
              <FaCheckCircle size={48} />
            </div>
            <h2 className="result-title success">Thanh toán thành công!</h2>
            <p className="result-message">
              Cảm ơn bạn đã thanh toán. Quyền Premium đã được kích hoạt, bạn có
              thể về trang chủ.
            </p>
            <button className="btn-home" onClick={() => navigate("/")}>
              <FaHome className="mr-2" /> Về trang chủ
            </button>
          </>
        ) : (
          <>
            <div className="icon-fail">
              <FaTimesCircle size={48} />
            </div>
            <h2 className="result-title fail">Thanh toán thất bại!</h2>
            <p className="result-message">
              Vui lòng thử lại hoặc liên hệ hỗ trợ.
            </p>
            <button className="btn-home" onClick={() => navigate("/")}>
              <FaHome className="mr-2" /> Về trang chủ
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentResult;
