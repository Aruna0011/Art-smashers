// Test Supabase connection and debug admin panel issues
import unifiedService from './unifiedService';

export const testSupabaseConnection = async () => {
  console.log('🔍 Testing Supabase Connection...');
  
  // Check environment variables
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('Environment Variables:');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
  
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-id') || supabaseKey.includes('your-anon-key')) {
    console.error('❌ Supabase credentials not properly configured');
    return false;
  }
  
  try {
    // Test categories
    console.log('📂 Testing Categories...');
    const categories = await unifiedService.getAllCategories();
    console.log('Categories loaded:', categories.length);
    console.log('Sample category:', categories[0]);
    
    // Test products
    console.log('🛍️ Testing Products...');
    const products = await unifiedService.getAllProducts();
    console.log('Products loaded:', products.length);
    console.log('Sample product:', products[0]);
    
    // Test add category
    console.log('➕ Testing Add Category...');
    const testCategory = {
      name: 'Test Category ' + Date.now(),
      description: 'Test description',
      image: 'https://via.placeholder.com/300'
    };
    
    const addedCategory = await unifiedService.addCategory(testCategory);
    console.log('Category added:', addedCategory);
    
    // Test add product
    console.log('➕ Testing Add Product...');
    const testProduct = {
      name: 'Test Product ' + Date.now(),
      description: 'Test product description',
      price: 99.99,
      stock: 10,
      category: addedCategory.name,
      images: ['https://via.placeholder.com/300'],
      status: 'active'
    };
    
    const addedProduct = await unifiedService.addProduct(testProduct);
    console.log('Product added:', addedProduct);
    
    // Clean up test data
    await unifiedService.deleteCategory(addedCategory.id);
    await unifiedService.deleteProduct(addedProduct.id);
    
    console.log('✅ All tests passed! Supabase is working correctly.');
    return true;
    
  } catch (error) {
    console.error('❌ Supabase test failed:', error);
    console.error('Error details:', error.message);
    return false;
  }
};

// Test function for admin panel
export const debugAdminPanel = () => {
  console.log('🔧 Debugging Admin Panel...');
  
  // Check if unifiedService is available
  console.log('UnifiedService available:', !!unifiedService);
  console.log('UnifiedService methods:', Object.keys(unifiedService));
  
  // Check Supabase configuration
  console.log('Supabase configured:', unifiedService.isSupabaseConfigured());
  
  return {
    unifiedServiceAvailable: !!unifiedService,
    supabaseConfigured: unifiedService.isSupabaseConfigured(),
    methods: Object.keys(unifiedService)
  };
};
