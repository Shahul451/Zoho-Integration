import express from 'express';
import cors from 'cors';
import path from 'path';
import { getEnv } from './config/env';
import { powerBiController } from './controllers/powerBiController';
import { zohoAuthService } from './services/zohoAuthService';

const app = express();
const env = getEnv();

// Enable CORS & JSON parsing
app.use(cors());
app.use(express.json());

// Serve static dashboard UI
app.use(express.static(path.join(__dirname, '../public')));

// Status & Token management
app.get('/api/powerbi/status', (req, res) => powerBiController.getStatus(req, res));
app.post('/api/powerbi/refresh-token', (req, res) => powerBiController.refreshToken(req, res));

// Power BI Table Endpoints
app.get('/api/powerbi/invoices', (req, res) => powerBiController.getInvoices(req, res));
app.get('/api/powerbi/contacts', (req, res) => powerBiController.getContacts(req, res));
app.get('/api/powerbi/items', (req, res) => powerBiController.getItems(req, res));
app.get('/api/powerbi/payments', (req, res) => powerBiController.getPayments(req, res));
app.get('/api/powerbi/bills', (req, res) => powerBiController.getBills(req, res));
app.get('/api/powerbi/expenses', (req, res) => powerBiController.getExpenses(req, res));
app.get('/api/powerbi/salesorders', (req, res) => powerBiController.getSalesOrders(req, res));

// Catch-all route for frontend dashboard
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start Server
app.listen(env.port, async () => {
  console.log(`=======================================================`);
  console.log(`🚀 Zoho Books to Power BI Integration Server`);
  console.log(`📡 Server running on http://localhost:${env.port}`);
  console.log(`📊 Power BI Dashboard UI: http://localhost:${env.port}`);
  console.log(`=======================================================`);

  // Attempt initial token refresh if credentials exist in .env
  if (env.clientId && env.clientSecret && env.refreshToken) {
    try {
      await zohoAuthService.getValidAccessToken();
    } catch (err: any) {
      console.warn(`[Startup Warning] Zoho OAuth token refresh on startup failed: ${err.message}`);
      console.warn(`[Startup Warning] Please check your credentials in .env file.`);
    }
  } else {
    console.log(`ℹ️ Please update your .env file with Zoho API Credentials.`);
  }
});
