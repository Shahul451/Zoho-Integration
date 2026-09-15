import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { zohoAuthService } from '../src/services/zohoAuthService';
import { getEnv } from '../src/config/env';

async function fetchOrganizationId() {
  try {
    const env = getEnv();
    console.log(`📡 Fetching valid Access Token...`);
    const token = await zohoAuthService.getValidAccessToken();

    console.log(`📡 Querying Zoho Books organizations (${env.apiUrl}/organizations)...`);
    const response = await axios.get(`${env.apiUrl}/organizations`, {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    });

    const orgs = response.data.organizations || [];

    if (orgs.length === 0) {
      console.log(`⚠️ No Zoho Books organizations found for this account.`);
      return;
    }

    console.log(`\n✅ Found ${orgs.length} Organization(s):`);
    orgs.forEach((o: any, idx: number) => {
      console.log(`  ${idx + 1}. ${o.name} (ID: ${o.organization_id}) - Currency: ${o.currency_code}`);
    });

    const primaryOrgId = orgs[0].organization_id;

    // Update .env file
    const envPath = path.resolve(__dirname, '../.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    const regex = /^ZOHO_ORGANIZATION_ID=.*$/m;
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `ZOHO_ORGANIZATION_ID=${primaryOrgId}`);
    } else {
      envContent += `\nZOHO_ORGANIZATION_ID=${primaryOrgId}`;
    }
    fs.writeFileSync(envPath, envContent, 'utf8');

    console.log(`\n🎉 Automatically set ZOHO_ORGANIZATION_ID=${primaryOrgId} in .env file!`);
  } catch (err: any) {
    const errorMsg = err.response?.data || err.message;
    console.error(`❌ Error fetching organization ID:`, errorMsg);
  }
}

fetchOrganizationId();
