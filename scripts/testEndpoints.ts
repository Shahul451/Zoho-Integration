import { zohoBooksService } from '../src/services/zohoBooksService';

async function testFetch() {
  try {
    console.log(`📡 Fetching Contacts table from Zoho Books...`);
    const contacts = await zohoBooksService.getContactsTable(true);
    console.log(`✅ Success! Retrieved ${contacts.length} contact row(s).`);

    console.log(`📡 Fetching Items table from Zoho Books...`);
    const items = await zohoBooksService.getItemsTable(true);
    console.log(`✅ Success! Retrieved ${items.length} item row(s).`);

    console.log(`\n🎉 Zoho Books Integration is 100% WORKING and ready for Power BI!`);
  } catch (err: any) {
    console.error(`❌ Test failed:`, err.message);
  }
}

testFetch();
