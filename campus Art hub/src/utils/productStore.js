// Local storage-based product store
import { getAllProducts } from './productApi';

class ProductStore {
  constructor() {
    this.products = [];
    this.initialized = false;
  }

  async initialize() {
    if (!this.initialized) {
      this.products = await getAllProducts();
      this.initialized = true;
    }
  }

  async getProductById(id) {
    await this.initialize();
    return this.products.find(product => product.id === id);
  }

  async getAllProducts() {
    await this.initialize();
    return this.products;
  }

  async getProductsByCategory(category) {
    await this.initialize();
    return this.products.filter(product => product.category === category);
  }

  async searchProducts(searchTerm) {
    await this.initialize();
    return this.products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Refresh products from storage
  async refresh() {
    this.products = await getAllProducts();
  }
}

// Export singleton instance
const productStore = new ProductStore();
export default productStore;
