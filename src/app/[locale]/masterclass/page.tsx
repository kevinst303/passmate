import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MasterclassClient from "./MasterclassClient";
import { getMasterclassProgress } from "@/app/actions/masterclass";

export default async function MasterclassPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (profile?.premium_tier !== 'citizenship_achiever') {
        redirect("/premium?reason=masterclass");
    }

    const { modules } = await getMasterclassProgress();

    return <MasterclassClient profile={profile} initialCompleted={modules} />;
}
