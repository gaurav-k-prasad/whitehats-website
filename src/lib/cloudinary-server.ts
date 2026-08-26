import { v2 as cloudinary } from 'cloudinary';

function cleanEnv(val?: string): string | undefined {
  if (!val) return undefined;
  return val.trim().replace(/^["']|["']$/g, '');
}

/**
 * Ensures Cloudinary SDK is dynamically configured with trimmed credentials.
 */
export function ensureCloudinaryConfig() {
  const cloudinaryUrl = cleanEnv(process.env.CLOUDINARY_URL);
  const cloudName = cleanEnv(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME);
  const apiKey = cleanEnv(process.env.CLOUDINARY_API_KEY);
  const apiSecret = cleanEnv(process.env.CLOUDINARY_API_SECRET);

  if (cloudinaryUrl) {
    cloudinary.config({
      cloudinary_url: cloudinaryUrl,
      secure: true,
    });
  } else if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }
}

export function isCloudinaryServerConfigured(): boolean {
  ensureCloudinaryConfig();
  const config = cloudinary.config();
  return Boolean(config.cloud_name && ((config.api_key && config.api_secret) || config.cloudinary_url));
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
      'Cloudinary API credentials missing or invalid. Please check CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, and CLOUDINARY_CLOUD_NAME in your environment.'
    );
  }

  const sanitizedTags = options.tags
    ? options.tags.map((t) => t.trim()).filter(Boolean)
    : undefined;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'whitehats',
        public_id: options.publicId,
        tags: sanitizedTags,
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
