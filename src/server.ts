import express from 'express';
import cors from 'cors';
import path from 'path';
import { getEnv } from './config/env';
import { powerBiController } from './controllers/powerBiController';
import { zohoAuthService } from './services/zohoAuthService';

const app = express();
const env = getEnv();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/powerbi/status', (req, res) =>
  powerBiController.getStatus(req, res)
);

app.post('/api/powerbi/refresh-token', (req, res) =>
  powerBiController.refreshToken(req, res)
);

app.get('/api/powerbi/invoices', (req, res) =>
  powerBiController.getInvoices(req, res)
);

app.get('/api/powerbi/contacts', (req, res) =>
  powerBiController.getContacts(req, res)
);

app.get('/api/powerbi/items', (req, res) =>
  powerBiController.getItems(req, res)
);

app.get('/api/powerbi/payments', (req, res) =>
  powerBiController.getPayments(req, res)
);

app.get('/api/powerbi/bills', (req, res) =>
  powerBiController.getBills(req, res)
);

app.get('/api/powerbi/expenses', (req, res) =>
  powerBiController.getExpenses(req, res)
);

app.get('/api/powerbi/salesorders', (req, res) =>
  powerBiController.getSalesOrders(req, res)
);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Azure App Service / IISNode provides PORT.
// Local development falls back to env.port / 3000.
const PORT = process.env.PORT || env.port || 3000;

app.listen(PORT, async () => {
  console.log('=======================================================');
  console.log('🚀 Zoho Books to Power BI Integration Server');
  console.log(`📡 Server running on: ${PORT}`);
  console.log('📊 Power BI Dashboard UI available');
  console.log('=======================================================');

  if (env.clientId && env.clientSecret && env.refreshToken) {
    try {
      await zohoAuthService.getValidAccessToken();
      console.log('[Startup] ✅ Zoho OAuth token refreshed successfully.');
    } catch (err: any) {
      console.warn(
        `[Startup Warning] Zoho OAuth token refresh failed: ${err.message}`
      );
      console.warn(
        '[Startup Warning] Please check your Zoho credentials in Azure App Settings.'
      );
    }
  } else {
    console.log(
      '[Info] ℹ️ Zoho credentials not configured. Add them in Azure App Settings.'
    );
  }
});