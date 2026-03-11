# How to Get Salesforce Security Token

## Option 1: From Vinoth (Salesforce Admin) - Recommended ✅

**Ask Vinoth to provide:**
- Security Token for the `integrationuser@phonepe.com` account
- They can retrieve it from Salesforce or reset it if needed

**What to tell Vinoth:**
> "Hi Vinoth, I need the Salesforce Security Token for the integration user account (integrationuser@phonepe.com) to complete the API integration setup. Can you please provide it or reset it for me?"

---

## Option 2: Get It Yourself (If You Have Salesforce Access)

If you have login access to the Salesforce account, follow these steps:

### Steps to Get Security Token:

1. **Login to Salesforce:**
   - Go to: `https://phonepeprivatelimited2--uat1.sandbox.my.salesforce.com`
   - Login with: `integrationuser@phonepe.com` and password

2. **Navigate to Settings:**
   - Click on your **profile picture/avatar** (top right)
   - Click **Settings** (or go to Setup)

3. **Go to Personal Information:**
   - In the left sidebar, click **My Personal Information**
   - Click **Reset My Security Token**

4. **Get the Token:**
   - Click **Reset Security Token** button
   - Salesforce will **email the security token** to the email address associated with the account
   - Check the email inbox for `integrationuser@phonepe.com`
   - The email will contain the security token (usually a long alphanumeric string)

5. **Add to .env file:**
   ```env
   SALESFORCE_SECURITY_TOKEN=your_token_here
   ```

---

## Important Notes:

- **Security Token is required if:**
  - Your IP address is NOT whitelisted in Salesforce
  - You're accessing Salesforce from outside the trusted network

- **Security Token is NOT required if:**
  - Your IP is whitelisted in Salesforce Network Access settings
  - You're accessing from a trusted network

- **If authentication fails without token:**
  - Try adding the Security Token first
  - OR ask Vinoth to whitelist your server's IP address

---

## Quick Test:

After adding the Security Token to `.env`, restart your backend server and test:

```bash
# Test Salesforce authentication
curl -X GET "http://localhost:5000/api/salesforce/test" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## What to Do Now:

1. **Contact Vinoth** and ask for the Security Token
2. **OR** if you have access, follow Option 2 above
3. **Add the token** to `backend/.env`:
   ```env
   SALESFORCE_SECURITY_TOKEN=your_security_token_here
   ```
4. **Restart** your backend server
5. **Test** the Salesforce connection again

---

**Note:** The Security Token is sensitive information - treat it like a password and keep it secure!
