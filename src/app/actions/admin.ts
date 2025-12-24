"use server";

import { createClient } from "@/utils/supabase/server";

export async function getAdminStats() {
    const supabase = await createClient();

    // Check if user is admin (you might want a 'role' field in profiles, for now we just check if authenticated)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Total Users
    const { count: totalUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

    // Premium Users
    const { count: premiumUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("is_premium", true);

    // Recent Quiz Attempts
    const { data: recentQuizzes } = await supabase
        .from("quiz_attempts")
        .select(`
            id,
            score,
            total_questions,
            completed_at,
            profiles(username, full_name)
        `)
        .order("completed_at", { ascending: false })
        .limit(10);

    // Total Questions
    const { count: totalQuestions } = await supabase
        .from("questions")
        .select("*", { count: "exact", head: true });

    // Total Achievements
    const { count: totalAchievements } = await supabase
        .from("achievements")
        .select("*", { count: "exact", head: true });

    // New Users (Last 24h)
    const { count: newUsers24h } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gt("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    // Active Quests
    const { data: activeQuests } = await supabase
        .from("quests")
        .select("*");

    // All Users (for management)
    const { data: allUsers } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

    return {
        stats: {
            totalUsers: totalUsers || 0,
            premiumUsers: premiumUsers || 0,
            conversionRate: totalUsers ? ((premiumUsers || 0) / totalUsers * 100).toFixed(1) : 0,
            totalQuestions: totalQuestions || 0,
            totalAchievements: totalAchievements || 0,
            newUsers24h: newUsers24h || 0,
        },
        recentQuizzes: recentQuizzes || [],
        activeQuests: activeQuests || [],
        allUsers: allUsers || [],
    };
}

export async function togglePremiumStatus(userId: string, status: boolean, tier: string = 'test_ready') {
    const supabase = await createClient();
    const { error } = await supabase
        .from("profiles")
        .update({
            is_premium: status,
            premium_tier: status ? tier : null
        })
        .eq("id", userId);

    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function resetHearts(userId: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("profiles")
        .update({
            hearts: 5,
            last_heart_regen: new Date().toISOString()
        })
        .eq("id", userId);

    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function getAllQuestions(topic?: string) {
    const supabase = await createClient();
    let query = supabase.from("questions").select("*").order("created_at", { ascending: false });

    if (topic) {
        query = query.eq("topic", topic);
    }

    const { data, error } = await query;
    if (error) return { success: false, error: error.message };
    return { success: true, data };
}

interface Question {
    id?: string;
    topic: string;
    question_text: string;
    options: string[];
    correct_index: number;
    explanation?: string;
    difficulty?: string;
}

interface Achievement {
    id?: string;
    name: string;
    description: string;
    badge_url: string;
    xp_reward: number;
}

interface Quest {
    id?: string;
    title: string;
    description: string;
    xp_reward: number;
    type: string;
    requirement: number;
}

export async function upsertQuestion(question: Question) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("questions")
        .upsert(question)
        .select()
        .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
}

export async function deleteQuestion(questionId: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("questions")
        .delete()
        .eq("id", questionId);

    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function getAllAchievements() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("name", { ascending: true });

    if (error) return { success: false, error: error.message };
    return { success: true, data };
}

export async function upsertAchievement(achievement: Achievement) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("achievements")
        .upsert(achievement)
        .select()
        .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
}

export async function deleteAchievement(achievementId: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("achievements")
        .delete()
        .eq("id", achievementId);

    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function upsertQuest(quest: Quest) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("quests")
        .upsert(quest)
        .select()
        .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
}

export async function deleteQuest(questId: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("quests")
        .delete()
        .eq("id", questId);

    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function getSystemConfig() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("system_config")
        .select("*");

    if (error) {
        // If table doesn't exist, we might get an error. In a real app we'd handle migration.
        // For now, let's return a default set if it fails as a fallback.
        return { success: false, error: error.message };
    }
    return { success: true, data };
}

export async function updateSystemConfig(config: { key: string; value: unknown; description?: string }) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("system_config")
        .upsert(config, { onConflict: 'key' })
        .select()
        .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
}
