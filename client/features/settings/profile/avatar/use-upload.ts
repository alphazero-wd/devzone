import { useState } from "react";
import { FileWithPreview } from "@/features/common/types";
import { createClient } from "@/lib/supabase/client";
import { BUCKET_ID } from "@/constants";
import { useToast } from "@/features/ui/use-toast";
import { format } from "date-fns/format";
import { useRouter } from "next/navigation";
import { useDeleteImage } from "./use-delete";

export const useUploadImage = (profileId: string, avatar?: string) => {
  const supabase = createClient();
  const { toast } = useToast();
  const [newImage, setNewImage] = useState<FileWithPreview | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const deleteImage = useDeleteImage();

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
    if (avatar) await deleteImage(avatar);
    const uploadedAt = format(new Date(), "yMMddHHmmss");
    const path = `avatars/${uploadedAt}_${profileId}_${newImage.name}`;
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_ID)
        .upload(path, newImage, {
          contentType: "image/jpeg",
        });
      if (error) throw error;
      if (data) {
        const { error } = await supabase
          .from("profiles")
          .update({
            avatar: data.path,
          })
          .eq("user_id", profileId);
        if (error) throw error;
        toast({
          variant: "success",
          title: "Avatar updated successfully",
        });
        router.refresh();
        clearPreviewImage();
      }
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
