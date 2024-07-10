import { cn } from "@/lib/utils";
import { CameraIcon } from "lucide-react";
import { DropzoneInputProps } from "react-dropzone";

interface ImageDropzoneProps {
  isDragActive: boolean;
  getInputProps: (props?: DropzoneInputProps) => DropzoneInputProps;
}

export const ImageDropzone = ({
  isDragActive,
  getInputProps,
}: ImageDropzoneProps) => {
  return (
    <div
      className={cn(
        isDragActive ? "opacity-100" : "opacity-0 hover:opacity-100",
        "z-10 text-background transition-opacity rounded-full w-full h-full absolute top-0 left-0 bg-foreground/80 flex justify-center items-center"
      )}
    >
      <input
        {...getInputProps({
          className:
            "rounded-full block pointer-events-none w-full h-full absolute top-6 -left-6",
        })}
        type="file"
      />
      <CameraIcon className="w-6 h-6" />
    </div>
  );
};
