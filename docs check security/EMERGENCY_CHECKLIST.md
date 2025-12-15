# CVE-2025-55182 Emergency Response Checklist

## 🚨 IMMEDIATE ACTIONS (First 15 Minutes)

### Phase 1: Verify Vulnerability Status
- [ ] Check Next.js version: `npm list next`
- [ ] Check React version: `npm list react`
- [ ] Verify if using App Router: Check for `/app` directory
- [ ] Run quick scan: `./cve-2025-55182-fix.sh --scan`

**Vulnerable Versions:**
- ❌ Next.js 14.3.0-canary.77+
- ❌ Next.js 15.x (all before 15.5.7)
- ❌ Next.js 16.x (all before 16.0.7)
- ✅ Next.js 13.x and 14.x stable: SAFE

### Phase 2: Isolate if Vulnerable
```bash
# Block external access immediately
sudo ufw deny in from any to any port 3000
sudo ufw deny in from any to any port 80
sudo ufw deny in from any to any port 443

# Stop service
sudo systemctl stop nextjs
# OR
pm2 stop all
```

### Phase 3: Quick Patch (if not compromised)
```bash
# Backup first
cp package.json package.json.backup

# Update Next.js
npm install next@latest  # or specific patched version

# Rebuild
npm run build

# Restart
sudo systemctl restart nextjs
```

---

## 🔍 COMPROMISE DETECTION (15-60 Minutes)

### Check 1: Processes
```bash
# Look for crypto miners
ps aux | grep -E "xmrig|miner|crypto|stratum" | grep -v grep

# Look for suspicious node processes
ps aux | grep node | grep -v "node.*next\|pm2"

# Kill if found
pkill -9 xmrig
```

**Expected: NO results**  
**If found: SYSTEM COMPROMISED - See Section 4**

### Check 2: Files
```bash
# Known malicious files
ls -la /tmp/sex.sh 2>/dev/null
ls -la /tmp/slt 2>/dev/null
ls -la /tmp/.X* 2>/dev/null

# Recent modifications in tmp
find /tmp -type f -mtime -1 -ls

# Recent modifications in home
find ~ -type f -mtime -1 -ls
```

**Expected: Only normal temp files**  
**If suspicious files found: SYSTEM COMPROMISED**

### Check 3: Network
```bash
# Check connections
netstat -antp | grep ESTABLISHED

# Look for suspicious ports
netstat -antp | grep -E ":1337|:4444|:8888|:3333"

# Check for reverse shells
ps aux | grep -E "bash -i|nc -e|python -c" | grep -v grep
```

**Expected: Only known connections to database, APIs**  
**If unknown external connections: INVESTIGATE**

### Check 4: Cron Jobs & Startup
```bash
# Check user crontab
crontab -l

# Check system cron
cat /etc/cron*/*

# Check systemd services
systemctl list-units --type=service --state=running | grep -v "system\|user\|dbus"

# Check rc.local
cat /etc/rc.local
```

**Expected: Only your legitimate jobs/services**  
**If unknown entries: SYSTEM COMPROMISED**

### Check 5: Logs
```bash
# Check nginx access logs
grep -i "next-action\|rsc-action" /var/log/nginx/access.log | tail -20

# Check error logs
tail -50 /var/log/nginx/error.log

# Check auth logs
grep -i "failed\|failure" /var/log/auth.log | tail -20
```

**Expected: No next-action/rsc-action headers**  
**If found: Count and analyze IPs**

### Check 6: Cloud Credentials
```bash
# Check if credentials accessed
ls -la ~/.aws/
ls -la ~/.kube/
ls -la ~/.config/gcloud/

# Check environment
env | grep -E "AWS|GCP|AZURE|SECRET|KEY|TOKEN"

# Check bash history for credential access
history | grep -E "aws|gcloud|kubectl|cat.*secret"
```

**Expected: Normal access patterns**  
**If suspicious access: ROTATE ALL CREDENTIALS**

---

## 🔧 REMEDIATION STEPS

### If NOT Compromised - Update Only

