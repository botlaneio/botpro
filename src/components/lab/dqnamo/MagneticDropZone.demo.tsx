"use client";
import { MagneticDropZone } from "./MagneticDropZone";
export function UploadField() {
  return (
    <MagneticDropZone
      accept="image/*,.pdf,.zip"
      maxSize={20 * 1024 * 1024}
      onFilesChange={(files) => {
        console.log(files);
      }}
    />
  );
}