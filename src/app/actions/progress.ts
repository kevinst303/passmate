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

    // 2. Log Quiz Attempt
    const { data: attemptData } = await supabase.from('quiz_attempts').insert({
        user_id: userId,
        score,
        total_questions: totalQuestions,
        xp_earned: xpGained,
    }).select('id').single();

    // 3. Log XP
    await supabase.from('xp_logs').insert({
        user_id: userId,
        amount: xpGained,
        reason: 'quiz_complete',
    });

    // 4. Update Quest Progress
    await updateQuestProgress(userId, 'quiz_count', 1, { topic });
    if (score === totalQuestions) {
        await updateQuestProgress(userId, 'perfect_score', 1, { topic });
    }
    await updateQuestProgress(userId, 'topic_quiz', 1, { topic });
    await updateQuestProgress(userId, 'xp_earn', xpGained, { topic });

    // 5. Update Streak Logic
    const now = new Date();
    const lastUpdate = profile.last_streak_update ? new Date(profile.last_streak_update) : null;
    let newStreak = profile.daily_streak || 0;

    if (!lastUpdate) {
        newStreak = 1;
    } else {
        const isToday = lastUpdate.toDateString() === now.toDateString();
        const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === lastUpdate.toDateString();

        // Reset date object after subtraction
        now.setDate(now.getDate() + 1);

        if (!isToday) {
            if (isYesterday) {
                newStreak += 1;
            } else {
                newStreak = 1; // Streak broken
            }
        }
    }

    // 5. Calculate New Level (Dummy logic: level up every 1000 XP)
    const newTotalXp = (profile.total_xp || 0) + xpGained;
    const newLevel = Math.floor(newTotalXp / 1000) + 1;

    // 6. Update Profile
    const { error: updateError } = await supabase
        .from('profiles')
        .update({
            current_xp: (profile.current_xp || 0) + xpGained,
            total_xp: newTotalXp,
            daily_streak: newStreak,
            last_streak_update: now.toISOString(),
            hearts: profile.is_premium ? 5 : Math.max(0, (profile.hearts || 0) - livesLost),
            level: newLevel,
            updated_at: now.toISOString(),
        })
        .eq('id', userId);

    if (updateError) {
        console.error('Error updating profile:', updateError);
        return { success: false, error: updateError.message };
    }

    // 7. Update Weekly League XP
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
        // Enrol in Bronze league
        const { data: bronze } = await supabase
            .from('leagues')
            .select('id')
            .eq('name', 'Bronze')
            .single();

        if (bronze) {
            await supabase.from('league_standings').insert({
                user_id: userId,
                league_id: bronze.id,
                weekly_xp: xpGained,
                current_rank: 10 // Start at the bottom
            });
        }
    }

    // 8. Update Topic Progress (Skill Tree)
    if (topic) {
        const percentage = Math.round((score / totalQuestions) * 100);
        await updateTopicProgress(topic, percentage);
    }

    // 8. Check Achievements
    const { unlocked: quizUnlocks } = await checkAndUnlockAchievements(userId, 'quiz', { score, totalQuestions });
    const { unlocked: streakUnlocks } = await checkAndUnlockAchievements(userId, 'streak', { streak: newStreak });
    let levelUnlocks: string[] = [];
    if (newLevel > (profile.level || 1)) {
        const { unlocked } = await checkAndUnlockAchievements(userId, 'level', { level: newLevel });
        levelUnlocks = unlocked || [];
    }

    revalidatePath('/dashboard');
    return { success: true, attemptId: attemptData?.id, newStreak, newXp: newTotalXp, newLevel, unlockedAchievements: [...(quizUnlocks || []), ...(streakUnlocks || []), ...levelUnlocks] };
}
