// src/components/menu/ImageUpload.tsx
'use client';

import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import Image from "next/image";
import { X } from "lucide-react"; // You may need to install lucide-react: npm install lucide-react

interface ImageUploadProps {
  onChange: (url?: string) => void;
  value?: string;
}

export default function ImageUpload({ onChange, value }: ImageUploadProps) {
  if (value) {
    return (
      <div className="relative h-40 w-40">
        <Image
          fill
          src={value}
          alt="Uploaded Image"
          className="rounded-lg object-cover"
        />
        <button
          onClick={() => onChange()}
          className="bg-red-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone<OurFileRouter>
      endpoint="menuItemImage"
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        alert(`ERROR! ${error.message}`);
      }}
      className="bg-slate-100 ut-label:text-indigo-600 ut-button:bg-indigo-500 ut-button:ut-readying:bg-indigo-500/50"
    />
  );
}