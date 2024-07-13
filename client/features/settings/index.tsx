"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ProfileSettings } from "./profile";
import { AccountSettings } from "./account";
import { User } from "../users/types";

interface SettingsClientProps {
  user: User | null;
}

export const SettingsClient = ({ user }: SettingsClientProps) => {
  if (!user) return null;
  return (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <ProfileSettings user={user} />
      </TabsContent>
      <TabsContent value="account">
        <AccountSettings user={user} />
      </TabsContent>
    </Tabs>
  );
};
