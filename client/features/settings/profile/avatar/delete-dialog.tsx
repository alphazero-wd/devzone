"use client";
import { Button } from "@/features/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/features/ui/dialog";
import { useRouter } from "next/navigation";
import { useToast } from "@/features/ui/use-toast";
import { deleteAvatar } from "./delete-avatar";
import { isAxiosError } from "axios";
import { MouseEventHandler, useState } from "react";
import { Spinner } from "@/features/ui/spinner";
import { XIcon } from "lucide-react";
import { timeout } from "@/features/common/utils";

interface DeleteAvatarDialogProps {
  clearPreviewImage: () => void;
}

export const DeleteAvatarDialog = ({
  clearPreviewImage,
}: DeleteAvatarDialogProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDeleteAvatar = async () => {
    setLoading(true);
    await timeout();
    try {
      await deleteAvatar();
      const { dismiss } = toast({
        variant: "success",
        title: "Delete avatar successfully!",
      });
      setTimeout(dismiss, 2000);
      clearPreviewImage();
      router.refresh();
      setIsOpen(false);
    } catch (error: any) {
      const message = isAxiosError(error)
        ? error.response?.data.message
        : error.message;
      const { dismiss } = toast({
        variant: "error",
        title: "Delete avatar failed!",
        description: message,
      });
      setTimeout(dismiss, 2000);
    } finally {
      setLoading(false);
    }
  };

  const onDeleteAvatarDialogOpen: MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    e.stopPropagation();
    setIsOpen(true);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="absolute opacity-0 group-hover:opacity-100 transition-opacity top-0 -right-3 z-50 bg-destructive rounded-full"
          variant="destructive"
          onClick={onDeleteAvatarDialogOpen}
        >
          <XIcon className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete avatar confirmation</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the avatar?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onDeleteAvatar}
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
