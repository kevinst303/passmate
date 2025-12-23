'use server';

import { createClient } from '@/utils/supabase/server';

const REAL_QUESTIONS = [
    {
        topic: "Australia and its people",
        question_text: "What do we remember on Anzac Day?",
        options: [
            "The landing of the First Fleet at Sydney Cove",
            "The arrival of the first free settlers from Great Britain",
            "The landing of the Australian and New Zealand Army Corps at Gallipoli, Turkey",
            "The federating of the separate colonies into one nation"
        ],
        correct_index: 2,
        explanation: "Anzac Day is named after the Australian and New Zealand Army Corps, which landed at Gallipoli in Turkey on 25 April 1915.",
        difficulty: "easy"
    },
    {
        topic: "Australia and its people",
        question_text: "What are the colors of the Australian Aboriginal Flag?",
        options: [
            "Black, red and yellow",
            "Green, white and black",
            "Blue, white and yellow",
            "Green and gold"
        ],
        correct_index: 0,
        explanation: "The Australian Aboriginal Flag is black, red and yellow. The top half is black and represents the Aboriginal people of Australia. The bottom half is red and represents the earth. The yellow circle in the centre represents the sun.",
        difficulty: "easy"
    },
    {
        topic: "Australia and its people",
        question_text: "Which of these is an example of freedom of speech?",
        options: [
            "People can write to newspapers or talk to the media about any topic",
            "People can say anything they want even if it is not true",
            "People can talk about anything as long as they do not mention the government",
            "People can talk about anything as long as they do not mention religion"
        ],
        correct_index: 0,
        explanation: "Freedom of speech means people can write or say what they think about any topic, including the government, and can gather together with other people to protest against a government action.",
        difficulty: "medium"
    },
    {
        topic: "Democratic beliefs, rights and liberties",
        question_text: "What happened in Australia on 1 January 1901?",
        options: [
            "The separate colonies were united into a federation of states called the Commonwealth of Australia",
            "The Australian Constitution was changed by a referendum",
            "The first Australian Parliament was opened in Canberra",
            "The Australian national anthem was played for the first time"
        ],
        correct_index: 0,
        explanation: "On 1 January 1901, the separate colonies were united into a federation of states called the Commonwealth of Australia. This is known as Federation.",
        difficulty: "medium"
    },
    {
        topic: "Government and the law in Australia",
        question_text: "What is the name of the legal document that sets out the rules for the government of Australia?",
        options: [
            "The Australian Declaration of Independence",
            "The Australian Constitution",
            "The Australian Book of Laws",
            "The Australian Government Guide"
        ],
        correct_index: 1,
        explanation: "The Australian Constitution is the legal document that sets out the rules for the government of Australia.",
        difficulty: "medium"
    },
    {
        topic: "Government and the law in Australia",
        question_text: "What is the role of the Governor-General in Australia?",
        options: [
            "To be the head of the Australian Government",
            "To be the representative of the King or Queen in Australia",
            "To be the leader of the opposition",
            "To be the judge in the High Court of Australia"
        ],
        correct_index: 1,
        explanation: "The Governor-General represents the King or Queen in Australia.",
        difficulty: "hard"
    },
    {
        topic: "Democratic beliefs, rights and liberties",
        question_text: "Which of these is a role of the Australian Government?",
        options: [
            "To keep laws about marriage and divorce",
            "To collect taxes for local parks",
            "To be responsible for foreign affairs and trade",
            "To manage local hospitals"
        ],
        correct_index: 2,
        explanation: "The Australian Government is responsible for foreign affairs, trade, defence and immigration.",
        difficulty: "medium"
    },
    {
        topic: "Government and the law in Australia",
        question_text: "What is the name of the Prime Minister of Australia?",
        options: [
            "The leader of the political party with the most members in the House of Representatives",
            "The person appointed by the Governor-General to lead the country",
            "The person who wins the most votes in a national election",
            "The head of the state with the largest population"
        ],
        correct_index: 0,
        explanation: "The leader of the political party with the most members in the House of Representatives is usually the Prime Minister.",
        difficulty: "medium"
    },
    {
        topic: "Australia and its people",
        question_text: "What do we call the system of government where people vote for their representatives?",
        options: [
            "Monarchy",
            "Democracy",
            "Autocracy",
            "Theocracy"
        ],
        correct_index: 1,
        explanation: "Australia is a representative democracy. This means that Australian citizens vote for people to represent them in parliament and make laws on their behalf.",
        difficulty: "easy"
    },
    {
        topic: "Democratic beliefs, rights and liberties",
        question_text: "What is an example of an Australian responsibility?",
        options: [
            "To serve on a jury if called to do so",
            "To join a trade union",
            "To vote in local sports club elections",
            "To attend every Anzac Day ceremony"
        ],
        correct_index: 0,
        explanation: "Responsibilities of Australian citizens include: obeying the law, voting in elections and referendums, and serving on a jury if called to do so.",
        difficulty: "medium"
    },
    {
        topic: "Government and the law in Australia",
        question_text: "Who is the King's representative in an Australian state?",
        options: [
            "The Premier",
            "The Governor",
            "The Mayor",
            "The Chief Minister"
        ],
        correct_index: 1,
        explanation: "In each state there is a Governor who represents the King.",
        difficulty: "medium"
    },
    {
        topic: "Our Australian values",
        question_text: "What does 'freedom of religion' mean in Australia?",
        options: [
            "Everyone must follow the same religion",
            "People can choose to follow any religion or no religion at all",
            "Only certain religions are allowed to be practiced",
            "The government chooses the religion for all citizens"
        ],
        correct_index: 1,
        explanation: "In Australia, people are free to follow any religion they choose, or to not follow a religion at all.",
        difficulty: "easy"
    },
    {
        topic: "Our Australian values",
        question_text: "What is an example of 'fair go' in Australia?",
        options: [
            "Everyone getting the same amount of money from the government",
            "Everyone having the same chance to succeed in life regardless of their background",
            "Everyone being required to vote in elections",
            "Everyone having to join a sports team"
        ],
        correct_index: 1,
        explanation: "The 'fair go' value means that what someone achieves in life should be a result of their hard work and talents, rather than their wealth or background.",
        difficulty: "medium"
    },
    {
        topic: "Australia today",
        question_text: "What is the capital city of Australia?",
        options: [
            "Sydney",
            "Melbourne",
            "Canberra",
            "Brisbane"
        ],
        correct_index: 2,
        explanation: "Canberra is the capital city of Australia.",
        difficulty: "easy"
    },
    {
        topic: "Australia today",
        question_text: "Which of these is a famous Australian landmark?",
        options: [
            "The Grand Canyon",
            "The Great Barrier Reef",
            "Mount Everest",
            "The Eiffel Tower"
        ],
        correct_index: 1,
        explanation: "The Great Barrier Reef is a famous Australian landmark.",
        difficulty: "easy"
    },
    {
        topic: "Australia and its people",
        question_text: "What happened at the Eureka Stockade in 1854?",
        options: [
            "Gold was discovered for the first time",
            "A protest by gold miners against unfair licensing fees",
            "The first Australian Parliament was opened",
            "Australia became a federation"
        ],
        correct_index: 1,
        explanation: "The Eureka Stockade was a rebellion of gold miners against the colonial authority of United Kingdom in 1854.",
        difficulty: "hard"
    },
    {
        topic: "Democratic beliefs, rights and liberties",
        question_text: "Which of these is a right of Australian citizens aged 18 years or over?",
        options: [
            "To apply for an Australian passport",
            "To receive free university education",
            "To be given a home by the government",
            "To have a job in the public service"
        ],
        correct_index: 0,
        explanation: "Australian citizens aged 18 years or over have the right to apply for an Australian passport and to stand for election to parliament.",
        difficulty: "medium"
    },
    {
        topic: "Government and the law in Australia",
        question_text: "How is the Australian Government chosen?",
        options: [
            "By the King",
            "By the Governor-General",
            "By the people of Australia in an election",
            "By the High Court"
        ],
        correct_index: 2,
        explanation: "The Australian Government is chosen by the people of Australia in an election.",
        difficulty: "easy"
    },
    {
        topic: "Our Australian values",
        question_text: "What is 'mutual respect' in Australian society?",
        options: [
            "Everyone must have the same political views",
            "Everyone must follow the same religion",
            "Respecting the rights of others to have different beliefs and values",
            "Agreeing with everything the government says"
        ],
        correct_index: 2,
        explanation: "Mutual respect means respecting the rights of others to their own beliefs and values, even if they are different from yours.",
        difficulty: "easy"
    },
    {
        topic: "Australia today",
        question_text: "What are the three tiers of government in Australia?",
        options: [
            "Federal, State/Territory and Local",
            "Parliament, Court and Police",
            "Prime Minister, Premier and Mayor",
            "Monarchy, Republic and Democracy"
        ],
        correct_index: 0,
        explanation: "The three tiers of government in Australia are Federal (or Commonwealth), State and Territory, and Local.",
        difficulty: "medium"
    },
    {
        topic: "Australia and its people",
        question_text: "Who are the traditional owners of the land in Australia?",
        options: [
            "The British settlers",
            "The convicts",
            "The Aboriginal and Torres Strait Islander peoples",
            "The first free settlers"
        ],
        correct_index: 2,
        explanation: "Aboriginal and Torres Strait Islander peoples are the traditional owners of the land in Australia.",
        difficulty: "easy"
    },
    {
        topic: "Democratic beliefs, rights and liberties",
        question_text: "Is voting compulsory in Australian federal elections?",
        options: [
            "No, it is optional",
            "Yes, for all Australian citizens aged 18 and over",
            "Only for people who own property",
            "Only for people born in Australia"
        ],
        correct_index: 1,
        explanation: "Voting is compulsory in federal elections for all Australian citizens aged 18 years and over.",
        difficulty: "easy"
    },
    {
        topic: "Government and the law in Australia",
        question_text: "What is the highest court in Australia?",
        options: [
            "The Supreme Court",
            "The Federal Court",
            "The High Court of Australia",
            "The Magistrate's Court"
        ],
        correct_index: 2,
        explanation: "The High Court of Australia is the highest court in the Australian judicial system.",
        difficulty: "medium"
    },
    {
        topic: "Our Australian values",
        question_text: "In Australia, should people be allowed to use violence to solve problems?",
        options: [
            "Yes, if they are very angry",
            "Yes, if someone else started it",
            "No, everyone must obey the law and solve problems peacefully",
            "Only if the police aren't looking"
        ],
        correct_index: 2,
        explanation: "Australian values include peace and non-violence as the way to solve problems and disagreements.",
        difficulty: "easy"
    },
    {
        topic: "Australia today",
        question_text: "Which animal is featured on the Australian Commonwealth Coat of Arms?",
        options: [
            "Koala and Platypus",
            "Kangaroo and Emu",
            "Dingo and Wombat",
            "Echidna and Possum"
        ],
        correct_index: 1,
        explanation: "The Kangaroo and the Emu are the two animals featured on the Australian Commonwealth Coat of Arms.",
        difficulty: "easy"
    }
];

