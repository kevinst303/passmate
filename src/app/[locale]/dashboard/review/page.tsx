import { createClient } from "@/utils/supabase/server";
import { redirect } from "@/i18n/routing";
import ReviewClient, { Mistake, Question } from "./ReviewClient";

interface MistakeRecord {
    id: string;
    question_id: string;
    incorrect_attempts: number;
    questions: Question | Question[];
}

export default async function ReviewPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect({ href: '/login', locale });
    }

    const { data: mistakes } = await supabase
        .from("user_mistakes")
        .select(`
            id,
            question_id,
            incorrect_attempts,
            questions (*)
        `)
        .eq("user_id", user!.id)
        .eq("is_resolved", false)
        .order("last_mistake_at", { ascending: false });

    const formattedMistakes: Mistake[] = (mistakes as unknown as MistakeRecord[])?.map((m) => ({
        id: m.id,
        questions: Array.isArray(m.questions) ? m.questions[0] : m.questions as Question
    })) || [];

    return <ReviewClient mistakes={formattedMistakes} />;
}
