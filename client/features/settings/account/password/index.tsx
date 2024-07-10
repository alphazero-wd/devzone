import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/features/ui/card";
import { PasswordSettingsForm } from "./form";

export const PasswordSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          Change your password frequently to secure your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PasswordSettingsForm />
      </CardContent>
    </Card>
  );
};
