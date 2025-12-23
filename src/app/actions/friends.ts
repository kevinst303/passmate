'use server';

import { createClient } from '@/utils/supabase/server';
import { checkAndUnlockAchievements } from './achievements';

export async function getFriendsData() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    // Fetch friendships where user is either user_id or friend_id
    const { data: friendships, error: friendsError } = await supabase
        .from('friendships')
        .select(`
            *,
            user:user_id (id, username, full_name, avatar_url, total_xp, daily_streak, level, is_premium, premium_tier),
            friend:friend_id (id, username, full_name, avatar_url, total_xp, daily_streak, level, is_premium, premium_tier)
        `)
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .eq('status', 'accepted');

    if (friendsError) {
        console.error('Error fetching friends:', friendsError);
        return { error: 'Failed to fetch friends' };
    }

    // Format the list to show the "other" person as the friend
    const friends = friendships.map(f => {
        const friendProfile = f.user_id === user.id ? f.friend : f.user;
        return {
            ...friendProfile,
            friendship_id: f.id,
            status: 'online' // Mocking online status for now
        };
    });

    // Fetch pending requests
    const { data: pendingRequests } = await supabase
        .from('friendships')
        .select(`
            *,
            user:user_id (id, username, full_name, avatar_url)
        `)
        .eq('friend_id', user.id)
        .eq('status', 'pending');

    return { friends, pendingRequests: pendingRequests || [] };
}

export async function sendFriendRequest(friendUsername: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Not authenticated' };

    // Find user by username
    const { data: friend, error: findError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', friendUsername)
        .single();

    if (findError || !friend) {
        return { error: 'User not found' };
    }

    if (friend.id === user.id) {
        return { error: "You can't add yourself as a friend, mate!" };
    }

    // Check if friendship already exists
    const { data: existing } = await supabase
        .from('friendships')
        .select('*')
        .or(`and(user_id.eq.${user.id},friend_id.eq.${friend.id}),and(user_id.eq.${friend.id},friend_id.eq.${user.id})`)
        .single();

    if (existing) {
        return { error: 'Friend request already exists or you are already friends.' };
    }

    const { error: insertError } = await supabase
        .from('friendships')
        .insert([{ user_id: user.id, friend_id: friend.id, status: 'pending' }]);

    if (insertError) {
        return { error: 'Failed to send friend request' };
    }

    return { success: true };
}

export async function acceptFriendRequest(friendshipId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Not authenticated' };

    const { data: friendship, error } = await supabase
        .from('friendships')
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .eq('id', friendshipId)
        .eq('friend_id', user.id)
        .select()
        .single();

    if (error || !friendship) return { error: 'Failed to accept request' };

    // Unlock achievements for both
    await checkAndUnlockAchievements(user.id, 'friend');
    await checkAndUnlockAchievements(friendship.user_id, 'friend');

    return { success: true };
}

export async function rejectFriendRequest(friendshipId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId)
        .eq('friend_id', user.id)
        .eq('status', 'pending');

    if (error) return { error: 'Failed to reject request' };
    return { success: true };
}

export async function removeFriend(friendshipId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId)
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

    if (error) return { error: 'Failed to remove friend' };
    return { success: true };
}

export async function searchUsers(query: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Not authenticated' };

    if (!query || query.length < 2) return { users: [] };

    const { data: users, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, level, is_premium, premium_tier')
        .ilike('username', `%${query}%`)
        .neq('id', user.id)
        .limit(10);

    if (error) {
        console.error('Error searching users:', error);
        return { error: 'Failed to search users' };
    }

    return { users: users || [] };
}
