export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/api/', '/auth/', '/payment/', '/reset-password'],
      },
    ],
    sitemap: 'https://www.prepa-pass-las.fr/sitemap.xml',
  };
}
