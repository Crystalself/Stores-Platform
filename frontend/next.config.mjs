import createNextIntlPlugin from "next-intl/plugin";
import { join } from 'path';

const withNextIntl = createNextIntlPlugin("./src/models/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = join(process.cwd(), 'src');
    return config;
  },
};

export default withNextIntl(nextConfig);
