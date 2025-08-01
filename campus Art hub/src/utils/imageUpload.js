import { supabase } from './supabaseClient';

export async function uploadProductImage(file) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    const { error } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Supabase uploadProductImage error:', error);
    // Fallback to base64 encoding for local storage
    if (error.message.includes('Invalid API key') || error.message.includes('fetch')) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    }
    throw error;
  }
}

export async function deleteProductImage(filePath) {
  try {
    const { error } = await supabase.storage
      .from('images')
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Supabase deleteProductImage error:', error);
    // No fallback needed for delete operation
    if (!error.message.includes('Invalid API key') && !error.message.includes('fetch')) {
      throw error;
    }
  }
}

export async function getImageUrl(filePath) {
  try {
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Supabase getImageUrl error:', error);
    // Return the filePath as fallback
    return filePath;
  }
} 