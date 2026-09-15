"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zohoAuthService = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
class ZohoAuthService {
    accessToken = null;
    expiresAt = 0; // Timestamp in ms
    isRefreshing = null;
    /**
     * Retrieves a valid access token.
     * Automatically refreshes the token using the refresh_token if expired or missing.
     */
    async getValidAccessToken() {
        const now = Date.now();
        // Check if current token is still valid (with a 60 second safety buffer)
        if (this.accessToken && this.expiresAt > now + 60000) {
            return this.accessToken;
        }
        // Prevent simultaneous multiple refresh requests
        if (this.isRefreshing) {
            return this.isRefreshing;
        }
        this.isRefreshing = this.refreshAccessToken();
        try {
            const token = await this.isRefreshing;
            return token;
        }
        finally {
            this.isRefreshing = null;
        }
    }
    /**
     * Performs the OAuth refresh_token flow with Zoho OAuth Server
     */
    async refreshAccessToken() {
        const env = (0, env_1.getEnv)();
        if (!env.clientId || !env.clientSecret || !env.refreshToken) {
            throw new Error('Missing Zoho OAuth credentials in .env file (ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN)');
        }
        const tokenEndpoint = `${env.authUrl}/oauth/v2/token`;
        console.log(`[ZohoAuth] 🔄 Requesting fresh access token from ${tokenEndpoint}...`);
        try {
            const params = new URLSearchParams({
                refresh_token: env.refreshToken,
                client_id: env.clientId,
                client_secret: env.clientSecret,
                grant_type: 'refresh_token',
            });
            const response = await axios_1.default.post(tokenEndpoint, params.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            const data = response.data;
            if (data.error) {
                throw new Error(`Zoho OAuth Error: ${data.error}`);
            }
            if (!data.access_token) {
                throw new Error('No access_token returned by Zoho OAuth endpoint');
            }
            this.accessToken = data.access_token;
            // expires_in is in seconds (default 3600 = 1 hour)
            const expiresInMs = (data.expires_in || 3600) * 1000;
            this.expiresAt = Date.now() + expiresInMs;
            console.log(`[ZohoAuth] ✅ Access Token refreshed successfully! Expires in ${data.expires_in || 3600} seconds.`);
            return data.access_token;
        }
        catch (error) {
            const errorMessage = error.response?.data?.error || error.response?.data || error.message;
            console.error('[ZohoAuth] ❌ Failed to refresh access token:', errorMessage);
            throw new Error(`Zoho Token Refresh Failed: ${JSON.stringify(errorMessage)}`);
        }
    }
    /**
     * Returns current token diagnostic status
     */
    getTokenStatus() {
        const now = Date.now();
        const isValid = !!this.accessToken && this.expiresAt > now;
        const remainingSeconds = isValid
            ? Math.floor((this.expiresAt - now) / 1000)
            : 0;
        return {
            hasToken: !!this.accessToken,
            isValid,
            expiresAt: this.expiresAt ? new Date(this.expiresAt).toISOString() : null,
            remainingSeconds,
        };
    }
}
exports.zohoAuthService = new ZohoAuthService();
