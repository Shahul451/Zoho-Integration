import { Request, Response } from 'express';
import { zohoBooksService } from '../services/zohoBooksService';
import { zohoAuthService } from '../services/zohoAuthService';
import { getEnv } from '../config/env';

export class PowerBiController {
  /**
   * Health check and OAuth token status endpoint
   */
  public async getStatus(req: Request, res: Response) {
    try {
      const env = getEnv();
      const tokenStatus = zohoAuthService.getTokenStatus();

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
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Force refresh OAuth access token
   */
  public async refreshToken(req: Request, res: Response) {
    try {
      const newToken = await zohoAuthService.refreshAccessToken();
      res.json({
        message: 'Access token refreshed successfully',
        status: zohoAuthService.getTokenStatus(),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Power BI Endpoint: Invoices Table
   */
  public async getInvoices(req: Request, res: Response) {
    try {
      const flatten = req.query.flatten !== 'false';
      const data = await zohoBooksService.getInvoicesTable(flatten);
      res.json(data);
    } catch (error: any) {
      console.error('[PowerBI Controller] Error fetching invoices:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Power BI Endpoint: Contacts Table
   */
  public async getContacts(req: Request, res: Response) {
    try {
      const flatten = req.query.flatten !== 'false';
      const data = await zohoBooksService.getContactsTable(flatten);
      res.json(data);
    } catch (error: any) {
      console.error('[PowerBI Controller] Error fetching contacts:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Power BI Endpoint: Items Table
   */
  public async getItems(req: Request, res: Response) {
    try {
      const flatten = req.query.flatten !== 'false';
      const data = await zohoBooksService.getItemsTable(flatten);
      res.json(data);
    } catch (error: any) {
      console.error('[PowerBI Controller] Error fetching items:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Power BI Endpoint: Customer Payments Table
   */
  public async getPayments(req: Request, res: Response) {
    try {
      const flatten = req.query.flatten !== 'false';
      const data = await zohoBooksService.getPaymentsTable(flatten);
      res.json(data);
    } catch (error: any) {
      console.error('[PowerBI Controller] Error fetching payments:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Power BI Endpoint: Vendor Bills Table
   */
  public async getBills(req: Request, res: Response) {
    try {
      const flatten = req.query.flatten !== 'false';
      const data = await zohoBooksService.getBillsTable(flatten);
      res.json(data);
    } catch (error: any) {
      console.error('[PowerBI Controller] Error fetching bills:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Power BI Endpoint: Expenses Table
   */
  public async getExpenses(req: Request, res: Response) {
    try {
      const flatten = req.query.flatten !== 'false';
      const data = await zohoBooksService.getExpensesTable(flatten);
      res.json(data);
    } catch (error: any) {
      console.error('[PowerBI Controller] Error fetching expenses:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Power BI Endpoint: Sales Orders Table
   */
  public async getSalesOrders(req: Request, res: Response) {
    try {
      const flatten = req.query.flatten !== 'false';
      const data = await zohoBooksService.getSalesOrdersTable(flatten);
      res.json(data);
    } catch (error: any) {
      console.error('[PowerBI Controller] Error fetching sales orders:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
}

export const powerBiController = new PowerBiController();
