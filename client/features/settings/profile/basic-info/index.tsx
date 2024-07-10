import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/features/ui/card";
import { BasicInfoForm } from "./form";

interface ProfileSettingsBasicInfoProps {
  profileId: string;
  firstName: string;
  lastName: string;
}

export const ProfileSettingsBasicInfo = (
  props: ProfileSettingsBasicInfoProps
) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Update your first name and last name</CardDescription>
      </CardHeader>
      <CardContent>
        <BasicInfoForm {...props} />
      </CardContent>
    </Card>
  );
};
