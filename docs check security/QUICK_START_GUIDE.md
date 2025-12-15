# 🚀 QUICK START GUIDE - VPS Security Fortress

## ⚡ TL;DR - 5 Phút Đầu Tiên

```bash
# 1. CVE-2025-55182 - CHECK NGAY!
cd /path/to/nextjs-app
npm list next react
# Nếu Next.js 15.x or 16.x → UPDATE NGAY!

# 2. Emergency Patch
npm install next@latest react@latest
npm run build
sudo systemctl restart your-service

# 3. Quick Malware Scan
ps aux | grep -E "xmrig|miner|crypto"
# Nếu có kết quả → BỊ HACK RỒI!

# 4. Remove Malware (nếu có)
pkill -9 xmrig
rm -f /tmp/sex.sh /tmp/slt
crontab -r

# 5. Lockdown
sudo ufw deny in from any
sudo systemctl stop nginx
```

---

## 📊 Security Implementation Priority

### 🔴 CRITICAL (Day 1 - Làm NGAY)

```bash
# 1. Update Next.js (CVE-2025-55182)
npm install next@latest

# 2. Check for malware
ps aux | grep miner

# 3. Basic firewall
sudo ufw default deny incoming
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# 4. Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# 5. PostgreSQL localhost only
sudo nano /etc/postgresql/*/main/postgresql.conf
# Set: listen_addresses = 'localhost'
sudo systemctl restart postgresql
```

### 🟡 HIGH (Week 1)

```bash
# 6. Change SSH port
sudo nano /etc/ssh/sshd_config
# Port 50122

# 7. Setup Fail2Ban
sudo apt install fail2ban
sudo systemctl enable fail2ban

# 8. Install Nginx reverse proxy
sudo apt install nginx

# 9. Make code read-only
sudo chown -R root:root /var/www/your-app
sudo chmod -R 555 /var/www/your-app

# 10. Setup backups
# (see COMPLETE_FORTRESS_GUIDE.md)
```

### 🟢 MEDIUM (Week 2-3)

```bash
# 11. Install ModSecurity WAF
# 12. Setup AIDE file monitoring
# 13. Implement JWT authentication
# 14. Encrypt .env files
# 15. Setup monitoring scripts
# 16. Configure Docker (if using)
```

### 🔵 LOW (Week 4+)

```bash
# 17. Penetration testing
# 18. Load testing
# 19. Documentation
# 20. Team training
```

---

## 🎯 Quick Commands Reference

### Emergency

```bash
# Emergency lockdown
sudo ufw deny in from any
sudo systemctl stop nginx

# Kill suspicious process
pkill -9 <process_name>

# Ban IP
sudo ufw deny from <IP_ADDRESS>

# Check who's logged in
w
```

### Daily Checks

```bash
# Check services
sudo systemctl status nginx postgresql

# Check disk space
df -h

# Check failed logins
grep "Failed password" /var/log/auth.log | tail -20

# Check CVE attempts
grep "next-action" /var/log/nginx/access.log | tail -10
```

### Monitoring

```bash
# View logs
tail -f /var/log/nginx/access.log
tail -f /var/log/auth.log
journalctl -u your-service -f

# Check banned IPs
sudo fail2ban-client status sshd

# Check processes
ps aux | grep node
top -u your-app-user
```

### Backup & Restore

```bash
# Manual backup
sudo -u postgres pg_dump dbname | gzip > backup.sql.gz

# Restore
gunzip -c backup.sql.gz | sudo -u postgres psql dbname

# List backups
ls -lh /mnt/backup/postgres/
```

---

## 📁 Essential Files Location

