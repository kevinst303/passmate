export interface TopicMetadata {
    id: string;
    title: string;
    lessons: number;
    icon: string;
    defaultStatus: string;
}

export interface Topic extends TopicMetadata {
    status: string;
    progress: number;
    completed: boolean;
}

export interface SkillTreeData {
    topics: Topic[];
    error?: string;
}
