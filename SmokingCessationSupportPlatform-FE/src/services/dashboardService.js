import api from '../config/axios.js';

export const dashboardService = {
  // Fetch member distribution for Overall Members Distribution chart
  getMemberDistribution: async () => {
    try {
      const response = await api.get('/admin/users');
      const users = response.data;
      
      // Filter only users with role "user" (exclude admin, mentor)
      const regularUsers = users.filter(user => user.role === 'user');
      
      // Count Premium and Free members based on hasActive field
      const premiumMembers = regularUsers.filter(user => user.hasActive === true).length;
      const freeMembers = regularUsers.filter(user => user.hasActive === false).length;
      
      // Return data for the two groups
      return [
        { name: "Premium Members", value: premiumMembers },
        { name: "Free Members", value: freeMembers }
      ];
      
    } catch (error) {
      console.error('Failed to fetch member distribution:', error);
      // Return fallback data if API fails
      return [
        { name: "Premium Members", value: 0 },
        { name: "Free Members", value: 0 }
      ];
    }
  }
};