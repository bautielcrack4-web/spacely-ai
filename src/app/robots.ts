import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/dashboard/profile'], // Protect API routes and private profiles from crawling
        },
        sitemap: 'https://roomcraft.app/sitemap.xml',
    }
}
