# PassMate 🐨

PassMate is a gamified Australian Citizenship Test preparation app designed to make studying engaging and effective. It features a "Duolingo-style" learning experience with leagues, streaks, XP, and a friendly Koala companion named Ollie.

## Features

- **Gamified Learning**: Earn XP, maintain daily streaks, and level up as you master topics.
- **Skill Trees**: Structured study paths covering all official testable sections.
- **Leagues**: Compete with other users in weekly leaderboards (Bronze, Silver, Gold, Diamond).
- **PvP Battles**: Challenge friends to quiz battles and see who knows more about Australia!
- **Achievements**: Unlock badges for milestones and specific accomplishments.
- **Mock Exams**: Full 45-minute timed simulation of the real test.
- **AI Tutor**: "Ollie the Koala" provides explanations and encouragement.
- **Review Mistakes**: Spaced repetition system to help you master difficult questions.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Design System
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Getting Started

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Setup**:
    Copy `.env.example` to `.env` and fill in your Supabase credentials.
    ```bash
    cp .env.example .env
    ```
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser.

## Database Schema

The app uses a comprehensive Supabase schema including:
- `profiles`: User stats (XP, level, streak, hearts).
- `questions`: The question bank.
- `leagues` & `league_standings`: Leaderboard system.
- `friendships` & `challenges`: Social features.
- `user_mistakes`: Spaced repetition tracking.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
