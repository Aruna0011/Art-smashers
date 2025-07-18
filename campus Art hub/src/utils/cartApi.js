import { supabase } from './supabaseClient';

export async function getCart(userId) {
  let { data, error } = await supabase.from('carts').select('items').eq('user_id', userId).single();
  if (error && error.code !== 'PGRST116') throw error;
  return data ? data.items : [];
}

export async function setCart(userId, items) {
  // Upsert the cart for the user
  let { error } = await supabase.from('carts').upsert({ user_id: userId, items });
  if (error) throw error;
}

export async function addToCart(userId, item) {
  const cart = await getCart(userId);
  const existing = cart.find(i => i.id === item.id);
  let newCart;
  if (existing) {
    newCart = cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i);
  } else {
    newCart = [...cart, { ...item, quantity: item.quantity || 1 }];
  }
  await setCart(userId, newCart);
}

export async function updateCartItem(userId, itemId, updates) {
  const cart = await getCart(userId);
  const newCart = cart.map(i => i.id === itemId ? { ...i, ...updates } : i);
  await setCart(userId, newCart);
}

export async function removeFromCart(userId, itemId) {
  const cart = await getCart(userId);
  const newCart = cart.filter(i => i.id !== itemId);
  await setCart(userId, newCart);
}

export async function clearCart(userId) {
  await setCart(userId, []);
} 