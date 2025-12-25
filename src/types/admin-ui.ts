import { Question, AchievementManagement as Achievement, QuestManagement as Quest } from "./admin";

export interface UserProfile {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    is_premium: boolean;
    is_suspended: boolean;
    premium_tier: string | null;
    source: string | null;
    created_at: string;
    total_xp: number;
    level: number;
}

export interface RecentQuiz {
    id: string;
    completed_at: string;
    score: number;
    total_questions: number;
    profiles: {
        username: string | null;
        full_name: string | null;
    } | {
        username: string | null;
        full_name: string | null;
    }[];
}

export interface RecentReferral {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    source: string | null;
    created_at: string;
}

export interface AdminDashboardData {
    stats: {
        totalUsers: number;
        premiumUsers: number;
        conversionRate: number | string;
        totalQuestions: number;
        referralUsers: number;
        totalAchievements?: number;
        newUsers24h?: number;
    };
    recentQuizzes: RecentQuiz[];
    allUsers: UserProfile[];
    questions?: Question[];
    achievements?: Achievement[];
    quests?: Quest[];
    recentReferrals: RecentReferral[];
}

export type AdminTab = 'overview' | 'users' | 'questions' | 'achievements' | 'quests' | 'settings';

export function isQuestion(item: any): item is Question {
    return item && 'question_text' in item;
}

export function isAchievement(item: any): item is Achievement {
    return item && 'xp_reward' in item && 'name' in item;
}

export function isQuest(item: any): item is Quest {
    return item && 'requirement' in item && 'title' in item;
}

export function isUserProfile(item: any): item is UserProfile {
    return item && 'is_suspended' in item;
}
