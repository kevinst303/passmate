import { createClient } from "@/utils/supabase/server";
import { redirect } from "@/i18n/routing";
import AITutorClient from "./AITutorClient";
import { getMistakesForAI } from "@/app/actions/mistakes";

export default async function AITutorPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect({ href: '/login', locale });
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single();

    if (!profile?.is_premium) {
        redirect({ href: "/premium?reason=ai_tutor", locale });
    }

    const { mistakes } = await getMistakesForAI();

    return <AITutorClient initialMistakes={mistakes} profile={profile} />;
}
