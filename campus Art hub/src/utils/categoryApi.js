// Mock categories data for local storage
const defaultCategories = [
  {
    id: '1',
    name: 'Paintings',
    description: 'Beautiful hand-painted artworks',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Sculptures',
    description: '3D artistic creations',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Digital Art',
    description: 'Modern digital artworks',
    image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400',
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Photography',
    description: 'Captured moments in time',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400',
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Handmade Crafts',
    description: 'Unique handmade items',
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400',
    created_at: new Date().toISOString()
  }
];

// Initialize categories if not exists
function initializeCategories() {
  if (!localStorage.getItem('art_hub_categories')) {
    localStorage.setItem('art_hub_categories', JSON.stringify(defaultCategories));
  }
}

export async function getAllCategories() {
  initializeCategories();
  const categories = JSON.parse(localStorage.getItem('art_hub_categories') || '[]');
  return categories;
}

export async function addCategory(category) {
  initializeCategories();
  const categories = JSON.parse(localStorage.getItem('art_hub_categories') || '[]');
  const newCategory = {
    ...category,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  categories.push(newCategory);
  localStorage.setItem('art_hub_categories', JSON.stringify(categories));
  return newCategory;
}

export async function updateCategory(id, updates) {
  initializeCategories();
  const categories = JSON.parse(localStorage.getItem('art_hub_categories') || '[]');
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Category not found');
  
  categories[index] = { ...categories[index], ...updates, updated_at: new Date().toISOString() };
  localStorage.setItem('art_hub_categories', JSON.stringify(categories));
  return categories[index];
}

export async function deleteCategory(id) {
  initializeCategories();
  const categories = JSON.parse(localStorage.getItem('art_hub_categories') || '[]');
  const filteredCategories = categories.filter(c => c.id !== id);
  localStorage.setItem('art_hub_categories', JSON.stringify(filteredCategories));
}