```bash
# 1. Backup
cp package.json package.json.backup.$(date +%Y%m%d)

# 2. Update (choose appropriate version)
npm install next@15.5.7  # For Next.js 15.x
npm install next@16.0.7  # For Next.js 16.x
npm install next@14.2.18  # Downgrade from 14.x canary

# 3. Update React if needed
npm install react@19.2.1 react-dom@19.2.1

# 4. Fix vulnerabilities
npm audit fix

# 5. Rebuild
npm run build

# 6. Test locally
npm run start
# Open browser, test functionality

# 7. Deploy
sudo systemctl restart nextjs

# 8. Verify
curl -I http://localhost:3000
```

### If COMPROMISED - Full Recovery

```bash
# ⚠️ CRITICAL: SYSTEM IS COMPROMISED

# 1. ISOLATE IMMEDIATELY
sudo ufw deny in from any
sudo systemctl stop nextjs
sudo systemctl stop nginx

# 2. KILL MALICIOUS PROCESSES
pkill -9 xmrig
pkill -9 -f "suspicious_name"

# 3. REMOVE MALWARE
rm -f /tmp/sex.sh /tmp/slt
rm -rf /tmp/.X*
crontab -r  # Remove all cron jobs

# 4. BACKUP CRITICAL DATA (if needed)
pg_dump dbname > backup-emergency.sql

# 5. ROTATE ALL CREDENTIALS
# Database passwords
# JWT secrets
# API keys
# Cloud credentials (AWS, GCP, Azure)
# SSH keys

# 6. REBUILD FROM CLEAN STATE
# Option A: Rebuild container
docker-compose down -v
docker-compose up -d --build

# Option B: Fresh install
# Reinstall OS if severely compromised
# Deploy from clean git repository
# Restore data from VERIFIED CLEAN backup

# 7. ENABLE ENHANCED MONITORING
# See monitoring section below
```

---

## 🛡️ HARDENING CHECKLIST

### Architecture
- [ ] Frontend and Backend separated
- [ ] Backend not directly accessible from internet
- [ ] Database only accessible from backend
- [ ] Reverse proxy (Nginx) in place
- [ ] WAF rules enabled

### Network Security
- [ ] Firewall configured (UFW/iptables)
- [ ] Only necessary ports open (80, 443, SSH)
- [ ] Rate limiting enabled
- [ ] DDoS protection active
- [ ] SSL/TLS properly configured

### Application Security
- [ ] Next.js updated to patched version
- [ ] React updated to patched version
- [ ] All npm packages audited
- [ ] Environment variables secured
- [ ] Secrets not in code/git
- [ ] CORS properly configured
- [ ] JWT secrets rotated regularly

### Container Security (if using Docker)
- [ ] Run as non-root user
- [ ] Read-only root filesystem
- [ ] Resource limits set
- [ ] Network isolation
- [ ] No unnecessary capabilities
- [ ] Security scanning enabled

### Monitoring
- [ ] Log aggregation configured
- [ ] Alerts for suspicious activity
- [ ] Real-time monitoring active
- [ ] Backup system verified
- [ ] Incident response plan documented

---

## 📊 MONITORING SETUP

### Essential Logs to Monitor

```bash
# Create log monitoring script
cat > /usr/local/bin/monitor-cve.sh << 'EOF'
#!/bin/bash
while true; do
    # Monitor for exploitation attempts
    tail -f /var/log/nginx/access.log | grep --line-buffered "next-action\|rsc-action" | \
    while read line; do
        IP=$(echo "$line" | awk '{print $1}')
        echo "[ALERT] CVE-2025-55182 attempt from $IP"
        # Ban IP
        sudo ufw deny from "$IP"
        # Send notification (configure your method)
        echo "Attack from $IP" | mail -s "ALERT" admin@your-domain.com
    done
    sleep 1
done
EOF

chmod +x /usr/local/bin/monitor-cve.sh

# Run in background
nohup /usr/local/bin/monitor-cve.sh &
```

### Key Metrics to Track

1. **HTTP Requests**
   - POST requests with multipart/form-data
   - Requests with Next-Action header
   - Unusual user agents

