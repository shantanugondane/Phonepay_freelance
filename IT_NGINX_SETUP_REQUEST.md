# IT Support Request - Nginx & HTTPS Setup for PhonePe Procurement Portal

**Date:** 2025-02-07  
**Server:** PP-Procu-UAT  
**User:** rohit.singh  
**IP Address:** 20.204.224.89  
**Project Path:** `/home/rohit.singh/Phonepay_freelance`

---

## 📋 Request Summary

I need help setting up Nginx web server with HTTPS (port 443) for the PhonePe Procurement Portal. I don't have sudo access, so I need IT assistance to:

1. Install Nginx
2. Create SSL certificate (self-signed is acceptable)
3. Configure Nginx for HTTPS on port 443
4. Start and enable Nginx service

---

## ✅ Current Status

- ✅ Backend is running on port 5000 (verified working)
- ✅ Frontend is built and ready in `/home/rohit.singh/Phonepay_freelance/build`
- ✅ Port 443 is confirmed open in firewall
- ❌ Nginx is not installed
- ❌ SSL certificate not created
- ❌ Nginx not configured

---

## 🔧 Step-by-Step Instructions for IT

### Step 1: Install Nginx

```bash
sudo apt update
sudo apt install nginx -y
```

### Step 2: Create SSL Certificate Directory

```bash
sudo mkdir -p /etc/nginx/ssl
sudo chmod 700 /etc/nginx/ssl
```

### Step 3: Generate Self-Signed SSL Certificate

```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/phonepe-portal.key \
  -out /etc/nginx/ssl/phonepe-portal.crt
```

**When prompted, enter:**
- Country Name: `IN` (or press Enter)
- State: `Karnataka` (or press Enter)
- City: `Bangalore` (or press Enter)
- Organization: `PhonePe` (or press Enter)
- Organizational Unit: `Procurement` (or press Enter)
- **Common Name: `20.204.224.89`** ← IMPORTANT: Use server IP
- Email: (press Enter to skip)

### Step 4: Set Certificate Permissions

```bash
sudo chown root:root /etc/nginx/ssl/phonepe-portal.key
sudo chown root:root /etc/nginx/ssl/phonepe-portal.crt
sudo chmod 600 /etc/nginx/ssl/phonepe-portal.key
sudo chmod 644 /etc/nginx/ssl/phonepe-portal.crt
```

### Step 5: Create Nginx Configuration File

```bash
sudo nano /etc/nginx/sites-available/phonepe-portal
```

**Paste the following configuration:**

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name 20.204.224.89;
    
    # Redirect all HTTP requests to HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name 20.204.224.89;
    
    # SSL Certificate Configuration
    ssl_certificate /etc/nginx/ssl/phonepe-portal.crt;
    ssl_certificate_key /etc/nginx/ssl/phonepe-portal.key;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Serve React frontend
    root /home/rohit.singh/Phonepay_freelance/build;
    index index.html;
    
    # Frontend routes - serve index.html for all routes (React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy API requests to backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

**Save and exit:** `Ctrl+X`, then `Y`, then `Enter`

### Step 6: Enable Nginx Site

```bash
# Create symbolic link
sudo ln -sf /etc/nginx/sites-available/phonepe-portal /etc/nginx/sites-enabled/

# Remove default nginx site (if exists)
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t
```

**Expected output:** `nginx: configuration file /etc/nginx/nginx.conf test is successful`

### Step 7: Start and Enable Nginx

```bash
# Start nginx
sudo systemctl start nginx

# Enable nginx to start on boot
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

### Step 8: Verify HTTPS is Working

```bash
# Test from server
curl -k https://localhost/api/health

# Check if port 443 is listening
sudo netstat -tulpn | grep 443
```

---

## ✅ Verification Checklist

After setup, please verify:

- [ ] Nginx is installed: `nginx -v`
- [ ] Nginx is running: `sudo systemctl status nginx`
- [ ] SSL certificate exists: `sudo ls -la /etc/nginx/ssl/`
- [ ] Port 443 is listening: `sudo netstat -tulpn | grep 443`
- [ ] HTTPS works: `curl -k https://localhost/api/health`
- [ ] Website accessible: `https://20.204.224.89` (from browser)

---

## 📝 Important Notes

1. **Self-Signed Certificate:** The SSL certificate will be self-signed, so browsers will show a security warning. Users will need to click "Advanced" → "Proceed to site" to access. This is normal for self-signed certificates.

2. **Backend Running:** The backend is already running on port 5000 via PM2. Nginx will proxy API requests to it.

3. **Frontend Location:** The frontend build files are in `/home/rohit.singh/Phonepay_freelance/build`

4. **Port 443:** Already confirmed open in firewall by IT.

5. **User Access:** After setup, user `rohit.singh` should be able to:
   - Test: `curl -k https://localhost/api/health`
   - Access website: `https://20.204.224.89`

---

## 🐛 Troubleshooting

If there are any issues:

1. **Check Nginx logs:**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   sudo tail -f /var/log/nginx/access.log
   ```

2. **Check backend is running:**
   ```bash
   curl http://localhost:5000/api/health
   ```

3. **Verify frontend build exists:**
   ```bash
   ls -la /home/rohit.singh/Phonepay_freelance/build
   ```

---

## 📞 Contact

If you need any clarification or encounter issues, please contact:
- **Developer:** rohit.singh
- **Project:** PhonePe Procurement Portal
- **Server:** PP-Procu-UAT

---

## 🎯 Expected Result

After completion, the website should be accessible at:
- **HTTPS:** `https://20.204.224.89`
- **HTTP:** `http://20.204.224.89` (will automatically redirect to HTTPS)

Users will see a browser security warning for the self-signed certificate, which is expected and normal.

---

**Thank you for your assistance!**
