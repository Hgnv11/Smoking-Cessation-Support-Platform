import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/redux/features/userSlice";
import { FaCheckCircle, FaTimesCircle, FaHome } from "react-icons/fa";
import "./paymentResult.css";
import api from "../../config/axios";

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null); // "success" | "fail"

  // Lấy profile mới nhất và cập nhật redux + localStorage
  const fetchUserProfile = useCallback(async () => {
    try {
      console.log("🔄 Fetching user profile...");
      const res = await api.get("profile/my");
      console.log("✅ Profile fetched:", res.data);

      // Kiểm tra nếu hasActive vẫn là null, thử fetch lại
      if (res.data.hasActive === null) {
        console.log("⚠️ hasActive is null, trying again in 2 seconds...");
        
        // Thử lại sau 2 giây
        setTimeout(async () => {
          try {
            const retryRes = await api.get("profile/my");
            console.log("🔄 Retry fetch result:", retryRes.data);
            
            if (retryRes.data.hasActive !== null) {
              localStorage.setItem("user", JSON.stringify(retryRes.data));
              dispatch(login(retryRes.data));
              console.log("✅ Profile updated with retry");
              
              // Dispatch custom event
              window.dispatchEvent(
                new CustomEvent("userUpdated", {
                  detail: retryRes.data,
                })
              );
            } else {
              console.log("⚠️ hasActive still null after retry");
            }
          } catch (retryError) {
            console.error("❌ Retry fetch failed:", retryError);
          }
        }, 2000);
      }

      // Cập nhật localStorage với data hiện tại (dù hasActive có thể null)
      localStorage.setItem("user", JSON.stringify(res.data));
      console.log("✅ localStorage updated");

      // Cập nhật Redux store
      dispatch(login(res.data));
      console.log("✅ Redux store updated");

      // Dispatch custom event để notify các component khác
      window.dispatchEvent(
        new CustomEvent("userUpdated", {
          detail: res.data,
        })
      );
    } catch (error) {
      console.error("❌ Lỗi lấy profile mới:", error);
    }
  }, [dispatch]);

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

          // Fetch user profile
          await fetchUserProfile();

          // Đợi thêm một chút để đảm bảo Redux được cập nhật
          setTimeout(() => {
            setLoading(false);
          }, 1000); // Tăng từ 500ms lên 1000ms
        } else {
          setResult("fail");
        }
      })
      .catch(() => setResult("fail"))
      .finally(() => {
        if (responseCode !== "00") setLoading(false);
      });
  }, [location, fetchUserProfile]);

  // Function để handle navigation và force refresh Redux
  const handleGoHome = async () => {
    console.log("🏠 Going home...");
    console.log("📊 Current Redux user state:", currentUser);

    // Kiểm tra nếu hasActive vẫn null, thử fetch lại
    if (currentUser && currentUser.hasActive === null) {
      console.log("⚠️ hasActive is still null, trying to fetch again...");
      try {
        const res = await api.get("profile/my");
        console.log("🔄 Final fetch before home:", res.data);
        
        if (res.data.hasActive !== null) {
          localStorage.setItem("user", JSON.stringify(res.data));
          dispatch(login(res.data));
          console.log("✅ Updated profile before going home");
        }
      } catch (error) {
        console.error("❌ Final fetch failed:", error);
      }
    }

    // Force refresh Redux với data từ localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log("🔄 Force refreshing Redux with:", user);
        dispatch(login(user));

        // Log lại để kiểm tra
        setTimeout(() => {
          console.log("📊 Redux state after refresh:", currentUser);
        }, 100);
      } catch (error) {
        console.error("❌ Error parsing user data:", error);
      }
    }

    // Navigate sau một delay nhỏ
    setTimeout(() => {
      navigate("/");
    }, 300);
  };

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
            <button className="btn-home" onClick={handleGoHome}>
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
            <button className="btn-home" onClick={handleGoHome}>
              <FaHome className="mr-2" /> Về trang chủ
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentResult;
