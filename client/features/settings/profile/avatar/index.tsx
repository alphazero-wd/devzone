"use client";
import { Button } from "@/features/ui/button";
import { Spinner } from "@/features/ui/spinner";
import { useUploadImage } from "./use-upload";
import { ProfileAvatar } from "@/features/users/avatar";
import { useDropzone } from "react-dropzone";
import { useDeleteAvatarDialog } from "./use-delete-dialog";
import { MouseEventHandler } from "react";
import { DeleteAvatarDialog } from "./delete-dialog";
import { ImageDropzone } from "@/features/common/components/dropzone";
import { XIcon } from "lucide-react";
import { Avatar } from "@/features/users/types";

interface ProfileAvatarSettingsProps {
  name: string;
  avatar: Avatar | null;
}

export const ProfileAvatarSettings = ({
  avatar,
  name,
}: ProfileAvatarSettingsProps) => {
  const { loading, newImage, onImageChange, onUploadImage, clearPreviewImage } =
    useUploadImage(avatar);
  const onOpen = useDeleteAvatarDialog((state) => state.onOpen);

  const { isDragActive, getInputProps, getRootProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
    multiple: false,
    onDrop: (files) => {
      onImageChange(files[0]);
    },
  });

  const onDeleteAvatarDialogOpen: MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    e.stopPropagation();
    onOpen();
  };

  return (
    <section className="grid gap-y-4">
      <div
        {...getRootProps({
          className: "relative w-24 h-24 group rounded-full",
        })}
      >
        {avatar && (
          <Button
            size="icon"
            className="absolute opacity-0 group-hover:opacity-100 transition-opacity top-0 -right-3 z-50 bg-destructive rounded-full"
            onClick={onDeleteAvatarDialogOpen}
            variant="destructive"
          >
            <XIcon className="w-5 h-5" />
          </Button>
        )}
        <ImageDropzone
          isDragActive={isDragActive}
          getInputProps={getInputProps}
        />
        <ProfileAvatar
          isPreview={!!newImage}
          name={name}
          avatarUrl={newImage?.preview || avatar?.url}
          size="lg"
        />
      </div>
      <div className="pt-2 border-t flex items-center gap-x-4">
        {newImage && (
          <Button onClick={clearPreviewImage} variant="outline">
            Cancel
          </Button>
        )}
        <Button
          onClick={onUploadImage}
          disabled={loading || !newImage}
          className="w-fit gap-x-2"
        >
          {loading && <Spinner />} {loading ? "Updating..." : "Update"}
        </Button>
      </div>
      {avatar && <DeleteAvatarDialog clearPreviewImage={clearPreviewImage} />}
    </section>
  );
};
