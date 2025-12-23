import { getDashboardData } from "@/app/actions/dashboard";
import { redirect } from "next/navigation";
import BillingClient from "./BillingClient";

export const dynamic = 'force-dynamic';

export default async function BillingPage() {
    const data = await getDashboardData();

    if (data.error === 'Not authenticated') {
        redirect('/login');
    }

    return <BillingClient data={data} />;
}
