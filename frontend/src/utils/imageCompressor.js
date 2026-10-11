/**
 * Compresses and resizes an image File/Blob in the browser using HTML5 Canvas.
 *
 * - Resizes image so neither width nor height exceeds maxDimension (default: 1200px).
 * - Preserves aspect ratio.
 * - Converts to JPEG at specified quality (default: 0.82).
 * - If file is already smaller than minSizeToCompress (default: 200KB), returns original file.
 * - Safely falls back to original file if compression fails.
 */
export async function compressImage(file, {
  maxDimension = 1200,
  quality = 0.82,
  minSizeToCompress = 200 * 1024, // 200 KB
} = {}) {
  // If not a valid image or already lightweight, skip compression
  if (!file || !file.type?.startsWith("image/") || file.size <= minSizeToCompress) {
    return file;
  }

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Calculate new dimensions if image exceeds maxDimension
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        // Fallback if canvas context is unavailable
        resolve(file);
        return;
      }

      // Draw and export as compressed JPEG
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            // If compressed blob is somehow larger than original, return original
            resolve(file);
            return;
          }

          const baseName = (file.name || "outfit").replace(/\.[^/.]+$/, "");
          const compressedFile = new File([blob], `${baseName}.jpg`, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });

          resolve(compressedFile);
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      // Fallback to original file on image load error
      resolve(file);
    };

    img.src = objectUrl;
  });
}
