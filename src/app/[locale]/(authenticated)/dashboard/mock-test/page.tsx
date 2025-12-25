import { createClient } from "@/utils/supabase/server";
import { redirect } from "@/i18n/routing";
import MockTestClient from "./MockTestClient";

export default async function MockTestPage({ params }: { params: Promise<{ locale: string }> }) {
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
        redirect({ href: "/premium?reason=mock_test", locale });
    }

    return <MockTestClient profile={profile} />;
}
