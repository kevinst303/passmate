'use server';

import { createClient } from '@/utils/supabase/server';

const DAILY_QUESTS_COUNT = 3;

const QUEST_DEFINITIONS = [
    {
        title: "Swift Study",
        description: "Complete 3 quizzes today",
        type: "quiz_count",
        requirement_value: 3,
        xp_reward: 100
    },
    {
        title: "Flawless Victory",
        description: "Get a perfect score on any quiz",
        type: "perfect_score",
        requirement_value: 1,
        xp_reward: 150
    },
    {
        title: "XP Grinder",
        description: "Earn 500 XP in a single day",
        type: "xp_earn",
        requirement_value: 500,
        xp_reward: 200
    },
    {
        title: "History Buff",
        description: "Complete a quiz in 'Australia and its people'",
        type: "topic_quiz",
        requirement_value: 1,
        xp_reward: 75
    },
    {
        title: "Values Check",
        description: "Complete a quiz in 'Our Australian values'",
        type: "topic_quiz",
        requirement_value: 1,
        xp_reward: 75
    },
    {
        title: "Legal Eagle",
        description: "Complete a quiz in 'Government and the law'",
        type: "topic_quiz",
        requirement_value: 1,
        xp_reward: 75
    },
    {
        title: "Quick Learner",
        description: "Complete 1 quiz today",
        type: "quiz_count",
        requirement_value: 1,
        xp_reward: 50
    },
    {
        title: "Democracy Pro",
        description: "Complete a quiz in 'Democratic beliefs'",
        type: "topic_quiz",
        requirement_value: 1,
        xp_reward: 75
    }
];

export async function seedQuestDefinitions() {
    const supabase = await createClient();

    // Fetch all existing quests to minimize queries
    const { data: existingQuests } = await supabase
        .from('quests')
        .select('title');

    const existingTitles = new Set(existingQuests?.map(q => q.title) || []);
    const newQuests = QUEST_DEFINITIONS.filter(q => !existingTitles.has(q.title));

    if (newQuests.length > 0) {
        const { error: insertError } = await supabase.from('quests').insert(newQuests);
        if (insertError) {
            console.error('Error inserting quest definitions:', insertError);
        }
    }
}

export async function generateDailyQuests(userId: string) {
    try {
        const supabase = await createClient();

        // 2. Check if user already has active quests for today
        const now = new Date();
        const startOfDay = new Date(new Date(now).setHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(new Date(now).setHours(23, 59, 59, 999)).toISOString();

        const { data: existingQuests, error: existingError } = await supabase
            .from('user_quests')
            .select('*')
            .eq('user_id', userId)
            .gte('expires_at', startOfDay)
            .lte('expires_at', endOfDay);

        if (existingError) {
            console.error('Error checking existing quests:', existingError);
        }

        if (existingQuests && existingQuests.length >= DAILY_QUESTS_COUNT) {
            return { success: true, message: 'Quests already generated for today' };
        }

        // 3. Pick random quests
        const { data: allQuests, error: questsError } = await supabase.from('quests').select('*');

        if (questsError) {
            console.error('Error fetching quest definitions:', questsError);
            return { error: 'Failed to fetch quest definitions' };
        }

        if (!allQuests || allQuests.length === 0) {
            // If no quests, try to seed once
            await seedQuestDefinitions();
            const { data: retryQuests } = await supabase.from('quests').select('*');
            if (!retryQuests || retryQuests.length === 0) return { error: 'No quest definitions found' };
            return generateDailyQuests(userId); // Recurse once
        }

        const selectedQuests = allQuests
            .sort(() => 0.5 - Math.random())
            .slice(0, DAILY_QUESTS_COUNT);

        const userQuests = selectedQuests.map(q => ({
            user_id: userId,
            quest_id: q.id,
            progress: 0,
            is_completed: false,
            expires_at: endOfDay
        }));

        const { error } = await supabase
            .from('user_quests')
            .insert(userQuests);

        if (error) {
            console.error('Error generating daily quests:', error);
            return { error: 'Failed to generate quests' };
        }

        return { success: true, quests: selectedQuests };
    } catch (err) {
        console.error('Unexpected error in generateDailyQuests:', err);
        return { error: 'Unexpected error generating quests' };
    }
}

interface QuestMetadata {
    topic?: string;
    score?: number;
}

export async function updateQuestProgress(userId: string, type: string, increment: number = 1, metadata?: QuestMetadata) {
    const supabase = await createClient();

    // Find active quests for this user
    const now = new Date().toISOString();
    const { data: activeQuests } = await supabase
        .from('user_quests')
        .select('*, quests(*)')
        .eq('user_id', userId)
        .eq('is_completed', false)
        .gt('expires_at', now);

    if (!activeQuests || activeQuests.length === 0) return;

    const updates = activeQuests
        .filter(uq => uq.quests.type === type)
        .filter(uq => {
            if (type === 'topic_quiz' && metadata?.topic) {
                return uq.quests.description.includes(metadata.topic);
            }
            return true;
        })
        .map(async (uq) => {
            const newProgress = uq.progress + increment;
            const isCompleted = newProgress >= uq.quests.requirement_value;

            const { error: updateError } = await supabase
                .from('user_quests')
                .update({
                    progress: newProgress,
                    is_completed: isCompleted,
                    completed_at: isCompleted ? new Date().toISOString() : null
                })
                .eq('id', uq.id);

            if (!updateError && isCompleted) {
                // Reward XP in parallel
                await Promise.all([
                    supabase.rpc('increment_xp', { uid: userId, amount: uq.quests.xp_reward }),
                    supabase.from('xp_logs').insert({
                        user_id: userId,
                        amount: uq.quests.xp_reward,
                        reason: 'daily_quest'
                    })
                ]);
            }
        });

    await Promise.all(updates);
}
