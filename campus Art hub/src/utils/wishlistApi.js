// Local storage-based wishlist operations
export async function getWishlist(userId) {
  const wishlistKey = `art_hub_wishlist_${userId}`;
  const wishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]');
  return wishlist;
}

export async function addToWishlist(userId, productId) {
  const wishlistKey = `art_hub_wishlist_${userId}`;
  const wishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]');
  
  const existingItem = wishlist.find(item => item.product_id === productId);
  if (existingItem) return existingItem;
  
  const newItem = {
    id: Date.now().toString(),
    user_id: userId,
    product_id: productId,
    created_at: new Date().toISOString()
  };
  
  wishlist.push(newItem);
  localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
  return newItem;
}

export async function removeFromWishlist(userId, productId) {
  const wishlistKey = `art_hub_wishlist_${userId}`;
  const wishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]');
  
  const filteredWishlist = wishlist.filter(item => item.product_id !== productId);
  localStorage.setItem(wishlistKey, JSON.stringify(filteredWishlist));
}

export async function isInWishlist(userId, productId) {
  const wishlistKey = `art_hub_wishlist_${userId}`;
  const wishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]');
  return wishlist.some(item => item.product_id === productId);
}