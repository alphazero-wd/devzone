/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        hostname: process.env.NEXT_PUBLIC_IMAGE_HOST,
        protocol: "https",
        pathname: "/avatars/**",
      },
    ],
  },
};

export default nextConfig;
