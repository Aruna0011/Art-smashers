import { imageApi } from './supabaseImageApi';

// Unified image service that handles both Supabase and localStorage fallback
class ImageService {
  constructor() {
    this.useSupabase = true; // Set to true to use Supabase, false for localStorage
  }

  // Get all images for a specific type (carousel, wall, offer)
  async getImagesByType(type) {
    if (this.useSupabase) {
      try {
        // Check if Supabase is configured
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          console.log('Supabase not configured, using localStorage');
          return this.getLocalImages(type);
        }
        
        const metadata = await imageApi.getImageMetadata();
        return metadata.filter(img => img.type === type);
      } catch (error) {
        console.error('Supabase error, falling back to localStorage:', error);
        return this.getLocalImages(type);
      }
    } else {
      return this.getLocalImages(type);
    }
  }

  // Upload new image
  async uploadImage(file, type, metadata = {}) {
    if (this.useSupabase) {
      try {
        // Upload to Supabase Storage
        const { url, path } = await imageApi.uploadImage(file, 'images', type);
        
        // Save metadata to database
        const imageData = {
          type,
          url,
          path,
          name: file.name,
          size: file.size,
          ...metadata,
          created_at: new Date().toISOString()
        };
        
        const savedData = await imageApi.saveImageMetadata(imageData);
        return savedData;
      } catch (error) {
        console.error('Supabase upload error, falling back to localStorage:', error);
        return this.uploadLocalImage(file, type, metadata);
      }
    } else {
      return this.uploadLocalImage(file, type, metadata);
    }
  }

  // Delete image
  async deleteImage(imageId, imagePath = null) {
    if (this.useSupabase) {
      try {
        // Delete from storage if path provided
        if (imagePath) {
          await imageApi.deleteImage(imagePath);
        }
        
        // Delete metadata from database
        await imageApi.deleteImageMetadata(imageId);
        return true;
      } catch (error) {
        console.error('Supabase delete error, falling back to localStorage:', error);
        return this.deleteLocalImage(imageId);
      }
    } else {
      return this.deleteLocalImage(imageId);
    }
  }

  // Update image metadata
  async updateImage(imageId, updates) {
    if (this.useSupabase) {
      try {
        return await imageApi.updateImageMetadata(imageId, updates);
      } catch (error) {
        console.error('Supabase update error, falling back to localStorage:', error);
        return this.updateLocalImage(imageId, updates);
      }
    } else {
      return this.updateLocalImage(imageId, updates);
    }
  }

  // LocalStorage fallback methods
  getLocalImages(type) {
    const images = JSON.parse(localStorage.getItem('art_hub_image_management') || '[]');
    return images.filter(img => img.type === type);
  }

  uploadLocalImage(file, type, metadata) {
    const images = JSON.parse(localStorage.getItem('art_hub_image_management') || '[]');
    const newImage = {
      id: Date.now().toString(),
      type,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file), // Create local URL
      ...metadata,
      created_at: new Date().toISOString()
    };
    
    images.push(newImage);
    localStorage.setItem('art_hub_image_management', JSON.stringify(images));
    return newImage;
  }

  deleteLocalImage(imageId) {
    const images = JSON.parse(localStorage.getItem('art_hub_image_management') || '[]');
    const filteredImages = images.filter(img => img.id !== imageId);
    localStorage.setItem('art_hub_image_management', JSON.stringify(filteredImages));
    return true;
  }

  updateLocalImage(imageId, updates) {
    const images = JSON.parse(localStorage.getItem('art_hub_image_management') || '[]');
    const index = images.findIndex(img => img.id === imageId);
    
    if (index !== -1) {
      images[index] = { ...images[index], ...updates, updated_at: new Date().toISOString() };
      localStorage.setItem('art_hub_image_management', JSON.stringify(images));
      return images[index];
    }
    
    throw new Error('Image not found');
  }

  // Get all images (for admin dashboard)
  async getAllImages() {
    if (this.useSupabase) {
      try {
        return await imageApi.getImageMetadata();
      } catch (error) {
        console.error('Supabase error, falling back to localStorage:', error);
        return JSON.parse(localStorage.getItem('art_hub_image_management') || '[]');
      }
    } else {
      return JSON.parse(localStorage.getItem('art_hub_image_management') || '[]');
    }
  }

  // Toggle between Supabase and localStorage
  setSupabaseMode(useSupabase) {
    this.useSupabase = useSupabase;
  }
}

// Export singleton instance
export const imageService = new ImageService();
export default imageService;
