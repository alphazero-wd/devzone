import { createClient } from "@/lib/supabase/client";
import { BUCKET_ID } from "@/constants";

export const useDeleteImage = () => {
  const supabase = createClient();
  const deleteImage = async (image: string) => {
    const { data, error } = await supabase.storage
      .from(BUCKET_ID)
      .remove([image]);
    return { data, error };
  };
  return deleteImage;
};
