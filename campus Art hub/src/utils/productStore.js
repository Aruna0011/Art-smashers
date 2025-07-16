// Simple product store for managing products across components
class ProductStore {
  constructor() {
    this.products = this.loadProducts();
    this.initializeDefaultProducts();
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

  initializeDefaultProducts() {
    const existingProducts = this.getAllProducts();
    if (existingProducts.length === 0) {
      console.log('Initializing default products...');
      const defaultProducts = [
        {
          id: 1,
          name: 'Abstract Canvas Painting',
          category: 'Painting',
          price: 2500,
          stock: 5,
          description: 'Beautiful abstract painting with vibrant colors and modern design.',
          image: 'Art.jpg',
          sold: 0,
          status: 'active'
        },
        {
          id: 2,
          name: 'Handmade Pottery Vase',
          category: 'Pottery',
          price: 1200,
          stock: 8,
          description: 'Elegant handmade pottery vase perfect for home decoration.',
          image: 'handmade.jpg',
          sold: 0,
          status: 'active'
        },
        {
          id: 3,
          name: 'Digital Art Print',
          category: 'Digital Art',
          price: 800,
          stock: 15,
          description: 'High-quality digital art print with stunning visual effects.',
          image: 'design 2.jpg',
          sold: 0,
          status: 'active'
        },
        {
          id: 4,
          name: 'Sculptural Installation',
          category: 'Sculpture',
          price: 3500,
          stock: 3,
          description: 'Unique sculptural piece that adds character to any space.',
          image: 'design 3.jpg',
          sold: 0,
          status: 'active'
        },
        {
          id: 5,
          name: 'Nature Photography',
          category: 'Photography',
          price: 600,
          stock: 12,
          description: 'Captivating nature photography capturing the beauty of landscapes.',
          image: 'land1.jpg',
          sold: 0,
          status: 'active'
        },
        {
          id: 6,
          name: 'Mixed Media Artwork',
          category: 'Mixed Media',
          price: 1800,
          stock: 6,
          description: 'Innovative mixed media artwork combining various materials and techniques.',
          image: 'design 5.jpg',
          sold: 0,
          status: 'active'
        }
      ];
      
      this.products = defaultProducts;
      this.saveProducts();
      console.log('Default products initialized:', defaultProducts.length);
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
    this.initializeDefaultProducts();
    console.log('Reset to default products:', this.products.length);
    return this.products;
  }
}

export const productStore = new ProductStore(); 