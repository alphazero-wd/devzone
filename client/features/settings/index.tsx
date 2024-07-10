"use client";
import { User } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Profile } from "../users/types";
import { ProfileSettings } from "./profile";
import { AccountSettings } from "./account";

interface SettingsClientProps {
  profile: Profile | null;
  user: User | null;
}

export const SettingsClient = ({ profile, user }: SettingsClientProps) => {
  if (!profile || !user) return null;
  return (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <ProfileSettings profile={profile} />
      </TabsContent>
      <TabsContent value="account">
        <AccountSettings user={user} />
      </TabsContent>
    </Tabs>
  );
};
