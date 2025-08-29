// Wishlist store for managing user's favorite items
class WishlistStore {
  constructor() {
    this.wishlist = this.loadWishlist();
  }

  // Load wishlist from localStorage
  loadWishlist() {
    try {
      const saved = localStorage.getItem('art_hub_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading wishlist:', error);
      return [];
    }
  }

  // Save wishlist to localStorage
  saveWishlist() {
    try {
      localStorage.setItem('art_hub_wishlist', JSON.stringify(this.wishlist));
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  }

  // Add item to wishlist
  addToWishlist(product) {
    if (!this.isInWishlist(product.id)) {
      this.wishlist.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        category: product.category,
        addedAt: new Date().toISOString()
      });
      this.saveWishlist();
      return true;
    }
    return false;
  }

  // Remove item from wishlist
  removeFromWishlist(productId) {
    const initialLength = this.wishlist.length;
    this.wishlist = this.wishlist.filter(item => item.id !== productId);
    if (this.wishlist.length !== initialLength) {
      this.saveWishlist();
      return true;
    }
    return false;
  }

  // Check if item is in wishlist
  isInWishlist(productId) {
    return this.wishlist.some(item => item.id === productId);
  }

  // Get all wishlist items
  getWishlist() {
    return [...this.wishlist];
  }

  // Get wishlist count
  getWishlistCount() {
    return this.wishlist.length;
  }

  // Clear entire wishlist
  clearWishlist() {
    this.wishlist = [];
    this.saveWishlist();
  }

  // Toggle item in wishlist (add if not present, remove if present)
  toggleWishlist(product) {
    if (this.isInWishlist(product.id)) {
      return this.removeFromWishlist(product.id);
    } else {
      return this.addToWishlist(product);
    }
  }
}

// Create and export a single instance
const wishlistStore = new WishlistStore();
export default wishlistStore;
