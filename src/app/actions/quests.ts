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

    for (const q of QUEST_DEFINITIONS) {
        const { data: existing, error: selectError } = await supabase
            .from('quests')
            .select('id')
            .eq('title', q.title)
            .single();

        // PGRST116 means no rows found, which is fine
        if (selectError && selectError.code !== 'PGRST116') {
            console.error('Error checking quest definition:', {
                message: selectError.message,
                code: selectError.code,
                details: selectError.details,
                hint: selectError.hint
            });
            continue;
        }

        if (!existing) {
            const { error: insertError } = await supabase.from('quests').insert(q);
            if (insertError) {
                console.error('Error inserting quest definition:', {
                    message: insertError.message,
                    code: insertError.code,
                    details: insertError.details,
                    hint: insertError.hint
                });
            }
        }
    }
}

export async function generateDailyQuests(userId: string) {
    try {
        const supabase = await createClient();

        // 1. Ensure definitions exist
        await seedQuestDefinitions();

        // 2. Check if user already has active quests for today
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(now.setHours(23, 59, 59, 999)).toISOString();

        const { data: existingQuests, error: existingError } = await supabase
            .from('user_quests')
            .select('*')
            .eq('user_id', userId)
            .gte('expires_at', startOfDay)
            .lte('expires_at', endOfDay);

        if (existingError) {
            console.error('Error checking existing quests:', {
                message: existingError.message,
                code: existingError.code,
                details: existingError.details,
                hint: existingError.hint
            });
            // Continue anyway - table might not exist yet
        }

        if (existingQuests && existingQuests.length >= DAILY_QUESTS_COUNT) {
            return { success: true, message: 'Quests already generated for today' };
        }

        // 3. Pick random quests
        const { data: allQuests, error: questsError } = await supabase.from('quests').select('*');

        if (questsError) {
            console.error('Error fetching quest definitions:', {
                message: questsError.message,
                code: questsError.code,
                details: questsError.details,
                hint: questsError.hint
            });
            return { error: 'Failed to fetch quest definitions' };
        }

        if (!allQuests || allQuests.length === 0) {
            return { error: 'No quest definitions found' };
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
            console.error('Error generating daily quests:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
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

    // Find active quests for this user of this type
    const now = new Date().toISOString();
    const { data: activeQuests } = await supabase
        .from('user_quests')
        .select('*, quests(*)')
        .eq('user_id', userId)
        .eq('is_completed', false)
        .gt('expires_at', now);

    if (!activeQuests) return;

    for (const uq of activeQuests) {
        if (uq.quests.type === type) {
            let shouldUpdate = true;

            // Special handling for topic-specific quests
            if (type === 'topic_quiz' && metadata?.topic) {
                if (!uq.quests.description.includes(metadata.topic)) {
                    shouldUpdate = false;
                }
            }

            if (shouldUpdate) {
                const newProgress = uq.progress + increment;
                const isCompleted = newProgress >= uq.quests.requirement_value;

                await supabase
                    .from('user_quests')
                    .update({
                        progress: newProgress,
                        is_completed: isCompleted,
                        completed_at: isCompleted ? new Date().toISOString() : null
                    })
                    .eq('id', uq.id);

                if (isCompleted) {
                    // Reward XP
                    await supabase.rpc('increment_xp', { uid: userId, amount: uq.quests.xp_reward });
                    // Log XP
                    await supabase.from('xp_logs').insert({
                        user_id: userId,
                        amount: uq.quests.xp_reward,
                        reason: 'daily_quest'
                    });
                }
            }
        }
    }
}
