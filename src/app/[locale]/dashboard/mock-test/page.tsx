import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MockTestClient from "./MockTestClient";

export default async function MockTestPage() {
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
        redirect("/premium?reason=mock_test");
    }

    return <MockTestClient profile={profile} />;
}
