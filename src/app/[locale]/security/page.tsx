import { getDashboardData } from "@/app/actions/dashboard";
import { redirect } from "next/navigation";
import SecurityClient from "./SecurityClient";

export const dynamic = 'force-dynamic';

export default async function SecurityPage() {
    const data = await getDashboardData();

    if (data.error === 'Not authenticated') {
        redirect('/login');
    }

    return <SecurityClient data={data} />;
}
