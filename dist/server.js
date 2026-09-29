"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./config/env");
const powerBiController_1 = require("./controllers/powerBiController");
const zohoAuthService_1 = require("./services/zohoAuthService");
const app = (0, express_1.default)();
const env = (0, env_1.getEnv)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.get('/api/powerbi/status', (req, res) => powerBiController_1.powerBiController.getStatus(req, res));
app.post('/api/powerbi/refresh-token', (req, res) => powerBiController_1.powerBiController.refreshToken(req, res));
app.get('/api/powerbi/invoices', (req, res) => powerBiController_1.powerBiController.getInvoices(req, res));
app.get('/api/powerbi/contacts', (req, res) => powerBiController_1.powerBiController.getContacts(req, res));
app.get('/api/powerbi/items', (req, res) => powerBiController_1.powerBiController.getItems(req, res));
app.get('/api/powerbi/payments', (req, res) => powerBiController_1.powerBiController.getPayments(req, res));
app.get('/api/powerbi/bills', (req, res) => powerBiController_1.powerBiController.getBills(req, res));
app.get('/api/powerbi/expenses', (req, res) => powerBiController_1.powerBiController.getExpenses(req, res));
app.get('/api/powerbi/salesorders', (req, res) => powerBiController_1.powerBiController.getSalesOrders(req, res));
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
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
            await zohoAuthService_1.zohoAuthService.getValidAccessToken();
            console.log('[Startup] ✅ Zoho OAuth token refreshed successfully.');
        }
        catch (err) {
            console.warn(`[Startup Warning] Zoho OAuth token refresh failed: ${err.message}`);
            console.warn('[Startup Warning] Please check your Zoho credentials in Azure App Settings.');
        }
    }
    else {
        console.log('[Info] ℹ️ Zoho credentials not configured. Add them in Azure App Settings.');
    }
});
