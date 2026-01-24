export const STYLES = [
    // Interior
    { id: "Modern Minimalist", label: "Minimalist", labelKey: "styles.modern", color: "bg-gray-100", image: "/styles/minimalist.png", category: "interior" },
    { id: "Industrial", label: "Industrial", labelKey: "styles.industrial", color: "bg-stone-200", image: "/styles/industrial.png", category: "interior" },
    { id: "Bohemian", label: "Bohemian", labelKey: "styles.bohemian", color: "bg-amber-100", image: "/styles/bohemian.png", category: "interior" },
    { id: "Scandinavian", label: "Scandi", labelKey: "styles.scandinavian", color: "bg-neutral-100", image: "/styles/scandinavian.png", category: "interior" },
    { id: "Mid-Century Modern", label: "Mid-Century", labelKey: "styles.midcentury", color: "bg-yellow-100", image: "/styles/midcentury.png", category: "interior" },
    { id: "Luxury Art Deco", label: "Art Deco", labelKey: "styles.artdeco", color: "bg-amber-500", image: "/styles/luxury_art_deco.png", category: "interior" },
    { id: "Japandi", label: "Japandi", labelKey: "styles.japandi", color: "bg-stone-100", image: "/styles/japandi.png", category: "interior" },

    // Exterior
    { id: "Modern Façade", label: "Modern Facade", labelKey: "styles.facade", color: "bg-blue-900", image: "/styles/modern_facade_style_1769241535216.png", category: "exterior" },
    { id: "Rustic Farmhouse", label: "Farmhouse", labelKey: "styles.farmhouse", color: "bg-orange-100", image: "/styles/rustic_farmhouse.png", category: "exterior" },
    { id: "Contemporary Garden", label: "Garden", labelKey: "styles.garden", color: "bg-emerald-200", image: "/styles/contemporary_garden_style_1769241565538.png", category: "exterior" },
    { id: "Pool Area", label: "Pool", labelKey: "styles.pool", color: "bg-cyan-100", image: "/styles/pool_area_style_1769241579294.png", category: "exterior" },
    { id: "Tropical", label: "Tropical", labelKey: "styles.tropical", color: "bg-emerald-100", image: "/styles/tropical.png", category: "exterior" },
    { id: "Coastal Mediterranean", label: "Coastal", labelKey: "styles.coastal", color: "bg-blue-100", image: "/styles/coastal.png", category: "exterior" },

    // Paint
    { id: "Accent Wall", label: "Accent Wall", labelKey: "styles.accent", color: "bg-indigo-600", image: "/styles/accent_wall_paint_1769241591177.png", category: "paint" },
    { id: "Pastel Elegance", label: "Pastel", labelKey: "styles.pastel", color: "bg-pink-100", image: "/styles/pastel_room_paint_1769241603911.png", category: "paint" },

    // All / General
    { id: "Japanese Zen", label: "Zen", labelKey: "styles.japanese", color: "bg-orange-50", image: "/styles/zen.png", category: "all" },
    { id: "Cyberpunk", label: "Cyberpunk", labelKey: "styles.cyberpunk", color: "bg-purple-900", image: "/styles/cyberpunk.png", category: "all" },
    { id: "Minimalist Dark", label: "Dark", labelKey: "styles.dark", color: "bg-gray-900", image: "/styles/minimalist_dark.png", category: "all" },
];

export const TEMPLATES = [
    // Interior
    { id: 'living', label: 'Living Room', labelKey: 'dashboard.templates.living', image: '/examples/assets/sala-estar-vacia-muebles-puerta_305343-47672.avif', category: 'interior' },
    { id: 'bedroom', label: 'Bedroom', labelKey: 'dashboard.templates.bedroom', image: '/examples/assets/bedroom.webp', category: 'interior' },
    { id: 'kitchen', label: 'Old Kitchen', labelKey: 'dashboard.templates.kitchen', image: '/examples/assets/please-dont-kill-me-painting-revitalizing-old-kitchen-v0-pshezzqc7qjd1.webp', category: 'interior' },

    // Exterior
    { id: 'house-facade', label: 'House Facade', labelKey: 'dashboard.templates.facade', image: '/templates/empty_house_template_1769241641619.png', category: 'exterior' },
    { id: 'pool-empty', label: 'Empty Pool', labelKey: 'dashboard.templates.pool_empty', image: '/templates/backyard_pool_template_1769241656641.png', category: 'exterior' },

    // General
    { id: 'room', label: 'Empty Room', labelKey: 'dashboard.templates.room', image: '/examples/assets/habitacion-vacia-casa-nueva.jpg', category: 'all' },
];

export const COMMUNITY_GALLERY = [
    { id: 'c1', prompt: 'Modern Minimalist living room', image_url: '/styles/minimalist.png' },
    { id: 'c2', prompt: 'Cozy Bohemian bedroom', image_url: '/styles/bohemian.png' },
    { id: 'c3', prompt: 'High-tech Cyberpunk setup', image_url: '/styles/cyberpunk.png' },
    { id: 'c4', prompt: 'Bright Scandinavian kitchen', image_url: '/styles/scandinavian.png' },
];
