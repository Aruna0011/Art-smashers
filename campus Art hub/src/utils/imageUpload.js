import { supabase } from './supabaseClient';

export async function uploadProductImage(file, userId) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, { upsert: true });
  if (error) throw error;
  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName);
  return publicUrlData.publicUrl;
} 