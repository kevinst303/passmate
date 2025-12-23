export const dynamic = 'force-dynamic';

import { getDashboardData } from "@/app/actions/dashboard";
import { getSkillTreeData } from "@/app/actions/skills";
import { redirect } from "next/navigation";
import SkillTreesClient from "./SkillTreesClient";

export default async function SkillTreesPage() {
    const data = await getDashboardData();

    if (data.error === 'Not authenticated') {
        redirect('/login');
    }

    const skillTreeData = await getSkillTreeData();

    if (data.error || skillTreeData.error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
                <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm text-center max-w-md">
                    <h2 className="text-2xl font-bold text-accent mb-4">Something went wrong</h2>
                    <p className="text-muted-foreground">{data.error || skillTreeData.error}</p>
                </div>
            </div>
        );
    }

    return <SkillTreesClient data={data} skillTreeData={skillTreeData} />;
}



