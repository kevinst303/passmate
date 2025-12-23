'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getMasterclassProgress() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { modules: [] };

    const { data } = await supabase
        .from('xp_logs')
        .select('metadata')
        .eq('user_id', user.id)
        .eq('reason', 'masterclass_module');

    // Extract module names from metadata if we stored them, 
    // or just return unique mod names from this session state for now.
    // In a real app we'd have a masterclass_progress table.
    // For now we'll simulate based on XP logs or return a placeholder if not found.
    return {
        modules: data?.map((log: any) => log.metadata?.moduleId).filter(Boolean) || []
    };
}

export async function flagMasterclassComplete(moduleId: string, xpReward: number = 500) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Not authenticated' };

    // Update XP
    await supabase.rpc('increment_xp', { uid: user.id, amount: xpReward });

    // Log XP with metadata
    await supabase.from('xp_logs').insert({
        user_id: user.id,
        amount: xpReward,
        reason: 'masterclass_module',
        metadata: { moduleId }
    });

    revalidatePath('/masterclass');
    revalidatePath('/dashboard');

    return { success: true };
}
