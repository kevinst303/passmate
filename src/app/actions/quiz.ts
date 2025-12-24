'use server';

import { createClient } from '@/utils/supabase/server';
import { updateUserProgress } from './progress';

export async function getQuestions(topic?: string, limit: number = 5) {
    const supabase = await createClient();

    let query = supabase
        .from('questions')
        .select('*');

    if (topic) {
        query = query.eq('topic', topic);
    }

    const { data, error } = await query.limit(limit);

    if (error) {
        console.error('Error fetching questions:', error);
        return [];
    }

    return data;
}

export async function getRandomQuestions(limit: number = 20) {
    const supabase = await createClient();

    // supabase doesn't have a built-in random, so we fetch all IDs and pick random ones 
    // or just fetch all and shuffle (fine for small amount of questions)
    const { data, error } = await supabase
        .from('questions')
        .select('*');

    if (error) {
        console.error('Error fetching questions:', error);
        return [];
    }

    // Shuffle and slice
    return data.sort(() => Math.random() - 0.5).slice(0, limit);
}

export async function logQuizMistake(questionId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    // Use upsert to increment attempts or create new
    const { data: existing } = await supabase
        .from('user_mistakes')
        .select('incorrect_attempts')
        .eq('user_id', user.id)
        .eq('question_id', questionId)
        .single();

    if (existing) {
        await supabase
            .from('user_mistakes')
            .update({
                incorrect_attempts: existing.incorrect_attempts + 1,
                last_mistake_at: new Date().toISOString(),
                is_resolved: false
            })
            .eq('user_id', user.id)
            .eq('question_id', questionId);
    } else {
        await supabase
            .from('user_mistakes')
            .insert([{ user_id: user.id, question_id: questionId, incorrect_attempts: 1 }]);
    }
}

export async function getMistakes() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from('user_mistakes')
        .select('*, questions(*)')
        .eq('user_id', user.id)
        .eq('is_resolved', false)
        .order('last_mistake_at', { ascending: false });

    if (error) {
        console.error('Error fetching mistakes:', error);
        return [];
    }

    return data;
}

export async function resolveMistake(mistakeId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase
        .from('user_mistakes')
        .update({ is_resolved: true })
        .eq('id', mistakeId);

    if (!error) {
        // Reward small amount of XP for mastering a mistake
        await supabase.rpc('increment_xp', { uid: user.id, amount: 10 });
        await supabase.from('xp_logs').insert({
            user_id: user.id,
            amount: 10,
            reason: 'mistake_resolved'
        });
    }

    return { success: !error };
}

export async function submitQuizResults(score: number, totalQuestions: number, topic: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Not authenticated' };

    const xpGained = score * 20;

    return await updateUserProgress(user.id, xpGained, score, totalQuestions, 0, topic);
}
