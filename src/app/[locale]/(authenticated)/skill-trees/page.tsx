export const dynamic = 'force-dynamic';

import { getDashboardData } from "@/app/actions/dashboard";
import { getSkillTreeData } from "@/app/actions/skills";
import { redirect } from "@/i18n/routing";
import SkillTreesClient from "./SkillTreesClient";
import { DashboardData } from "@/types/dashboard";

export default async function SkillTreesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const [data, skillTreeData] = await Promise.all([
        getDashboardData(),
        getSkillTreeData()
    ]);

    if ('error' in data && data.error === 'Not authenticated') {
        redirect({ href: '/login', locale });
    }

    if (('error' in data && data.error) || skillTreeData.error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
                <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm text-center max-w-md">
                    <h2 className="text-2xl font-bold text-accent mb-4">Something went wrong</h2>
                    <p className="text-muted-foreground">{('error' in data ? data.error : '') || skillTreeData.error}</p>
                </div>
            </div>
        );
    }

    // Cast is safe here because we checked for error
    return <SkillTreesClient data={data as DashboardData} skillTreeData={skillTreeData as any} />;
}



