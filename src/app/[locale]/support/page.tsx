import { getDashboardData } from "@/app/actions/dashboard";
import { redirect } from "@/i18n/routing";
import SupportClient from "./SupportClient";

export const dynamic = 'force-dynamic';

export default async function SupportPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const data = await getDashboardData();

    if (data.error === 'Not authenticated') {
        redirect({ href: '/login', locale });
    }

    return <SupportClient data={data} />;
}
