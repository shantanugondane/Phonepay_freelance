# HTTPS Deployment Guide - Port 443 with Self-Signed Certificate

## 🎯 Goal
Deploy the PhonePe Procurement Portal over HTTPS port 443 using a self-signed SSL certificate.

**Note:** Self-signed certificates will show browser security warnings. Users will need to click "Advanced" → "Proceed to site" to access.

---

## 📋 Prerequisites

✅ You have:
- VDI server access (IP: 20.204.224.89)
- Port 443 open in firewall (confirmed ✅)
- Nginx installed (or will install)
- Frontend built
- Backend running with PM2

---

## 🚀 Step-by-Step HTTPS Deployment

### Step 1: Install OpenSSL (if not already installed)

```bash
# Check if openssl is installed
openssl version

# If not installed, install it
sudo apt update
sudo apt install openssl -y
```

---

### Step 2: Create SSL Certificate Directory

```bash
# Create directory for SSL certificates
sudo mkdir -p /etc/nginx/ssl

# Set proper permissions
sudo chmod 700 /etc/nginx/ssl
```

---

### Step 3: Generate Self-Signed SSL Certificate

```bash
# Generate private key and certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/phonepe-portal.key \
  -out /etc/nginx/ssl/phonepe-portal.crt

# You'll be prompted for information. Fill as follows:
# Country Name (2 letter code): IN
# State or Province Name: [Your State]
# Locality Name: [Your City]
# Organization Name: PhonePe
# Organizational Unit Name: Procurement
# Common Name (FQDN): 20.204.224.89  ← IMPORTANT: Use your server IP
# Email Address: [Your email or leave blank]
```

**Note:** For "Common Name", enter your server IP: `20.204.224.89`

---

### Step 4: Set Proper Permissions for Certificate Files

```bash
# Set ownership
sudo chown root:root /etc/nginx/ssl/phonepe-portal.key
sudo chown root:root /etc/nginx/ssl/phonepe-portal.crt

# Set permissions (private key should be readable only by root)
sudo chmod 600 /etc/nginx/ssl/phonepe-portal.key
sudo chmod 644 /etc/nginx/ssl/phonepe-portal.crt
```

---

### Step 5: Update Backend .env for HTTPS

```bash
cd /home/rohit.singh/Phonepay_freelance/backend
nano .env
```

**Update `FRONTEND_URL` to use HTTPS:**
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://shantanugondane44_db_user:YOUR_PASSWORD@cluster0.fkcvoiy.mongodb.net/phonepe_portal?retryWrites=true&w=majority
JWT_SECRET=phonepe_procurement_portal_secret_key_2024_production
FRONTEND_URL=https://20.204.224.89
```

**Save and exit:** `Ctrl+X`, then `Y`, then `Enter`

**Restart backend:**
```bash
pm2 restart phonepe-backend
```

---

### Step 6: Update Frontend .env for HTTPS

```bash
cd /home/rohit.singh/Phonepay_freelance
nano .env
```

**Update `REACT_APP_API_URL` to use HTTPS:**
```env
REACT_APP_API_URL=https://20.204.224.89/api
```

**Save and exit:** `Ctrl+X`, then `Y`, then `Enter`

**Rebuild frontend:**
```bash
npm run build
```

---

### Step 7: Configure Nginx for HTTPS

**Create or update nginx configuration:**
```bash
sudo nano /etc/nginx/sites-available/phonepe-portal
```

**Replace entire content with this HTTPS configuration:**

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

---

### Step 8: Test and Enable Nginx Configuration

```bash
# Test nginx configuration for syntax errors
sudo nginx -t

# If test passes, enable the site (if not already enabled)
sudo ln -sf /etc/nginx/sites-available/phonepe-portal /etc/nginx/sites-enabled/

# Remove default nginx site (if exists)
sudo rm -f /etc/nginx/sites-enabled/default

# Reload nginx to apply changes
sudo systemctl reload nginx

# Check nginx status
sudo systemctl status nginx
```

---

### Step 9: Verify HTTPS is Working

**1. Test HTTPS from server:**
```bash
# Test backend API through HTTPS
curl -k https://localhost/api/health

# Test from external (if possible)
curl -k https://20.204.224.89/api/health
```

**Note:** The `-k` flag ignores SSL certificate verification (needed for self-signed certs)

**2. Test in browser:**
- Open browser and go to: `https://20.204.224.89`
- You'll see a security warning (this is normal for self-signed certificates)
- Click "Advanced" → "Proceed to 20.204.224.89 (unsafe)" or similar
- The website should load with HTTPS

