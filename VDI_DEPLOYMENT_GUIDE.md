# VDI Server Deployment Guide - Making Website Accessible

## 🎯 Goal
Make your PhonePe Procurement Portal accessible to users via a public URL (like `http://your-server-ip` or `http://your-domain.com`)

---

## 📋 Prerequisites

✅ You have:
- VDI server access (IP: 20.204.224.89)
- Node.js installed
- MongoDB Atlas set up
- Code cloned from GitHub

---

## 🚀 Step-by-Step Deployment

### Step 1: Get Server Information

**Find your server's public IP or domain:**

```bash
# Check public IP
curl ifconfig.me
# or
hostname -I
```

**Note:** You mentioned the server IP is `20.204.224.89`. You'll need to confirm:
- Is this the public IP that external users can access?
- Do you have a domain name? (e.g., `procurement.phonepe.com`)
- Are ports 80 (HTTP) and 443 (HTTPS) open in the firewall?

---

### Step 2: Install Nginx (Reverse Proxy & Web Server)

**Nginx will:**
- Serve the React frontend (static files)
- Proxy API requests to the backend
- Handle SSL/HTTPS (if you have a certificate)

```bash
# Install nginx
sudo apt update
sudo apt install nginx -y

# Start nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

---

### Step 3: Build Frontend for Production

**Build the React app:**

```bash
cd /home/rohit.singh/Phonepay_freelance

# Install dependencies (if not done)
npm install

# Create production build
npm run build
```

This creates a `build/` folder with optimized static files.

**Expected output:**
```
Creating an optimized production build...
Compiled successfully!
```

---

### Step 4: Configure Backend for Production

**Update backend `.env` file:**

```bash
cd /home/rohit.singh/Phonepay_freelance/backend
nano .env
```

**Update with your public URL:**

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://shantanugondane44_db_user:YOUR_PASSWORD@cluster0.fkcvoiy.mongodb.net/phonepe_portal?retryWrites=true&w=majority
JWT_SECRET=phonepe_procurement_portal_secret_key_2024_production
FRONTEND_URL=http://20.204.224.89
# Or if you have a domain:
# FRONTEND_URL=http://procurement.phonepe.com
```

**Save and exit:** `Ctrl+X`, then `Y`, then `Enter`

---

### Step 5: Configure Nginx

**Create nginx configuration:**

```bash
sudo nano /etc/nginx/sites-available/phonepe-portal
```

**Add this configuration:**

```nginx
server {
    listen 80;
    server_name 20.204.224.89;  # Replace with your domain if you have one
    
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
}
```

**Save and exit:** `Ctrl+X`, then `Y`, then `Enter`

**Enable the site:**

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/phonepe-portal /etc/nginx/sites-enabled/

# Remove default nginx site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

---

### Step 6: Set Up Process Manager (PM2)

**PM2 keeps your backend running even if you disconnect:**

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start backend with PM2
cd /home/rohit.singh/Phonepay_freelance/backend
pm2 start server.js --name phonepe-backend

# Save PM2 configuration
pm2 save

# Set PM2 to start on server reboot
pm2 startup
# Follow the command it outputs (usually something like: sudo env PATH=... pm2 startup systemd -u rohit.singh --hp /home/rohit.singh)

# Check status
pm2 status
pm2 logs phonepe-backend
```

---

### Step 7: Configure Firewall

**Allow HTTP and HTTPS traffic:**

```bash
# Check if ufw is installed
sudo ufw status

# Allow HTTP (port 80)
sudo ufw allow 80/tcp

# Allow HTTPS (port 443) - if you set up SSL later
sudo ufw allow 443/tcp

# Allow backend port (if needed for direct access)
sudo ufw allow 5000/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

### Step 8: Update Frontend Environment Variable

**Create `.env` file in root directory for frontend:**

```bash
cd /home/rohit.singh/Phonepay_freelance
nano .env
```

**Add:**

```env
REACT_APP_API_URL=http://20.204.224.89/api
# Or if you have a domain:
# REACT_APP_API_URL=http://procurement.phonepe.com/api
```

**Important:** After updating `.env`, you need to rebuild:

```bash
npm run build
sudo systemctl reload nginx
```

---

### Step 9: Test the Deployment

**1. Test backend directly:**
```bash
curl http://localhost:5000/api/health
```

**2. Test through nginx:**
```bash
curl http://20.204.224.89/api/health
```

**3. Test frontend:**
- Open browser: `http://20.204.224.89`
- Should see the PhonePe Procurement Portal
- Try logging in

---

## 🔒 Optional: Set Up HTTPS (SSL Certificate)

**If you have a domain name, set up Let's Encrypt SSL:**

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d procurement.phonepe.com

# Follow prompts
# Certbot will automatically update nginx config
```

**After SSL setup, update:**
- Backend `.env`: `FRONTEND_URL=https://your-domain.com`
- Frontend `.env`: `REACT_APP_API_URL=https://your-domain.com/api`
- Rebuild frontend: `npm run build`

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

## 🐛 Troubleshooting

### Issue: Can't access website from outside

**Check:**
1. Firewall allows port 80: `sudo ufw status`
2. Nginx is running: `sudo systemctl status nginx`
3. Backend is running: `pm2 status`
4. Server IP is correct: `curl ifconfig.me`

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

### Issue: Frontend shows but API calls fail

**Check:**
1. Backend `.env` has correct `FRONTEND_URL`
2. Frontend `.env` has correct `REACT_APP_API_URL`
3. Rebuild frontend after `.env` changes: `npm run build`
4. Check browser console for CORS errors

### Issue: React Router routes don't work (404)

**Fix:** Make sure nginx config has:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Then reload: `sudo systemctl reload nginx`

---

## 📊 Architecture Overview

```
Internet Users
    ↓
[Port 80/443] → Nginx (Reverse Proxy)
    ↓
    ├─→ /api/* → Backend (Node.js on port 5000)
    └─→ /* → Frontend (React build files)
```

---

## ✅ Deployment Checklist

- [ ] Nginx installed and running
- [ ] Frontend built (`npm run build`)
- [ ] Backend `.env` configured with public URL
- [ ] Frontend `.env` configured with API URL
- [ ] Backend running with PM2
- [ ] Nginx configured and reloaded
- [ ] Firewall allows port 80 (and 443 if using HTTPS)
- [ ] Test: `curl http://YOUR_IP/api/health` works
- [ ] Test: Website accessible from browser
- [ ] Test: Login/registration works
- [ ] PM2 startup configured (survives reboots)

---

## 🎉 Success!

Once everything is set up, users can access your portal at:
- **HTTP:** `http://20.204.224.89`
- **HTTPS (if configured):** `https://your-domain.com`

Share this URL with your team!

---

## 📞 Next Steps

1. **Monitor logs** regularly: `pm2 logs` and `sudo tail -f /var/log/nginx/access.log`
2. **Set up backups** for MongoDB Atlas
3. **Configure domain** (if you have one) for better URLs
4. **Set up SSL** for secure HTTPS access
5. **Monitor server resources:** `htop` or `pm2 monit`

---

**Last Updated:** VDI Server Deployment Guide
