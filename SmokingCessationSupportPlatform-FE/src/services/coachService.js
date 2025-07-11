import api from "../config/axios";

export const coachService = {
    // Tổng quan dashboard huấn luyện viên
  getDashboardOverview: async () => {
    const response = await api.get("mentor-dashboard/overview");
    return response.data;
  },
  // Lấy danh sách consultations của mentor
  getMentorConsultations: async () => {
    const response = await api.get("consultations/mentor");
    return response.data;
  },
  // Lấy tiến trình cai thuốc của user theo userId
  getUserSmokingProgress: async (userId) => {
    const response = await api.get(`/mentor-dashboard/smoking-progress/user/${userId}`);
    return response.data;
  }
};
