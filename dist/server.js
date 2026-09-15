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
// Enable CORS & JSON parsing
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static dashboard UI
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Status & Token management
app.get('/api/powerbi/status', (req, res) => powerBiController_1.powerBiController.getStatus(req, res));
app.post('/api/powerbi/refresh-token', (req, res) => powerBiController_1.powerBiController.refreshToken(req, res));
// Power BI Table Endpoints
app.get('/api/powerbi/invoices', (req, res) => powerBiController_1.powerBiController.getInvoices(req, res));
app.get('/api/powerbi/contacts', (req, res) => powerBiController_1.powerBiController.getContacts(req, res));
app.get('/api/powerbi/items', (req, res) => powerBiController_1.powerBiController.getItems(req, res));
app.get('/api/powerbi/payments', (req, res) => powerBiController_1.powerBiController.getPayments(req, res));
app.get('/api/powerbi/bills', (req, res) => powerBiController_1.powerBiController.getBills(req, res));
app.get('/api/powerbi/expenses', (req, res) => powerBiController_1.powerBiController.getExpenses(req, res));
app.get('/api/powerbi/salesorders', (req, res) => powerBiController_1.powerBiController.getSalesOrders(req, res));
// Catch-all route for frontend dashboard
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
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
            await zohoAuthService_1.zohoAuthService.getValidAccessToken();
        }
        catch (err) {
            console.warn(`[Startup Warning] Zoho OAuth token refresh on startup failed: ${err.message}`);
            console.warn(`[Startup Warning] Please check your credentials in .env file.`);
        }
    }
    else {
        console.log(`ℹ️ Please update your .env file with Zoho API Credentials.`);
    }
});
