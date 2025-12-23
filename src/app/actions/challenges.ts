'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { checkAndUnlockAchievements } from './achievements';

export async function getChallengesData() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Not authenticated' };

    // Fetch pending challenges where user is either challenger or challenged
    const { data: challenges, error } = await supabase
        .from('challenges')
        .select(`
            *,
            challenger:challenger_id (id, username, full_name, avatar_url),
            challenged:challenged_id (id, username, full_name, avatar_url)
        `)
        .or(`challenger_id.eq.${user.id},challenged_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching challenges:', error);
        return { error: 'Failed to fetch challenges' };
    }

    const pendingReceived = challenges.filter(c => c.challenged_id === user.id && c.status === 'pending');
    const pendingSent = challenges.filter(c => c.challenger_id === user.id && c.status === 'pending');
    const completed = challenges.filter(c => c.status === 'completed').slice(0, 5);

    return { pendingReceived, pendingSent, completed };
}

export async function createChallenge(challengedId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Not authenticated' };

    // Check if there's already a pending challenge between these two
    const { data: existing } = await supabase
        .from('challenges')
        .select('*')
        .or(`and(challenger_id.eq.${user.id},challenged_id.eq.${challengedId}),and(challenger_id.eq.${challengedId},challenged_id.eq.${user.id})`)
        .eq('status', 'pending')
        .single();

    if (existing) {
        return { success: true, challenge: existing };
    }

    const { data, error } = await supabase
        .from('challenges')
        .insert([{
            challenger_id: user.id,
            challenged_id: challengedId,
            status: 'pending'
        }])
        .select()
        .single();

    if (error) {
        console.error('Error creating challenge:', error);
        return { error: 'Failed to create challenge' };
    }

    revalidatePath('/friends');
    return { success: true, challenge: data };
}

export async function getPendingChallenges() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
        .from('challenges')
        .select(`
            *,
            challenger:challenger_id (id, username, full_name, avatar_url)
        `)
        .eq('challenged_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching challenges:', error);
        return { error: 'Failed to fetch challenges' };
    }

    return { challenges: data || [] };
}

export async function acceptChallenge(challengeId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase
        .from('challenges')
        .update({ status: 'accepted' })
        .eq('id', challengeId)
        .eq('challenged_id', user.id);

    if (error) return { error: 'Failed to accept challenge' };

    revalidatePath('/friends');
    return { success: true };
}

export async function updateChallengeScore(challengeId: string, score: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Not authenticated' };

    // Fetch current state of the challenge
    const { data: challenge, error: fetchError } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', challengeId)
        .single();

    if (fetchError || !challenge) return { error: 'Challenge not found' };

    const isChallenger = challenge.challenger_id === user.id;
    const isChallenged = challenge.challenged_id === user.id;

    if (!isChallenger && !isChallenged) return { error: 'Not your challenge' };

    const updateData: any = {};
    if (isChallenger) {
        updateData.challenger_score = score;
        updateData.challenger_played = true;
    } else {
        updateData.challenged_score = score;
        updateData.challenged_played = true;
    }

    // Check if both have played
    const bothPlayed = (isChallenger && challenge.challenged_played) || (isChallenged && challenge.challenger_played);

    if (bothPlayed) {
        updateData.status = 'completed';
        updateData.completed_at = new Date().toISOString();

        const myScore = score;
        const opponentScore = isChallenger ? challenge.challenged_score : challenge.challenger_score;

        if (myScore > opponentScore) {
            updateData.winner_id = user.id;
        } else if (myScore < opponentScore) {
            updateData.winner_id = isChallenger ? challenge.challenged_id : challenge.challenger_id;
        }
        // Draw remains winner_id null
    }

    const { error: updateError } = await supabase
        .from('challenges')
        .update(updateData)
        .eq('id', challengeId);

    if (updateError) {
        console.error('Update score error:', updateError);
        return { error: 'Failed to update score' };
    }

    // Award achievement to winner
    if (updateData.winner_id) {
        await checkAndUnlockAchievements(updateData.winner_id, 'battle', { won: true });
    }

    revalidatePath('/friends');
    return { success: true };
}

