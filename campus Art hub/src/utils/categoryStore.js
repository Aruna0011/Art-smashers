class CategoryStore {
  constructor() {
    this.storageKey = 'campusArtHub_categories';
  }

  getAllCategories() {
    try {
      const categories = localStorage.getItem(this.storageKey);
      const parsedCategories = categories ? JSON.parse(categories) : [];
      console.log('Loading categories from storage:', parsedCategories.length);
      return parsedCategories;
    } catch (error) {
      console.error('Error loading categories:', error);
      return [];
    }
  }

  addCategory(category) {
    try {
      const categories = this.getAllCategories();
      const newCategory = {
        ...category,
        id: Date.now(),
        productCount: 0,
      };
      categories.push(newCategory);
      this.saveCategories(categories);
      return newCategory;
    } catch (error) {
      console.error('Error adding category:', error);
      return null;
    }
  }

  updateCategory(id, updatedCategory) {
    try {
      const categories = this.getAllCategories();
      const index = categories.findIndex(cat => cat.id === id);
      if (index !== -1) {
        categories[index] = { ...categories[index], ...updatedCategory };
        this.saveCategories(categories);
        return categories[index];
      }
      return null;
    } catch (error) {
      console.error('Error updating category:', error);
      return null;
    }
  }

  deleteCategory(id) {
    try {
      const categories = this.getAllCategories();
      const filteredCategories = categories.filter(cat => cat.id !== id);
      this.saveCategories(filteredCategories);
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }

  getCategoryById(id) {
    const categories = this.getAllCategories();
    return categories.find(cat => cat.id === id);
  }

  getCategoryByName(name) {
    const categories = this.getAllCategories();
    return categories.find(cat => cat.name === name);
  }

  updateProductCounts(products) {
    try {
      const categories = this.getAllCategories();
      const updatedCategories = categories.map(category => ({
        ...category,
        productCount: products.filter(product => product.category === category.name).length
      }));
      this.saveCategories(updatedCategories);
    } catch (error) {
      console.error('Error updating product counts:', error);
    }
  }

  saveCategories(categories) {
    try {
      if (!Array.isArray(categories)) {
        console.error('Attempting to save non-array to localStorage! This will break product persistence.');
      }
      localStorage.setItem(this.storageKey, JSON.stringify(categories));
      // Dispatch custom event for other components to listen to
      window.dispatchEvent(new CustomEvent('categoriesUpdated', { detail: categories }));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  }
}

export const categoryStore = new CategoryStore(); 