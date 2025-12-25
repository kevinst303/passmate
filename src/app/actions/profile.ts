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
    revalidatePath('/settings');
    revalidatePath('/dashboard');
    return { success: true };
}

export async function uploadAvatar(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    const file = formData.get('file') as File;
    if (!file) {
        return { error: 'No file provided' };
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
        return { error: 'Please upload an image file' };
    }

    // Validate file size (e.g., 2MB)
    if (file.size > 2 * 1024 * 1024) {
        return { error: 'Image must be less than 2MB' };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
            upsert: true,
            contentType: file.type
        });

    if (error) {
        console.error('Error uploading avatar:', error);
        return { error: 'Failed to upload avatar. Please make sure the "avatars" bucket exists and is public.' };
    }

    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

    return { success: true, url: publicUrl };
}

export async function deleteAccount() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    // Since we're using Supabase, deleting the user from auth.users 
    // needs to be done via service role or the user deleting themselves
    // If using the standard client, we can use supabase.auth.admin.deleteUser
    // but that requires service role. 
    // For now, we'll delete the profile and sign out.
    // In a real production app, you might have an edge function for this.

    const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

    if (profileError) {
        console.error('Error deleting profile:', profileError);
        return { error: 'Failed to delete account data' };
    }

    const { error: authError } = await supabase.auth.signOut();

    if (authError) {
        console.error('Error signing out:', authError);
        return { error: 'Failed to sign out' };
    }

    revalidatePath('/');
    return { success: true };
}
