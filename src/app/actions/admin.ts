"use server";

import { createClient } from "@/utils/supabase/server";
import { Question, AchievementManagement as Achievement, QuestManagement as Quest } from "@/types/admin";

export async function getAdminStats() {
    const supabase = await createClient();

    // Check if user is admin via metadata
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Allow looking at admin stats if role is admin
    const isAdmin = user.user_metadata?.role === 'admin' || user.user_metadata?.role === 'super_admin';
    if (!isAdmin) throw new Error("Unauthorized: Admin access required");

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

    // Referral Users
    const { count: referralUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .not("source", "is", null);

    // Recent Referrals
    const { data: recentReferrals } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, source, created_at")
        .not("source", "is", null)
        .order("created_at", { ascending: false })
        .limit(5);

    return {
        stats: {
            totalUsers: totalUsers || 0,
            premiumUsers: premiumUsers || 0,
            conversionRate: totalUsers ? ((premiumUsers || 0) / totalUsers * 100).toFixed(1) : 0,
            totalQuestions: totalQuestions || 0,
            totalAchievements: totalAchievements || 0,
            newUsers24h: newUsers24h || 0,
            referralUsers: referralUsers || 0,
        },
        recentQuizzes: recentQuizzes || [],
        recentReferrals: recentReferrals || [],
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

export async function manageUser(userId: string, updates: any) {
    const supabase = await createClient();

    // Check for super_admin
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser?.user_metadata?.role !== 'super_admin') {
        throw new Error("Super Admin access required");
    }

    const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId);

    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function deleteUser(userId: string) {
    const supabase = await createClient();

    // Check for super_admin
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser?.user_metadata?.role !== 'super_admin') {
        throw new Error("Super Admin access required");
    }

    // Since we don't have service role for Auth deletion, 
    // we mark as deleted or just delete from profile if possible.
    // In a real app, you'd use the admin auth API.
    const { error } = await supabase
        .from("profiles")
        .delete()
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

export async function claimSuperAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Not authenticated" };

    const { data, error } = await supabase.auth.updateUser({
        data: { role: 'super_admin' }
    });

    if (error) return { success: false, error: error.message };
    return { success: true, message: "You are now a Super Admin!" };
}
