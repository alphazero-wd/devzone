import { Profile } from "@/features/users/types";
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
  profile: Profile;
}

export const ProfileSettings = ({ profile }: ProfileSettingsProps) => {
  return (
    <div className="grid gap-y-4">
      <ProfileSettingsBasicInfo
        profileId={profile.user_id}
        firstName={profile.first_name}
        lastName={profile.last_name}
      />
      <Card>
        <CardHeader>
          <CardTitle>Profile image</CardTitle>
          <CardDescription>Change your profile avatar</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileAvatarSettings
            profileId={profile.user_id}
            firstName={profile.first_name}
            lastName={profile.last_name}
            avatar={profile.avatar}
          />
        </CardContent>
      </Card>
    </div>
  );
};
