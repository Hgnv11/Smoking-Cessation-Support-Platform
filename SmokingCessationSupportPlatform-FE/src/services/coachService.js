import api from "../config/axios";

export const coachService = {
    // Tổng quan dashboard huấn luyện viên
  getDashboardOverview: async () => {
    const response = await api.get("mentor-dashboard/overview");
    return response.data;
  }
};
