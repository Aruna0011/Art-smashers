// Local storage-based client to replace Supabase
export const localStorageClient = {
  // Mock Supabase client structure for compatibility
  auth: {
    signUp: async ({ email, password, options = {} }) => {
      const users = JSON.parse(localStorage.getItem('art_hub_users') || '[]');
      const existingUser = users.find(user => user.email === email);
      
      if (existingUser) {
        throw new Error('Email already registered');
      }
      
      const newUser = {
        id: Date.now().toString(),
        email,
        password, // In production, this should be hashed
        ...options.data,
        created_at: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('art_hub_users', JSON.stringify(users));
      localStorage.setItem('art_hub_current_user', JSON.stringify(newUser));
      
      return { data: { user: newUser, session: { user: newUser } }, error: null };
    },
    
    signInWithPassword: async ({ email, password }) => {
      const users = JSON.parse(localStorage.getItem('art_hub_users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      localStorage.setItem('art_hub_current_user', JSON.stringify(user));
      return { data: { user, session: { user } }, error: null };
    },
    
    signOut: async () => {
      localStorage.removeItem('art_hub_current_user');
      return { error: null };
    },
    
    getSession: async () => {
      const user = JSON.parse(localStorage.getItem('art_hub_current_user'));
      return { data: { session: user ? { user } : null }, error: null };
    },
    
    onAuthStateChange: (callback) => {
      // Simple implementation - in a real app you'd want proper event listening
      return { data: { subscription: null } };
    },
    
    resetPasswordForEmail: async (email) => {
      // Mock password reset
      return { data: { message: 'Password reset email sent (mock)' }, error: null };
    }
  }
};

// Export as supabase for backward compatibility
export const supabase = localStorageClient;