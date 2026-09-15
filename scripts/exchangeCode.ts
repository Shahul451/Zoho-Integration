import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function exchangeGrantCode() {
  // Read arguments or env
  const code = process.argv[2] || process.env.ZOHO_GRANT_CODE;
  const clientId = process.argv[3] || process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.argv[4] || process.env.ZOHO_CLIENT_SECRET;
  const region = (process.argv[5] || process.env.ZOHO_REGION || 'in').toLowerCase();

  const domainMap: Record<string, string> = {
    com: 'https://accounts.zoho.com',
    in: 'https://accounts.zoho.in',
    eu: 'https://accounts.zoho.eu',
    'com.au': 'https://accounts.zoho.com.au',
    jp: 'https://accounts.zoho.jp',
    ca: 'https://accounts.zoho.ca',
  };

  const authUrl = domainMap[region] || domainMap['in'];

  if (!code || !clientId || !clientSecret) {
    console.log(`
❌ Usage:
  npm run exchange-code <GRANT_CODE> <CLIENT_ID> <CLIENT_SECRET> [REGION]

Example:
  npm run exchange-code 1000.d0951... 1000.xxxx 869x... in
`);
    process.exit(1);
  }

  const tokenEndpoint = `${authUrl}/oauth/v2/token`;
  console.log(`📡 Exchanging Grant Code with Zoho (${tokenEndpoint})...`);

  try {
    const params = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
    });

    const response = await axios.post(tokenEndpoint, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const data = response.data;

    if (data.error) {
      console.error(`❌ Zoho OAuth Error:`, data.error);
      process.exit(1);
    }

    console.log(`\n✅ SUCCESS! Refresh Token Obtained!`);
    console.log(`🔑 Refresh Token: ${data.refresh_token}`);

    // Update .env file
    const envPath = path.resolve(__dirname, '../.env');
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

    envContent = updateEnvVariable(envContent, 'ZOHO_CLIENT_ID', clientId);
    envContent = updateEnvVariable(envContent, 'ZOHO_CLIENT_SECRET', clientSecret);
    envContent = updateEnvVariable(envContent, 'ZOHO_REFRESH_TOKEN', data.refresh_token);
    envContent = updateEnvVariable(envContent, 'ZOHO_REGION', region);

    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log(`📝 Updated .env file automatically with Client ID, Secret, and Refresh Token!`);
  } catch (err: any) {
    const errorMsg = err.response?.data || err.message;
    console.error(`❌ Failed to exchange grant code:`, errorMsg);
  }
}

function updateEnvVariable(envString: string, key: string, value: string): string {
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(envString)) {
    return envString.replace(regex, `${key}=${value}`);
  }
  return envString + `\n${key}=${value}`;
}

exchangeGrantCode();
