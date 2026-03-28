import { carService } from "@/services/api/carService";
import { useMutation } from "@tanstack/react-query";

export const useCarScanning = () => {
  /** Map for common image extensions to MIME types */
  const getMimeType = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "webp":
        return "image/webp";
      case "heic":
        return "image/heic";
      default:
        return "image/jpeg"; // Safe default
    }
  };

  /** AI-powered photo scanning mutation */
  const scanPhotosMutation = useMutation({
    mutationFn: async ({
      images,
      additionalImages,
    }: {
      images: Record<string, string>;
      additionalImages: string[];
    }) => {
      const formData = new FormData();

      // Append required photos
      Object.entries(images).forEach(([key, uri]) => {
        const filename = uri.split("/").pop() || `${key}.jpg`;
        const type = getMimeType(filename);

        formData.append("photos", {
          uri,
          name: filename,
          type,
        } as any);
      });

      // Append additional photos
      additionalImages.forEach((uri, index) => {
        const filename = uri.split("/").pop() || `extra_${index}.jpg`;
        const type = getMimeType(filename);

        formData.append("photos", {
          uri,
          name: filename,
          type,
        } as any);
      });

      const response = await carService.scanPhotos(formData);

      if (response && response.carData) {
        return response.carData;
      } else {
        throw new Error("No car data recognized. Please try clearer images.");
      }
    },
  });

  /** OCR-powered license scanning mutation */
  const scanLicenseMutation = useMutation({
    mutationFn: async (imageUri: string) => {
      const formData = new FormData();
      const filename = imageUri.split("/").pop() || "license.jpg";
      const type = getMimeType(filename);

      formData.append("photo", {
        uri: imageUri,
        name: filename,
        type,
      } as any);

      return await carService.scanLicense(formData);
    },
  });

  return {
    // Photos Scanning
    isLoading: scanPhotosMutation.isPending,
    error: scanPhotosMutation.error?.message || null,
    scanCarPhotos: scanPhotosMutation.mutateAsync,

    // License Scanning
    isLicenseLoading: scanLicenseMutation.isPending,
    licenseError: scanLicenseMutation.error?.message || null,
    scanVehicleLicense: scanLicenseMutation.mutateAsync,

    // Raw mutation objects for more control if needed
    scanPhotosMutation,
    scanLicenseMutation,
  };
};
