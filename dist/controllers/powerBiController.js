"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.powerBiController = exports.PowerBiController = void 0;
const zohoBooksService_1 = require("../services/zohoBooksService");
const zohoAuthService_1 = require("../services/zohoAuthService");
const env_1 = require("../config/env");
class PowerBiController {
    /**
     * Health check and OAuth token status endpoint
     */
    async getStatus(req, res) {
        try {
            const env = (0, env_1.getEnv)();
            const tokenStatus = zohoAuthService_1.zohoAuthService.getTokenStatus();
            res.json({
                status: 'online',
                service: 'Zoho Books to Power BI Integration',
                region: env.region,
                organizationId: env.organizationId ? '***' + env.organizationId.slice(-4) : 'Not configured',
                credentialsConfigured: !!(env.clientId && env.clientSecret && env.refreshToken && env.organizationId),
                tokenStatus,
                availableTables: [
                    '/api/powerbi/invoices',
                    '/api/powerbi/contacts',
                    '/api/powerbi/items',
                    '/api/powerbi/payments',
                    '/api/powerbi/bills',
                    '/api/powerbi/expenses',
                    '/api/powerbi/salesorders',
                ],
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * Force refresh OAuth access token
     */
    async refreshToken(req, res) {
        try {
            const newToken = await zohoAuthService_1.zohoAuthService.refreshAccessToken();
            res.json({
                message: 'Access token refreshed successfully',
                status: zohoAuthService_1.zohoAuthService.getTokenStatus(),
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * Power BI Endpoint: Invoices Table
     */
    async getInvoices(req, res) {
        try {
            const flatten = req.query.flatten !== 'false';
            const data = await zohoBooksService_1.zohoBooksService.getInvoicesTable(flatten);
            res.json(data);
        }
        catch (error) {
            console.error('[PowerBI Controller] Error fetching invoices:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * Power BI Endpoint: Contacts Table
     */
    async getContacts(req, res) {
        try {
            const flatten = req.query.flatten !== 'false';
            const data = await zohoBooksService_1.zohoBooksService.getContactsTable(flatten);
            res.json(data);
        }
        catch (error) {
            console.error('[PowerBI Controller] Error fetching contacts:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * Power BI Endpoint: Items Table
     */
    async getItems(req, res) {
        try {
            const flatten = req.query.flatten !== 'false';
            const data = await zohoBooksService_1.zohoBooksService.getItemsTable(flatten);
            res.json(data);
        }
        catch (error) {
            console.error('[PowerBI Controller] Error fetching items:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * Power BI Endpoint: Customer Payments Table
     */
    async getPayments(req, res) {
        try {
            const flatten = req.query.flatten !== 'false';
            const data = await zohoBooksService_1.zohoBooksService.getPaymentsTable(flatten);
            res.json(data);
        }
        catch (error) {
            console.error('[PowerBI Controller] Error fetching payments:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * Power BI Endpoint: Vendor Bills Table
     */
    async getBills(req, res) {
        try {
            const flatten = req.query.flatten !== 'false';
            const data = await zohoBooksService_1.zohoBooksService.getBillsTable(flatten);
            res.json(data);
        }
        catch (error) {
            console.error('[PowerBI Controller] Error fetching bills:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * Power BI Endpoint: Expenses Table
     */
    async getExpenses(req, res) {
        try {
            const flatten = req.query.flatten !== 'false';
            const data = await zohoBooksService_1.zohoBooksService.getExpensesTable(flatten);
            res.json(data);
        }
        catch (error) {
            console.error('[PowerBI Controller] Error fetching expenses:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * Power BI Endpoint: Sales Orders Table
     */
    async getSalesOrders(req, res) {
        try {
            const flatten = req.query.flatten !== 'false';
            const data = await zohoBooksService_1.zohoBooksService.getSalesOrdersTable(flatten);
            res.json(data);
        }
        catch (error) {
            console.error('[PowerBI Controller] Error fetching sales orders:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
}
exports.PowerBiController = PowerBiController;
exports.powerBiController = new PowerBiController();
