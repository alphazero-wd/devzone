"use client";
import { Button } from "@/features/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/features/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/features/ui/use-toast";
import { useDeleteAvatarDialog } from "./use-delete-dialog";
import { useDeleteImage } from "./use-delete";

const supabase = createClient();

interface DeleteAvatarDialogProps {
  avatar: string;
  profileId: string;
  clearPreviewImage: () => void;
}

export const DeleteAvatarDialog = ({
  avatar,
  profileId,
  clearPreviewImage,
}: DeleteAvatarDialogProps) => {
  const router = useRouter();
  const deleteAvatar = useDeleteImage();
  const { toast } = useToast();
  const { isOpen, onClose } = useDeleteAvatarDialog();

  const onDeletePost = async () => {
    const { data, error } = await deleteAvatar(avatar);
    if (data) {
      const { dismiss } = toast({
        variant: "success",
        title: "Delete avatar successfully!",
      });
      const { data, error } = await supabase
        .from("profiles")
        .update({
          avatar: null,
        })
        .eq("user_id", profileId);
      if (data) setTimeout(dismiss, 2000);
      if (error) showError(error.message);
    }

    if (error) showError(error.message);
    clearPreviewImage();
    router.refresh();
    onClose();
  };

  const showError = (message: string) => {
    const { dismiss } = toast({
      variant: "error",
      title: "Delete avatar failed!",
      description: message,
    });
    setTimeout(dismiss, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete avatar confirmation</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the avatar?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDeletePost}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
