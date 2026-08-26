import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary SDK
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
  });
} else {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export function isCloudinaryServerConfigured(): boolean {
  const config = cloudinary.config();
  return Boolean(config.cloud_name && (config.api_key && config.api_secret || process.env.CLOUDINARY_URL));
}

export interface CloudinaryUploadResult {
  publicId: string;
  secureUrl: string;
  width?: number;
  height?: number;
  format?: string;
}

export interface UploadOptions {
  folder?: string;
  publicId?: string;
  tags?: string[];
  transformation?: object;
}

/**
 * Uploads a Buffer or Base64 data string to Cloudinary.
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryServerConfigured()) {
    throw new Error(
      'Cloudinary API credentials missing. Please set CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in your environment.'
    );
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'whitehats',
        public_id: options.publicId,
        tags: options.tags,
        resource_type: 'image',
        ...options.transformation,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Unknown Cloudinary upload error'));
        }
        resolve({
          publicId: result.public_id,
          secureUrl: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Deletes a single image from Cloudinary (used for rollback on DB failures).
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (!isCloudinaryServerConfigured() || !publicId) {
    return false;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
      invalidate: true,
    });
    return result.result === 'ok';
  } catch (error) {
    console.error(`[Cloudinary Rollback] Failed to delete asset ${publicId}:`, error);
    return false;
  }
}

/**
 * Deletes multiple images from Cloudinary in parallel (used for bulk rollback).
 */
export async function deleteMultipleFromCloudinary(publicIds: string[]): Promise<void> {
  if (!publicIds || publicIds.length === 0) return;
  await Promise.allSettled(publicIds.map((id) => deleteFromCloudinary(id)));
}
