import { useMutation } from "@tanstack/react-query";
import { uploadService } from "@/services/api/uploadService";

/**
 * Hook for universal image uploads.
 * 
 * Usage:
 * const { mutateAsync: uploadImage, isPending } = useUploadImage();
 * const result = await uploadImage({ uri: '...', folder: 'avatars' });
 */
export const useUploadImage = () => {
  return useMutation({
    mutationFn: ({ uri, folder }: { uri: string; folder?: string }) => 
      uploadService.uploadImage(uri, folder),
    onSuccess: (data) => {
      console.log('✅ [useUploadImage] Success:', data.url);
    },
    onError: (error) => {
      console.error('❌ [useUploadImage] Error:', error);
    }
  });
};
