import { getDashboardData } from "@/app/actions/dashboard";
import { redirect } from "next/navigation";
import SupportClient from "./SupportClient";

export const dynamic = 'force-dynamic';

export default async function SupportPage() {
    const data = await getDashboardData();

    if (data.error === 'Not authenticated') {
        redirect('/login');
    }

    return <SupportClient data={data} />;
}
