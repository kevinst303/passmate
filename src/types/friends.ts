export interface FriendProfile {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
    is_premium: boolean;
    level: number;
    daily_streak: number;
    total_xp: number;
    status: 'online' | 'offline';
    friendship_id: string;
}

export interface UserSummary {
    id: string;
    username: string;
    avatar_url: string | null;
    is_premium: boolean;
    level: number;
}

export interface Challenge {
    id: string;
    challenger_id: string;
    challenged_id: string;
    challenger_score: number | null;
    challenged_score: number | null;
    challenger_played: boolean;
    challenged_played: boolean;
    winner_id: string | null;
    challenger?: { username: string; avatar_url: string | null };
    challenged?: { username: string; avatar_url: string | null };
}

export interface FriendRequest {
    id: string;
    user: {
        username: string;
        avatar_url: string | null;
    };
}

export interface FriendsCombinedData {
    friends: FriendProfile[];
    pendingRequests: FriendRequest[];
    pendingReceived: Challenge[];
    pendingSent: Challenge[];
    completed: Challenge[];
    error?: string;
}
