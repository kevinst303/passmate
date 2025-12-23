'use server';

import { createClient } from '@/utils/supabase/server';
import { seedQuestions } from './seed';
import { generateDailyQuests } from './quests';
import { getGlobalActivity } from './activity';

export async function getDashboardData() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    // 1. Fetch Profile
    let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
                id: user.id,
                username: user.email?.split('@')[0],
                full_name: user.user_metadata?.full_name || 'New Mate',
                avatar_url: user.user_metadata?.avatar_url,
                current_xp: 0,
                total_xp: 0,
                level: 1,
                daily_streak: 0,
            })
            .select()
            .single();

        if (createError) {
            console.error('Error creating profile:', createError);
            return { error: 'Could not create profile' };
        }
        profile = newProfile;
    } else if (profileError) {
        console.error('Error fetching profile:', {
            message: profileError.message,
            code: profileError.code,
            details: profileError.details,
            hint: profileError.hint
        });
        return { error: `Profile error: ${profileError.message}` };
    }

    // Generate Quests
    if (profile) {
        await generateDailyQuests(user.id);
    }

    // 2. Fetch Quests
    const { data: userQuests, error: questsError } = await supabase
        .from('user_quests')
        .select('*, quests(*)')
        .eq('user_id', user.id)
        .eq('is_completed', false);

    // 3. Fetch League Standing
    const { data: standing, error: leagueError } = await supabase
        .from('league_standings')
        .select('*, leagues(name, rank)')
        .eq('user_id', user.id)
        .single();

    // If standing is missing, assign to Bronze
    if (!standing && (!leagueError || leagueError.code === 'PGRST116')) {
        // Find Bronze league
        const { data: bronzeLeague } = await supabase
            .from('leagues')
            .select('id')
            .eq('name', 'Bronze')
            .single();

        if (bronzeLeague) {
            const { error: insertError } = await supabase
                .from('league_standings')
                .insert({
                    user_id: user.id,
                    league_id: bronzeLeague.id,
                    weekly_xp: 0
                });

            if (!insertError) {
                // If successful, we can just reload the page or let the next fetch handle it.
                // But let's just create a standing object to use immediately.
                // However, re-fetching is safer/easier to ensure structure match.
                // Let's just return null for standing for now, and the client handles it?
                // No, we want to show them in the list.
                // We will rely on the next refresh or we can manually construct it.
            }
        }
    }

    // Refetch standing if it was missing (and we hopefully just added it)
    let finalStanding = standing;
    if (!standing) {
        const { data: refetchedStanding } = await supabase
            .from('league_standings')
            .select('*, leagues(name, rank)')
            .eq('user_id', user.id)
            .single();
        finalStanding = refetchedStanding;
    }

    // 3. Handle Hearts Regeneration
    let currentHearts = profile.hearts;
    const lastRegen = new Date(profile.last_heart_regen).getTime();
    const now = Date.now();
    const threeHours = 3 * 60 * 60 * 1000;
    let nextHeartAt = null;

    if (currentHearts < 5 && lastRegen) {
        const timePassed = now - lastRegen;
        const heartsToGain = Math.floor(timePassed / threeHours);

        if (heartsToGain > 0) {
            currentHearts = Math.min(5, currentHearts + heartsToGain);
            const newRegenTime = new Date(lastRegen + (heartsToGain * threeHours)).toISOString();

            await supabase
                .from('profiles')
                .update({
                    hearts: currentHearts,
                    last_heart_regen: newRegenTime
                })
                .eq('id', user.id);

            // Update the profile object for the response
            profile.hearts = currentHearts;
            profile.last_heart_regen = newRegenTime;
        }

        if (currentHearts < 5) {
            nextHeartAt = new Date(new Date(profile.last_heart_regen).getTime() + threeHours).toISOString();
        }
    }

    // 4. Seed Questions if none exist (Dev convenience)
    await seedQuestions();

    // 5. Fetch Top Players in the same league
    let topPlayers: any[] = [];
    if (finalStanding) {
        const { data: players } = await supabase
            .from('league_standings')
            .select('user_id, weekly_xp, profiles(username, avatar_url)')
            .eq('league_id', finalStanding.league_id)
            .order('weekly_xp', { ascending: false })
            .limit(10);

        topPlayers = players || [];

        // If leaderboard is thin, add some synthetic competitors
        if (topPlayers.length < 6) {
            const mocks = [
                { user_id: 'mock1', weekly_xp: 450, profiles: { username: 'DingoDave', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=dave' } },
                { user_id: 'mock2', weekly_xp: 320, profiles: { username: 'SheilaSunshine', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=sheila' } },
                { user_id: 'mock3', weekly_xp: 280, profiles: { username: 'JoeyJumper', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=joe' } },
                { user_id: 'mock4', weekly_xp: 150, profiles: { username: 'WallabyWally', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=wally' } },
                { user_id: 'mock5', weekly_xp: 90, profiles: { username: 'KoalaKiwi', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=kiwi' } },
            ];

            // Filter out mocks that might be lower than existing real players if we wanted, 
            // but for now let's just combine and sort
            topPlayers = [...topPlayers, ...mocks]
                .sort((a, b) => b.weekly_xp - a.weekly_xp)
                .slice(0, 10);
        }

        // Update rank based on current database state (more accurate than static rank)
        const { count } = await supabase
            .from('league_standings')
            .select('*', { count: 'exact', head: true })
            .eq('league_id', finalStanding.league_id)
            .gt('weekly_xp', finalStanding.weekly_xp);

        // Also count mocks that are above the user
        const mockCountAbove = [450, 320, 280, 150, 90].filter(xp => xp > finalStanding.weekly_xp).length;

        finalStanding.current_rank = (count || 0) + mockCountAbove + 1;
    }

    // 6. Fetch Topic Progress
    const { data: topicProgress, error: tpError } = await supabase
        .from('topic_progress')
        .select('*')
        .eq('user_id', user.id);

    if (tpError) {
        console.error('Error fetching topic progress in dashboard:', {
            message: tpError.message,
            code: tpError.code,
            details: tpError.details,
            hint: tpError.hint
        });
    }

    // 7. Get Global Activity
    const activity = await getGlobalActivity();

    return {
        profile,
        quests: userQuests || [],
        standing: finalStanding,
        topPlayers,
        topicProgress: topicProgress || [],
        activity,
        nextHeartAt,
        user
    };
}
