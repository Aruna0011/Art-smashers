import { supabase } from './supabaseClient';

export async function getWishlist(userId) {
  try {
    let { data, error } = await supabase.from('wishlist').select('*').eq('user_id', userId);
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Supabase getWishlist error:', error);
    // Fallback to local storage
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      const wishlist = JSON.parse(localStorage.getItem(`art_hub_wishlist_${userId}`) || '[]');
      return wishlist;
    }
    throw error;
  }
}

export async function addToWishlist(userId, productId) {
  try {
    let { data, error } = await supabase.from('wishlist').insert([{ user_id: userId, product_id: productId }]);
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Supabase addToWishlist error:', error);
    // Fallback to local storage
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      const wishlist = JSON.parse(localStorage.getItem(`art_hub_wishlist_${userId}`) || '[]');
      if (!wishlist.find(item => item.product_id === productId)) {
        wishlist.push({ user_id: userId, product_id: productId, id: Date.now() });
        localStorage.setItem(`art_hub_wishlist_${userId}`, JSON.stringify(wishlist));
      }
      return { user_id: userId, product_id: productId };
    }
    throw error;
  }
}

export async function removeFromWishlist(userId, productId) {
  try {
    let { error } = await supabase.from('wishlist').delete().eq('user_id', userId).eq('product_id', productId);
    if (error) throw error;
  } catch (error) {
    console.error('Supabase removeFromWishlist error:', error);
    // Fallback to local storage
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      const wishlist = JSON.parse(localStorage.getItem(`art_hub_wishlist_${userId}`) || '[]');
      const filteredWishlist = wishlist.filter(item => item.product_id !== productId);
      localStorage.setItem(`art_hub_wishlist_${userId}`, JSON.stringify(filteredWishlist));
    } else {
      throw error;
    }
  }
}

export async function isInWishlist(userId, productId) {
  try {
    let { data, error } = await supabase.from('wishlist').select('*').eq('user_id', userId).eq('product_id', productId);
    if (error) throw error;
    return data && data.length > 0;
  } catch (error) {
    console.error('Supabase isInWishlist error:', error);
    // Fallback to local storage
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      const wishlist = JSON.parse(localStorage.getItem(`art_hub_wishlist_${userId}`) || '[]');
      return wishlist.some(item => item.product_id === productId);
    }
    throw error;
  }
} 