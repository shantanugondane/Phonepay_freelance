# Salesforce API Integration - Setup Guide

## ✅ What Has Been Done (Automated)

1. ✅ **Installed axios package** - For making HTTP requests to Salesforce
2. ✅ **Created Salesforce Service** (`backend/services/salesforce.js`)
   - Handles authentication with Salesforce
   - Fetches cases using the provided query endpoint
   - Transforms Salesforce data to match your app format
3. ✅ **Created Salesforce Routes** (`backend/routes/salesforce.js`)
   - `GET /api/salesforce/cases` - Get all cases (with filters)
   - `GET /api/salesforce/cases/:caseNumber` - Get single case
   - `GET /api/salesforce/test` - Test connection (Admin only)
4. ✅ **Added Route to Server** - Registered Salesforce routes in `server.js`
5. ✅ **Added Frontend API Methods** - Added `salesforceAPI` to `src/utils/api.js`

---

## 📋 What You Need to Do Manually

### Step 1: Get Salesforce Credentials from Vinoth/Team

You need to ask Vinoth or your Salesforce admin for:

1. **Instance URL** (e.g., `https://yourcompany.salesforce.com` or `https://yourcompany--sandbox.salesforce.com`)
2. **Authentication Method** - One of these:
   - **Option A: OAuth 2.0 (Username/Password Flow)** - Recommended
     - Client ID (Consumer Key)
     - Client Secret (Consumer Secret)
     - Username
     - Password
     - Security Token (if required)
   - **Option B: Connected App** - If they set up a Connected App
     - Client ID
     - Client Secret
     - Username
     - Password + Security Token

### Step 2: Add Credentials to Backend `.env` File

Open `backend/.env` and add these variables:

```env
# Salesforce Configuration
SALESFORCE_INSTANCE_URL=https://yourcompany.salesforce.com
SALESFORCE_API_VERSION=v62.0
SALESFORCE_CLIENT_ID=your_client_id_here
SALESFORCE_CLIENT_SECRET=your_client_secret_here
SALESFORCE_USERNAME=your_username@company.com
SALESFORCE_PASSWORD=your_password
SALESFORCE_SECURITY_TOKEN=your_security_token_if_needed
```

**Important Notes:**
- If your password contains special characters, they should work as-is in the .env file
- Security Token is usually required if your IP is not whitelisted
- For sandbox, the instance URL will be like: `https://yourcompany--sandbox.salesforce.com`

### Step 3: Test the Connection

1. **Start your backend server:**
   ```bash
   cd backend
   npm start
   ```

2. **Test the connection** (as Admin user):
   - Login to your portal as Admin
   - Open browser console
   - Run:
     ```javascript
     const response = await fetch('http://localhost:5000/api/salesforce/test', {
       headers: {
         'Authorization': 'Bearer ' + localStorage.getItem('phonepe_token')
       }
     });
     const data = await response.json();
     console.log(data);
     ```

   Or use Postman/Thunder Client:
   - GET `http://localhost:5000/api/salesforce/test`
   - Add header: `Authorization: Bearer YOUR_JWT_TOKEN`

3. **Expected Response (Success):**
   ```json
   {
     "success": true,
     "message": "Salesforce connection successful",
     "instanceUrl": "https://yourcompany.salesforce.com",
     "totalCases": 150,
     "sampleCases": [...]
   }
   ```

4. **If you get errors:**
   - Check that all credentials are correct
   - Verify the instance URL is correct
   - Check if Security Token is needed
   - Verify your IP is whitelisted in Salesforce (or use Security Token)

---

## 🔧 Troubleshooting

### Error: "Failed to authenticate with Salesforce"

**Possible causes:**
1. Wrong credentials (username/password)
2. Missing Security Token (if IP not whitelisted)
3. Wrong Instance URL
4. Client ID/Secret incorrect

**Solution:**
- Double-check all credentials in `.env`
- Ask Vinoth to verify the credentials
- Try getting a new Security Token from Salesforce

### Error: "IP not whitelisted"

**Solution:**
- Add your IP to Salesforce Network Access settings
- OR use Security Token (append to password)

### Error: "Invalid grant_type" or OAuth errors

**Solution:**
- Verify Client ID and Client Secret are correct
- Check if Connected App is set up correctly in Salesforce
- Verify the OAuth flow is enabled in Salesforce

---

## 📊 API Endpoints Available

### 1. Get All Cases
```
GET /api/salesforce/cases
```

**Query Parameters (optional):**
- `status` - Filter by status
- `caseNumber` - Filter by case number
- `requestorName` - Filter by requestor name
- `vendorName` - Filter by vendor name

**Example:**
```
GET /api/salesforce/cases?status=Open&vendorName=ABC Corp
```

**Response:**
```json
{
  "success": true,
  "cases": [
    {
      "caseNumber": "PSR-12590",
      "subject": "Contract Renewal",
      "status": "Open",
      "vendorName": "ABC Corp",
      "grandTotal": 5000000,
      "budget": {
        "amount": 5000000,
        "currency": "INR",
        "display": "INR 5.0M"
      },
      ...
    }
  ],
  "totalSize": 150,
  "count": 10
}
```

### 2. Get Single Case
```
GET /api/salesforce/cases/PSR-12590
```

### 3. Test Connection
```
GET /api/salesforce/test
```
(Admin only)

---

## 🎯 Next Steps After Setup

Once the connection is working:

1. **Integrate into Frontend:**
   - Add Salesforce cases to Procurement Console
   - Add Salesforce cases to Requestor Console
   - Create a new "Salesforce Cases" tab or section

2. **Display Salesforce Data:**
   - Show cases in tables
   - Add filters and search
   - Show contract expiry dates
   - Display vendor information

3. **Sync Data (Optional):**
   - Sync Salesforce cases to MongoDB
   - Link Salesforce cases with internal PSRs
   - Keep data in sync

---

## 📞 Need Help?

If you encounter issues:
1. Check the error message in backend console
2. Verify all credentials are correct
3. Contact Vinoth for Salesforce access issues
4. Check Salesforce API documentation: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/

---

**Last Updated:** Salesforce Integration Setup Guide
