'use server';

import { createClient } from "@/utils/supabase/server";

export async function getMistakesForAI() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
        .from('user_mistakes')
        .select(`
            id,
            incorrect_attempts,
            questions (
                question_text,
                explanation,
                topic
            )
        `)
        .eq('user_id', user.id)
        .eq('is_resolved', false)
        .order('last_mistake_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error('Error fetching mistakes:', error);
        return { error: 'Failed to fetch mistakes' };
    }

    return { mistakes: data || [] };
}