export async function seedLeagues() {
    const supabase = await createClient();

    const leagues = [
        { name: 'Bronze', rank: 1, min_xp_threshold: 0, reward_xp: 50 },
        { name: 'Silver', rank: 2, min_xp_threshold: 500, reward_xp: 100 },
        { name: 'Gold', rank: 3, min_xp_threshold: 1500, reward_xp: 200 },
        { name: 'Diamond', rank: 4, min_xp_threshold: 3000, reward_xp: 500 },
    ];

    for (const league of leagues) {
        const { data: existing } = await supabase
            .from('leagues')
            .select('id')
            .eq('name', league.name)
            .single();

        if (!existing) {
            await supabase.from('leagues').insert(league);
        }
    }
}

export async function seedAchievements() {
    const supabase = await createClient();

    const achievements = [
        { name: 'First Step', description: 'Complete your first quiz', badge_url: '🏁', xp_reward: 50 },
        { name: 'On Fire', description: 'Reach a 3-day streak', badge_url: '🔥', xp_reward: 100 },
        { name: 'Week Warrior', description: 'Reach a 7-day streak', badge_url: '📅', xp_reward: 500 },
        { name: 'Scholar', description: 'Complete a study topic', badge_url: '🎓', xp_reward: 200 },
        { name: 'Socialite', description: 'Add a friend', badge_url: '👋', xp_reward: 50 },
        { name: 'Gladiator', description: 'Win a PvP battle', badge_url: '⚔️', xp_reward: 150 },
        { name: 'Perfect Score', description: 'Get 100% on a quiz', badge_url: '💯', xp_reward: 100 },
        { name: 'Koala King', description: 'Reach Level 10', badge_url: '👑', xp_reward: 1000 },
        { name: 'Mock Master', description: 'Pass the Official Mock Test', badge_url: '📜', xp_reward: 500 },
    ];

    for (const achievement of achievements) {
        const { data: existing } = await supabase
            .from('achievements')
            .select('id')
            .eq('name', achievement.name)
            .single();

        if (!existing) {
            await supabase.from('achievements').insert(achievement);
        }
    }
}

