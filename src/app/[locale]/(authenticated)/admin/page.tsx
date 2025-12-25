export const dynamic = 'force-dynamic';

import { createClient } from "@/utils/supabase/server";
import { redirect } from "@/i18n/routing";
import AdminClient from "./AdminClient";

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect({ href: '/login', locale });
    }

    return <AdminClient />;
}
