import { Avatar, AvatarFallback, AvatarImage } from "@/features/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ProfileAvatarProps {
  isPreview?: boolean;
  avatar?: string;
  name: string;
  size?: "sm" | "lg";
}

export const ProfileAvatar = ({
  avatar,
  name,
  size = "sm",
  isPreview = false,
}: ProfileAvatarProps) => {
  if (!avatar)
    return (
      <Avatar className={cn(size === "lg" && "w-24 h-24 text-3xl")}>
        <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
      </Avatar>
    );
  return (
    <Image
      width={size === "lg" ? 128 : 60}
      height={size === "lg" ? 128 : 60}
      alt={`${name}'s avatar`}
      src={avatar}
      onLoad={isPreview ? () => URL.revokeObjectURL(avatar!) : undefined}
      className={cn(
        size === "lg" ? "w-24 h-24" : "w-10 h-10",
        "relative flex object-cover aspect-square shrink-0 overflow-hidden rounded-full"
      )}
    />
  );
};
