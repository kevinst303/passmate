import { User } from '@supabase/supabase-js';

export interface Profile {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    current_xp: number;
    total_xp: number;
    level: number;
    daily_streak: number;
    hearts: number;
    last_heart_regen: string;
    is_premium: boolean;
    created_at: string;
    updated_at: string;
}

export interface Quest {
    title: string;
    xp_reward: number;
}

export interface UserQuest {
    id: string;
    quests: Quest | null;
    progress: number;
    requirement_value: number;
    is_completed: boolean;
}

export interface League {
    name: string;
    rank?: number;
}

export interface Standing {
    league_id: string;
    weekly_xp: number;
    current_rank: number | null;
    leagues: League | null;
}

export interface DashboardProfile {
    username: string | null;
    avatar_url: string | null;
}

export interface TopPlayer {
    user_id: string;
    weekly_xp: number;
    profiles: DashboardProfile | null;
}

export interface TopicProgress {
    topic_name: string;
    status: 'completed' | 'in_progress' | 'locked';
}

export interface ActivityItem {
    id: string;
    user: string;
    avatar: string | null;
    isPremium: boolean;
    score: number;
    total: number;
    xp: number;
    time: string;
}

export interface DashboardData {
    profile: Profile;
    quests: UserQuest[];
    standing: Standing | null;
    topPlayers: TopPlayer[];
    topicProgress: TopicProgress[];
    activity: ActivityItem[];
    nextHeartAt: string | null;
    user: User; // Supabase user
}

export type DashboardResponse = DashboardData | { error: string };
