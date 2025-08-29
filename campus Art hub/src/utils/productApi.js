// Mock products data for local storage
const defaultProducts = [
  {
    id: '1',
    name: 'Abstract Canvas Painting',
    description: 'Beautiful abstract artwork on canvas',
    price: 299.99,
    stock: 5,
    category: 'Paintings',
    images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400'],
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Ceramic Sculpture',
    description: 'Handcrafted ceramic sculpture',
    price: 199.99,
    stock: 3,
    category: 'Sculptures',
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Digital Art Print',
    description: 'High-quality digital art print',
    price: 79.99,
    stock: 10,
    category: 'Digital Art',
    images: ['https://images.unsplash.com/photo-1549490349-8643362247b5?w=400'],
    created_at: new Date().toISOString()
  }
];

// Initialize products if not exists
function initializeProducts() {
  if (!localStorage.getItem('art_hub_products')) {
    localStorage.setItem('art_hub_products', JSON.stringify(defaultProducts));
  }
}

export async function getAllProducts() {
  initializeProducts();
  const products = JSON.parse(localStorage.getItem('art_hub_products') || '[]');
  return products;
}

export async function addProduct(product) {
  initializeProducts();
  const products = JSON.parse(localStorage.getItem('art_hub_products') || '[]');
  const newProduct = {
    ...product,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  products.push(newProduct);
  localStorage.setItem('art_hub_products', JSON.stringify(products));
  return newProduct;
}

export async function updateProduct(id, updates) {
  initializeProducts();
  const products = JSON.parse(localStorage.getItem('art_hub_products') || '[]');
  const index = products.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Product not found');
  
  products[index] = { ...products[index], ...updates, updated_at: new Date().toISOString() };
  localStorage.setItem('art_hub_products', JSON.stringify(products));
  return products[index];
}

export async function deleteProduct(id) {
  initializeProducts();
  const products = JSON.parse(localStorage.getItem('art_hub_products') || '[]');
  const filteredProducts = products.filter(p => p.id !== id);
  localStorage.setItem('art_hub_products', JSON.stringify(filteredProducts));
}