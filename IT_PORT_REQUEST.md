# Request for Port Access - PhonePe Procurement Portal

**Subject: Port Access Request for PhonePe Procurement Portal Deployment**

---

Dear IT Team,

We are deploying the PhonePe Procurement Portal application on the VDI server (PP-Procu-UAT) and need assistance with network port configuration.

## Application Details

- **Server:** PP-Procu-UAT (VDI Server)
- **Server IP:** 20.204.144.197
- **Application:** PhonePe Procurement Portal (Internal Web Application)

## Port Requirements

Our application requires the following ports to be accessible:

1. **Frontend Web Server:** Port 3000 or 8080 (preferred: 8080)
   - Purpose: Serves the React web application to users
   - Protocol: HTTP

2. **Backend API Server:** Port 5000
   - Purpose: REST API endpoints for the application
   - Protocol: HTTP
   - Note: Can be accessed only from frontend server (localhost) if needed

## Request

Could you please:

1. **Confirm which ports are currently open/available** for web traffic on this server?
   - Common ports: 80, 443, 8080, 3000, 5000

2. **If ports need to be opened**, could you whitelist/open:
   - **Port 8080** (or 3000) for frontend access
   - **Port 5000** for backend API (if external access needed)

3. **Or suggest an alternative port** that is already open and we can configure our application to use it.

## Current Status

- ✅ Application is built and running on the server
- ✅ Backend API is functional on port 5000
- ✅ Frontend is configured to run on port 8080
- ❌ External access is currently blocked by firewall

## Access Requirements

- **Internal users** need to access the portal via web browser
- **URL format:** `http://20.204.144.197:PORT` (where PORT is the approved port)

## Alternative Solutions (if direct port access is not possible)

If direct port access cannot be provided, we are open to:
- Using a reverse proxy
- Setting up through existing web server infrastructure
- Using a different deployment approach as per IT policies

---

**Contact Information:**
- **Developer:** [Your Name]
- **Project:** PhonePe Procurement Portal
- **Server:** PP-Procu-UAT (rohit.singh@PP-Procu-UAT)

Thank you for your assistance!

---

**Quick Summary:**
- Need port 8080 (or alternative) opened for web application
- Server IP: 20.204.144.197
- Application is ready, just needs network access
