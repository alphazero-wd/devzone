import { Avatar, AvatarFallback, AvatarImage } from "@/features/ui/avatar";
import { cn } from "@/lib/utils";

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
  return (
    <Avatar className={cn(size === "lg" && "w-24 h-24 text-3xl")}>
      <AvatarImage
        onLoad={isPreview ? () => URL.revokeObjectURL(avatar!) : undefined}
        src={avatar}
        alt={`${name}'s avatar`}
      />
      <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};
