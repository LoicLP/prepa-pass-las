/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/qcm.html', destination: '/qcm', permanent: true },
      { source: '/fiches.html', destination: '/fiches', permanent: true },
      { source: '/examen.html', destination: '/examen', permanent: true },
      { source: '/cours.html', destination: '/cours', permanent: true },
      { source: '/programme.html', destination: '/programme', permanent: true },
      { source: '/blog.html', destination: '/blog', permanent: true },
      { source: '/tarifs.html', destination: '/tarifs', permanent: true },
      { source: '/dashboard.html', destination: '/dashboard', permanent: true },
      { source: '/annales.html', destination: '/annales', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
