// Local storage-based authentication system (no Supabase)

export async function signUp({ email, password, ...userData }) {
  try {
    const users = JSON.parse(localStorage.getItem('art_hub_users') || '[]');
    
    // Check if user already exists
    if (users.find(user => user.email === email)) {
      throw new Error('User already exists with this email');
    }
    
    const newUser = {
      id: 'user_' + Date.now(),
      email,
      password, // In production, this should be hashed
      ...userData,
      is_admin: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('art_hub_users', JSON.stringify(users));
    
    // Auto-login after signup
    const sessionUser = { ...newUser };
    delete sessionUser.password;
    localStorage.setItem('art_hub_current_user', JSON.stringify(sessionUser));
    
    return { user: sessionUser };
  } catch (error) {
    console.error('Auth signUp error:', error);
    throw error;
  }
}

export async function signIn({ email, password }) {
  // Clear existing users and create fresh admin
  const defaultAdmin = {
    id: 'admin_1',
    email: 'admin@campusarthub.com',
    password: 'admin123',
    name: 'Admin User',
    is_admin: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Always reset with fresh admin user
  localStorage.setItem('art_hub_users', JSON.stringify([defaultAdmin]));
  console.log('Reset admin user:', defaultAdmin);
  
  // Check credentials
  if (email === 'admin@campusarthub.com' && password === 'admin123') {
    const sessionUser = {
      id: 'admin_1',
      email: 'admin@campusarthub.com',
      name: 'Admin User',
      is_admin: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('Session user before storage:', sessionUser);
    localStorage.setItem('art_hub_current_user', JSON.stringify(sessionUser));
    return { user: sessionUser };
  } else {
    return { error: 'Invalid credentials' };
  }
}

export async function signOut() {
  try {
    localStorage.removeItem('art_hub_current_user');
  } catch (error) {
    console.error('Auth signOut error:', error);
    throw error;
  }
}

export async function getSession() {
  try {
    const currentUser = JSON.parse(localStorage.getItem('art_hub_current_user'));
    return currentUser ? { user: currentUser } : null;
  } catch (error) {
    console.error('Auth getSession error:', error);
    return null;
  }
}

export function onAuthStateChange(callback) {
  // Simple implementation for localStorage auth
  const checkAuth = () => {
    const session = JSON.parse(localStorage.getItem('art_hub_current_user'));
    callback('SIGNED_IN', session ? { user: session } : null);
  };
  
  // Check immediately
  checkAuth();
  
  // Return unsubscribe function
  return { data: { subscription: { unsubscribe: () => {} } } };
}

export async function resetPassword(email) {
  try {
    // For demo purposes, just return success
    console.log('Password reset requested for:', email);
    return { data: { success: true } };
  } catch (error) {
    console.error('Auth resetPassword error:', error);
    throw error;
  }
} 