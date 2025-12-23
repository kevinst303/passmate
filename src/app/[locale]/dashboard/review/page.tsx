import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ReviewClient from "./ReviewClient";

export default async function ReviewPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: mistakes } = await supabase
        .from("user_mistakes")
        .select(`
            id,
            question_id,
            incorrect_attempts,
            questions (*)
        `)
        .eq("user_id", user.id)
        .eq("is_resolved", false)
        .order("last_mistake_at", { ascending: false });

    return <ReviewClient mistakes={mistakes || []} />;
}
