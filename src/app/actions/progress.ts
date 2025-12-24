'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { checkAndUnlockAchievements } from './achievements';
import { updateQuestProgress } from './quests';
import { updateTopicProgress } from './skills';

export async function updateUserProgress(userId: string, xpGained: number, score: number, totalQuestions: number, livesLost: number = 0, topic?: string) {
    const supabase = await createClient();

    // 1. Get current profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('current_xp, total_xp, daily_streak, last_streak_update, level, hearts, is_premium')
        .eq('id', userId)
        .single();

    if (profileError || !profile) {
        console.error('Error fetching profile:', profileError);
        return { success: false, error: 'Profile not found' };
    }

    // 2. Prep calculations
    const now = new Date();
    const lastUpdate = profile.last_streak_update ? new Date(profile.last_streak_update) : null;
    let newStreak = profile.daily_streak || 0;

    if (!lastUpdate) {
        newStreak = 1;
    } else {
        const isToday = lastUpdate.toDateString() === now.toDateString();
        const isYesterday = new Date(new Date(now).setDate(now.getDate() - 1)).toDateString() === lastUpdate.toDateString();

        if (!isToday) {
            newStreak = isYesterday ? newStreak + 1 : 1;
        }
    }

    const newTotalXp = (profile.total_xp || 0) + xpGained;
    const newLevel = Math.floor(newTotalXp / 1000) + 1;

    // 3. Parallelize independent updates
    const [attemptRes, profileUpdate, questsUpdate, topicUpdate, leagueUpdate] = await Promise.all([
        supabase.from('quiz_attempts').insert({
            user_id: userId,
            score,
            total_questions: totalQuestions,
            xp_earned: xpGained,
        }).select('id').single(),

        supabase.from('profiles').update({
            current_xp: (profile.current_xp || 0) + xpGained,
            total_xp: newTotalXp,
            daily_streak: newStreak,
            last_streak_update: now.toISOString(),
            hearts: profile.is_premium ? 5 : Math.max(0, (profile.hearts || 0) - livesLost),
            level: newLevel,
            updated_at: now.toISOString(),
        }).eq('id', userId),

        // Run quest updates in parallel
        Promise.all([
            updateQuestProgress(userId, 'quiz_count', 1, { topic }),
            score === totalQuestions ? updateQuestProgress(userId, 'perfect_score', 1, { topic }) : Promise.resolve(),
            updateQuestProgress(userId, 'topic_quiz', 1, { topic }),
            updateQuestProgress(userId, 'xp_earn', xpGained, { topic }),
        ]),

        topic ? updateTopicProgress(topic, Math.round((score / totalQuestions) * 100)) : Promise.resolve(),

        // League update
        (async () => {
            const { data: leagueStanding } = await supabase
                .from('league_standings')
                .select('weekly_xp')
                .eq('user_id', userId)
                .single();

            if (leagueStanding) {
                await supabase
                    .from('league_standings')
                    .update({ weekly_xp: leagueStanding.weekly_xp + xpGained })
                    .eq('user_id', userId);
            } else {
                const { data: bronze } = await supabase.from('leagues').select('id').eq('name', 'Bronze').single();
                if (bronze) {
                    await supabase.from('league_standings').insert({
                        user_id: userId,
                        league_id: bronze.id,
                        weekly_xp: xpGained,
                        current_rank: 10
                    });
                }
            }
        })(),

        // Log general XP
        supabase.from('xp_logs').insert({
            user_id: userId,
            amount: xpGained,
            reason: 'quiz_complete',
        })
    ]);

    // 4. Check achievements (last, as they might depend on updated state)
    const [quizUnlocks, streakUnlocks, levelUnlocks] = await Promise.all([
        checkAndUnlockAchievements(userId, 'quiz', { score, totalQuestions }),
        checkAndUnlockAchievements(userId, 'streak', { streak: newStreak }),
        newLevel > (profile.level || 1) ? checkAndUnlockAchievements(userId, 'level', { level: newLevel }) : Promise.resolve({ unlocked: [] })
    ]);

    revalidatePath('/dashboard');
    return {
        success: true,
        attemptId: attemptRes.data?.id,
        newStreak,
        newXp: newTotalXp,
        newLevel,
        unlockedAchievements: [
            ...(quizUnlocks?.unlocked || []),
            ...(streakUnlocks?.unlocked || []),
            ...(levelUnlocks?.unlocked || [])
        ]
    };
}
