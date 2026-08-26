"use client";

import { CldImage as NextCldImage, CldImageProps } from "next-cloudinary";
import Image from "next/image";
import React from "react";

export interface CloudinaryImageProps extends Omit<CldImageProps, "src"> {
  src: string;
  alt: string;
}

/**
 * Universal Image component supporting Cloudinary assets, URLs, or local media.
 */
export default function CloudinaryImage({
  src,
  alt,
  width,
  height,
  className,
  draggable = false,
  quality,
  sizes,
  ...props
}: CloudinaryImageProps) {
  if (!src) return null;

  const isExternalOrData =
    src.startsWith("data:") ||
    (src.startsWith("http") && !src.includes("cloudinary.com"));

  const resolvedSizes = sizes || (props.fill ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : undefined);

  if (isExternalOrData) {
    const numQuality = typeof quality === "number" ? quality : undefined;
    return (
      <Image
        src={src}
        alt={alt}
        width={props.fill ? undefined : width}
        height={props.fill ? undefined : height}
        className={className}
        draggable={draggable}
        quality={numQuality}
        sizes={resolvedSizes}
        unoptimized
        {...props}
      />
    );
  }

  return (
    <NextCldImage
      src={src}
      alt={alt}
      width={props.fill ? undefined : width}
      height={props.fill ? undefined : height}
      className={className}
      draggable={draggable}
      quality={quality}
      sizes={resolvedSizes}
      {...props}
    />
  );
}
