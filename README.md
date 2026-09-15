# Zoho Books to Power BI Integration (Automatic OAuth Token Refresh)

A high-performance Node.js & TypeScript API integration service designed to connect **Zoho Books** directly with **Power BI Desktop & Power BI Service**. 

This middleware solves the challenge of expiring Zoho OAuth 2.0 access tokens by **automatically refreshing tokens in the background**, ensuring your Power BI dashboards update without manual token updates.

---

## 🌟 Key Features

* **🔄 100% Automatic OAuth Token Refresh**: Uses your `refresh_token` to request fresh `access_token`s from Zoho OAuth servers automatically before expiration.
* **📊 Power BI Ready Tables**: Exposes clean, flattened REST API endpoints optimized for Power BI ("Get Data -> Web").
* **⚡ Full Table Support**:
  * `📄 Invoices` (`/api/powerbi/invoices`)
  * `👤 Contacts` (Customers & Vendors) (`/api/powerbi/contacts`)
  * `📦 Items` (Products & Services) (`/api/powerbi/items`)
  * `💳 Customer Payments` (`/api/powerbi/payments`)
  * `🧾 Vendor Bills` (`/api/powerbi/bills`)
  * `💸 Expenses` (`/api/powerbi/expenses`)
  * `📋 Sales Orders` (`/api/powerbi/salesorders`)
* **🌐 Multi-Region Support**: Supports Zoho Data Centers worldwide (`in`, `com`, `eu`, `com.au`, `jp`, `ca`).
* **💻 Interactive Web Dashboard**: Built-in visual UI at `http://localhost:3000` to monitor connection status, force token refreshes, and test table endpoints.

---

## 🛠️ Step 1: Getting your Zoho API Credentials

1. Go to the **[Zoho API Console](https://api-console.zoho.com/)**.
2. Click **Add Client** ➔ Choose **Self Client**.
3. Copy your `Client ID` and `Client Secret`.
4. Under **Generate Code**, enter the scopes:
   ```text
   ZohoBooks.fullaccess.ALL
   ```
5. Click **Generate** and choose Time Duration (e.g. 10 mins) and Scope Description.
6. Make a `POST` request (using Postman, cURL, or terminal) to convert the code into a **Refresh Token**:
   * **US URL:** `https://accounts.zoho.com/oauth/v2/token`
   * **India URL:** `https://accounts.zoho.in/oauth/v2/token`
   * **Params (form-urlencoded):**
     * `code`: `<GENERATED_CODE>`
     * `client_id`: `<YOUR_CLIENT_ID>`
     * `client_secret`: `<YOUR_CLIENT_SECRET>`
     * `grant_type`: `authorization_code`
7. Save the `refresh_token` returned in the response (this token never expires unless revoked!).

---

## ⚙️ Step 2: Configuration (.env)

Open `.env` in this directory (`c:\Users\admin\Desktop\Zoho Integration\.env`) and fill in your credentials:

```env
PORT=3000
ZOHO_CLIENT_ID=your_client_id_here
ZOHO_CLIENT_SECRET=your_client_secret_here
ZOHO_REFRESH_TOKEN=your_refresh_token_here
ZOHO_ORGANIZATION_ID=your_organization_id_here
ZOHO_REGION=in   # Options: com, in, eu, com.au, jp, ca
```

---

## 🚀 Step 3: Start the Integration Service

Run the following commands in PowerShell/Terminal:

```bash
# 1. Install dependencies
npm install

# 2. Run in development mode
npm run dev
```

The server will start at `http://localhost:3000`.

---

## 📊 Step 4: Connecting Power BI Desktop

1. Launch **Power BI Desktop**.
2. Click **Get Data** ➔ **Web**.
3. Select **Basic** and enter your desired table endpoint:
   * **Invoices:** `http://localhost:3000/api/powerbi/invoices`
   * **Contacts:** `http://localhost:3000/api/powerbi/contacts`
   * **Items:** `http://localhost:3000/api/powerbi/items`
   * **Payments:** `http://localhost:3000/api/powerbi/payments`
   * **Bills:** `http://localhost:3000/api/powerbi/bills`
   * **Expenses:** `http://localhost:3000/api/powerbi/expenses`
4. Click **OK**. Power BI will load the clean tabular JSON data.
5. Click **Transform Data** (or Load directly) into your report!

---

## 🔁 How Automatic Token Refresh Works

1. When a request hits any `/api/powerbi/*` endpoint, the service checks if the cached OAuth `access_token` is valid.
2. If the token is expired or missing, `zohoAuthService` automatically contacts Zoho's OAuth endpoint (`https://accounts.zoho.in/oauth/v2/token`) using your `ZOHO_REFRESH_TOKEN`.
3. A fresh `access_token` is acquired, cached in memory, and attached to the Zoho API request.
4. If a 401 Unauthorized status is ever received, the service automatically performs a force-refresh retry.
5. **Result:** You never need to touch access tokens again. Power BI scheduled refreshes work seamlessly!
