import { Profile, User } from "@/features/users/types";
import { ProfileSettingsBasicInfo } from "./basic-info";
import { ProfileAvatarSettings } from "./avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/features/ui/card";

interface ProfileSettingsProps {
  user: User;
}

export const ProfileSettings = ({ user }: ProfileSettingsProps) => {
  return (
    <div className="grid gap-y-4">
      <ProfileSettingsBasicInfo name={user.name} />
      <Card>
        <CardHeader>
          <CardTitle>Profile image</CardTitle>
          <CardDescription>Change your profile avatar</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileAvatarSettings name={user.name} avatar={user.avatar} />
        </CardContent>
      </Card>
    </div>
  );
};
