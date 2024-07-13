import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/features/ui/card";
import { BasicInfoForm } from "./form";

interface ProfileSettingsBasicInfoProps {
  name: string;
}

export const ProfileSettingsBasicInfo = ({
  name,
}: ProfileSettingsBasicInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Update your first name and last name</CardDescription>
      </CardHeader>
      <CardContent>
        <BasicInfoForm name={name} />
      </CardContent>
    </Card>
  );
};
