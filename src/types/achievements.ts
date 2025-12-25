export interface Achievement {
    id: string;
    name: string;
    description: string;
    badge_url: string | null;
    xp_reward: number;
    secret: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface AchievementWithStatus extends Achievement {
    is_unlocked: boolean;
    unlocked_at: string | null;
}

export interface AchievementsData {
    achievements: AchievementWithStatus[];
    stats: {
        total: number;
        unlocked: number;
        progress: number;
    };
    error?: string;
}
