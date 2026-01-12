import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const { id, image_url, userId } = await req.json();

        if (!id || !image_url) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Delete from Storage
        // Extract filename from URL: .../storage/v1/object/public/generations/filename.png
        const pathParts = image_url.split('/generations/');
        if (pathParts.length > 1) {
            const filePath = pathParts[1];
            const { error: storageError } = await supabase.storage
                .from('generations')
                .remove([filePath]);

            if (storageError) {
                console.error("Storage delete error:", storageError);
                // Continue to DB delete even if storage fails (orphaned files are better than zombie records)
            }
        }

        // 2. Delete from DB
        // We should ideally verify userId matches record owner, but for this prototype trusting ID
        // In prod, check RLS or query first.
        let query = supabase.from('generations').delete().eq('id', id);

        // Safety check if userId provided
        if (userId) {
            query = query.eq('user_id', userId);
        }

        const { error: dbError } = await query;

        if (dbError) {
            throw dbError;
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
