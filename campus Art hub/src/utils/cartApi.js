// Local storage-based cart operations
export async function getCart(userId) {
  const cartKey = `art_hub_cart_${userId}`;
  const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
  return cart;
}

export async function addToCart(userId, productId, quantity) {
  const cartKey = `art_hub_cart_${userId}`;
  const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
  
  const existingItem = cart.find(item => item.product_id === productId);
  if (existingItem) {
    existingItem.quantity = quantity;
    existingItem.updated_at = new Date().toISOString();
  } else {
    const newItem = {
      id: Date.now().toString(),
      user_id: userId,
      product_id: productId,
      quantity,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    cart.push(newItem);
  }
  
  localStorage.setItem(cartKey, JSON.stringify(cart));
  return existingItem || cart[cart.length - 1];
}

export async function updateCartItem(userId, productId, quantity) {
  const cartKey = `art_hub_cart_${userId}`;
  const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
  
  const item = cart.find(item => item.product_id === productId);
  if (!item) throw new Error('Cart item not found');
  
  item.quantity = quantity;
  item.updated_at = new Date().toISOString();
  
  localStorage.setItem(cartKey, JSON.stringify(cart));
  return item;
}

export async function removeFromCart(userId, productId) {
  const cartKey = `art_hub_cart_${userId}`;
  const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
  
  const filteredCart = cart.filter(item => item.product_id !== productId);
  localStorage.setItem(cartKey, JSON.stringify(filteredCart));
}

export async function clearCart(userId) {
  const cartKey = `art_hub_cart_${userId}`;
  localStorage.removeItem(cartKey);
}