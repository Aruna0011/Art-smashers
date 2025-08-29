// Unified service that handles Supabase with localStorage fallback for complete sync
import imageApi from './supabaseImageApi';
import productApi from './supabaseProductApi';
import categoryApi from './supabaseCategoryApi';

class UnifiedService {
  constructor() {
    this.useSupabase = true;
  }

  // Check if Supabase is configured
  isSupabaseConfigured() {
    return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
  }

  // PRODUCTS
  async getAllProducts() {
    if (this.useSupabase && this.isSupabaseConfigured()) {
      try {
        return await productApi.getAllProducts();
      } catch (error) {
        console.error('Supabase products error, falling back to localStorage:', error);
        return this.getLocalProducts();
      }
    }
    return this.getLocalProducts();
  }

  async addProduct(product) {
    if (this.useSupabase && this.isSupabaseConfigured()) {
      try {
        const result = await productApi.addProduct(product);
        // Also save to localStorage for fallback
        this.saveLocalProduct(result);
        return result;
      } catch (error) {
        console.error('Supabase add product error, using localStorage:', error);
        return this.addLocalProduct(product);
      }
    }
    return this.addLocalProduct(product);
  }

  async updateProduct(id, updates) {
    if (this.useSupabase && this.isSupabaseConfigured()) {
      try {
        const result = await productApi.updateProduct(id, updates);
        // Update localStorage too
        this.updateLocalProduct(id, updates);
        return result;
      } catch (error) {
        console.error('Supabase update product error, using localStorage:', error);
        return this.updateLocalProduct(id, updates);
      }
    }
    return this.updateLocalProduct(id, updates);
  }

  async deleteProduct(id) {
    if (this.useSupabase && this.isSupabaseConfigured()) {
      try {
        await productApi.deleteProduct(id);
        // Delete from localStorage too
        this.deleteLocalProduct(id);
        return true;
      } catch (error) {
        console.error('Supabase delete product error, using localStorage:', error);
        return this.deleteLocalProduct(id);
      }
    }
    return this.deleteLocalProduct(id);
  }

  // CATEGORIES
  async getAllCategories() {
    if (this.useSupabase && this.isSupabaseConfigured()) {
      try {
        return await categoryApi.getAllCategories();
      } catch (error) {
        console.error('Supabase categories error, falling back to localStorage:', error);
        return this.getLocalCategories();
      }
    }
    return this.getLocalCategories();
  }

  async addCategory(category) {
    if (this.useSupabase && this.isSupabaseConfigured()) {
      try {
        const result = await categoryApi.addCategory(category);
        this.saveLocalCategory(result);
        return result;
      } catch (error) {
        console.error('Supabase add category error, using localStorage:', error);
        return this.addLocalCategory(category);
      }
    }
    return this.addLocalCategory(category);
  }

  async updateCategory(id, updates) {
    if (this.useSupabase && this.isSupabaseConfigured()) {
      try {
        const result = await categoryApi.updateCategory(id, updates);
        this.updateLocalCategory(id, updates);
        return result;
      } catch (error) {
        console.error('Supabase update category error, using localStorage:', error);
        return this.updateLocalCategory(id, updates);
      }
    }
    return this.updateLocalCategory(id, updates);
  }

  async deleteCategory(id) {
    if (this.useSupabase && this.isSupabaseConfigured()) {
      try {
        await categoryApi.deleteCategory(id);
        this.deleteLocalCategory(id);
        return true;
      } catch (error) {
        console.error('Supabase delete category error, using localStorage:', error);
        return this.deleteLocalCategory(id);
      }
    }
    return this.deleteLocalCategory(id);
  }

  // IMAGES
  async getImagesByType(type) {
    if (this.useSupabase && this.isSupabaseConfigured()) {
      try {
        const metadata = await imageApi.getImageMetadata();
        return metadata.filter(img => img.type === type);
      } catch (error) {
        console.error('Supabase images error, falling back to localStorage:', error);
        return this.getLocalImages(type);
      }
    }
    return this.getLocalImages(type);
  }

  // LOCAL STORAGE FALLBACK METHODS
  getLocalProducts() {
    return JSON.parse(localStorage.getItem('art_hub_products') || '[]');
  }

  addLocalProduct(product) {
    const products = this.getLocalProducts();
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    products.push(newProduct);
    localStorage.setItem('art_hub_products', JSON.stringify(products));
    return newProduct;
  }

  saveLocalProduct(product) {
    const products = this.getLocalProducts();
    const existingIndex = products.findIndex(p => p.id === product.id);
    if (existingIndex >= 0) {
      products[existingIndex] = product;
    } else {
      products.push(product);
    }
    localStorage.setItem('art_hub_products', JSON.stringify(products));
  }

  updateLocalProduct(id, updates) {
    const products = this.getLocalProducts();
    const index = products.findIndex(p => p.id === id);
    if (index >= 0) {
      products[index] = { ...products[index], ...updates, updated_at: new Date().toISOString() };
      localStorage.setItem('art_hub_products', JSON.stringify(products));
      return products[index];
    }
    throw new Error('Product not found');
  }

  deleteLocalProduct(id) {
    const products = this.getLocalProducts();
    const filtered = products.filter(p => p.id !== id);
    localStorage.setItem('art_hub_products', JSON.stringify(filtered));
    return true;
  }

  getLocalCategories() {
    return JSON.parse(localStorage.getItem('art_hub_categories') || '[]');
  }

  addLocalCategory(category) {
    const categories = this.getLocalCategories();
    const newCategory = {
      ...category,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    categories.push(newCategory);
    localStorage.setItem('art_hub_categories', JSON.stringify(categories));
    return newCategory;
  }

  saveLocalCategory(category) {
    const categories = this.getLocalCategories();
    const existingIndex = categories.findIndex(c => c.id === category.id);
    if (existingIndex >= 0) {
      categories[existingIndex] = category;
    } else {
      categories.push(category);
    }
    localStorage.setItem('art_hub_categories', JSON.stringify(categories));
  }

  updateLocalCategory(id, updates) {
    const categories = this.getLocalCategories();
    const index = categories.findIndex(c => c.id === id);
    if (index >= 0) {
      categories[index] = { ...categories[index], ...updates, updated_at: new Date().toISOString() };
      localStorage.setItem('art_hub_categories', JSON.stringify(categories));
      return categories[index];
    }
    throw new Error('Category not found');
  }

  deleteLocalCategory(id) {
    const categories = this.getLocalCategories();
    const filtered = categories.filter(c => c.id !== id);
    localStorage.setItem('art_hub_categories', JSON.stringify(filtered));
    return true;
  }

  getLocalImages(type) {
    const images = JSON.parse(localStorage.getItem('art_hub_image_management') || '[]');
    return images.filter(img => img.type === type);
  }
}

export const unifiedService = new UnifiedService();
export default unifiedService;
