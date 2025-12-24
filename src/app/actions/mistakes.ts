'use server';

import { createClient } from "@/utils/supabase/server";

export async function getMistakesForAI() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Not authenticated' };

    try {
        const { data, error } = await supabase
            .from('user_mistakes')
            .select('*, questions(*)')
            .eq('user_id', user.id)
            .eq('is_resolved', false)
            .order('last_mistake_at', { ascending: false })
            .limit(5);

        if (error) {
            console.error(`[getMistakesForAI] Supabase Error: ${error.message} (Code: ${error.code})`);
            return { mistakes: [] };
        }

        const formattedData = data?.map(m => ({
            ...m,
            questions: Array.isArray(m.questions) ? m.questions[0] : m.questions
        })) || [];

        return { mistakes: formattedData };
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`[getMistakesForAI] Catch Error: ${errorMessage}`);
        return { mistakes: [] };
    }
}
