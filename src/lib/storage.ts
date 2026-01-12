import { supabase } from "./supabase";

/**
 * Uploads a file to Supabase Storage and returns the public URL.
 * Falls back to base64 if upload fails (though that risks 500s).
 */
export async function uploadTempImage(file: File): Promise<string> {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `temp/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // 1. Upload
        const { error: uploadError } = await supabase.storage
            .from('generations')
            .upload(fileName, file, {
                upsert: true,
                contentType: file.type
            });

        if (uploadError) throw uploadError;

        // 2. Get Signed URL (Better reliability for AI services)
        const { data } = await supabase.storage
            .from('generations')
            .createSignedUrl(fileName, 3600); // 1 hour

        if (!data?.signedUrl) throw new Error("Failed to generate signed URL");

        return data.signedUrl;
    } catch (error) {
        console.error("Upload failed:", error);
        throw new Error("Failed to upload image. Please try again.");
    }
}