2. **System Resources**
   - CPU usage (miners use high CPU)
   - Network traffic (unusual outbound)
   - Disk I/O (unusual writes)

3. **Processes**
   - New unknown processes
   - High CPU processes
   - Unusual network connections

4. **Files**
   - /tmp modifications
   - New files in /root or /home
   - Modified system files

---

## 🚀 DEPLOYMENT SAFETY CHECKLIST

Before deploying updates:

### Pre-Deploy
- [ ] Test in staging environment
- [ ] Verify patched versions
- [ ] Backup current state
- [ ] Backup database
- [ ] Document current configuration
- [ ] Plan rollback procedure

### Deploy
- [ ] Use blue-green deployment if possible
- [ ] Monitor logs during deployment
- [ ] Check health endpoints
- [ ] Verify functionality
- [ ] Check for errors

### Post-Deploy
- [ ] Monitor for 24 hours
- [ ] Check resource usage
- [ ] Verify no exploitation attempts
- [ ] Test all critical features
- [ ] Review logs for anomalies

---

## 📞 INCIDENT CONTACTS

| Type | Contact | Response Time |
|------|---------|---------------|
| Hosting Provider | support@provider.com | < 1 hour |
| Security Team | security@your-company.com | < 30 min |
| On-Call Engineer | +1-xxx-xxx-xxxx | < 15 min |
| Cloud Provider | AWS/GCP/Azure Support | < 1 hour |

---

## 📚 QUICK REFERENCE COMMANDS

### Check Status
```bash
# Version check
npm list next react

# Process check
ps aux | grep -E "node|xmrig|miner"

# Connection check
netstat -antp | grep ESTABLISHED

# Log check
tail -f /var/log/nginx/access.log | grep "next-action"
```

### Emergency Stop
```bash
# Stop services
sudo systemctl stop nextjs nginx

# Block traffic
sudo ufw deny in from any

# Kill processes
pkill -9 node
```

### Quick Fix
```bash
# Update and restart
npm install next@latest
npm run build
sudo systemctl restart nextjs
```

### System Scan
```bash
# Run security scan
./cve-2025-55182-fix.sh --scan

# Check for malware
clamscan -r /home /tmp /var/www

# Check file integrity
aide --check
```

---

## ⚡ AUTOMATED RESPONSE

### Setup Auto-Ban Script

```bash
# Create auto-ban service
cat > /etc/systemd/system/auto-ban-cve.service << 'EOF'
[Unit]
Description=Auto-ban CVE-2025-55182 attempts
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/auto-ban-cve.sh
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Create ban script
cat > /usr/local/bin/auto-ban-cve.sh << 'EOF'
#!/bin/bash
tail -F /var/log/nginx/access.log | \
grep --line-buffered "next-action\|rsc-action" | \
while read line; do
    IP=$(echo "$line" | awk '{print $1}')
    sudo ufw deny from "$IP"
    logger "BANNED IP $IP for CVE-2025-55182 attempt"
done
EOF

chmod +x /usr/local/bin/auto-ban-cve.sh
sudo systemctl enable auto-ban-cve
sudo systemctl start auto-ban-cve
```

---

## ✅ VALIDATION CHECKLIST

After remediation, verify:

- [ ] Next.js version >= patched version
- [ ] React version >= patched version
- [ ] No suspicious processes running
- [ ] No malicious files present
- [ ] No unauthorized network connections
- [ ] No unauthorized cron jobs
- [ ] Logs show no exploitation attempts
- [ ] All credentials rotated (if compromised)
- [ ] Monitoring active and alerting
- [ ] Backups tested and working
- [ ] Team notified and trained

---

## 🔄 ONGOING MAINTENANCE

### Daily
- [ ] Check logs for suspicious activity
- [ ] Verify monitoring is working
- [ ] Check resource usage

### Weekly
- [ ] Review security alerts
- [ ] Update dependencies
- [ ] Test backups
- [ ] Review access logs

### Monthly
- [ ] Full security audit
- [ ] Penetration testing
- [ ] Review incident response plan
- [ ] Update documentation

---

**Last Updated:** 2025-12-09  
**Document Version:** 1.0  
**Status:** Production Ready
