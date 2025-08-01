import { supabase } from './supabaseClient';

export async function signUp({ email, password, ...userData }) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: userData }
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Supabase signUp error:', error);
    // Fallback to local storage if Supabase is not configured
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      return fallbackSignUp({ email, password, ...userData });
    }
    throw error;
  }
}

export async function signIn({ email, password }) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Supabase signIn error:', error);
    // Fallback to local storage if Supabase is not configured
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      return fallbackSignIn({ email, password });
    }
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Supabase signOut error:', error);
    // Fallback to local storage cleanup
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      fallbackSignOut();
    } else {
      throw error;
    }
  }
}

export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error('Supabase getSession error:', error);
    // Fallback to local storage session
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      return fallbackGetSession();
    }
    throw error;
  }
}

export function onAuthStateChange(callback) {
  try {
    return supabase.auth.onAuthStateChange(callback);
  } catch (error) {
    console.error('Supabase onAuthStateChange error:', error);
    // Fallback to local storage listener
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      return fallbackOnAuthStateChange(callback);
    }
    throw error;
  }
}

export async function resetPassword(email) {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Supabase resetPassword error:', error);
    // Fallback to local storage reset
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      return fallbackResetPassword(email);
    }
    throw error;
  }
}

// Fallback functions for when Supabase is not configured
function fallbackSignUp({ email, password, ...userData }) {
  const users = JSON.parse(localStorage.getItem('art_hub_users') || '[]');
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    throw new Error('Email already registered');
  }
  
  const newUser = {
    id: Date.now().toString(),
    email,
    ...userData,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('art_hub_users', JSON.stringify(users));
  localStorage.setItem('art_hub_current_user', JSON.stringify(newUser));
  
  return { user: newUser, session: { user: newUser } };
}

function fallbackSignIn({ email, password }) {
  const users = JSON.parse(localStorage.getItem('art_hub_users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  localStorage.setItem('art_hub_current_user', JSON.stringify(user));
  return { user, session: { user } };
}

function fallbackSignOut() {
  localStorage.removeItem('art_hub_current_user');
}

function fallbackGetSession() {
  const user = JSON.parse(localStorage.getItem('art_hub_current_user'));
  return user ? { user } : null;
}

function fallbackOnAuthStateChange(callback) {
  // Simple fallback that doesn't actually listen for changes
  return { data: { subscription: null } };
}

function fallbackResetPassword(email) {
  // Mock password reset for local storage
  return { message: 'Password reset email sent (mock)' };
} 