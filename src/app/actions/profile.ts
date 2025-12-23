'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(data: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    // If username is being changed, check if it's already taken
    if (data.username) {
        const { data: existing } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', data.username)
            .neq('id', user.id)
            .single();

        if (existing) {
            return { error: 'Username is already taken, mate!' };
        }
    }

    const { error } = await supabase
        .from('profiles')
        .update({
            ...data,
            updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

    if (error) {
        console.error('Error updating profile:', error);
        return { error: 'Failed to update profile' };
    }

    revalidatePath('/profile');
    revalidatePath('/dashboard');
    return { success: true };
}
