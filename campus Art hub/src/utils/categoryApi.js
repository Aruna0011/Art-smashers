import { supabase } from './supabaseClient';

// Fallback category data for when Supabase is not configured
const fallbackCategories = [
  {
    id: 1,
    name: "Paintings",
    description: "Beautiful paintings in various styles",
    image: "/src/assets/design 1.png"
  },
  {
    id: 2,
    name: "Sculptures",
    description: "Three-dimensional artworks",
    image: "/src/assets/design 2.jpg"
  },
  {
    id: 3,
    name: "Digital Art",
    description: "Modern digital creations",
    image: "/src/assets/design 3.jpg"
  },
  {
    id: 4,
    name: "Photography",
    description: "Captured moments in time",
    image: "/src/assets/design 4.jpg"
  }
];

export async function getAllCategories() {
  try {
    let { data, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    return data || fallbackCategories;
  } catch (error) {
    console.error('Supabase getAllCategories error:', error);
    // Return fallback data if Supabase is not configured
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      return fallbackCategories;
    }
    throw error;
  }
}

export async function addCategory(category) {
  try {
    let { data, error } = await supabase.from('categories').insert([category]);
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Supabase addCategory error:', error);
    // Fallback to local storage
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      const categories = JSON.parse(localStorage.getItem('art_hub_categories') || '[]');
      const newCategory = { ...category, id: Date.now() };
      categories.push(newCategory);
      localStorage.setItem('art_hub_categories', JSON.stringify(categories));
      return newCategory;
    }
    throw error;
  }
}

export async function updateCategory(id, updates) {
  try {
    let { data, error } = await supabase.from('categories').update(updates).eq('id', id);
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Supabase updateCategory error:', error);
    // Fallback to local storage
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      const categories = JSON.parse(localStorage.getItem('art_hub_categories') || '[]');
      const categoryIndex = categories.findIndex(c => c.id === id);
      if (categoryIndex !== -1) {
        categories[categoryIndex] = { ...categories[categoryIndex], ...updates };
        localStorage.setItem('art_hub_categories', JSON.stringify(categories));
        return categories[categoryIndex];
      }
    }
    throw error;
  }
}

export async function deleteCategory(id) {
  try {
    let { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.error('Supabase deleteCategory error:', error);
    // Fallback to local storage
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      const categories = JSON.parse(localStorage.getItem('art_hub_categories') || '[]');
      const filteredCategories = categories.filter(c => c.id !== id);
      localStorage.setItem('art_hub_categories', JSON.stringify(filteredCategories));
    } else {
      throw error;
    }
  }
} 