export async function seedMockUsers() {
    const supabase = await createClient();

    const mockUsers = [
        { username: 'DingoDave', full_name: 'Dave Wilson', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=dave', total_xp: 2500, level: 5 },
        { username: 'SheilaSunshine', full_name: 'Sheila Banks', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=sheila', total_xp: 1800, level: 4 },
        { username: 'JoeyJumper', full_name: 'Joe Miller', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=joe', total_xp: 1200, level: 3 },
        { username: 'WallabyWally', full_name: 'Wally West', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=wally', total_xp: 900, level: 2 },
        { username: 'GreatBarrierGazza', full_name: 'Gary Green', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=gary', total_xp: 3500, level: 7 },
    ];

    const { data: bronzeLeague } = await supabase.from('leagues').select('id').eq('name', 'Bronze').single();
    if (!bronzeLeague) return;

    for (const mock of mockUsers) {
        // Check if mock user already exists in profiles
        const { data: existing } = await supabase.from('profiles').select('id').eq('username', mock.username).single();

        if (!existing) {
            // Create a fake UUID for mock users (this is not ideal but works for seeding if we don't have auth)
            // Actually, we can't easily insert into profiles without a valid user.id in some schemas, 
            // but let's try if the schema allows it. 
            // If the schema has a foreign key to auth.users, this will fail.
            // Let's check schema.sql.
        }
    }
}

export async function seedQuestions(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
        const supabase = await createClient();

        // Seed leagues and achievements
        await seedLeagues();
        await seedAchievements();

        // Fetch existing questions to avoid duplicates
        const { data: existingQuestions } = await supabase
            .from('questions')
            .select('question_text');

        const existingTexts = new Set(existingQuestions?.map(q => q.question_text) || []);

        const newQuestions = REAL_QUESTIONS.filter(q => !existingTexts.has(q.question_text));

        if (newQuestions.length > 0) {
            await supabase
                .from('questions')
                .insert(newQuestions.map(q => ({
                    ...q,
                    options: q.options
                })));
        }

        return { success: true, message: `Database seeded! Added ${newQuestions.length} new questions.` };
    } catch (err) {
        console.error('Seed error:', err);
        return { success: false, error: 'Failed to seed database. Check server logs.' };
    }
}
