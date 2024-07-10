"use client";
import { Button } from "@/features/ui/button";
import { Spinner } from "@/features/ui/spinner";
import { useUploadImage } from "./use-upload";
import { ProfileAvatar } from "@/features/users/avatar";
import { useDropzone } from "react-dropzone";
import { createClient } from "@/lib/supabase/client";
import { useDeleteAvatarDialog } from "./use-delete-dialog";
import { MouseEventHandler } from "react";
import { DeleteAvatarDialog } from "./delete-dialog";
import { ImageDropzone } from "@/features/common/components/dropzone";
import { XIcon } from "lucide-react";

interface ProfileAvatarSettingsProps {
  profileId: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export const ProfileAvatarSettings = ({
  profileId,
  avatar,
  firstName,
  lastName,
}: ProfileAvatarSettingsProps) => {
  const { loading, newImage, onImageChange, onUploadImage, clearPreviewImage } =
    useUploadImage(profileId, avatar);
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
          firstName={firstName}
          lastName={lastName}
          avatar={newImage?.preview || avatar}
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
      {avatar && (
        <DeleteAvatarDialog
          clearPreviewImage={clearPreviewImage}
          avatar={avatar}
          profileId={profileId}
        />
      )}
    </section>
  );
};
