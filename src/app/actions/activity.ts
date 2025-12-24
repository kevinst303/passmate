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

    interface ActivityAttempt {
        id: string;
        score: number;
        total_questions: number;
        xp_earned: number;
        completed_at: string;
        profiles: {
            username: string | null;
            avatar_url: string | null;
            is_premium: boolean;
        } | null;
    }

    const activityData = attempts as unknown as ActivityAttempt[];

    return (activityData || []).map((a: ActivityAttempt) => {
        const profile = Array.isArray(a.profiles) ? a.profiles[0] : a.profiles;
        return {
            id: a.id,
            user: profile?.username || 'Citizen Mate',
            avatar: profile?.avatar_url,
            isPremium: profile?.is_premium,
            score: a.score,
            total: a.total_questions,
            xp: a.xp_earned,
            time: a.completed_at
        };
    });
}
