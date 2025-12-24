import { createClient } from "@/utils/supabase/server";
import { redirect } from "@/i18n/routing";
import MasterclassClient from "./MasterclassClient";
import { getMasterclassProgress } from "@/app/actions/masterclass";

export default async function MasterclassPage({ params }: { params: Promise<{ locale: string }> }) {
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

    if (profile?.premium_tier !== 'citizenship_achiever') {
        redirect({ href: "/premium?reason=masterclass", locale });
    }

    const { modules } = await getMasterclassProgress();

    return <MasterclassClient profile={profile} initialCompleted={modules} />;
}
