import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://studyvisions.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/', 
        '/dashboard/', 
        '/my-library/', 
        '/checkout/', 
        '/auth/', 
        '/api/'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
