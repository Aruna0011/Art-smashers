// Cart Store for managing cart state
class CartStore {
  constructor() {
    this.cartKey = 'campus-art-hub-cart';
    this.items = this.loadFromStorage();
  }

  // Load cart from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.cartKey);
      const items = stored ? JSON.parse(stored) : [];
      this.items = items; // Ensure in-memory items are updated
      return items;
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      this.items = [];
      return [];
    }
  }

  // Save cart to localStorage
  saveToStorage() {
    try {
      localStorage.setItem(this.cartKey, JSON.stringify(this.items));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  // Get all cart items
  getCartItems() {
    return this.items;
  }

  // Add item to cart
  addToCart(product, quantity = 1) {
    const existingItem = this.items.find(item => item.id === product.id);
    const mainImage = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : product.image;
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: mainImage,
        artist: product.artist || '',
        quantity: quantity
      });
    }
    
    this.saveToStorage();
    this.notifyListeners();
  }

  // Update item quantity
  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    
    const item = this.items.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  // Remove item from cart
  removeFromCart(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveToStorage();
    this.notifyListeners();
  }

  // Clear entire cart
  clearCart() {
    this.items = [];
    this.saveToStorage();
    this.notifyListeners();
  }

  // Get cart total
  getTotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // Get cart count
  getCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Check if cart is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Event listeners for cart updates
  listeners = [];

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.items));
  }
}

// Create singleton instance
export const cartStore = new CartStore(); 