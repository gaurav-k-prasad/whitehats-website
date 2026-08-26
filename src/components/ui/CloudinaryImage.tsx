"use client";

import { CldImage as NextCldImage, CldImageProps } from "next-cloudinary";
import React from "react";

export interface CloudinaryImageProps extends Omit<CldImageProps, "src"> {
  src: string;
  alt: string;
}

/**
 * Reusable Cloudinary Image component wrapping `next-cloudinary`.
 * Uses the environment configuration automatically.
 */
export default function CloudinaryImage({
  src,
  alt,
  width,
  height,
  className,
  draggable = false,
  ...props
}: CloudinaryImageProps) {
  return (
    <NextCldImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      draggable={draggable}
      {...props}
    />
  );
}
