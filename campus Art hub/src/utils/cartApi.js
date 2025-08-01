import { supabase } from './supabaseClient';

export async function getCart(userId) {
  try {
    let { data, error } = await supabase.from('cart').select('*').eq('user_id', userId);
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Supabase getCart error:', error);
    // Fallback to local storage
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      const cart = JSON.parse(localStorage.getItem(`art_hub_cart_${userId}`) || '[]');
      return cart;
    }
    throw error;
  }
}

export async function addToCart(userId, productId, quantity = 1) {
  try {
    // Check if item already exists in cart
    let { data: existing, error: checkError } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') throw checkError;

    if (existing) {
      // Update quantity
      let { data, error } = await supabase
        .from('cart')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id);
      if (error) throw error;
      return data[0];
    } else {
      // Add new item
      let { data, error } = await supabase
        .from('cart')
        .insert([{ user_id: userId, product_id: productId, quantity }]);
      if (error) throw error;
      return data[0];
    }
  } catch (error) {
    console.error('Supabase addToCart error:', error);
    // Fallback to local storage
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      const cart = JSON.parse(localStorage.getItem(`art_hub_cart_${userId}`) || '[]');
      const existingItem = cart.find(item => item.product_id === productId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({ user_id: userId, product_id: productId, quantity, id: Date.now() });
      }
      
      localStorage.setItem(`art_hub_cart_${userId}`, JSON.stringify(cart));
      return { user_id: userId, product_id: productId, quantity };
    }
    throw error;
  }
}

export async function updateCartItem(userId, productId, quantity) {
  try {
    if (quantity <= 0) {
      return await removeFromCart(userId, productId);
    }

    let { data, error } = await supabase
      .from('cart')
      .update({ quantity })
      .eq('user_id', userId)
      .eq('product_id', productId);
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Supabase updateCartItem error:', error);
    // Fallback to local storage
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      const cart = JSON.parse(localStorage.getItem(`art_hub_cart_${userId}`) || '[]');
      const item = cart.find(item => item.product_id === productId);
      
      if (item) {
        if (quantity <= 0) {
          const filteredCart = cart.filter(item => item.product_id !== productId);
          localStorage.setItem(`art_hub_cart_${userId}`, JSON.stringify(filteredCart));
        } else {
          item.quantity = quantity;
          localStorage.setItem(`art_hub_cart_${userId}`, JSON.stringify(cart));
        }
      }
      return { user_id: userId, product_id: productId, quantity };
    }
    throw error;
  }
}

export async function removeFromCart(userId, productId) {
  try {
    let { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    if (error) throw error;
  } catch (error) {
    console.error('Supabase removeFromCart error:', error);
    // Fallback to local storage
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      const cart = JSON.parse(localStorage.getItem(`art_hub_cart_${userId}`) || '[]');
      const filteredCart = cart.filter(item => item.product_id !== productId);
      localStorage.setItem(`art_hub_cart_${userId}`, JSON.stringify(filteredCart));
    } else {
      throw error;
    }
  }
}

export async function clearCart(userId) {
  try {
    let { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', userId);
    if (error) throw error;
  } catch (error) {
    console.error('Supabase clearCart error:', error);
    // Fallback to local storage
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      localStorage.removeItem(`art_hub_cart_${userId}`);
    } else {
      throw error;
    }
  }
} 