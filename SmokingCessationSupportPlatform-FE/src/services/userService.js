import api from "../config/axios";

export const userService = {

  // Lấy thông tin chi tiết một người dùng
  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  // Tạo người dùng mới
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Cập nhật thông tin người dùng
  updateUser: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  // Xóa người dùng
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Lấy danh sách user cho admin
  fetchAdminUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
}; 