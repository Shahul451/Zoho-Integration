import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export interface ZohoDomainConfig {
  authUrl: string;
  apiUrl: string;
}

const REGION_DOMAINS: Record<string, ZohoDomainConfig> = {
  com: {
    authUrl: 'https://accounts.zoho.com',
    apiUrl: 'https://www.zohoapis.com/books/v3',
  },
  in: {
    authUrl: 'https://accounts.zoho.in',
    apiUrl: 'https://www.zohoapis.in/books/v3',
  },
  eu: {
    authUrl: 'https://accounts.zoho.eu',
    apiUrl: 'https://www.zohoapis.eu/books/v3',
  },
  'com.au': {
    authUrl: 'https://accounts.zoho.com.au',
    apiUrl: 'https://www.zohoapis.com.au/books/v3',
  },
  jp: {
    authUrl: 'https://accounts.zoho.jp',
    apiUrl: 'https://www.zohoapis.jp/books/v3',
  },
  ca: {
    authUrl: 'https://accounts.zoho.ca',
    apiUrl: 'https://www.zohoapis.ca/books/v3',
  },
};

export const getEnv = () => {
  const region = (process.env.ZOHO_REGION || 'in').toLowerCase();
  const domainConfig = REGION_DOMAINS[region] || REGION_DOMAINS['in'];

  const rawPort = process.env.PORT || '3000';
  const port = /^\d+$/.test(rawPort) ? parseInt(rawPort, 10) : rawPort;

  return {
    port,
    clientId: process.env.ZOHO_CLIENT_ID || '',
    clientSecret: process.env.ZOHO_CLIENT_SECRET || '',
    refreshToken: process.env.ZOHO_REFRESH_TOKEN || '',
    organizationId: process.env.ZOHO_ORGANIZATION_ID || '',
    region,
    authUrl: domainConfig.authUrl,
    apiUrl: domainConfig.apiUrl,
  };
};
