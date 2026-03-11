# Email 2: Salesforce Integration - Information Request

**Subject:** PhonePe Procurement Portal - Salesforce Integration Setup

---

**To:** Vinoth  
**CC:** [Project Manager / Team Lead]  
**From:** rohit.singh

---

Hi Vinoth,

I hope you're doing well.

I'm reaching out regarding the Salesforce integration that was recently added to the PhonePe Procurement Portal. I need some information from you to complete the setup.

## 📋 Current Status

The Salesforce integration code has been successfully added to the application:
- ✅ Salesforce service layer implemented (read-only - fetching cases only)
- ✅ API routes configured (GET endpoints only)
- ✅ Frontend API methods added
- ✅ Code is ready for configuration

**Important Notes:**
- This integration is **read-only** - we will only be **fetching/reading** case data from Salesforce. We will not be creating, updating, or deleting any records in Salesforce.
- The Salesforce data will be displayed in the **Procurement Console** (accessible to Procurement Team and Admin roles only)
- Requestors will **not** have access to Salesforce data

## 🔑 Information Needed

To complete the Salesforce integration setup, I need the following credentials and configuration details:

### 1. Salesforce Instance URL
- Production or Sandbox instance URL
- Example format: `https://yourcompany.salesforce.com` or `https://yourcompany--sandbox.salesforce.com`

### 2. Salesforce Credentials
- **Instance URL** (e.g., `https://yourcompany.salesforce.com` or `https://yourcompany--sandbox.salesforce.com`)
- **Username** (Salesforce user account with read access to Cases)
- **Password** (Salesforce user password)
- **Security Token** (if required for API access)

**Note:** Please let me know which authentication method you prefer to use for Salesforce integration. The code can be adapted based on your requirements.

### 3. Salesforce Objects/APIs
- We will be fetching **Case** records from Salesforce
- The integration will query cases with fields like: CaseNumber, Subject, Status, Buyer Name, Requestor Name, Vendor Name, Contract Status, Contract Expiry, etc.
- **Read-only access** - we only need permission to read/query cases, not to create or update them
- The data will be displayed in the **Procurement Console** for the Procurement Team to view

### 4. Environment
- Is this for Production or Sandbox/UAT environment?
- Any specific Salesforce org details I should be aware of?

## 📝 Configuration Details

Once I receive the credentials, I'll need to update the backend `.env` file with:

```env
SALESFORCE_INSTANCE_URL=https://your-instance.salesforce.com
SALESFORCE_USERNAME=your_username
SALESFORCE_PASSWORD=your_password
SALESFORCE_SECURITY_TOKEN=your_security_token (if required)
```

**Note:** Additional credentials may be needed depending on the authentication method you choose.

## 🔒 Security Note

For security purposes, please share the credentials through a secure channel (encrypted email, secure file sharing, or password manager). The credentials will be stored securely in the `.env` file, which is not committed to the repository.

## 📚 Documentation

I've prepared a detailed setup guide in `SALESFORCE_SETUP.md` that includes:
- Step-by-step configuration instructions
- How to obtain Salesforce credentials
- Testing procedures
- Troubleshooting guide

## ❓ Questions

1. **Authentication Method:** Which authentication method should we use for Salesforce? (e.g., Username/Password with Security Token, API Key, or another method)
2. **Read Permissions:** The Salesforce user account needs **read-only** access to Case records. Can you confirm the user has the necessary permissions?
3. Is there a timeline for when this integration needs to be live?
4. Do you have the necessary Salesforce credentials ready?

## 🎯 Next Steps

Once I receive the Salesforce credentials and configuration details, I will:
1. Update the backend environment variables with the credentials
2. Test the Salesforce connection
3. Verify the integration is working correctly
4. Integrate Salesforce cases into the Procurement Console UI
5. Deploy to the VDI server (PP-Procu-UAT)

**Where it will be used:**
- The Salesforce cases will be displayed in the **Procurement Console** dashboard
- Only users with **Procurement Team** or **Admin** roles will be able to view this data
- Requestors will not have access to Salesforce data

Please let me know if you need any clarification or if there's anything else I should know about the Salesforce integration requirements.

Thank you for your assistance!

Best regards,  
**rohit.singh**  
PhonePe Procurement Portal - Development Team

---

**Attachments:**
- `SALESFORCE_SETUP.md` (Salesforce integration setup guide)
