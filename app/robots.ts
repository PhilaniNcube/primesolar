import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://primesolar.co.za' // Update with your actual domain

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/db/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
