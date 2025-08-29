// Local storage-based image upload using base64 encoding
export async function uploadProductImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
}

export async function deleteProductImage(filePath) {
  // No action needed for base64 images stored in local storage
  console.log('Image deletion not needed for local storage implementation');
}

export async function getImageUrl(filePath) {
  // Return the filePath as-is since it's already a base64 URL or external URL
  return filePath;
} 