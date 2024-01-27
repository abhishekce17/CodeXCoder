/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['res.cloudinary.com']
    },
    experimental: {
        serverActions: true,
    },
}

export default nextConfig;
