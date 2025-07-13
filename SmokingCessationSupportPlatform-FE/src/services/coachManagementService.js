import api from "../config/axios";

export const coachService = {
  // Lấy danh sách huấn luyện viên
  getCoaches: async () => {
    const response = await api.get('/admin/mentors');
    return response.data;
  },

  // Lấy thông tin chi tiết một huấn luyện viên
  getCoachById: async (id) => {
    const response = await api.get(`/coaches/${id}`);
    return response.data;
  },

  // Tạo huấn luyện viên mới
  createCoach: async (coachData) => {
    const response = await api.post('/coaches', coachData);
    return response.data;
  },

  // Cập nhật thông tin huấn luyện viên
  updateCoach: async (id, coachData) => {
    const response = await api.put(`/coaches/${id}`, coachData);
    return response.data;
  },

  // Xóa huấn luyện viên
  deleteCoach: async (id) => {
    const response = await api.delete(`/coaches/${id}`);
    return response.data;
  },

  // Lấy tất cả slot của một mentor
  getMentorSlots: async (mentorId) => {
    try {
      const response = await api.get(`/admin/mentor/${mentorId}/slots/all`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching slots for mentor ${mentorId}:`, error);
      // Trả về array rỗng nếu có lỗi để không break UI
      return [];
    }
  },

  // Lấy rating trung bình của mentor theo id
  getMentorRating: async (mentorId) => {
    try {
      const response = await api.get(`/profile/mentors/${mentorId}`);
      return response.data.averageRating ?? 0;
    } catch (error) {
      console.error(`Error fetching rating for mentor ${mentorId}:`, error);
      return 0;
    }
  },
};