```
/root/scripts/
├── emergency-lockdown.sh       # Emergency isolation
├── detect-malware.sh            # Malware detection
├── remove-malware.sh            # Malware removal
├── backup-database.sh           # Database backup
├── health-check.sh              # System health
├── security-monitor.sh          # Security monitoring
├── aide-check.sh                # File integrity
└── lock-source-code.sh          # Make code read-only

/etc/nginx/
├── nginx.conf                   # Main config
├── sites-available/             # Site configs
└── modsec/                      # ModSecurity rules
    └── custom-cve-2025-55182.conf

/etc/postgresql/*/main/
├── postgresql.conf              # PostgreSQL config
└── pg_hba.conf                  # Auth config

/var/log/
├── nginx/                       # Web server logs
├── postgresql/                  # Database logs
├── auth.log                     # Authentication logs
└── security-monitor/            # Security checks

/var/www/
├── web1/app/                    # App 1 (user: web1)
├── backend1/app/                # Backend (user: backend1)
└── cms1/app/                    # CMS (user: cms1)
```

---

## 🚨 Incident Response Quick Reference

### If You Detect Attack

```bash
# 1. IMMEDIATE - Isolate (15 seconds)
sudo /root/scripts/emergency-lockdown.sh

# 2. INVESTIGATE (5 minutes)
sudo /root/scripts/detect-malware.sh
grep "Failed password" /var/log/auth.log | tail -50
netstat -antp | grep ESTABLISHED

# 3. REMOVE (if compromised)
sudo /root/scripts/remove-malware.sh

# 4. ROTATE (all credentials)
# - Database passwords
# - JWT secrets
# - API keys
# - SSH keys
# - User passwords

# 5. REBUILD (if severely compromised)
# From clean backup/image
```

### Check if Already Compromised

```bash
# Crypto miners?
ps aux | grep -E "xmrig|miner|crypto"

# Malicious files?
ls -la /tmp/sex.sh /tmp/slt 2>/dev/null

# Unauthorized cron jobs?
crontab -l

# Suspicious network?
netstat -antp | grep ESTABLISHED

# File changes?
sudo aide --check
```

---

## 🔒 Security Layers Checklist

```
✓ Layer 1:  Firewall (UFW + iptables)
✓ Layer 2:  SSH Hardening (keys only, custom port)
✓ Layer 3:  Fail2Ban (auto-ban attackers)
✓ Layer 4:  Nginx Reverse Proxy
✓ Layer 5:  ModSecurity WAF
✓ Layer 6:  CVE-2025-55182 Protection
✓ Layer 7:  Rate Limiting
✓ Layer 8:  JWT Authentication
✓ Layer 9:  Database Isolation (localhost only)
✓ Layer 10: User Separation (one per app)
✓ Layer 11: Read-only Code (root ownership)
✓ Layer 12: AIDE File Integrity
✓ Layer 13: Docker Isolation (if used)
✓ Layer 14: Encrypted Secrets (.env)
✓ Layer 15: 24/7 Monitoring
```

---

## 📞 Emergency Contacts

```
System Admin:       +84-xxx-xxx-xxxx
Security Team:      security@yourdomain.com
Hosting Provider:   support@provider.com
Incident Response:  incidents@yourdomain.com
```

---

## 🎓 Learn More

**Full Guide:** `COMPLETE_FORTRESS_GUIDE.md` (71KB)  
**CVE Details:** `NEXTJS_SECURITY_CVE-2025-55182_HARDENING.md`  
**Emergency:** `EMERGENCY_CHECKLIST.md`  
**Nginx:** `NGINX_WAF_CONFIGURATION.md`

---

## ✅ Daily Checklist (5 minutes)

```bash
# Morning routine
[ ] Check service status
[ ] Review security logs
[ ] Check disk space
[ ] Verify backups ran
[ ] Check for alerts
```

---

## 🚀 Next Steps

1. **Read:** `COMPLETE_FORTRESS_GUIDE.md`
2. **Implement:** Follow the checklist phase by phase
3. **Test:** Each security control after implementation
4. **Monitor:** Setup automated monitoring
5. **Maintain:** Regular updates and reviews

---

**Remember:**
- Security is a journey, not a destination
- Test everything before production
- Backup before any changes
- Document all modifications
- Stay updated on new threats

**Good luck! 🛡️**
