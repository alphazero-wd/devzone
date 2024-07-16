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
import { useRouter } from "next/navigation";
import { useToast } from "@/features/ui/use-toast";
import { useDeleteAvatarDialog } from "./use-delete-dialog";
import { deleteAvatar } from "./delete-avatar";
import { isAxiosError } from "axios";
import { useState } from "react";
import { Spinner } from "@/features/ui/spinner";

interface DeleteAvatarDialogProps {
  clearPreviewImage: () => void;
}

export const DeleteAvatarDialog = ({
  clearPreviewImage,
}: DeleteAvatarDialogProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { isOpen, onClose } = useDeleteAvatarDialog();
  const [loading, setLoading] = useState(false);

  const onDeletePost = () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        await deleteAvatar();
        const { dismiss } = toast({
          variant: "success",
          title: "Delete avatar successfully!",
        });
        setTimeout(dismiss, 2000);
        clearPreviewImage();
        router.refresh();
        onClose();
      } catch (error: any) {
        showError(
          isAxiosError(error) ? error.response?.data.message : error.message
        );
      } finally {
        setLoading(false);
      }
    }, 2000);
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
          <Button variant="outline" disabled={loading} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onDeletePost}
            className="w-fit gap-x-2"
            type="submit"
            disabled={loading}
          >
            {loading && <Spinner />} {loading ? "Deleting..." : "Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
