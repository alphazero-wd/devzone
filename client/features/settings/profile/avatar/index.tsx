"use client";
import { Button } from "@/features/ui/button";
import { Spinner } from "@/features/ui/spinner";
import { useUploadImage } from "./use-upload";
import { ProfileAvatar } from "@/features/users/avatar";
import { useDropzone } from "react-dropzone";
import { useDeleteAvatarDialog } from "./use-delete-dialog";
import { DeleteAvatarDialog } from "./delete-dialog";
import { ImageDropzone } from "@/features/common/components/dropzone";
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

  return (
    <section className="grid gap-y-4">
      <div
        {...getRootProps({
          className: "relative w-24 h-24 group rounded-full",
        })}
      >
        {avatar && <DeleteAvatarDialog clearPreviewImage={clearPreviewImage} />}
        <ImageDropzone
          isDragActive={isDragActive}
          getInputProps={getInputProps}
        />
        <ProfileAvatar
          isPreview={!!newImage}
          name={name}
          avatar={newImage?.preview || avatar?.url}
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
    </section>
  );
};
