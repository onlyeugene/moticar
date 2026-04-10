import apiClient from "@/config/apiClient";


/**
 * Upload Service
 * 
 * Handles universal file uploads to the Moticar backend.
 */
export const uploadService = {
  /**
   * Upload an image to the backend which proxies to Cloudinary
   * 
   * @param imageUri Local URI of the image
   * @param folder Destination folder in Cloudinary
   * @returns Cloudinary response data including secure_url
   */
  uploadImage: async (imageUri: string, folder: string = 'general') => {
    const formData = new FormData();
    
    // Prepare the file object for FormData
    const filename = imageUri.split('/').pop() || 'upload.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1] === 'jpg' ? 'jpeg' : match[1]}` : `image/jpeg`;

    formData.append('image', {
      uri: imageUri,
      name: filename,
      type,
    } as any);
    
    formData.append('folder', folder);

    const response = await apiClient.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};
