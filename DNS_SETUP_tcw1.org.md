# 🌐 Cloudflare DNS Setup for tcw1.org

**Complete DNS configuration guide for your TCW1 app**

---

## ✅ DNS Records to Add in Cloudflare

Login to: **https://dash.cloudflare.com** > Select **tcw1.org** > Click **DNS** tab

### Add These 5 Records:

#### **Record 1: Root Domain**
```
Type:     CNAME
Name:     @ (or tcw1.org)
Content:  tcw1-frontend.azurewebsites.net
TTL:      Auto
Proxy:    DNS only (gray cloud) ⚠️
```

#### **Record 2: WWW Subdomain**
```
Type:     CNAME
Name:     www
Content:  tcw1-frontend.azurewebsites.net
TTL:      Auto
Proxy:    DNS only (gray cloud) ⚠️
```

#### **Record 3: API Subdomain** ⭐ IMPORTANT
```
Type:     CNAME
Name:     api
Content:  tcw1-backend.azurewebsites.net
TTL:      Auto
Proxy:    DNS only (gray cloud) ⚠️
```

#### **Record 4: Email MX Record**
```
Type:     MX
Name:     @ (or tcw1.org)
Content:  tcw1-org.mail.protection.outlook.com
Priority: 0
TTL:      Auto
```

#### **Record 5: SPF Record** (Email Authentication)
```
Type:     TXT
Name:     @ (or tcw1.org)
Content:  v=spf1 include:spf.protection.outlook.com ~all
TTL:      Auto
```

---

## 📋 DNS Records Summary Table

| Type | Name | Content | TTL | Proxy | Priority |
|------|------|---------|-----|-------|----------|
| CNAME | @ | tcw1-frontend.azurewebsites.net | Auto | DNS only | - |
| CNAME | www | tcw1-frontend.azurewebsites.net | Auto | DNS only | - |
| CNAME | api | tcw1-backend.azurewebsites.net | Auto | DNS only | - |
| MX | @ | tcw1-org.mail.protection.outlook.com | Auto | - | 0 |
| TXT | @ | v=spf1 include:spf.protection.outlook.com ~all | Auto | - | - |

---

## 🔧 Step-by-Step Instructions

### 1. Access Cloudflare
- Go to https://dash.cloudflare.com
- Select **tcw1.org** domain
- Click **DNS** in left menu

### 2. Add Root Domain (tcw1.org)
```
Click "+ Add record"
Type: CNAME
Name: @
Target: tcw1-frontend.azurewebsites.net
TTL: Auto
Proxy: Click gray cloud (DNS only)
Save
```

### 3. Add WWW Record
```
+ Add record
Type: CNAME
Name: www
Target: tcw1-frontend.azurewebsites.net
TTL: Auto
Proxy: DNS only
Save
```

### 4. Add API Record ⭐
```
+ Add record
Type: CNAME
Name: api
Target: tcw1-backend.azurewebsites.net
TTL: Auto
Proxy: DNS only
Save
```

### 5. Add Email MX Record
```
+ Add record
Type: MX
Name: @
Mail server: tcw1-org.mail.protection.outlook.com
Priority: 0
Save
```

### 6. Add SPF TXT Record
```
+ Add record
Type: TXT
Name: @
Content: v=spf1 include:spf.protection.outlook.com ~all
Save
```

---

## ✅ Verification Commands

After adding records, verify with these commands:

```bash
# Check root domain
nslookup tcw1.org

# Check API subdomain
nslookup api.tcw1.org

# Check WWW subdomain
nslookup www.tcw1.org

# Check MX record
nslookup -q=MX tcw1.org

# Check SPF record
nslookup -q=TXT tcw1.org

# Check DNS propagation globally
# Visit: https://dnschecker.org
# Enter: tcw1.org
```

---

## 🔒 Cloudflare SSL/TLS Settings

1. Go to **SSL/TLS** tab
2. Set encryption mode: **Full (Strict)**
3. Enable **Always Use HTTPS**: ON
4. Enable **Automatic HTTPS Rewrites**: ON
5. Minimum TLS Version: **TLS 1.2**

---

## 📧 Microsoft Email Setup

### Option 1: Azure Communication Services (Recommended)

1. **Create Azure Communication Services:**
   ```bash
   az communication create \
     --name tcw1-email \
     --resource-group tcw1-rg \
     --location global
   ```

2. **Get Connection String:**
   - Azure Portal > Communication Services > Keys
   - Copy connection string

3. **Add to Backend .env:**
   ```
   AZURE_COMMUNICATION_CONNECTION_STRING=endpoint=https://...;accesskey=...
   SENDER_EMAIL=noreply@tcw1.org
   ```

### Option 2: Outlook Personal

1. **Generate App Password:**
   - Go to https://account.microsoft.com/security
   - Security > Advanced security options
   - App passwords > Create new

2. **Add to Backend .env:**
   ```
   SMTP_HOST=smtp-mail.outlook.com
   SMTP_PORT=587
   SMTP_USER=your-email@outlook.com
   SMTP_PASSWORD=app_password_from_step_1
   SENDER_EMAIL=noreply@tcw1.org
   ```

### Option 3: Microsoft 365 with Custom Domain

1. **Add Domain to Microsoft 365:**
   - Admin center > Setup > Domains
   - Add tcw1.org
   - Follow DNS verification steps

