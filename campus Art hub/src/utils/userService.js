// User Service for managing user authentication and registration
// Simulates a real backend user management system

class UserService {
  constructor() {
    this.usersKey = 'art_hub_users';
    this.currentUserKey = 'art_hub_current_user';
  }

  // Get all users
  getAllUsers() {
    try {
      return JSON.parse(localStorage.getItem(this.usersKey)) || [];
    } catch {
      return [];
    }
  }

  // Register a new user
  registerUser(userData) {
    const users = this.getAllUsers();
    
    // Check if email already exists
    const existingUser = users.find(user => user.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
      throw new Error('Email already registered. Please use a different email or login.');
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
      isAdmin: false
    };

    // Add to users array
    users.push(newUser);
    localStorage.setItem(this.usersKey, JSON.stringify(users));

    // Auto-login the new user
    this.loginUser(newUser.email, newUser.password);
    
    return newUser;
  }

  // Login user
  loginUser(email, password) {
    const users = this.getAllUsers();
    const user = users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Store current user (without password)
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(this.currentUserKey, JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  }

  // Get current logged in user
  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(this.currentUserKey)) || null;
    } catch {
      return null;
    }
  }

  // Logout user
  logoutUser() {
    localStorage.removeItem(this.currentUserKey);
  }

  // Update user profile
  updateUserProfile(userId, updates) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Update user data
    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem(this.usersKey, JSON.stringify(users));

    // Update current user if it's the same user
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      const { password: _, ...userWithoutPassword } = users[userIndex];
      localStorage.setItem(this.currentUserKey, JSON.stringify(userWithoutPassword));
    }

    return users[userIndex];
  }

  // Check if email exists (for forgot password)
  checkEmailExists(email) {
    const users = this.getAllUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  }

  // Reset password (in a real app, this would be more secure)
  resetPassword(email, newPassword) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (userIndex === -1) {
      throw new Error('Email not found');
    }

    users[userIndex].password = newPassword;
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    
    return users[userIndex];
  }

  // Validate email format
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  validatePassword(password) {
    return password.length >= 6;
  }

  // Check if user is admin
  isAdmin() {
    const currentUser = this.getCurrentUser();
    return currentUser && currentUser.isAdmin;
  }

  // Create admin user if none exists
  initializeAdminUser() {
    const users = this.getAllUsers();
    const adminExists = users.some(user => user.isAdmin);
    
    if (!adminExists) {
      const adminUser = {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@campusarthub.com',
        password: 'admin123',
        phone: '+91 98765 43210',
        address: 'Campus Address',
        isAdmin: true,
        createdAt: new Date().toISOString()
      };
      
      users.push(adminUser);
      localStorage.setItem(this.usersKey, JSON.stringify(users));
      console.log('✅ Admin user created: admin@campusarthub.com / admin123');
    }
  }
}

// Create singleton instance
const userService = new UserService();

// Initialize admin user on first load
userService.initializeAdminUser();

export default userService; 