"use client";

import { EmailInputForm } from "./form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/features/ui/card";

interface EmailSettingsProps {
  email: string;
}

export const EmailSettings = ({ email }: EmailSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Setting</CardTitle>
        <CardDescription>
          Change your email here, confirmation required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EmailInputForm email={email} />
      </CardContent>
    </Card>
  );
};
