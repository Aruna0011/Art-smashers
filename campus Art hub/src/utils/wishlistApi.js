import { supabase } from './supabaseClient';

export async function getWishlist(userId) {
  let { data, error } = await supabase.from('wishlists').select('items').eq('user_id', userId).single();
  if (error && error.code !== 'PGRST116') throw error;
  return data ? data.items : [];
}

export async function setWishlist(userId, items) {
  // Upsert the wishlist for the user
  let { error } = await supabase.from('wishlists').upsert({ user_id: userId, items });
  if (error) throw error;
}

export async function addToWishlist(userId, item) {
  const wishlist = await getWishlist(userId);
  const exists = wishlist.some(i => i.id === item.id);
  if (!exists) {
    await setWishlist(userId, [...wishlist, item]);
  }
}

export async function removeFromWishlist(userId, itemId) {
  const wishlist = await getWishlist(userId);
  const newWishlist = wishlist.filter(i => i.id !== itemId);
  await setWishlist(userId, newWishlist);
} 