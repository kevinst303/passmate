import { createClient } from "@/utils/supabase/server";
import { redirect } from "@/i18n/routing";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect({ href: "/login", locale });
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single();

    return <SettingsClient profile={profile} user={user!} />;
}
