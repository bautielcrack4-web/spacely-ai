import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

const ASSETS_PATH = path.join(process.cwd(), 'spacely-examples-pack', 'images');

const METADATA = [
    {
        room_type: 'living',
        style_name: 'Modern Minimalist',
        before: 'sala-estar-vacia-muebles-puerta_305343-47672.avif',
        after: 'replicate-prediction-1sgrm7zxr9rmr0cvmqcstqdv04.jpeg',
        title: 'De Vacío a Minimalista Moderno',
        description: 'Una sala vacía transformada en un espacio elegante con líneas limpias y luz natural.',
        badge: 'WOW FACTOR',
        priority: 5
    },
    {
        room_type: 'kitchen',
        style_name: 'Scandinavian Wood',
        before: 'please-dont-kill-me-painting-revitalizing-old-kitchen-v0-pshezzqc7qjd1.webp',
        after: 'replicate-prediction-cfcty851k5rmr0cvmqe9q2sffr.jpeg',
        title: 'Calidez Escandinava Renovada',
        description: 'Moderniza la madera con diseño luminoso, open shelving y subway tiles.',
        badge: null,
        priority: 4
    },
    {
        room_type: 'bedroom',
        style_name: 'Dark Moody',
        before: 'habitacion-vacia-casa-nueva.jpg',
        after: 'replicate-prediction-kqnpa9f7tdrmy0cvmqj8bq1bd0.jpeg',
        title: 'Habitación Moody Dramática',
        description: 'Pared negra mate con cama flotante LED y arte geométrico para un estilo masculino sofisticado.',
        badge: 'IMPRESIONANTE',
        priority: 8
    },
    {
        room_type: 'bedroom',
        style_name: 'Hotel Suite',
        before: 'habitacion-vacia-casa-nueva.jpg',
        after: 'replicate-prediction-6e96t53md9rmw0cvmqj88z0var.jpeg',
        title: 'Suite de Hotel Boutique',
        description: 'Dormitorio de 5 estrellas con headboard LED, lámparas colgantes y textiles de lujo.',
        badge: null,
        priority: 3
    },
    {
        room_type: 'bedroom',
        style_name: 'Classic Luxury',
        before: 'habitacion-vacia-casa-nueva.jpg',
        after: 'replicate-prediction-8twv0dtcvxrmr0cvmqjbffqjpr.jpeg',
        title: 'Lujo Clásico Atemporal',
        description: 'Elegancia tradicional con araña de cristal, molduras y pared de mármol.',
        badge: null,
        priority: 2
    },
    {
        room_type: 'bathroom',
        style_name: 'Scandinavian Brass',
        before: 'what-in-the-world-to-do-with-this-50s-pink-burgundy-tile-v0-3ni6qfjcclka1.webp',
        after: 'replicate-prediction-zckthr70vhrmt0cvmqm87jhyec.jpeg',
        title: 'Escandinavo Cálido con Brass',
        description: 'Madera oak, brass fixtures y hexagon tiles para un baño luminoso y acogedor.',
        badge: null,
        priority: 1
    },
    {
        room_type: 'bathroom',
        style_name: 'Industrial Black',
        before: 'what-in-the-world-to-do-with-this-50s-pink-burgundy-tile-v0-3ni6qfjcclka1.webp',
        after: 'replicate-prediction-r7aescnddhrmw0cvmqmb698qmw.jpeg',
        title: 'De Rosa Retro a Industrial Negro',
        description: 'El contraste más dramático: azulejos rosa años 50 convertidos en baño industrial completamente negro.',
        badge: 'WOW FACTOR',
        priority: 10
    },
    {
        room_type: 'bathroom',
        style_name: 'Spa Luxury',
        before: 'what-in-the-world-to-do-with-this-50s-pink-burgundy-tile-v0-3ni6qfjcclka1.webp',
        after: 'replicate-prediction-rpjfwrgc71rmr0cvmqmbgkv0b8.jpeg',
        title: 'Spa de Lujo en Casa',
        description: 'Tina freestanding, mármol y grifería dorada transforman un baño vintage en spa de hotel.',
        badge: 'TRENDING',
        priority: 9
    }
];

export async function GET() {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) { return cookieStore.get(name)?.value },
                    set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
                    remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }) },
                },
            }
        );

        const uploadedUrls: Record<string, string> = {};

        // 1. Upload all unique images
        const allFiles = [...new Set(METADATA.flatMap(m => [m.before, m.after]))];

        for (const filename of allFiles) {
            const filePath = path.join(ASSETS_PATH, filename);
            if (!fs.existsSync(filePath)) continue;

            const fileBuffer = fs.readFileSync(filePath);
            const contentType = filename.endsWith('.avif') ? 'image/avif' :
                filename.endsWith('.webp') ? 'image/webp' :
                    filename.endsWith('.jpeg') || filename.endsWith('.jpg') ? 'image/jpeg' : 'image/png';

            const { data, error } = await supabase.storage
                .from('examples')
                .upload(`assets/${filename}`, fileBuffer, {
                    contentType,
                    upsert: true
                });

            if (!error || error.message.includes('already exists')) {
                const { data: { publicUrl } } = supabase.storage
                    .from('examples')
                    .getPublicUrl(`assets/${filename}`);
                uploadedUrls[filename] = publicUrl;
            }
        }

        // 2. Insert into DB
        for (const item of METADATA) {
            const before_url = uploadedUrls[item.before];
            const after_url = uploadedUrls[item.after];

            if (!before_url || !after_url) continue;

            await supabase.from('examples').upsert({
                room_type: item.room_type,
                style_name: item.style_name,
                before_url,
                after_url,
                title: item.title,
                description: item.description,
                badge: item.badge,
                priority: item.priority
            }, { onConflict: 'title' }); // Using title as unique for upsert if needed, or just insert
        }

        return NextResponse.json({ success: true, count: METADATA.length });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
