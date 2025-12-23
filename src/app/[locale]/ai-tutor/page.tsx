import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AITutorClient from "./AITutorClient";
import { getMistakesForAI } from "@/app/actions/mistakes";

export default async function AITutorPage() {
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

    if (!profile?.is_premium) {
        redirect("/premium?reason=ai_tutor");
    }

    const { mistakes } = await getMistakesForAI();

    return <AITutorClient initialMistakes={mistakes} profile={profile} />;
}
