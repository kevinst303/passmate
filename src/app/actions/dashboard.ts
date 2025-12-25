'use server';

import { createClient } from '@/utils/supabase/server';
import { generateDailyQuests } from './quests';
import { getGlobalActivity } from './activity';
import { DashboardResponse, DashboardProfile } from '@/types/dashboard';

interface LeaderboardEntryRaw {
    user_id: string;
    weekly_xp: number;
    profiles: DashboardProfile | DashboardProfile[] | null;
}

export async function getDashboardData(): Promise<DashboardResponse> {

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    // 1. Fetch Profile and League Standing in parallel - these are essential for the rest
    const [profileRes, standingRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('league_standings').select('*, leagues(name, rank)').eq('user_id', user.id).single()
    ]);

    let profile = profileRes.data;
    let standing = standingRes.data;

    // Handle profile creation if missing
    if (profileRes.error && profileRes.error.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
                id: user.id,
                username: user.email?.split('@')[0],
                full_name: user.user_metadata?.full_name || 'New Mate',
                avatar_url: user.user_metadata?.avatar_url,
                source: user.user_metadata?.source || null,
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
    } else if (profileRes.error) {
        return { error: `Profile error: ${profileRes.error.message}` };
    }

    if (!profile) return { error: 'Profile not found' };

    // 1b. Check for suspension
    if (profile.is_suspended) {
        return { error: 'Your account has been suspended by an administrator. Please contact support for assistance.' };
    }

    // Handle standing creation if missing
    if (!standing && (standingRes.error?.code === 'PGRST116' || !standingRes.data)) {
        const { data: bronzeLeague } = await supabase
            .from('leagues')
            .select('id')
            .eq('name', 'Bronze')
            .single();

        if (bronzeLeague) {
            const { data: newStanding } = await supabase
                .from('league_standings')
                .insert({
                    user_id: user.id,
                    league_id: bronzeLeague.id,
                    weekly_xp: 0
                })
                .select('*, leagues(name, rank)')
                .single();
            standing = newStanding;
        }
    }

    // 2. Fetch all other data in parallel
    const [questsRes, topicProgressRes, activity, _questsSeed, leaderboardData] = await Promise.all([
        supabase.from('user_quests')
            .select('*, quests(*)')
            .eq('user_id', user.id)
            .eq('is_completed', false),
        supabase.from('topic_progress')
            .select('*')
            .eq('user_id', user.id),
        getGlobalActivity(),
        generateDailyQuests(user.id),
        standing ? Promise.all([
            supabase.from('league_standings')
                .select('user_id, weekly_xp, profiles(username, avatar_url)')
                .eq('league_id', standing.league_id)
                .order('weekly_xp', { ascending: false })
                .limit(10),
            supabase.from('league_standings')
                .select('*', { count: 'exact', head: true })
                .eq('league_id', standing.league_id)
                .gt('weekly_xp', standing.weekly_xp)
        ]) : Promise.resolve([null, null])
    ]);

    const [playersRes, countRes] = standing
        ? (leaderboardData as [{ data: LeaderboardEntryRaw[] | null }, { count: number | null }])
        : [null, null];

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

            // Background update to not block
            supabase
                .from('profiles')
                .update({
                    hearts: currentHearts,
                    last_heart_regen: newRegenTime
                })
                .eq('id', user.id)
                .then(({ error }) => {
                    if (error) console.error('Heart regen update error:', error);
                });

            profile.hearts = currentHearts;
            profile.last_heart_regen = newRegenTime;
        }

        if (currentHearts < 5) {
            nextHeartAt = new Date(new Date(profile.last_heart_regen).getTime() + threeHours).toISOString();
        }
    }

    // 4. Process Leaderboard Data
    let topPlayers: { user_id: string; weekly_xp: number; profiles: DashboardProfile | null }[] = [];
    if (playersRes?.data) {
        topPlayers = playersRes.data.map((p) => ({
            user_id: p.user_id,
            weekly_xp: p.weekly_xp,
            profiles: Array.isArray(p.profiles) ? p.profiles[0] : p.profiles
        }));

        // Add mocks if needed
        if (topPlayers.length < 6) {
            const mocks = [
                { user_id: 'mock1', weekly_xp: 450, profiles: { username: 'DingoDave', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=dave' } },
                { user_id: 'mock2', weekly_xp: 320, profiles: { username: 'SheilaSunshine', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=sheila' } },
                { user_id: 'mock3', weekly_xp: 280, profiles: { username: 'JoeyJumper', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=joe' } },
                { user_id: 'mock4', weekly_xp: 150, profiles: { username: 'WallabyWally', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=wally' } },
                { user_id: 'mock5', weekly_xp: 90, profiles: { username: 'KoalaKiwi', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=kiwi' } },
            ];
            topPlayers = [...topPlayers, ...mocks].sort((a, b) => b.weekly_xp - a.weekly_xp).slice(0, 10);
        }

        // Rank calculation
        const count = countRes?.count || 0;
        // Check if standing.weekly_xp is defined, else 0
        const userWeeklyXp = standing?.weekly_xp || 0;
        const mockCountAbove = [450, 320, 280, 150, 90].filter(xp => xp > userWeeklyXp).length;
        if (standing) {
            standing.current_rank = count + mockCountAbove + 1;
        }
    }

    return {
        profile,
        quests: questsRes.data || [],
        standing,
        topPlayers,
        topicProgress: topicProgressRes.data || [],
        activity,
        nextHeartAt,
        user
    };
}
