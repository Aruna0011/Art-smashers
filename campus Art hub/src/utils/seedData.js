// Seed data for initial setup when Supabase is empty
export const seedCategories = [
  {
    id: '1',
    name: 'Paintings',
    description: 'Beautiful hand-painted artworks',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
    is_active: true
  },
  {
    id: '2', 
    name: 'Sculptures',
    description: '3D artistic creations',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    is_active: true
  },
  {
    id: '3',
    name: 'Digital Art',
    description: 'Modern digital artworks', 
    image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400',
    is_active: true
  },
  {
    id: '4',
    name: 'Photography',
    description: 'Captured moments in time',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400',
    is_active: true
  },
  {
    id: '5',
    name: 'Handmade Crafts',
    description: 'Unique handmade items',
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400',
    is_active: true
  }
];

export const seedProducts = [
  {
    id: '1',
    name: 'Abstract Canvas Painting',
    description: 'Beautiful abstract artwork on canvas',
    price: 299.99,
    stock: 5,
    category: 'Paintings',
    images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400'],
    status: 'active'
  },
  {
    id: '2',
    name: 'Ceramic Sculpture',
    description: 'Handcrafted ceramic sculpture',
    price: 199.99,
    stock: 3,
    category: 'Sculptures', 
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
    status: 'active'
  },
  {
    id: '3',
    name: 'Digital Art Print',
    description: 'High-quality digital art print',
    price: 79.99,
    stock: 10,
    category: 'Digital Art',
    images: ['https://images.unsplash.com/photo-1549490349-8643362247b5?w=400'],
    status: 'active'
  },
  {
    id: '4',
    name: 'Nature Photography',
    description: 'Stunning landscape photograph',
    price: 149.99,
    stock: 7,
    category: 'Photography',
    images: ['https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400'],
    status: 'active'
  },
  {
    id: '5',
    name: 'Handwoven Basket',
    description: 'Traditional handwoven craft',
    price: 89.99,
    stock: 12,
    category: 'Handmade Crafts',
    images: ['https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400'],
    status: 'active'
  },
  {
    id: '6',
    name: 'Oil Portrait',
    description: 'Classic oil painting portrait',
    price: 450.00,
    stock: 2,
    category: 'Paintings',
    images: ['https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400'],
    status: 'active'
  },
  {
    id: '7',
    name: 'Modern Sculpture',
    description: 'Contemporary metal sculpture',
    price: 350.00,
    stock: 4,
    category: 'Sculptures',
    images: ['https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400'],
    status: 'active'
  },
  {
    id: '8',
    name: 'Digital Illustration',
    description: 'Vibrant digital character art',
    price: 120.00,
    stock: 8,
    category: 'Digital Art',
    images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'],
    status: 'active'
  }
];

// Function to seed localStorage with initial data
export const seedLocalStorage = () => {
  localStorage.setItem('art_hub_categories', JSON.stringify(seedCategories));
  localStorage.setItem('art_hub_products', JSON.stringify(seedProducts));
  console.log('✅ Seeded localStorage with initial data');
};
