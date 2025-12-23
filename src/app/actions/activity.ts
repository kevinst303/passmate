'use server';

import { createClient } from '@/utils/supabase/server';

export async function getGlobalActivity() {
    const supabase = await createClient();

    // Fetch recent quiz attempts with user profiles
    const { data: attempts, error } = await supabase
        .from('quiz_attempts')
        .select(`
            id,
            score,
            total_questions,
            xp_earned,
            completed_at,
            profiles (
                username,
                avatar_url,
                is_premium
            )
        `)
        .order('completed_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error fetching global activity:', error);
        return [];
    }

    return attempts.map((a: any) => ({
        id: a.id,
        user: a.profiles?.username || 'Citizen Mate',
        avatar: a.profiles?.avatar_url,
        isPremium: a.profiles?.is_premium,
        score: a.score,
        total: a.total_questions,
        xp: a.xp_earned,
        time: a.completed_at
    }));
}
