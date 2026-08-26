"use client";

import React, { useState, useRef, useEffect } from "react";
import { UploadCloud, Image as ImageIcon, X, Link as LinkIcon, RefreshCw, CheckCircle2 } from "lucide-react";
import { CloudinaryImage } from "@/components/ui/cloudinary";

export interface SelectedFileItem {
  file: File;
  previewUrl: string;
  name: string;
  sizeFormatted: string;
}

interface SingleImageUploadPickerProps {
  multiple?: false;
  value?: string | null;
  onChangeValue: (value: string) => void;
  selectedFile?: File | null;
  onSelectFile: (file: File | null) => void;
  label?: string;
  folderHint?: string;
  className?: string;
}

interface MultipleImageUploadPickerProps {
  multiple: true;
  selectedFiles: File[];
  onSelectFiles: (files: File[]) => void;
  label?: string;
  folderHint?: string;
  className?: string;
}

export type ImageUploadPickerProps = SingleImageUploadPickerProps | MultipleImageUploadPickerProps;

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function ImageUploadPicker(props: ImageUploadPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);

  // Single file preview state
  const [singlePreview, setSinglePreview] = useState<string | null>(null);

  // Multiple files preview state
  const [multiPreviews, setMultiPreviews] = useState<SelectedFileItem[]>([]);

  // Manage single file object URL
  useEffect(() => {
    if (!props.multiple && props.selectedFile) {
      const url = URL.createObjectURL(props.selectedFile);
      setSinglePreview(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else if (!props.multiple && !props.selectedFile) {
      setSinglePreview(null);
    }
  }, [props.multiple, !props.multiple ? props.selectedFile : null]);

  // Manage multiple file object URLs
  useEffect(() => {
    if (props.multiple && props.selectedFiles) {
      const items: SelectedFileItem[] = props.selectedFiles.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        name: file.name,
        sizeFormatted: formatFileSize(file.size),
      }));
      setMultiPreviews(items);

      return () => {
        items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      };
    }
  }, [props.multiple, props.multiple ? props.selectedFiles : null]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (props.multiple) {
        const imageFiles = Array.from(e.dataTransfer.files).filter((f) =>
          f.type.startsWith("image/")
        );
        if (imageFiles.length > 0) {
          props.onSelectFiles([...props.selectedFiles, ...imageFiles]);
        }
      } else {
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
          props.onSelectFile(file);
          props.onChangeValue("");
        }
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (props.multiple) {
        const newFiles = Array.from(e.target.files).filter((f) =>
          f.type.startsWith("image/")
        );
        props.onSelectFiles([...props.selectedFiles, ...newFiles]);
      } else {
        const file = e.target.files[0];
        props.onSelectFile(file);
        props.onChangeValue("");
      }
    }
  };

  const removeSingleFile = () => {
    if (!props.multiple) {
      props.onSelectFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeMultiFile = (index: number) => {
    if (props.multiple) {
      const updated = props.selectedFiles.filter((_, i) => i !== index);
      props.onSelectFiles(updated);
    }
  };

  return (
    <div className={`flex flex-col gap-2.5 ${props.className || ""}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono font-medium text-slate-300 flex items-center gap-2">
          <ImageIcon className="w-3.5 h-3.5 text-cyber-blue" />
          <span>{props.label || "IMAGE UPLOAD"}</span>
          {props.folderHint && (
            <span className="text-[10px] text-slate-500 font-mono">
              ({props.folderHint})
            </span>
          )}
        </label>

        {!props.multiple && (
          <button
            type="button"
            onClick={() => setShowManualInput(!showManualInput)}
            className="text-[11px] font-mono text-slate-400 hover:text-cyber-blue flex items-center gap-1 transition-colors cursor-pointer"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showManualInput ? "Use File Upload" : "Or manual ID / URL"}</span>
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={props.multiple}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Mode A: Multiple Image Selection (Bulk Gallery Upload) */}
      {props.multiple ? (
        <div className="flex flex-col gap-3">
          {/* Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full p-4 rounded-lg border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-center ${
              isDragOver
                ? "border-cyber-blue bg-cyber-blue/10 scale-[0.99]"
                : "border-[#1E293B] hover:border-cyber-blue/50 bg-[#030712]/70 hover:bg-[#030712]"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-cyber-blue/10 border border-cyber-blue/30 flex items-center justify-center text-cyber-blue">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="font-mono text-xs font-bold text-slate-200">
                Click to browse or drag & drop multiple photos
              </p>
              <p className="font-mono text-[10px] text-slate-500">
                PNG, JPG, JPEG, WEBP (Batch upload sharing title & metadata)
              </p>
            </div>
          </div>

          {/* Multiple Selected Previews Grid */}
          {multiPreviews.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300 pb-1 border-b border-[#1E293B]">
                <span className="flex items-center gap-1.5 text-cyber-blue font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {multiPreviews.length} {multiPreviews.length === 1 ? "photo" : "photos"} selected for batch upload
                </span>
                <button
                  type="button"
                  onClick={() => props.onSelectFiles([])}
                  className="text-red-400 hover:text-red-300 text-[10px] font-mono hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
                {multiPreviews.map((item, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-md overflow-hidden border border-[#1E293B] bg-[#070D1D] aspect-[4/3]"
                  >
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMultiFile(idx);
                        }}
                        className="self-end p-1 rounded bg-red-500/80 text-white hover:bg-red-500 cursor-pointer"
                        title="Remove this photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <p className="font-mono text-[9px] text-white truncate w-full">
                        {item.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : showManualInput ? (
        /* Mode B: Manual Public ID / URL Input */
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={props.value || ""}
              onChange={(e) => {
                props.onChangeValue(e.target.value);
                if (props.selectedFile) removeSingleFile();
              }}
              placeholder="Cloudinary Public ID (e.g. board/gaurav) or full URL"
              className="flex-1 rounded-md bg-[#030712] border border-[#1E293B] px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyber-blue"
            />
          </div>

          {/* Manual Input Preview */}
          {props.value && props.value.trim().length > 0 && (
            <div className="p-2.5 rounded bg-[#030712] border border-[#1E293B] flex items-center gap-3 overflow-hidden">
              <div className="relative w-14 h-14 rounded overflow-hidden bg-[#070D1D] shrink-0 border border-[#1E293B]">
                <CloudinaryImage
                  src={props.value}
                  alt="Remote Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="font-mono text-xs text-slate-400 min-w-0 flex-1 overflow-hidden">
                <span className="text-cyber-blue text-[10px] block font-bold tracking-wider uppercase">
                  HOSTED ASSET PREVIEW
                </span>
                <p className="truncate text-white text-xs block max-w-full font-mono">
                  {props.value}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Mode C: Single File Dropzone & Picker */
        <div className="flex flex-col gap-2">
          {props.selectedFile && singlePreview ? (
            /* Selected Local File Preview Box */
            <div className="p-3 rounded-lg bg-[#030712] border border-cyber-blue/40 flex items-center justify-between gap-3 shadow-[0_0_15px_rgba(0,136,255,0.15)]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-14 h-14 rounded overflow-hidden bg-[#070D1D] shrink-0 border border-[#1E293B]">
                  <img
                    src={singlePreview}
                    alt="Selected Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="font-mono text-xs text-slate-300 min-w-0 flex flex-col gap-0.5">
                  <span className="text-emerald-400 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    READY TO UPLOAD
                  </span>
                  <p className="text-white text-xs truncate max-w-[180px] sm:max-w-xs font-semibold">
                    {props.selectedFile.name}
                  </p>
                  <span className="text-[10px] text-slate-500">
                    {formatFileSize(props.selectedFile.size)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 rounded-md border border-[#1E293B] hover:border-cyber-blue text-slate-400 hover:text-white text-xs font-mono flex items-center gap-1 cursor-pointer"
                  title="Replace file"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Replace</span>
                </button>
                <button
                  type="button"
                  onClick={removeSingleFile}
                  className="p-1.5 rounded-md border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 cursor-pointer"
                  title="Remove file"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : props.value && props.value.trim().length > 0 ? (
            /* Existing Hosted Image Preview Box with Change Button */
            <div className="p-3 rounded-lg bg-[#030712] border border-[#1E293B] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-14 h-14 rounded overflow-hidden bg-[#070D1D] shrink-0 border border-[#1E293B]">
                  <CloudinaryImage
                    src={props.value}
                    alt="Current Image"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="font-mono text-xs text-slate-400 min-w-0 flex flex-col gap-0.5">
                  <span className="text-cyber-blue text-[10px] font-bold tracking-wider uppercase">
                    CURRENT IMAGE
                  </span>
                  <p className="truncate text-white text-xs max-w-[180px] sm:max-w-xs font-mono">
                    {props.value}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-md bg-[#0B1120] border border-[#1E293B] hover:border-cyber-blue text-slate-300 hover:text-white font-mono text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5 text-cyber-blue" />
                <span>Upload New</span>
              </button>
            </div>
          ) : (
            /* Empty Dropzone Box */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full p-4 rounded-lg border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 text-center ${
                isDragOver
                  ? "border-cyber-blue bg-cyber-blue/10 scale-[0.99]"
                  : "border-[#1E293B] hover:border-cyber-blue/50 bg-[#030712]/70 hover:bg-[#030712]"
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-cyber-blue/10 border border-cyber-blue/30 flex items-center justify-center text-cyber-blue">
                <UploadCloud className="w-4 h-4" />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="font-mono text-xs font-bold text-slate-200">
                  Click to upload image or drag & drop
                </p>
                <p className="font-mono text-[10px] text-slate-500">
                  PNG, JPG, JPEG, WEBP (Direct upload with auto-rollback)
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
