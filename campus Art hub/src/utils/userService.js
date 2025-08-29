// Local storage-based user service
import { getAllUsers, updateUser, deleteUser } from './userApi';
import { getSession } from './supabaseAuth';

class UserService {
  constructor() {
    this.currentUser = null;
  }

  // Get current logged-in user
  async getCurrentUser() {
    try {
      const session = await getSession();
      if (session && session.user) {
        this.currentUser = session.user;
        return session.user;
      }
      
      // Fallback to localStorage
      const user = JSON.parse(localStorage.getItem('art_hub_current_user'));
      this.currentUser = user;
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Update user profile
  async updateProfile(userId, updates) {
    try {
      const updatedUser = await updateUser(userId, updates);
      if (this.currentUser && this.currentUser.id === userId) {
        this.currentUser = updatedUser;
      }
      return updatedUser;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Check if user is admin
  async isAdmin() {
    const user = await this.getCurrentUser();
    return user && user.is_admin === true;
  }

  // Get user by ID
  async getUserById(userId) {
    try {
      const users = await getAllUsers();
      return users.find(user => user.id === userId);
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  // Get all users (admin only)
  async getAllUsers() {
    try {
      const isUserAdmin = await this.isAdmin();
      if (!isUserAdmin) {
        throw new Error('Unauthorized: Admin access required');
      }
      return await getAllUsers();
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  // Delete user (admin only)
  async deleteUser(userId) {
    try {
      const isUserAdmin = await this.isAdmin();
      if (!isUserAdmin) {
        throw new Error('Unauthorized: Admin access required');
      }
      await deleteUser(userId);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Sign out user
  signOut() {
    this.currentUser = null;
    localStorage.removeItem('art_hub_current_user');
  }
}

// Export singleton instance
const userService = new UserService();
export default userService;
