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
    console.error('Auth signUp error:', error);
    throw error;
  }
}

export async function signIn({ email, password }) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Auth signIn error:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Auth signOut error:', error);
    throw error;
  }
}

export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error('Auth getSession error:', error);
    throw error;
  }
}

export function onAuthStateChange(callback) {
  try {
    return supabase.auth.onAuthStateChange(callback);
  } catch (error) {
    console.error('Auth onAuthStateChange error:', error);
    throw error;
  }
}

export async function resetPassword(email) {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Auth resetPassword error:', error);
    throw error;
  }
} 