2. **Microsoft will provide specific MX records:**
   ```
   MX: tcw1-org.mail.protection.outlook.com (Priority: 0)
   TXT: MS=msXXXXXXXX (for verification)
   ```

3. **Create Email Account:**
   - Admin@tcw1.org or noreply@tcw1.org

4. **Add to Backend .env:**
   ```
   SMTP_HOST=smtp.office365.com
   SMTP_PORT=587
   SMTP_USER=admin@tcw1.org
   SMTP_PASSWORD=your_m365_password
   SENDER_EMAIL=noreply@tcw1.org
   ```

---

## 🚀 Azure Custom Domain Configuration

### Add tcw1.org to Frontend App

1. **Azure Portal** > tcw1-frontend > **Custom domains**
2. Click **Add custom domain**
3. Enter: `tcw1.org`
4. Validation: **CNAME** (already added in Cloudflare)
5. Click **Validate**
6. Click **Add**

### Add www.tcw1.org to Frontend

Repeat above with: `www.tcw1.org`

### Add api.tcw1.org to Backend App

1. **Azure Portal** > tcw1-backend > **Custom domains**
2. Click **Add custom domain**
3. Enter: `api.tcw1.org`
4. Click **Validate** and **Add**

### Create SSL Certificates

1. **TLS/SSL settings** > **Private Key Certificates**
2. Click **Create App Service Managed Certificate**
3. Select: `tcw1.org`
4. Create certificate (takes 5-10 minutes)
5. Repeat for `www.tcw1.org` and `api.tcw1.org`

### Add HTTPS Bindings

1. **TLS/SSL settings** > **Bindings**
2. Click **Add TLS/SSL Binding**
3. Custom Domain: `tcw1.org`
4. Certificate: Select the managed cert
5. TLS/SSL Type: **SNI SSL**
6. Click **Add Binding**
7. Repeat for www and api subdomains

---

## ⏱️ DNS Propagation Timeline

| Time | Status |
|------|--------|
| 0-5 min | Records added to Cloudflare |
| 5-30 min | DNS propagates (some regions) |
| 1-4 hours | Global propagation (most regions) |
| 4-24 hours | Full worldwide propagation |

**Check progress:** https://dnschecker.org

---

## ✅ Testing Your Setup

### Test DNS Resolution
```bash
# Should return Azure IP
nslookup tcw1.org

# Should return Azure IP
nslookup api.tcw1.org

# Should show MX record
nslookup -q=MX tcw1.org
```

### Test HTTPS Endpoints
```bash
# Test frontend
curl https://tcw1.org

# Test API health endpoint
curl https://api.tcw1.org/health

# Expected: {"status":"ok","timestamp":"..."}

# Test WWW redirect
curl https://www.tcw1.org
```

### Test CORS
```bash
curl -H "Origin: https://tcw1.org" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://api.tcw1.org/api/wallet
```

---

## 🚨 Troubleshooting

### Issue: DNS not resolving
**Solution:**
- Wait 30 minutes for propagation
- Check Cloudflare DNS panel for typos
- Ensure Proxy is "DNS only" (gray cloud)
- Clear local DNS cache: `ipconfig /flushdns`

### Issue: SSL certificate error
**Solution:**
- Ensure custom domain is added in Azure Portal
- Wait 15 minutes after creating managed cert
- Check Cloudflare SSL mode is **Full (Strict)**
- Verify HTTPS binding is created in Azure

### Issue: API returns 404 or CORS error
**Solution:**
- Verify CORS_ORIGIN in backend includes `https://tcw1.org`
- Check API is running: App Service > Log Stream
- Test direct Azure URL: `https://tcw1-backend.azurewebsites.net/health`
- Restart app service: App Service > Restart

### Issue: Email not sending
**Solution:**
- Verify SENDER_EMAIL matches your configured domain
- Check SMTP credentials if using Outlook/M365
- Test connection: `telnet smtp-mail.outlook.com 587`
- Review logs: App Service > Log Stream

---

## 📊 Monitoring

### Check Application Status
```bash
# Health check
curl https://api.tcw1.org/health

# Monitor script (from project)
bash monitor.sh tcw1.org
```

### Azure Portal Monitoring
- **App Service** > **Metrics**
  - Response time
  - HTTP errors
  - CPU/Memory usage

- **App Service** > **Log Stream**
  - Real-time application logs

- **Application Insights**
  - Performance metrics
  - Error tracking
  - User analytics

---

## ✅ Final Checklist

Before going live:

- [ ] All 5 DNS records added in Cloudflare
- [ ] DNS propagation complete (check with nslookup)
- [ ] Custom domains added in Azure Portal
- [ ] SSL certificates created for all domains
- [ ] HTTPS bindings configured
- [ ] Backend CORS_ORIGIN set to `https://tcw1.org`
- [ ] Frontend VITE_API_URL set to `https://api.tcw1.org`
- [ ] Email configuration complete and tested
- [ ] Health check responds: `curl https://api.tcw1.org/health`
- [ ] Frontend loads: `https://tcw1.org`
- [ ] All features working (wallet, chat, video)

---

## 🎉 Success!

Once all steps complete, your TCW1 app will be live at:

```
🌐 Website:  https://tcw1.org
🌐 API:      https://api.tcw1.org
📧 Email:    noreply@tcw1.org
```

**Next steps:**
1. Test all features thoroughly
2. Set up monitoring alerts
3. Configure database backups
4. Plan scaling strategy

---

For detailed deployment instructions, see: **QUICK_START.md**
