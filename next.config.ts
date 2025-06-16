import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  API_Endpoint: 'http://109.123.245.232:8405/v1/',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eu2.contabostorage.com',
        port: '',
        pathname: '/**', // Allows all paths under this domain
      },
    ],
  },
 /* images: {
    domains: ['eu2.contabostorage.com'], // Whitelist the domain
  },*/
  /*API_Endpoint: 'https://bills.jugaad.co.zw/api/wallet/api/v1/'*/
};

export default nextConfig;
