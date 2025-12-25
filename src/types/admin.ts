export interface Question {
    id?: string;
    topic: string;
    subtopic?: string;
    question_text: string;
    options: string[];
    correct_index: number;
    explanation?: string;
    difficulty?: string;
    is_premium?: boolean;
    created_at?: string;
}

export interface AchievementManagement {
    id?: string;
    name: string;
    title?: string;
    description: string;
    badge_url?: string;
    xp_reward: number;
    points?: number;
    icon?: string;
    type?: string;
    secret?: boolean;
}

export interface QuestManagement {
    id?: string;
    title: string;
    description?: string;
    objective?: string;
    xp_reward: number;
    reward_xp?: number;
    type: string;
    requirement: number;
    target_value?: number;
    status?: 'active' | 'inactive' | string;
}
