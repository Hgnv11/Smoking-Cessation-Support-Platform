import api from "../config/axios";

/**
 * Constants cho error messages
 */
const ERROR_MESSAGES = {
  INVALID_USER_DATA: 'Dữ liệu người dùng không hợp lệ',
  USER_ID_REQUIRED: 'User ID is required',
  USER_NOT_FOUND: 'Không tìm thấy người dùng',
  NO_PERMISSION: 'Không có quyền truy cập',
  EMAIL_EXISTS: 'Email hoặc tên người dùng đã tồn tại',
  SERVER_ERROR: 'Lỗi server, vui lòng thử lại sau',
  GENERIC_ERROR: 'Có lỗi xảy ra, vui lòng thử lại'
};

/**
 * Helper function để validate user data
 * @param {Object} userData - Dữ liệu người dùng
 * @returns {boolean} - true nếu valid
 */
const validateUserData = (userData) => {
  if (!userData || typeof userData !== 'object') {
    return false;
  }
  
  // Kiểm tra các trường bắt buộc
  const requiredFields = ['email'];
  for (const field of requiredFields) {
    if (!userData[field]) {
      return false;
    }
  }
  
  // Validate email format
  if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    return false;
  }
  
  return true;
};

/**
 * Helper function để xử lý lỗi API
 * @param {Error} error - Error object
 * @param {string} operation - Tên operation đang thực hiện
 * @returns {Error} - Formatted error
 */
const handleApiError = (error, operation) => {
  console.error(`${operation} error:`, error);
  
  if (error.message && Object.values(ERROR_MESSAGES).includes(error.message)) {
    return error;
  }
  
  const status = error.response?.status;
  
  switch (status) {
    case 400:
      return new Error(ERROR_MESSAGES.INVALID_USER_DATA);
    case 403:
      return new Error(ERROR_MESSAGES.NO_PERMISSION);
    case 404:
      return new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    case 409:
      return new Error(ERROR_MESSAGES.EMAIL_EXISTS);
    default:
      if (status >= 500) {
        return new Error(ERROR_MESSAGES.SERVER_ERROR);
      }
      return new Error(ERROR_MESSAGES.GENERIC_ERROR);
  }
};

/**
 * User Service để quản lý các API liên quan đến người dùng
 */
export const userService = {
  /**
   * Lấy thông tin chi tiết một người dùng
   * @param {string} id - ID của người dùng
   * @returns {Promise<Object>} - Thông tin chi tiết người dùng
   */
  getUserById: async (id) => {
    try {
      console.log('Fetching user details for ID:', id);
      
      if (!id) {
        throw new Error(ERROR_MESSAGES.USER_ID_REQUIRED);
      }

      const response = await api.get(`admin/users/${id}`);
      console.log('User details fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'getUserById');
    }
  },

  /**
   * Tạo người dùng mới
   * @param {Object} userData - Dữ liệu người dùng
   * @returns {Promise<Object>} - Thông tin người dùng đã tạo
   */
  createUser: async (userData) => {
    try {
      console.log('Creating new user with data:', userData);
      
      if (!validateUserData(userData)) {
        throw new Error(ERROR_MESSAGES.INVALID_USER_DATA);
      }

      const response = await api.post('users', userData);
      console.log('User created successfully:', response.data);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'createUser');
    }
  },

  /**
   * Cập nhật thông tin người dùng
   * @param {string} id - ID của người dùng
   * @param {Object} userData - Dữ liệu cập nhật
   * @returns {Promise<Object>} - Thông tin người dùng đã cập nhật
   */
  updateUser: async (id, userData) => {
    try {
      console.log('Updating user:', id, 'with data:', userData);
      
      if (!id) {
        throw new Error(ERROR_MESSAGES.USER_ID_REQUIRED);
      }
      
      if (!validateUserData(userData)) {
        throw new Error(ERROR_MESSAGES.INVALID_USER_DATA);
      }
      
      const response = await api.put(`admin/users/${id}`, userData);
      console.log('Update response:', response.data);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'updateUser');
    }
  },

  /**
   * Xóa mềm người dùng
   * @param {string} id - ID của người dùng cần xóa
   * @returns {Promise<Object>} - Kết quả xóa người dùng
   */
  deleteUser: async (id) => {
    try {
      console.log('Deleting user with ID:', id);
      
      if (!id) {
        throw new Error(ERROR_MESSAGES.USER_ID_REQUIRED);
      }
      
      const response = await api.delete(`admin/users/${id}`);
      console.log('User deleted successfully:', response.data);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'deleteUser');
    }
  },

  /**
   * Lấy danh sách user cho admin
   * @returns {Promise<Array>} - Danh sách người dùng
   */
  fetchAdminUsers: async () => {
    try {
      console.log('Fetching admin users list');
      
      const response = await api.get('admin/users');
      console.log('Admin users fetched successfully, count:', response.data?.length || 0);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'fetchAdminUsers');
    }
  },

  /**
   * Lấy lịch sử hút thuốc của người dùng
   * @param {string} userId - ID của người dùng
   * @returns {Promise<Array>} - Dữ liệu lịch sử hút thuốc
   */
  getSmokingProgressId: async (userId) => {
    try {
      console.log('Fetching smoking progress for user ID:', userId);
      
      if (!userId) {
        throw new Error(ERROR_MESSAGES.USER_ID_REQUIRED);
      }
      
      const response = await api.get(`admin/smoking-progress/user/${userId}`);
      console.log("Smoking progress data:", response.data);
      return response.data;
    } catch (error) {
      console.error("getSmokingProgressId error:", error);
      
      // Đối với smoking progress, có thể user chưa có data nên trả về array rỗng thay vì throw error
      if (error.message === ERROR_MESSAGES.USER_ID_REQUIRED) {
        throw error;
      } else if (error.response?.status === 404) {
        console.warn("No smoking progress found for user, returning empty array");
        return [];
      } else if (error.response?.status >= 500) {
        console.warn("Server error, returning empty array");
        return [];
      } else {
        console.warn("Unknown error, returning empty array");
        return [];
      }
    }
  }
};