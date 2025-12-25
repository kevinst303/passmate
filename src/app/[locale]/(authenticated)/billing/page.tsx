import { getDashboardData } from "@/app/actions/dashboard";
import { redirect } from "@/i18n/routing";
import BillingClient from "./BillingClient";

export const dynamic = 'force-dynamic';

export default async function BillingPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const data = await getDashboardData();

    if ('error' in data) {
        if (data.error === 'Not authenticated') {
            redirect({ href: '/login', locale });
        }
        return <div>Error loading data</div>; // Simple fallback
    }

    return <BillingClient data={data} />;
}