**3. Verify HTTPS in browser:**
- Look for the padlock icon (may show as "Not secure" or warning icon)
- Check the URL bar - it should show `https://`
- Try logging in to verify API calls work over HTTPS

---

## 🔍 Troubleshooting

### Issue: Nginx fails to start

**Check:**
```bash
# Check nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test configuration
sudo nginx -t

# Common issues:
# - Certificate file path incorrect
# - Certificate file permissions wrong
# - Syntax error in nginx config
```

### Issue: 502 Bad Gateway

**This means nginx can't reach backend:**
```bash
# Check if backend is running
pm2 status

# Check backend logs
pm2 logs phonepe-backend

# Test backend directly
curl http://localhost:5000/api/health
```

### Issue: Browser shows "Connection Refused"

**Check:**
```bash
# Verify port 443 is listening
sudo netstat -tulpn | grep 443

# Check firewall
sudo ufw status

# Verify nginx is running
sudo systemctl status nginx
```

### Issue: Mixed Content Warnings

**This happens if frontend tries to load HTTP resources over HTTPS:**
- Make sure `REACT_APP_API_URL` in frontend `.env` uses `https://`
- Rebuild frontend after changing `.env`: `npm run build`
- Check browser console for specific mixed content errors

### Issue: CORS Errors

**Check:**
- Backend `.env` has `FRONTEND_URL=https://20.204.224.89` (not `http://`)
- Restart backend after changing `.env`: `pm2 restart phonepe-backend`

---

## 📝 Quick Reference Commands

### Check Services Status
```bash
# Backend (PM2)
pm2 status
pm2 logs phonepe-backend

# Nginx
sudo systemctl status nginx
sudo nginx -t

# Check ports
sudo netstat -tulpn | grep -E ':(80|443|5000)'

# Check SSL certificate
sudo openssl x509 -in /etc/nginx/ssl/phonepe-portal.crt -text -noout
```

### Restart Services
```bash
# Restart backend
pm2 restart phonepe-backend

# Restart nginx
sudo systemctl restart nginx

# After code changes - rebuild frontend
cd /home/rohit.singh/Phonepay_freelance
npm run build
sudo systemctl reload nginx
```

### View Logs
```bash
# Backend logs
pm2 logs phonepe-backend

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## ✅ Deployment Checklist

- [ ] OpenSSL installed
- [ ] SSL certificate directory created (`/etc/nginx/ssl`)
- [ ] Self-signed certificate generated
- [ ] Certificate permissions set correctly
- [ ] Backend `.env` updated with `FRONTEND_URL=https://20.204.224.89`
- [ ] Frontend `.env` updated with `REACT_APP_API_URL=https://20.204.224.89/api`
- [ ] Frontend rebuilt (`npm run build`)
- [ ] Backend restarted (`pm2 restart phonepe-backend`)
- [ ] Nginx configured for HTTPS (port 443)
- [ ] Nginx configuration tested (`sudo nginx -t`)
- [ ] Nginx reloaded (`sudo systemctl reload nginx`)
- [ ] HTTPS accessible: `https://20.204.224.89`
- [ ] HTTP redirects to HTTPS
- [ ] API calls work over HTTPS
- [ ] Login/registration works

---

## 🎉 Success!

Once everything is set up, users can access your portal at:
- **HTTPS:** `https://20.204.224.89`
- **HTTP:** `http://20.204.224.89` (automatically redirects to HTTPS)

**Important:** Users will see a browser security warning for the self-signed certificate. They need to:
1. Click "Advanced" or "Show Details"
2. Click "Proceed to 20.204.224.89 (unsafe)" or similar
3. The site will then load normally

---

## 📞 Next Steps

1. **Inform users** about the browser security warning (it's normal for self-signed certs)
2. **Consider requesting** a proper SSL certificate from IT for production use
3. **Monitor logs** regularly: `pm2 logs` and `sudo tail -f /var/log/nginx/access.log`
4. **Set up domain name** (if possible) for better user experience
5. **Request proper SSL certificate** from IT for production (replaces self-signed cert)

---

## 🔐 Security Notes

1. **Self-signed certificates** are fine for internal/testing use but show browser warnings
2. **For production**, consider requesting a proper SSL certificate from IT
3. **Certificate expires** after 365 days - you'll need to regenerate it
4. **Keep private key secure** - never share `/etc/nginx/ssl/phonepe-portal.key`

---

**Last Updated:** HTTPS Deployment Guide for Port 443
