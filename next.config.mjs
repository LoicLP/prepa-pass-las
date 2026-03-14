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
};

export default nextConfig;
