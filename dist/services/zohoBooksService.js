"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zohoBooksService = exports.ZohoBooksService = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const zohoAuthService_1 = require("./zohoAuthService");
const flattenData_1 = require("../utils/flattenData");
class ZohoBooksService {
    /**
     * Internal helper to make authenticated HTTP requests to Zoho Books API v3.
     * Auto-retries once if access token receives a 401 Unauthorized.
     */
    async request(endpoint, params = {}, isRetry = false) {
        const env = (0, env_1.getEnv)();
        if (!env.organizationId) {
            throw new Error('ZOHO_ORGANIZATION_ID is missing in .env file');
        }
        const token = await zohoAuthService_1.zohoAuthService.getValidAccessToken();
        const url = `${env.apiUrl}${endpoint}`;
        const queryParams = {
            organization_id: env.organizationId,
            ...params,
        };
        const config = {
            headers: {
                Authorization: `Zoho-oauthtoken ${token}`,
                'Content-Type': 'application/json',
            },
            params: queryParams,
        };
        try {
            const response = await axios_1.default.get(url, config);
            return response.data;
        }
        catch (error) {
            // If 401 error occurs, force-refresh token and retry once
            if (error.response?.status === 401 && !isRetry) {
                console.warn('[ZohoBooks] ⚠️ Received 401 Unauthorized. Force refreshing access token and retrying...');
                await zohoAuthService_1.zohoAuthService.refreshAccessToken();
                return this.request(endpoint, params, true);
            }
            const errMsg = error.response?.data?.message ||
                error.response?.data ||
                error.message;
            throw new Error(`Zoho API Error (${endpoint}): ${JSON.stringify(errMsg)}`);
        }
    }
    /**
     * Fetches all records from a paginated Zoho Books endpoint.
     * Loops through pages until `has_more_page` is false.
     */
    async fetchAllPages(endpoint, resourceKey, maxPages = 25) {
        let allRecords = [];
        let page = 1;
        let hasMore = true;
        while (hasMore && page <= maxPages) {
            const response = await this.request(endpoint, { page, per_page: 200 });
            const records = response[resourceKey] || [];
            allRecords = allRecords.concat(records);
            const pageContext = response.page_context || {};
            hasMore = pageContext.has_more_page ?? false;
            page++;
        }
        return allRecords;
    }
    /**
     * Fetch Invoices Table
     */
    async getInvoicesTable(flatten = true) {
        const rawData = await this.fetchAllPages('/invoices', 'invoices');
        return flatten ? (0, flattenData_1.flattenTableData)(rawData) : rawData;
    }
    /**
     * Fetch Contacts Table (Customers & Vendors)
     */
    async getContactsTable(flatten = true) {
        const rawData = await this.fetchAllPages('/contacts', 'contacts');
        return flatten ? (0, flattenData_1.flattenTableData)(rawData) : rawData;
    }
    /**
     * Fetch Items Table (Products & Services)
     */
    async getItemsTable(flatten = true) {
        const rawData = await this.fetchAllPages('/items', 'items');
        return flatten ? (0, flattenData_1.flattenTableData)(rawData) : rawData;
    }
    /**
     * Fetch Customer Payments Received Table
     */
    async getPaymentsTable(flatten = true) {
        const rawData = await this.fetchAllPages('/customerpayments', 'customerpayments');
        return flatten ? (0, flattenData_1.flattenTableData)(rawData) : rawData;
    }
    /**
     * Fetch Vendor Bills Table
     */
    async getBillsTable(flatten = true) {
        const rawData = await this.fetchAllPages('/bills', 'bills');
        return flatten ? (0, flattenData_1.flattenTableData)(rawData) : rawData;
    }
    /**
     * Fetch Expenses Table
     */
    async getExpensesTable(flatten = true) {
        const rawData = await this.fetchAllPages('/expenses', 'expenses');
        return flatten ? (0, flattenData_1.flattenTableData)(rawData) : rawData;
    }
    /**
     * Fetch Sales Orders Table
     */
    async getSalesOrdersTable(flatten = true) {
        const rawData = await this.fetchAllPages('/salesorders', 'salesorders');
        return flatten ? (0, flattenData_1.flattenTableData)(rawData) : rawData;
    }
}
exports.ZohoBooksService = ZohoBooksService;
exports.zohoBooksService = new ZohoBooksService();
