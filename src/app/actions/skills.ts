'use server';

import { createClient } from '@/utils/supabase/server';

const TOPICS_METADATA = [
    {
        id: "1",
        title: "Australia and its people",
        lessons: 5,
        icon: "🇦🇺",
        defaultStatus: "unlocked" // First one is always open
    },
    {
        id: "2",
        title: "Democratic beliefs, rights and liberties",
        lessons: 8,
        icon: "⚖️",
        defaultStatus: "locked"
    },
    {
        id: "3",
        title: "Government and the law in Australia",
        lessons: 10,
        icon: "🏛️",
        defaultStatus: "locked"
    },
    {
        id: "4",
        title: "Australia today",
        lessons: 6,
        icon: "🌇",
        defaultStatus: "locked"
    },
    {
        id: "5",
        title: "Our Australian values",
        lessons: 4,
        icon: "🤝",
        defaultStatus: "locked"
    }
];

export async function getSkillTreeData() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Not authenticated' };

    // Fetch user progress for all topics
    const { data: progressList, error } = await supabase
        .from('topic_progress')
        .select('*')
        .eq('user_id', user.id);

    if (error) {
        console.error('Error fetching topic progress:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
        });
        return { error: 'Failed to fetch progress' };
    }

    // Merge metadata with DB progress
    const topics = TOPICS_METADATA.map((meta, index) => {
        const userProgress = progressList?.find(p => p.topic_name === meta.title);

        // Default logic if no DB entry exists
        let status = userProgress?.status || meta.defaultStatus;
        let progress = userProgress?.progress_percentage || 0;
        let completed = status === 'completed';

        // Auto-unlock first topic if no data
        if (index === 0 && !userProgress) {
            status = 'in-progress';
        }

        return {
            ...meta,
            status,
            progress,
            completed
        };
    });

    return { topics };
}

export async function updateTopicProgress(topicName: string, percentage: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Not authenticated' };

    // Check if topic exists in our metadata
    const topicMeta = TOPICS_METADATA.find(t => t.title === topicName);
    if (!topicMeta) return { error: 'Invalid topic' };

    // Upsert progress
    const status = percentage >= 100 ? 'completed' : 'in-progress';

    const { error } = await supabase
        .from('topic_progress')
        .upsert({
            user_id: user.id,
            topic_name: topicName,
            progress_percentage: percentage,
            status: status,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'user_id, topic_name'
        });

    if (error) {
        console.error('Error updating progress:', error);
        return { error: 'Failed to update progress' };
    }

    // If completed, unlock the NEXT topic
    if (status === 'completed') {
        const { checkAndUnlockAchievements } = await import('./achievements');
        await checkAndUnlockAchievements(user.id, 'topic_complete');

        const currentIndex = TOPICS_METADATA.findIndex(t => t.title === topicName);
        if (currentIndex < TOPICS_METADATA.length - 1) {
            const nextTopic = TOPICS_METADATA[currentIndex + 1];

            // Check if next topic is already unlocked/started
            const { data: nextProgress } = await supabase
                .from('topic_progress')
                .select('status')
                .eq('user_id', user.id)
                .eq('topic_name', nextTopic.title)
                .single();

            if (!nextProgress || nextProgress.status === 'locked') {
                await supabase
                    .from('topic_progress')
                    .upsert({
                        user_id: user.id,
                        topic_name: nextTopic.title,
                        status: 'in-progress', // Unlock it
                        progress_percentage: 0
                    }, { onConflict: 'user_id, topic_name' });
            }
        }
    }

    return { success: true };
}
