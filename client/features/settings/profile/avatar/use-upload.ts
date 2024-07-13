import { useState } from "react";
import { FileWithPreview } from "@/features/common/types";
import { useToast } from "@/features/ui/use-toast";
import { useRouter } from "next/navigation";
import { deleteAvatar } from "./delete-avatar";
import { uploadAvatar } from "./upload-avatar";
import { Avatar } from "@/features/users/types";

export const useUploadImage = (avatar: Avatar | null) => {
  const { toast } = useToast();
  const [newImage, setNewImage] = useState<FileWithPreview | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onImageChange = (image?: File) => {
    if (!image) return;
    setNewImage(Object.assign(image, { preview: URL.createObjectURL(image) }));
  };

  const onUploadImage = () => {
    setLoading(true);
    setTimeout(uploadImage, 2000);
  };

  const clearPreviewImage = () => setNewImage(null);

  const uploadImage = async () => {
    if (!newImage) return;
    if (avatar) await deleteAvatar();
    try {
      await uploadAvatar(newImage);
      toast({
        variant: "success",
        title: "Avatar updated successfully",
      });
      router.refresh();
      clearPreviewImage();
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const showError = (message: string) => {
    toast({
      variant: "error",
      title: "Failed to update avatar",
      description: message,
    });
  };

  return { loading, onUploadImage, onImageChange, newImage, clearPreviewImage };
};
