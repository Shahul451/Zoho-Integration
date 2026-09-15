import axios, { AxiosRequestConfig } from 'axios';
import { getEnv } from '../config/env';
import { zohoAuthService } from './zohoAuthService';
import { flattenTableData } from '../utils/flattenData';

export class ZohoBooksService {
  /**
   * Internal helper to make authenticated HTTP requests to Zoho Books API v3.
   * Auto-retries once if access token receives a 401 Unauthorized.
   */
  private async request<T = any>(
    endpoint: string,
    params: Record<string, any> = {},
    isRetry = false
  ): Promise<T> {
    const env = getEnv();

    if (!env.organizationId) {
      throw new Error('ZOHO_ORGANIZATION_ID is missing in .env file');
    }

    const token = await zohoAuthService.getValidAccessToken();
    const url = `${env.apiUrl}${endpoint}`;

    const queryParams = {
      organization_id: env.organizationId,
      ...params,
    };

    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        'Content-Type': 'application/json',
      },
      params: queryParams,
    };

    try {
      const response = await axios.get(url, config);
      return response.data;
    } catch (error: any) {
      // If 401 error occurs, force-refresh token and retry once
      if (error.response?.status === 401 && !isRetry) {
        console.warn('[ZohoBooks] ⚠️ Received 401 Unauthorized. Force refreshing access token and retrying...');
        await zohoAuthService.refreshAccessToken();
        return this.request<T>(endpoint, params, true);
      }

      const errMsg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message;
      throw new Error(`Zoho API Error (${endpoint}): ${JSON.stringify(errMsg)}`);
    }
  }

  /**
   * Fetches all records from a paginated Zoho Books endpoint.
   * Loops through pages until `has_more_page` is false.
   */
  private async fetchAllPages(
    endpoint: string,
    resourceKey: string,
    maxPages = 25
  ): Promise<any[]> {
    let allRecords: any[] = [];
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
  public async getInvoicesTable(flatten = true) {
    const rawData = await this.fetchAllPages('/invoices', 'invoices');
    return flatten ? flattenTableData(rawData) : rawData;
  }

  /**
   * Fetch Contacts Table (Customers & Vendors)
   */
  public async getContactsTable(flatten = true) {
    const rawData = await this.fetchAllPages('/contacts', 'contacts');
    return flatten ? flattenTableData(rawData) : rawData;
  }

  /**
   * Fetch Items Table (Products & Services)
   */
  public async getItemsTable(flatten = true) {
    const rawData = await this.fetchAllPages('/items', 'items');
    return flatten ? flattenTableData(rawData) : rawData;
  }

  /**
   * Fetch Customer Payments Received Table
   */
  public async getPaymentsTable(flatten = true) {
    const rawData = await this.fetchAllPages('/customerpayments', 'customerpayments');
    return flatten ? flattenTableData(rawData) : rawData;
  }

  /**
   * Fetch Vendor Bills Table
   */
  public async getBillsTable(flatten = true) {
    const rawData = await this.fetchAllPages('/bills', 'bills');
    return flatten ? flattenTableData(rawData) : rawData;
  }

  /**
   * Fetch Expenses Table
   */
  public async getExpensesTable(flatten = true) {
    const rawData = await this.fetchAllPages('/expenses', 'expenses');
    return flatten ? flattenTableData(rawData) : rawData;
  }

  /**
   * Fetch Sales Orders Table
   */
  public async getSalesOrdersTable(flatten = true) {
    const rawData = await this.fetchAllPages('/salesorders', 'salesorders');
    return flatten ? flattenTableData(rawData) : rawData;
  }
}

export const zohoBooksService = new ZohoBooksService();
