// Product Store for managing product state
class ProductStore {
  constructor() {
    this.productsKey = 'art_hub_products';
    this.products = this.loadFromStorage();
  }

  // Load products from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.productsKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading products from storage:', error);
      return [];
    }
  }

  // Save products to localStorage
  saveToStorage() {
    try {
      localStorage.setItem(this.productsKey, JSON.stringify(this.products));
    } catch (error) {
      console.error('Error saving products to storage:', error);
    }
  }

  // Get all products
  getAllProducts() {
    return this.products;
  }

  // Get product by ID
  getProductById(id) {
    return this.products.find(product => product.id === id);
  }

  // Add product
  addProduct(product) {
    const newProduct = {
      ...product,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    this.products.push(newProduct);
    this.saveToStorage();
    return newProduct;
  }

  // Update product
  updateProduct(id, updates) {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex !== -1) {
      this.products[productIndex] = { ...this.products[productIndex], ...updates };
      this.saveToStorage();
      return this.products[productIndex];
    }
    return null;
  }

  // Delete product
  deleteProduct(id) {
    this.products = this.products.filter(p => p.id !== id);
    this.saveToStorage();
  }

  // Get products by category
  getProductsByCategory(category) {
    return this.products.filter(product => product.category === category);
  }

  // Search products
  searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return this.products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.artist.toLowerCase().includes(searchTerm)
    );
  }

  // Get featured products
  getFeaturedProducts() {
    return this.products.filter(product => product.featured);
  }

  // Clear all products
  clearProducts() {
    this.products = [];
    this.saveToStorage();
  }
}

// Create singleton instance
const productStore = new ProductStore();

export default productStore; 