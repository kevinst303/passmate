'use server';

import { createClient } from '@/utils/supabase/server';

export async function getAchievementsData() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    // Fetch all achievements
    const { data: allAchievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .order('xp_reward', { ascending: true });

    if (achievementsError) {
        console.error('Error fetching achievements:', achievementsError);
        return { error: 'Failed to fetch achievements' };
    }

    // Fetch user's unlocked achievements
    const { data: userAchievements, error: userAchievementsError } = await supabase
        .from('user_achievements')
        .select('achievement_id, unlocked_at')
        .eq('user_id', user.id);

    if (userAchievementsError) {
        console.error('Error fetching user achievements:', userAchievementsError);
        return { error: 'Failed to fetch user achievements' };
    }

    // Map unlocked status to achievements
    const achievements = allAchievements.map(achievement => {
        const unlocked = userAchievements.find(ua => ua.achievement_id === achievement.id);
        return {
            ...achievement,
            is_unlocked: !!unlocked,
            unlocked_at: unlocked ? unlocked.unlocked_at : null
        };
    });

    // Calculate progress
    const total = achievements.length;
    const unlockedCount = userAchievements.length;
    const progressPercentage = total > 0 ? (unlockedCount / total) * 100 : 0;

    return {
        achievements,
        stats: {
            total,
            unlocked: unlockedCount,
            progress: Math.round(progressPercentage)
        }
    };
}

export async function checkAndUnlockAchievements(
    userId: string,
    type: 'quiz' | 'streak' | 'friend' | 'battle' | 'level' | 'mock_test' | 'topic_complete',
    meta?: any
) {
    const supabase = await createClient();

    // specific achievement names to look for based on type
    const potentialUnlocks = [];

    if (type === 'quiz') {
        // Check "First Step"
        const { count: quizCount } = await supabase
            .from('quiz_attempts')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        if (quizCount && quizCount >= 1) potentialUnlocks.push('First Step');

        // Check "Perfect Score"
        if (meta?.score && meta?.totalQuestions && meta.score === meta.totalQuestions) {
            potentialUnlocks.push('Perfect Score');
        }

        // Check "Scholar" - Logic: if a topic is completed. 
        // We might need to pass this info in meta or check DB.
        // For now, let's skip "Scholar" here or rely on updateTopicProgress calling this with type 'topic_complete' (if we add it).
    }

    if (type === 'streak') {
        const streak = meta?.streak || 0;
        if (streak >= 3) potentialUnlocks.push('On Fire');
        if (streak >= 7) potentialUnlocks.push('Week Warrior');
    }

    if (type === 'friend') {
        potentialUnlocks.push('Socialite');
    }

    if (type === 'battle') {
        if (meta?.won) potentialUnlocks.push('Gladiator');
    }

    if (type === 'level') {
        const level = meta?.level || 1;
        if (level >= 10) potentialUnlocks.push('Koala King');
    }

    if (type === 'mock_test') {
        if (meta?.passed) potentialUnlocks.push('Mock Master');
    }

    if (type === 'topic_complete') {
        potentialUnlocks.push('Scholar');
    }

    if (potentialUnlocks.length === 0) return { unlocked: [] };

    // Process unlocks
    const unlockedNames = [];

    for (const name of potentialUnlocks) {
        // 1. Get achievement ID
        const { data: achievement } = await supabase
            .from('achievements')
            .select('id, xp_reward')
            .eq('name', name)
            .single();

        if (!achievement) continue;

        // 2. Check if already has it
        const { data: existing } = await supabase
            .from('user_achievements')
            .select('achievement_id')
            .eq('user_id', userId)
            .eq('achievement_id', achievement.id)
            .single();

        if (existing) continue;

        // 3. Unlock it
        await supabase.from('user_achievements').insert({
            user_id: userId,
            achievement_id: achievement.id
        });

        // 4. Give XP Reward
        if (achievement.xp_reward > 0) {
            await supabase.from('profiles').update({
                total_xp: meta?.currentTotalXp
                    ? meta.currentTotalXp + achievement.xp_reward
                    : undefined // We might not have the latest total_xp here easily, so ideally we increment
            }).eq('id', userId);

            // Note: properly incrementing usually requires a stored procedure or fetching first.
            // Simplified: We assume calling function handles XP or we do a separate specific update call.
            // Let's safe-increment:
            const { error: rpcError } = await supabase.rpc('increment_xp', {
                uid: userId,
                amount: achievement.xp_reward
            });

            if (rpcError) {
                // Fallback if RPC doesn't exist
                const { data: p } = await supabase.from('profiles').select('total_xp').eq('id', userId).single();
                if (p) {
                    await supabase.from('profiles').update({ total_xp: p.total_xp + achievement.xp_reward }).eq('id', userId);
                }
            }

            // Log the XP gain
            await supabase.from('xp_logs').insert({
                user_id: userId,
                amount: achievement.xp_reward,
                reason: `achievement_unlocked:${name}`
            });
        }

        unlockedNames.push(name);
    }

    return { unlocked: unlockedNames };
}

