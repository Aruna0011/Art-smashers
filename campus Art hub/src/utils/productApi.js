import { supabase } from './supabaseClient';

// Fallback product data for when Supabase is not configured
const fallbackProducts = [
  {
    id: 1,
    name: "Abstract Sunset",
    category: "Paintings",
    price: 2500,
    stock: 5,
    description: "Beautiful abstract painting inspired by sunset colors",
    artist: "Sarah Johnson",
    images: ["/src/assets/design 1.png"],
    featured: true
  },
  {
    id: 2,
    name: "Modern Sculpture",
    category: "Sculptures",
    price: 5000,
    stock: 2,
    description: "Contemporary metal sculpture with geometric patterns",
    artist: "Mike Chen",
    images: ["/src/assets/design 2.jpg"],
    featured: true
  },
  {
    id: 3,
    name: "Digital Art Collection",
    category: "Digital Art",
    price: 1500,
    stock: 10,
    description: "Digital artwork created with modern techniques",
    artist: "Alex Rivera",
    images: ["/src/assets/design 3.jpg"],
    featured: false
  }
];

export async function getAllProducts() {
  try {
    let { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    return data || fallbackProducts;
  } catch (error) {
    console.error('Supabase getAllProducts error:', error);
    // Return fallback data if Supabase is not configured
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      return fallbackProducts;
    }
    throw error;
  }
}

export async function addProduct(product) {
  try {
    let { data, error } = await supabase.from('products').insert([product]);
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Supabase addProduct error:', error);
    // Fallback to local storage
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      const products = JSON.parse(localStorage.getItem('art_hub_products') || '[]');
      const newProduct = { ...product, id: Date.now() };
      products.push(newProduct);
      localStorage.setItem('art_hub_products', JSON.stringify(products));
      return newProduct;
    }
    throw error;
  }
}

export async function updateProduct(id, updates) {
  try {
    let { data, error } = await supabase.from('products').update(updates).eq('id', id);
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Supabase updateProduct error:', error);
    // Fallback to local storage
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      const products = JSON.parse(localStorage.getItem('art_hub_products') || '[]');
      const productIndex = products.findIndex(p => p.id === id);
      if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...updates };
        localStorage.setItem('art_hub_products', JSON.stringify(products));
        return products[productIndex];
      }
    }
    throw error;
  }
}

export async function deleteProduct(id) {
  try {
    let { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.error('Supabase deleteProduct error:', error);
    // Fallback to local storage
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      const products = JSON.parse(localStorage.getItem('art_hub_products') || '[]');
      const filteredProducts = products.filter(p => p.id !== id);
      localStorage.setItem('art_hub_products', JSON.stringify(filteredProducts));
    } else {
      throw error;
    }
  }
} 