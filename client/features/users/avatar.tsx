import { Avatar, AvatarFallback, AvatarImage } from "@/features/ui/avatar";
import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  isPreview?: boolean;
  avatarUrl?: string;
  name: string;
  size?: "sm" | "lg";
}

export const ProfileAvatar = ({
  avatarUrl,
  name,
  size = "sm",
  isPreview = false,
}: ProfileAvatarProps) => {
  return (
    <Avatar className={cn(size === "lg" && "w-24 h-24 text-3xl")}>
      <AvatarImage
        onLoad={isPreview ? () => URL.revokeObjectURL(avatarUrl!) : undefined}
        src={avatarUrl}
        alt={`${name}'s avatar`}
      />
      <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};
