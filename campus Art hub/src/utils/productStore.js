// Simple product store for managing products across components
class ProductStore {
  constructor() {
    this.products = this.loadProducts();
  }

  loadProducts() {
    const saved = localStorage.getItem('artHubProducts');
    if (saved === null) {
      // No products in storage, return empty array
      return [];
    }
    // If localStorage exists, try to parse it
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      } else if (parsed && typeof parsed === 'object') {
        // If it's a single object, wrap it in an array
        console.warn('artHubProducts in localStorage was an object, wrapping in array.');
        return [parsed];
      } else {
        console.error('artHubProducts in localStorage is not an array or object.');
        return [];
      }
    } catch (error) {
      console.error('Error parsing artHubProducts from localStorage:', error);
      // Do NOT overwrite localStorage here!
      return [];
    }
  }

  saveProducts() {
    if (!Array.isArray(this.products)) {
      console.warn('Attempting to save non-array to localStorage! Wrapping in array.', this.products);
      this.products = [this.products];
    }
    try {
      localStorage.setItem('artHubProducts', JSON.stringify(this.products));
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('productsUpdated', { detail: this.products }));
      console.log('Products saved successfully');
    } catch (error) {
      console.error('Error saving products to localStorage:', error);
    }
  }

  getAllProducts() {
    // Always reload from localStorage to get latest
    this.products = this.loadProducts();
    return this.products;
  }

  addProduct(product) {
    try {
      console.log('Before add:', this.products);
      // Validate required fields
      if (!product.name || !product.category || !product.price || !product.stock) {
        console.error('Missing required fields:', product);
        return null;
      }
      const newProduct = {
        ...product,
        id: Date.now().toString(), // Use string for ID
        sold: 0,
        status: 'active',
        price: Number(product.price),
        stock: Number(product.stock),
      };
      this.products.push(newProduct);
      console.log('After add:', this.products);
      this.saveProducts();
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      return null;
    }
  }

  updateProduct(id, updates) {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updates };
      this.saveProducts();
      return this.products[index];
    }
    return null;
  }

  deleteProduct(id) {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveProducts();
      return true;
    }
    return false;
  }

  getProductById(id) {
    this.products = this.loadProducts();
    return this.products.find(p => p.id == id); // Use loose comparison
  }

  // Debug method to check current state
  debugState() {
    console.log('Current products in store:', this.products.length);
    console.log('Products:', this.products);
    console.log('localStorage content:', localStorage.getItem('artHubProducts'));
  }

  // Method to force reload from localStorage
  reloadFromStorage() {
    this.products = this.loadProducts();
    console.log('Reloaded products from storage:', this.products.length);
    return this.products;
  }

  // Method to reset to default products (for testing)
  resetToDefaults() {
    localStorage.removeItem('artHubProducts');
    this.products = [];
    console.log('Reset to default products:', this.products.length);
    return this.products;
  }
}

export const productStore = new ProductStore(); 