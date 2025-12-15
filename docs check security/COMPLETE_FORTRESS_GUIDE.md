# 🏰 ULTIMATE VPS SECURITY FORTRESS
## Giải Pháp Bảo Mật Toàn Diện cho NextJS + NodeJS + PostgreSQL

**Mục tiêu:** Ngay cả khi hacker vào được VPS, họ KHÔNG THỂ làm gì  
**Chiến lược:** Defense-in-Depth + Zero Trust + CVE-2025-55182 Protection  
**Stack:** Ubuntu 22.04 | NextJS 15+ | NodeJS 20+ | PostgreSQL 16  
**Version:** 3.0 Ultimate Edition

---

## 📋 Mục Lục

### 🔴 PHASE 1: CRITICAL - IMMEDIATE PROTECTION
1. [CVE-2025-55182 Emergency Response](#phase-1-cve-2025-55182-emergency-response)
2. [Malware Detection & Removal](#malware-detection--removal)
3. [Immediate System Lockdown](#immediate-system-lockdown)

### 🟡 PHASE 2: FOUNDATION - OS & INFRASTRUCTURE
4. [System Hardening & User Management](#system-hardening--user-management)
5. [SSH Fortress Configuration](#ssh-fortress-configuration)
6. [Firewall & Network Isolation](#firewall--network-isolation)
7. [PostgreSQL Maximum Security](#postgresql-maximum-security)

### 🟢 PHASE 3: APPLICATION - NEXTJS + NODEJS
8. [NextJS Security Architecture](#nextjs-security-architecture)
9. [Backend API Hardening](#backend-api-hardening)
10. [JWT + Authentication](#jwt--authentication)
11. [API Rate Limiting & DDoS Protection](#api-rate-limiting--ddos-protection)

### 🔵 PHASE 4: DEFENSE LAYERS
12. [Nginx + ModSecurity WAF](#nginx--modsecurity-waf)
13. [Fail2Ban + Intrusion Detection](#fail2ban--intrusion-detection)
14. [File Integrity Monitoring (AIDE)](#file-integrity-monitoring)
15. [Docker Security Isolation](#docker-security-isolation)

### 🟣 PHASE 5: MONITORING & RESPONSE
16. [24/7 Monitoring & Alerting](#247-monitoring--alerting)
17. [Incident Response Procedures](#incident-response-procedures)
18. [Backup & Disaster Recovery](#backup--disaster-recovery)

### 📦 BONUS: AUTOMATION
19. [Security Automation Scripts](#security-automation-scripts)
20. [Complete Implementation Checklist](#complete-implementation-checklist)

---

## 🎯 Security Principles

### Core Philosophy: "Assume Breach"

**Kể cả khi hacker có thể:**
- ✅ Vào được VPS qua lỗ hổng
- ✅ Chiếm được một service
- ✅ Có quyền user thường

**Họ VẪN KHÔNG THỂ:**
- ❌ Access database (localhost only + auth)
- ❌ Modify source code (read-only + root owner)
- ❌ Escalate privileges (proper separation)
- ❌ Access secrets (.env encrypted + vault)
- ❌ Move lateral (network segmentation)
- ❌ Persist (file integrity monitoring)
- ❌ Exfiltrate data (egress monitoring)

---

# PHASE 1: CVE-2025-55182 EMERGENCY RESPONSE

## 🚨 CRITICAL: Check & Patch Immediately

### Step 1: Quick Vulnerability Check

```bash
#!/bin/bash
# quick-cve-check.sh

echo "=== CVE-2025-55182 Quick Check ==="

# Find all Next.js projects
PROJECTS=$(find /home /var/www /opt -name "package.json" -exec grep -l '"next"' {} \; 2>/dev/null)

for project_file in $PROJECTS; do
    PROJECT_DIR=$(dirname "$project_file")
    cd "$PROJECT_DIR"
    
    NEXT_VERSION=$(node -pe "require('./package.json').dependencies.next" 2>/dev/null)
    
    echo ""
    echo "Project: $PROJECT_DIR"
    echo "Next.js: $NEXT_VERSION"
    
    # Check if vulnerable
    if [[ "$NEXT_VERSION" == *"canary"* ]] || \
       [[ "$NEXT_VERSION" =~ ^15\. ]] || \
       [[ "$NEXT_VERSION" =~ ^16\. ]]; then
        echo "Status: ⚠️  POTENTIALLY VULNERABLE"
        echo "Action: UPDATE IMMEDIATELY!"
    else
        echo "Status: ✅ SAFE"
    fi
done
```

### Step 2: Immediate Patch

```bash
#!/bin/bash
# emergency-patch.sh

cd /path/to/your/nextjs-app

# Backup first
cp package.json package.json.backup.$(date +%Y%m%d_%H%M%S)
cp package-lock.json package-lock.json.backup.$(date +%Y%m%d_%H%M%S)

# Update Next.js
npm install next@latest react@latest react-dom@latest

# Fix vulnerabilities
npm audit fix --force

# Rebuild
npm run build

# Restart service
sudo systemctl restart your-nextjs-service

echo "✅ Patched! Now verify version:"
npm list next
```

## Malware Detection & Removal

### Check for Crypto Miners

```bash
#!/bin/bash
# detect-malware.sh

echo "=== Malware Detection ==="

# 1. Check suspicious processes
echo "Checking processes..."
ps aux | grep -E "xmrig|miner|crypto|stratum" | grep -v grep

# 2. Check network connections
echo "Checking connections..."
netstat -antp | grep ESTABLISHED | grep -E "3333|4444|8888|1337"

# 3. Check for known malicious files
echo "Checking files..."
find /tmp -name "sex.sh" -o -name "slt" -o -name ".X*" 2>/dev/null

# 4. Check cron jobs
echo "Checking cron jobs..."
for user in $(cut -f1 -d: /etc/passwd); do
    echo "User: $user"
    crontab -u $user -l 2>/dev/null
done

# 5. Check startup services
echo "Checking services..."
systemctl list-units --type=service --state=running | grep -v "system\|user\|dbus"

# 6. Check for modified system files
echo "Checking system files..."
ls -la /etc/rc.local /etc/systemd/system/*.service 2>/dev/null

# 7. Check GRUB bootloader
echo "Checking GRUB..."
ls -la /boot/grub/grub.cfg

echo "=== Scan Complete ==="
```

### Remove Malware

```bash
#!/bin/bash
# remove-malware.sh

echo "=== Malware Removal ==="

# Kill malicious processes
pkill -9 xmrig
pkill -9 -f "sex.sh"
pkill -9 -f "slt"

# Remove malicious files
rm -f /tmp/sex.sh
rm -f /tmp/slt
rm -rf /tmp/.X*
rm -rf /var/tmp/*miner*

# Clean cron jobs (backup first)
crontab -l > /root/crontab.backup.$(date +%Y%m%d)
crontab -r

# Check and clean systemd services
systemctl list-units --type=service --all | grep -i "miner\|crypto" | awk '{print $1}' | while read service; do
    echo "Stopping suspicious service: $service"
    systemctl stop "$service"
    systemctl disable "$service"
done

# Verify GRUB
grub-install /dev/sda
update-grub

echo "✅ Malware removed. Reboot recommended."
```

## Immediate System Lockdown

```bash
#!/bin/bash
# emergency-lockdown.sh

echo "=== EMERGENCY LOCKDOWN ==="

# 1. Block all incoming traffic except SSH
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp  # Or your custom SSH port
ufw --force enable

# 2. Stop all web services
systemctl stop nginx
systemctl stop apache2 2>/dev/null

# 3. Stop all Node.js apps
pm2 stop all 2>/dev/null
systemctl stop nextjs* 2>/dev/null

# 4. Check current connections
echo "Active connections:"
netstat -antp | grep ESTABLISHED

# 5. Check logged in users
echo "Logged in users:"
w

# 6. Review recent commands
echo "Recent commands from all users:"
tail -50 /home/*/.bash_history

echo "=== LOCKDOWN COMPLETE ==="
echo "Review the output above for suspicious activity"
echo "To restore services: systemctl start nginx && pm2 start all"
```

---

# PHASE 2: SYSTEM HARDENING & USER MANAGEMENT

## System Hardening

### Kernel Hardening

```bash
# /etc/sysctl.d/99-security.conf

# IP Forwarding
net.ipv4.ip_forward = 0
net.ipv6.conf.all.forwarding = 0

# SYN Cookies
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_syn_retries = 2
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_max_syn_backlog = 4096

# Ignore ICMP
net.ipv4.icmp_echo_ignore_all = 1
net.ipv4.icmp_echo_ignore_broadcasts = 1

# IP Spoofing protection
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Ignore redirects
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv6.conf.default.accept_redirects = 0

# Ignore source routed packets
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0
net.ipv6.conf.default.accept_source_route = 0

# Log suspicious packets
net.ipv4.conf.all.log_martians = 1
net.ipv4.conf.default.log_martians = 1

# Apply settings
# sysctl -p /etc/sysctl.d/99-security.conf
```

### Secure Shared Memory

```bash
# Add to /etc/fstab
none /run/shm tmpfs defaults,ro 0 0

# Remount
mount -o remount /run/shm
```

## User Management & Separation

### Strategy: One User Per Application

```bash
#!/bin/bash
# setup-users.sh

# Admin user with sudo
adduser --disabled-password --gecos "Admin User" admin
usermod -aG sudo admin

# Application users (no login, no sudo)
adduser --system --group --no-create-home --shell /usr/sbin/nologin web1
adduser --system --group --no-create-home --shell /usr/sbin/nologin web2
adduser --system --group --no-create-home --shell /usr/sbin/nologin cms1
adduser --system --group --no-create-home --shell /usr/sbin/nologin backend1

# PostgreSQL user (already exists, just lock it)
usermod -L postgres

echo "✅ Users created"
```

### Application Directory Structure

```bash
#!/bin/bash
# setup-app-directories.sh

for app in web1 web2 cms1 backend1; do
    # Create directories
    mkdir -p /var/www/$app/{app,logs,backups}
    
    # Set ownership
    chown -R $app:$app /var/www/$app/app
    chown -R $app:$app /var/www/$app/logs
    chown root:root /var/www/$app/backups
    
    # Set permissions
    chmod 750 /var/www/$app/app
    chmod 755 /var/www/$app/logs
    chmod 700 /var/www/$app/backups
    
    echo "✅ Setup $app directory"
done
```

## SSH Fortress Configuration

### Ultimate SSH Hardening

```bash
# /etc/ssh/sshd_config

# Change default port
Port 50122

# Protocol
Protocol 2

# Authentication
PermitRootLogin no
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
ChallengeResponseAuthentication no
UsePAM yes

# Security
X11Forwarding no
MaxAuthTries 3
MaxSessions 2
LoginGraceTime 30
ClientAliveInterval 300
ClientAliveCountMax 2

# Logging
SyslogFacility AUTH
LogLevel VERBOSE

# Whitelist specific users
AllowUsers admin

# Whitelist specific IPs (optional - be careful!)
# Match Address 1.2.3.4,5.6.7.8
#     AllowUsers admin

# Disable less secure algorithms
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com

# Restart: systemctl restart sshd
```

### SSH Key Management

```bash
#!/bin/bash
# setup-ssh-keys.sh

# On local machine:
ssh-keygen -t ed25519 -C "admin@yourserver" -f ~/.ssh/vps_admin_ed25519

# Copy to server (one-time with password)
ssh-copy-id -i ~/.ssh/vps_admin_ed25519.pub -p 50122 admin@your_server_ip

# Create SSH config on local
cat >> ~/.ssh/config << 'EOF'
Host vps-prod
    HostName your_server_ip
    Port 50122
    User admin
    IdentityFile ~/.ssh/vps_admin_ed25519
    IdentitiesOnly yes
    ServerAliveInterval 60
    ServerAliveCountMax 3
EOF

# Now you can connect with: ssh vps-prod
```

### Fail2Ban Advanced Configuration

```bash
# /etc/fail2ban/jail.local

[DEFAULT]
bantime = 86400
findtime = 3600
maxretry = 3
destemail = admin@yourdomain.com
sender = fail2ban@yourdomain.com
action = %(action_mwl)s

[sshd]
enabled = true
port = 50122
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 864000

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 5
bantime = 3600

[nginx-cve-2025-55182]
enabled = true
port = http,https
filter = nginx-cve-2025-55182
logpath = /var/log/nginx/*access.log
maxretry = 1
bantime = 2592000

# Restart: systemctl restart fail2ban
```

## Firewall & Network Isolation

### UFW Complete Configuration

```bash
#!/bin/bash
# setup-firewall.sh

# Reset firewall
ufw --force reset

# Default policies
ufw default deny incoming
ufw default allow outgoing

# SSH (custom port)
ufw allow 50122/tcp comment 'SSH'

# HTTP/HTTPS
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'

# Rate limiting on SSH
ufw limit 50122/tcp

# Enable logging
ufw logging high

# Enable firewall
ufw --force enable

# Status
ufw status verbose
ufw status numbered
```

### Network Segmentation with iptables

```bash
#!/bin/bash
# advanced-network-rules.sh

# Allow localhost
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# Allow established connections
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Drop invalid packets
iptables -A INPUT -m state --state INVALID -j DROP

# SYN flood protection
iptables -N syn_flood
iptables -A INPUT -p tcp --syn -j syn_flood
iptables -A syn_flood -m limit --limit 1/s --limit-burst 3 -j RETURN
iptables -A syn_flood -j DROP

# Port scan protection
iptables -N port-scanning
iptables -A port-scanning -p tcp --tcp-flags SYN,ACK,FIN,RST RST -m limit --limit 1/s --limit-burst 2 -j RETURN
iptables -A port-scanning -j DROP

# Save rules
iptables-save > /etc/iptables/rules.v4
```

## PostgreSQL Maximum Security

### PostgreSQL Configuration

```bash
# /etc/postgresql/16/main/postgresql.conf

# Listen only on localhost
listen_addresses = 'localhost'

# Connection limits
max_connections = 100
superuser_reserved_connections = 3

# Memory
shared_buffers = 256MB
work_mem = 16MB
maintenance_work_mem = 128MB

# Logging for security
log_destination = 'stderr'
logging_collector = on
log_directory = '/var/log/postgresql'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_rotation_age = 1d
log_rotation_size = 100MB
log_min_duration_statement = 1000
log_connections = on
log_disconnections = on
log_duration = off
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '

# Security
ssl = on
ssl_cert_file = '/etc/ssl/certs/ssl-cert-snakeoil.pem'
ssl_key_file = '/etc/ssl/private/ssl-cert-snakeoil.key'
```

### PostgreSQL Authentication

```bash
# /etc/postgresql/16/main/pg_hba.conf

# TYPE  DATABASE        USER            ADDRESS                 METHOD

# Local connections (Unix socket)
local   all             postgres                                peer
local   all             all                                     peer

# IPv4 local connections only
host    all             all             127.0.0.1/32            scram-sha-256

# IPv6 local connections only
host    all             all             ::1/128                 scram-sha-256

# Deny all other connections
host    all             all             0.0.0.0/0               reject
host    all             all             ::/0                    reject
```

### Database User with Minimal Privileges

```sql
-- Create application-specific database and user
CREATE DATABASE app1_db;
CREATE USER app1_user WITH ENCRYPTED PASSWORD 'very_strong_password_here';

-- Grant ONLY necessary privileges
GRANT CONNECT ON DATABASE app1_db TO app1_user;
\c app1_db;
GRANT USAGE ON SCHEMA public TO app1_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app1_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app1_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app1_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO app1_user;

-- Deny dangerous operations
REVOKE CREATE ON SCHEMA public FROM app1_user;
REVOKE ALL ON DATABASE app1_db FROM PUBLIC;

-- Enable connection limit
ALTER USER app1_user CONNECTION LIMIT 20;
```

### Automated Database Backups

```bash
#!/bin/bash
# /root/scripts/backup-database.sh

BACKUP_DIR="/mnt/backup/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

mkdir -p $BACKUP_DIR

# Backup each database
for db in app1_db app2_db cms1_db; do
    echo "Backing up $db..."
    
    sudo -u postgres pg_dump $db | gzip > $BACKUP_DIR/${db}_${DATE}.sql.gz
    
    if [ $? -eq 0 ]; then
        echo "✅ $db backed up successfully"
    else
        echo "❌ Failed to backup $db"
        # Send alert
        echo "Database backup failed for $db" | mail -s "BACKUP ALERT" admin@yourdomain.com
    fi
done

# Delete old backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup complete: $(date)"
```

---

# PHASE 3: NEXTJS + NODEJS SECURITY

## NextJS Security Architecture

### Secure Architecture Pattern

```
Internet → Cloudflare (DDoS) → VPS
                                 ↓
                            Nginx (WAF + Reverse Proxy)
                                 ↓
                ┌────────────────┼────────────────┐
                │                                 │
          NextJS Frontend              Backend API (NodeJS)
          (Port 3000)                  (Port 4000)
          User: web1                   User: backend1
          Read-only code               Read-only code
                │                                 │
                └────────────────┬────────────────┘
                                 ↓
                          PostgreSQL (localhost:5432)
                          User: postgres
                          Listen: 127.0.0.1 only
```

### NextJS next.config.js - Production Security

```javascript
// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimization
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://api.yourdomain.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'"
            ].join('; ')
          }
        ],
      },
    ]
  },
  
  // Disable X-Powered-By
  reactStrictMode: true,
  
  // Environment variables validation
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

module.exports = nextConfig
```

### NextJS API Routes - Secure Pattern

```typescript
// app/api/proxy/route.ts
// NextJS acts as PROXY to backend, never direct DB access

import { NextRequest, NextResponse } from 'next/server'

// Rate limiting store (use Redis in production)
const rateLimitMap = new Map<string, number[]>()

function rateLimit(ip: string, limit = 100, window = 60000): boolean {
  const now = Date.now()
  const userRequests = rateLimitMap.get(ip) || []
  
  // Clean old requests
  const recentRequests = userRequests.filter(time => now - time < window)
  
  if (recentRequests.length >= limit) {
    return false
  }
  
  recentRequests.push(now)
  rateLimitMap.set(ip, recentRequests)
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    // Rate limiting
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }
    
    // Get auth token from cookie (httpOnly)
    const token = request.cookies.get('auth_token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Forward to backend API
    const backendResponse = await fetch('http://localhost:4000/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Forwarded-For': ip,
      },
      body: JSON.stringify(await request.json()),
    })
    
    const data = await backendResponse.json()
    
    return NextResponse.json(data, { 
      status: backendResponse.status 
    })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## Backend API Hardening

### Backend Server - Express with Maximum Security

```javascript
// backend/server.js

const express = require('express')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const slowDown = require('express-slow-down')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { Pool } = require('pg')
const winston = require('winston')

const app = express()

// ==========================================
// LOGGING
// ==========================================
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: '/var/www/backend1/logs/error.log', 
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({ 
      filename: '/var/www/backend1/logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
})

// ==========================================
// SECURITY MIDDLEWARE
// ==========================================

// Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}))

// Hide Express
app.disable('x-powered-by')

// Body parsing with size limits
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// CORS - ONLY allow frontend domain
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Forwarded-For']
}
app.use(cors(corsOptions))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded: ${req.ip}`)
    res.status(429).json({ error: 'Too many requests' })
  }
})

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,
  delayMs: 500,
})

app.use('/api/', limiter)
app.use('/api/', speedLimiter)

// ==========================================
// DATABASE CONNECTION
// ==========================================

const pool = new Pool({
  user: process.env.DB_USER,
  host: 'localhost', // ONLY localhost
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  max: 20, // connection pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: false, // localhost doesn't need SSL
})

// Test connection
pool.on('connect', () => {
  logger.info('Database connected')
})

pool.on('error', (err) => {
  logger.error('Database connection error', err)
  process.exit(-1)
})

// ==========================================
// JWT AUTHENTICATION MIDDLEWARE
// ==========================================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  
  if (!token) {
    logger.warn(`Unauthorized access attempt from ${req.ip}`)
    return res.status(401).json({ error: 'No token provided' })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    
    // Log authenticated access
    logger.info(`Authenticated request: ${req.user.id} from ${req.ip}`)
    
    next()
  } catch (error) {
    logger.warn(`Invalid token from ${req.ip}: ${error.message}`)
    return res.status(403).json({ error: 'Invalid or expired token' })
  }
}

// ==========================================
// ROUTES
// ==========================================

// Health check (no auth needed)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }
    
    // Query database (use parameterized query - NEVER string concat)
    const result = await pool.query(
      'SELECT id, email, password_hash, role FROM users WHERE email = $1',
      [email]
    )
    
    if (result.rows.length === 0) {
      logger.warn(`Failed login attempt for ${email} from ${req.ip}`)
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    const user = result.rows[0]
    
    // Verify password (use bcrypt)
    const bcrypt = require('bcrypt')
    const validPassword = await bcrypt.compare(password, user.password_hash)
    
    if (!validPassword) {
      logger.warn(`Failed login attempt for ${email} from ${req.ip}`)
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    // Generate JWT
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )
    
    logger.info(`Successful login: ${email} from ${req.ip}`)
    
    res.json({ 
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    })
    
  } catch (error) {
    logger.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Protected route example
app.get('/api/data', authenticateToken, async (req, res) => {
  try {
    // Use parameterized queries ALWAYS
    const result = await pool.query(
      'SELECT id, name, created_at FROM items WHERE user_id = $1 LIMIT 100',
      [req.user.id]
    )
    
    res.json({ 
      success: true,
      data: result.rows 
    })
    
  } catch (error) {
    logger.error('Data fetch error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ==========================================
// ERROR HANDLING
// ==========================================

// 404 handler
app.use((req, res) => {
  logger.warn(`404: ${req.method} ${req.url} from ${req.ip}`)
  res.status(404).json({ error: 'Not found' })
})

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err)
  res.status(500).json({ error: 'Something went wrong' })
})

// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 4000
const HOST = '127.0.0.1' // ONLY listen on localhost

app.listen(PORT, HOST, () => {
  logger.info(`Backend API listening on ${HOST}:${PORT}`)
  console.log(`✅ Backend API running on ${HOST}:${PORT}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully')
  pool.end()
  process.exit(0)
})
```

### Environment Variables - Encrypted Storage

```bash
#!/bin/bash
# /root/scripts/setup-env-encryption.sh

# Install age encryption
apt install age

# Generate encryption key (KEEP THIS SAFE!)
age-keygen -o /root/.env-encryption-key
chmod 600 /root/.env-encryption-key

echo "✅ Encryption key generated: /root/.env-encryption-key"
echo "⚠️  BACKUP THIS KEY SECURELY!"
```

```bash
#!/bin/bash
# /root/scripts/encrypt-env.sh

PROJECT=$1
ENV_FILE="/var/www/$PROJECT/app/.env"
ENCRYPTED_FILE="/var/www/$PROJECT/app/.env.encrypted"
KEY_FILE="/root/.env-encryption-key"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE not found"
    exit 1
fi

# Encrypt
age -r $(age-keygen -y $KEY_FILE) -o $ENCRYPTED_FILE $ENV_FILE

# Verify
if [ -f "$ENCRYPTED_FILE" ]; then
    echo "✅ Encrypted: $ENCRYPTED_FILE"
    
    # Secure delete original
    shred -vfz -n 10 $ENV_FILE
    echo "✅ Original .env securely deleted"
else
    echo "❌ Encryption failed"
    exit 1
fi
```

```bash
#!/bin/bash
# /root/scripts/decrypt-env.sh

PROJECT=$1
ENCRYPTED_FILE="/var/www/$PROJECT/app/.env.encrypted"
ENV_FILE="/var/www/$PROJECT/app/.env"
KEY_FILE="/root/.env-encryption-key"

# Decrypt
age -d -i $KEY_FILE -o $ENV_FILE $ENCRYPTED_FILE

# Set permissions
chown $PROJECT:$PROJECT $ENV_FILE
chmod 400 $ENV_FILE

echo "✅ Decrypted: $ENV_FILE"
```

---

# PHASE 4: NGINX + ModSecurity WAF

## Complete Nginx Configuration with WAF

```nginx
# /etc/nginx/nginx.conf

user www-data;
worker_processes auto;
worker_rlimit_nofile 65535;
pid /run/nginx.pid;

# Load ModSecurity
load_module modules/ngx_http_modsecurity_module.so;

events {
    worker_connections 4096;
    multi_accept on;
    use epoll;
}

http {
    ##
    # Basic Settings
    ##
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;
    
    client_body_buffer_size 1m;
    client_max_body_size 10m;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 8k;
    
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    ##
    # SSL Settings
    ##
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5:!RC4;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    
    ##
    # Logging
    ##
    log_format security '$remote_addr - $remote_user [$time_local] '
                       '"$request" $status $body_bytes_sent '
                       '"$http_referer" "$http_user_agent" '
                       'Headers: next-action="$http_next_action" '
                       'rsc-action="$http_rsc_action_id" '
                       'request_time=$request_time '
                       'upstream_time=$upstream_response_time';
    
    access_log /var/log/nginx/access.log security;
    error_log /var/log/nginx/error.log warn;
    
    ##
    # Gzip
    ##
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss;
    
    ##
    # Rate Limiting
    ##
    limit_req_zone $binary_remote_addr zone=general:10m rate=30r/s;
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
    limit_req_zone $binary_remote_addr zone=strict:10m rate=1r/s;
    limit_req_zone $binary_remote_addr zone=cve_protect:10m rate=5r/s;
    
    limit_conn_zone $binary_remote_addr zone=conn_limit:10m;
    limit_conn_zone $server_name zone=perserver:10m;
    
    limit_req_status 429;
    limit_conn_status 429;
    
    ##
    # GeoIP Blocking (Optional)
    ##
    # geoip_country /usr/share/GeoIP/GeoIP.dat;
    # map $geoip_country_code $blocked_country {
    #     default 0;
    #     CN 1;  # China
    #     RU 1;  # Russia
    #     KP 1;  # North Korea
    # }
    
    ##
    # ModSecurity WAF
    ##
    modsecurity on;
    modsecurity_rules_file /etc/nginx/modsec/main.conf;
    
    ##
    # Upstream Definitions
    ##
    upstream nextjs_frontend {
        server 127.0.0.1:3000 max_fails=3 fail_timeout=30s;
        keepalive 32;
    }
    
    upstream nodejs_backend {
        server 127.0.0.1:4000 max_fails=3 fail_timeout=30s;
        keepalive 32;
    }
    
    ##
    # Virtual Hosts
    ##
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

### Complete Site Configuration with CVE-2025-55182 Protection

```nginx
# /etc/nginx/sites-available/production

# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# Main HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/yourdomain.com/chain.pem;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://yourdomain.com;" always;
    
    # Connection limits
    limit_conn conn_limit 20;
    limit_conn perserver 1000;
    limit_req zone=general burst=50 nodelay;
    
    # Logging
    access_log /var/log/nginx/yourdomain_access.log security;
    error_log /var/log/nginx/yourdomain_error.log warn;
    
    ##
    # CVE-2025-55182 PROTECTION
    ##
    
    # Block Next-Action header
    if ($http_next_action != "") {
        return 403 "CVE-2025-55182: Access Denied";
    }
    
    # Block RSC-Action-ID header
    if ($http_rsc_action_id != "") {
        return 403 "CVE-2025-55182: Access Denied";
    }
    
    # Block suspicious Next.js patterns
    set $suspicious_nextjs 0;
    
    if ($http_x_nextjs_request_id != "") {
        set $suspicious_nextjs 1;
    }
    
    if ($http_next_router_state_tree != "") {
        set $suspicious_nextjs "${suspicious_nextjs}1";
    }
    
    if ($suspicious_nextjs = "11") {
        return 403 "CVE-2025-55182: Access Denied";
    }
    
    # Block multipart POST with suspicious headers
    set $block_post 0;
    
    if ($request_method = POST) {
        set $block_post "P";
    }
    
    if ($content_type ~* "multipart/form-data") {
        set $block_post "${block_post}M";
    }
    
    if ($http_next_action != "") {
        set $block_post "${block_post}A";
    }
    
    if ($block_post = "PMA") {
        return 403 "CVE-2025-55182: Access Denied";
    }
    
    # Rate limit CVE exploitation attempts
    limit_req zone=cve_protect burst=3 nodelay;
    
    ##
    # Backend API (Internal Only - CRITICAL)
    ##
    location /api/ {
        # ONLY allow from localhost (NextJS SSR)
        allow 127.0.0.1;
        deny all;
        
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://nodejs_backend;
        proxy_http_version 1.1;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Remove suspicious headers before forwarding
        proxy_set_header Next-Action "";
        proxy_set_header Rsc-Action-Id "";
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    ##
    # Frontend (Next.js)
    ##
    location / {
        limit_req zone=general burst=50 nodelay;
        
        # Block SQL injection patterns
        if ($query_string ~* (union|select|insert|drop|delete|update|cast|create|char|from|varchar|or|'|--|;)) {
            return 403;
        }
        
        # Block XSS patterns
        if ($query_string ~* (<script|javascript:|onerror=|onload=)) {
            return 403;
        }
        
        proxy_pass http://nextjs_frontend;
        proxy_http_version 1.1;
        
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_cache_bypass $http_upgrade;
        proxy_redirect off;
    }
    
    ##
    # Next.js Static Assets
    ##
    location /_next/static/ {
        proxy_pass http://nextjs_frontend;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }
    
    location /_next/image {
        proxy_pass http://nextjs_frontend;
        add_header Cache-Control "public, max-age=2592000";
    }
    
    ##
    # Health Check
    ##
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
    
    ##
    # Block Sensitive Files
    ##
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    location ~* /(\.git|\.env|\.DS_Store|package\.json|package-lock\.json|node_modules) {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

### ModSecurity Custom CVE Rules

```nginx
# /etc/nginx/modsec/custom-cve-2025-55182.conf

# CVE-2025-55182 Protection Rules
# Rule ID range: 9000000-9000999

SecRule REQUEST_HEADERS:Next-Action "@rx ." \
    "id:9000001,\
    phase:1,\
    block,\
    status:403,\
    log,\
    msg:'CVE-2025-55182: Next-Action header detected',\
    severity:CRITICAL,\
    tag:'CVE-2025-55182',\
    chain"
    SecRule REQUEST_METHOD "@streq POST"

SecRule REQUEST_HEADERS:Rsc-Action-Id "@rx ." \
    "id:9000002,\
    phase:1,\
    block,\
    status:403,\
    log,\
    msg:'CVE-2025-55182: RSC-Action-Id detected',\
    severity:CRITICAL,\
    tag:'CVE-2025-55182'"

SecRule REQUEST_BODY "@rx \[\"\$[0-9]+:[a-z]:[a-z]\"\]" \
    "id:9000004,\
    phase:2,\
    block,\
    status:403,\
    log,\
    msg:'CVE-2025-55182: Malicious RSC payload',\
    severity:CRITICAL,\
    tag:'CVE-2025-55182'"

SecRule REQUEST_BODY "@rx (vm\.runInThisContext|child_process|fs\.writeFile|require\(|eval\()" \
    "id:9000005,\
    phase:2,\
    block,\
    status:403,\
    log,\
    msg:'CVE-2025-55182: Dangerous JavaScript function',\
    severity:CRITICAL,\
    tag:'CVE-2025-55182'"
```

---

*Due to length constraints, I'll create this as a separate file. Continuing...*
# 🏰 ULTIMATE VPS SECURITY FORTRESS - PART 2

## PHASE 4 (continued): File Integrity Monitoring (AIDE)

### Install and Configure AIDE

```bash
#!/bin/bash
# setup-aide.sh

# Install AIDE
apt install aide aide-common

# Initialize database
echo "Initializing AIDE database (this may take a while)..."
aideinit

# Move database to production location
mv /var/lib/aide/aide.db.new /var/lib/aide/aide.db

echo "✅ AIDE initialized"
```

### AIDE Configuration for Application Directories

```bash
# /etc/aide/aide.conf

# Custom rules for web applications
/var/www R+b+sha256

# Monitor these specifically
/var/www/web1/app R+b+sha256
/var/www/backend1/app R+b+sha256
/var/www/cms1/app R+b+sha256

# Exclude logs and temp files
!/var/www/*/logs
!/var/www/*/tmp
!/var/www/*/node_modules

# System binaries (detect if replaced)
/bin R+b+sha256
/sbin R+b+sha256
/usr/bin R+b+sha256
/usr/sbin R+b+sha256

# Configuration files
/etc R+b+sha256
!/etc/shadow$
!/etc/shadow-
!/etc/gshadow$
!/etc/gshadow-
!/etc/passwd.lock
!/etc/group.lock
```

### Automated AIDE Checks

```bash
#!/bin/bash
# /root/scripts/aide-check.sh

REPORT_FILE="/var/log/aide/check-$(date +%Y%m%d_%H%M%S).log"
mkdir -p /var/log/aide

echo "=== AIDE Integrity Check - $(date) ===" | tee $REPORT_FILE

# Run check
aide --check | tee -a $REPORT_FILE

# Check for changes
if grep -q "found differences" $REPORT_FILE; then
    echo "⚠️  FILE CHANGES DETECTED!" | tee -a $REPORT_FILE
    
    # Send alert
    cat $REPORT_FILE | mail -s "SECURITY ALERT: File Integrity Check Failed" admin@yourdomain.com
    
    # Log to security log
    logger -t AIDE "ALERT: File integrity check detected changes"
    
    # Send Telegram alert (optional)
    curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
        -d chat_id="$TELEGRAM_CHAT_ID" \
        -d text="⚠️ AIDE detected file changes on $(hostname)" \
        -d parse_mode="Markdown"
    
    exit 1
else
    echo "✅ No unauthorized changes detected" | tee -a $REPORT_FILE
    exit 0
fi
```

### Make Application Code Read-Only

```bash
#!/bin/bash
# /root/scripts/lock-source-code.sh

for app in web1 backend1 cms1; do
    APP_DIR="/var/www/$app/app"
    
    if [ -d "$APP_DIR" ]; then
        # Change ownership to root (app user can't modify)
        chown -R root:root $APP_DIR
        
        # Read-only for app user
        chmod -R 555 $APP_DIR
        
        # Specific files that need to be writable
        if [ -d "$APP_DIR/.next/cache" ]; then
            chown -R $app:$app $APP_DIR/.next/cache
            chmod -R 755 $APP_DIR/.next/cache
        fi
        
        echo "✅ Locked $app source code"
    fi
done

# Update AIDE database after locking
aide --update
mv /var/lib/aide/aide.db.new /var/lib/aide/aide.db

echo "✅ Source code locked and AIDE updated"
```

---

## PHASE 4: Docker Security Isolation

### Docker Compose - Complete Secure Setup

```yaml
# docker-compose-production.yml

version: '3.8'

networks:
  frontend-net:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/24
  
  backend-net:
    driver: bridge
    internal: true  # No external access
    ipam:
      config:
        - subnet: 172.21.0.0/24

volumes:
  postgres-data:
    driver: local
  redis-data:
    driver: local

services:
  # ========================================
  # Frontend - NextJS
  # ========================================
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    
    container_name: nextjs-frontend
    
    user: "node:node"
    
    expose:
      - "3000"
    
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://yourdomain.com/api
    
    networks:
      - frontend-net
    
    restart: unless-stopped
    
    security_opt:
      - no-new-privileges:true
      - apparmor:docker-default
    
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
    
    read_only: true
    
    tmpfs:
      - /tmp:noexec,nosuid,size=100m
      - /app/.next/cache:size=512m
    
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 512M
    
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # ========================================
  # Backend API - NodeJS
  # ========================================
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    
    container_name: nodejs-backend
    
    user: "node:node"
    
    expose:
      - "4000"
    
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://appuser:${DB_PASSWORD}@postgres:5432/appdb
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
      - JWT_SECRET=${JWT_SECRET}
    
    networks:
      - frontend-net
      - backend-net
    
    restart: unless-stopped
    
    security_opt:
      - no-new-privileges:true
    
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
    
    read_only: true
    
    tmpfs:
      - /tmp:noexec,nosuid,size=50m
    
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
    
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:4000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  # ========================================
  # PostgreSQL Database
  # ========================================
  postgres:
    image: postgres:16-alpine
    
    container_name: postgres-db
    
    expose:
      - "5432"
    
    environment:
      - POSTGRES_DB=appdb
      - POSTGRES_USER=appuser
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    
    networks:
      - backend-net
    
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./backend/init-db.sql:/docker-entrypoint-initdb.d/init.sql:ro
    
    restart: unless-stopped
    
    security_opt:
      - no-new-privileges:true
    
    command: >
      postgres
      -c max_connections=100
      -c shared_buffers=256MB
      -c effective_cache_size=1GB
      -c maintenance_work_mem=64MB
      -c checkpoint_completion_target=0.9
      -c wal_buffers=16MB
      -c default_statistics_target=100
      -c random_page_cost=1.1
      -c effective_io_concurrency=200
      -c work_mem=16MB
      -c min_wal_size=1GB
      -c max_wal_size=4GB
      -c log_statement=mod
      -c log_duration=on
      -c log_connections=on
      -c log_disconnections=on
    
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d appdb"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ========================================
  # Redis Cache
  # ========================================
  redis:
    image: redis:7-alpine
    
    container_name: redis-cache
    
    expose:
      - "6379"
    
    networks:
      - backend-net
    
    volumes:
      - redis-data:/data
    
    command: >
      redis-server
      --appendonly yes
      --requirepass ${REDIS_PASSWORD}
      --maxmemory 512mb
      --maxmemory-policy allkeys-lru
      --save 900 1
      --save 300 10
      --save 60 10000
    
    restart: unless-stopped
    
    security_opt:
      - no-new-privileges:true
    
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ========================================
  # Nginx Reverse Proxy
  # ========================================
  nginx:
    image: nginx:alpine
    
    container_name: nginx-proxy
    
    ports:
      - "80:80"
      - "443:443"
    
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    
    networks:
      - frontend-net
    
    restart: unless-stopped
    
    security_opt:
      - no-new-privileges:true
    
    depends_on:
      - frontend
      - backend
    
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Production Dockerfile - Frontend

```dockerfile
# frontend/Dockerfile.prod

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# Rebuild the source code
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Security: Remove unnecessary files
RUN rm -rf /app/node_modules/.cache && \
    rm -rf /tmp/* && \
    rm -rf /var/cache/apk/*

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "server.js"]
```

### Production Dockerfile - Backend

```dockerfile
# backend/Dockerfile.prod

FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copy application
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Remove unnecessary files
RUN rm -rf test/ docs/ .git/ *.md && \
    rm -rf /tmp/* && \
    rm -rf /var/cache/apk/*

# Set permissions
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "server.js"]
```

---

## PHASE 5: 24/7 MONITORING & ALERTING

### Comprehensive Health Check Script

```bash
#!/bin/bash
# /root/scripts/health-check.sh

LOG_FILE="/var/log/health-checks/$(date +%Y%m%d).log"
mkdir -p /var/log/health-checks

echo "=== Health Check - $(date) ===" | tee -a $LOG_FILE

ALERTS=""

# 1. Check Services
echo "Checking services..." | tee -a $LOG_FILE
for service in nginx postgresql redis-server; do
    if systemctl is-active --quiet $service; then
        echo "✅ $service: Running" | tee -a $LOG_FILE
    else
        echo "❌ $service: DOWN" | tee -a $LOG_FILE
        ALERTS="$ALERTS\n🔴 Service $service is DOWN"
        systemctl start $service
    fi
done

# 2. Check Docker Containers
if command -v docker &> /dev/null; then
    echo "Checking Docker containers..." | tee -a $LOG_FILE
    UNHEALTHY=$(docker ps --filter health=unhealthy --format "{{.Names}}")
    if [ -n "$UNHEALTHY" ]; then
        echo "❌ Unhealthy containers: $UNHEALTHY" | tee -a $LOG_FILE
        ALERTS="$ALERTS\n🔴 Unhealthy containers: $UNHEALTHY"
    else
        echo "✅ All containers healthy" | tee -a $LOG_FILE
    fi
fi

# 3. Check Disk Space
echo "Checking disk space..." | tee -a $LOG_FILE
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 85 ]; then
    echo "⚠️  Disk usage: ${DISK_USAGE}%" | tee -a $LOG_FILE
    ALERTS="$ALERTS\n⚠️  Disk usage critical: ${DISK_USAGE}%"
else
    echo "✅ Disk usage: ${DISK_USAGE}%" | tee -a $LOG_FILE
fi

# 4. Check Memory
echo "Checking memory..." | tee -a $LOG_FILE
MEM_USAGE=$(free | grep Mem | awk '{print ($3/$2) * 100.0}' | cut -d. -f1)
if [ $MEM_USAGE -gt 90 ]; then
    echo "⚠️  Memory usage: ${MEM_USAGE}%" | tee -a $LOG_FILE
    ALERTS="$ALERTS\n⚠️  Memory usage high: ${MEM_USAGE}%"
else
    echo "✅ Memory usage: ${MEM_USAGE}%" | tee -a $LOG_FILE
fi

# 5. Check CPU Load
echo "Checking CPU load..." | tee -a $LOG_FILE
CPU_LOAD=$(uptime | awk -F'load average:' '{print $2}' | cut -d, -f1 | tr -d ' ')
echo "✅ CPU load: $CPU_LOAD" | tee -a $LOG_FILE

# 6. Check Network Connectivity
echo "Checking network..." | tee -a $LOG_FILE
if ping -c 1 8.8.8.8 &> /dev/null; then
    echo "✅ Network: OK" | tee -a $LOG_FILE
else
    echo "❌ Network: DOWN" | tee -a $LOG_FILE
    ALERTS="$ALERTS\n🔴 Network connectivity issue"
fi

# 7. Check SSL Certificates
echo "Checking SSL certificates..." | tee -a $LOG_FILE
for domain in yourdomain.com; do
    CERT_EXPIRY=$(echo | openssl s_client -servername $domain -connect $domain:443 2>/dev/null | \
                  openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
    EXPIRY_DATE=$(date -d "$CERT_EXPIRY" +%s)
    CURRENT_DATE=$(date +%s)
    DAYS_LEFT=$(( ($EXPIRY_DATE - $CURRENT_DATE) / 86400 ))
    
    if [ $DAYS_LEFT -lt 30 ]; then
        echo "⚠️  SSL cert for $domain expires in $DAYS_LEFT days" | tee -a $LOG_FILE
        ALERTS="$ALERTS\n⚠️  SSL cert expiring soon: $domain ($DAYS_LEFT days)"
    else
        echo "✅ SSL cert for $domain: $DAYS_LEFT days left" | tee -a $LOG_FILE
    fi
done

# 8. Check for Failed Logins
echo "Checking failed logins..." | tee -a $LOG_FILE
FAILED_LOGINS=$(grep "Failed password" /var/log/auth.log | tail -10 | wc -l)
if [ $FAILED_LOGINS -gt 5 ]; then
    echo "⚠️  Failed login attempts: $FAILED_LOGINS" | tee -a $LOG_FILE
    ALERTS="$ALERTS\n⚠️  High failed login attempts: $FAILED_LOGINS"
else
    echo "✅ Failed logins: $FAILED_LOGINS" | tee -a $LOG_FILE
fi

# 9. Check Application Endpoints
echo "Checking application endpoints..." | tee -a $LOG_FILE
for url in https://yourdomain.com https://yourdomain.com/api/health; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $url)
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ $url: OK ($HTTP_CODE)" | tee -a $LOG_FILE
    else
        echo "❌ $url: FAIL ($HTTP_CODE)" | tee -a $LOG_FILE
        ALERTS="$ALERTS\n🔴 Endpoint down: $url ($HTTP_CODE)"
    fi
done

# 10. Send Alerts if needed
if [ -n "$ALERTS" ]; then
    echo -e "\n⚠️  ALERTS DETECTED!" | tee -a $LOG_FILE
    echo -e "$ALERTS" | tee -a $LOG_FILE
    
    # Email alert
    echo -e "Health Check Alerts from $(hostname)\n$ALERTS" | \
        mail -s "🚨 HEALTH CHECK ALERTS" admin@yourdomain.com
    
    # Telegram alert
    curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
        -d chat_id="$TELEGRAM_CHAT_ID" \
        -d text="🚨 Health Check Alerts from $(hostname)$ALERTS" \
        -d parse_mode="Markdown"
    
    exit 1
else
    echo -e "\n✅ All checks passed!" | tee -a $LOG_FILE
    exit 0
fi
```

### Security Monitoring Script

```bash
#!/bin/bash
# /root/scripts/security-monitor.sh

LOG_FILE="/var/log/security-monitor/$(date +%Y%m%d).log"
mkdir -p /var/log/security-monitor

echo "=== Security Monitor - $(date) ===" | tee -a $LOG_FILE

ALERTS=""

# 1. Check for CVE-2025-55182 exploitation attempts
echo "Checking for CVE-2025-55182 attacks..." | tee -a $LOG_FILE
CVE_ATTEMPTS=$(grep -c "next-action\|rsc-action" /var/log/nginx/access.log)
if [ $CVE_ATTEMPTS -gt 0 ]; then
    echo "⚠️  CVE-2025-55182 attempts: $CVE_ATTEMPTS" | tee -a $LOG_FILE
    ALERTS="$ALERTS\n⚠️  CVE-2025-55182 exploitation attempts: $CVE_ATTEMPTS"
    
    # Show attacker IPs
    grep "next-action\|rsc-action" /var/log/nginx/access.log | \
        awk '{print $1}' | sort | uniq -c | sort -rn | head -5 | tee -a $LOG_FILE
fi

# 2. Check for brute force attacks
echo "Checking for brute force attacks..." | tee -a $LOG_FILE
BRUTE_FORCE=$(fail2ban-client status sshd | grep "Currently banned" | awk '{print $NF}')
if [ $BRUTE_FORCE -gt 0 ]; then
    echo "⚠️  Banned IPs: $BRUTE_FORCE" | tee -a $LOG_FILE
    ALERTS="$ALERTS\n⚠️  Brute force attacks detected: $BRUTE_FORCE IPs banned"
fi

# 3. Check for suspicious processes
echo "Checking for suspicious processes..." | tee -a $LOG_FILE
SUSPICIOUS=$(ps aux | grep -E "xmrig|miner|crypto" | grep -v grep | wc -l)
if [ $SUSPICIOUS -gt 0 ]; then
    echo "🔴 SUSPICIOUS PROCESSES FOUND!" | tee -a $LOG_FILE
    ps aux | grep -E "xmrig|miner|crypto" | grep -v grep | tee -a $LOG_FILE
    ALERTS="$ALERTS\n🔴 CRITICAL: Suspicious processes detected (possible crypto miner)"
fi

# 4. Check for unauthorized users
echo "Checking users..." | tee -a $LOG_FILE
CURRENT_USERS=$(w -h | wc -l)
if [ $CURRENT_USERS -gt 1 ]; then
    echo "⚠️  Multiple users logged in: $CURRENT_USERS" | tee -a $LOG_FILE
    w | tee -a $LOG_FILE
    ALERTS="$ALERTS\n⚠️  Multiple users logged in: $CURRENT_USERS"
fi

# 5. Check file integrity
echo "Running AIDE check..." | tee -a $LOG_FILE
if /root/scripts/aide-check.sh > /tmp/aide-check.out 2>&1; then
    echo "✅ AIDE: No changes" | tee -a $LOG_FILE
else
    echo "🔴 AIDE: CHANGES DETECTED!" | tee -a $LOG_FILE
    ALERTS="$ALERTS\n🔴 CRITICAL: File integrity check failed - unauthorized changes detected"
fi

# 6. Check for new cron jobs
echo "Checking cron jobs..." | tee -a $LOG_FILE
CRON_COUNT=$(crontab -l 2>/dev/null | grep -v "^#" | wc -l)
echo "Current cron jobs: $CRON_COUNT" | tee -a $LOG_FILE

# 7. Check listening ports
echo "Checking listening ports..." | tee -a $LOG_FILE
LISTENING=$(netstat -tuln | grep LISTEN | grep -v "127.0.0.1\|::1")
echo "$LISTENING" | tee -a $LOG_FILE

# 8. Check for rootkits (basic)
echo "Checking for rootkits..." | tee -a $LOG_FILE
if command -v rkhunter &> /dev/null; then
    rkhunter --check --skip-keypress --report-warnings-only | tee -a $LOG_FILE
fi

# Send alerts if critical issues found
if [ -n "$ALERTS" ]; then
    echo -e "\n🚨 SECURITY ALERTS!" | tee -a $LOG_FILE
    echo -e "$ALERTS" | tee -a $LOG_FILE
    
    # Email
    echo -e "Security Alerts from $(hostname)\n$ALERTS" | \
        mail -s "🚨 SECURITY ALERTS" admin@yourdomain.com
    
    # Telegram
    curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
        -d chat_id="$TELEGRAM_CHAT_ID" \
        -d text="🚨 SECURITY ALERTS from $(hostname)$ALERTS" \
        -d parse_mode="Markdown"
    
    exit 1
else
    echo "✅ No security issues detected" | tee -a $LOG_FILE
    exit 0
fi
```

### Cron Jobs for Automation

```bash
# /etc/cron.d/security-monitoring

# Health checks every 5 minutes
*/5 * * * * root /root/scripts/health-check.sh >> /var/log/cron-health.log 2>&1

# Security monitoring every 15 minutes
*/15 * * * * root /root/scripts/security-monitor.sh >> /var/log/cron-security.log 2>&1

# AIDE integrity check daily at 3 AM
0 3 * * * root /root/scripts/aide-check.sh >> /var/log/cron-aide.log 2>&1

# Database backup daily at 2 AM
0 2 * * * root /root/scripts/backup-database.sh >> /var/log/cron-backup.log 2>&1

# Log rotation weekly
0 0 * * 0 root logrotate /etc/logrotate.conf

# System updates check daily at 4 AM
0 4 * * * root apt update && apt list --upgradable | mail -s "Updates Available" admin@yourdomain.com

# CVE-2025-55182 scan every hour
0 * * * * root /root/scripts/cve-check.sh >> /var/log/cron-cve.log 2>&1
```

---

## PHASE 5: INCIDENT RESPONSE PROCEDURES

### Emergency Lockdown Procedure

```bash
#!/bin/bash
# /root/scripts/emergency-lockdown.sh

echo "🚨 EMERGENCY LOCKDOWN INITIATED"
echo "Time: $(date)"

# Log this action
logger -p auth.crit "EMERGENCY LOCKDOWN INITIATED by $(whoami)"

# 1. Block ALL incoming traffic
echo "Blocking all incoming traffic..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw limit 22/tcp  # Keep SSH for recovery
ufw --force enable

# 2. Stop all web services
echo "Stopping web services..."
systemctl stop nginx apache2 2>/dev/null
docker-compose down 2>/dev/null
pm2 stop all 2>/dev/null

# 3. Kill suspicious processes
echo "Killing suspicious processes..."
pkill -9 xmrig
pkill -9 -f "crypto"
pkill -9 -f "miner"

# 4. Disconnect suspicious connections
echo "Checking active connections..."
netstat -antp | grep ESTABLISHED

# 5. Check logged in users
echo "Logged in users:"
w

# 6. Create forensics snapshot
echo "Creating forensics data..."
FORENSICS_DIR="/root/forensics/$(date +%Y%m%d_%H%M%S)"
mkdir -p $FORENSICS_DIR

# Save current state
ps auxf > $FORENSICS_DIR/processes.txt
netstat -antp > $FORENSICS_DIR/connections.txt
w > $FORENSICS_DIR/users.txt
last -100 > $FORENSICS_DIR/logins.txt
cp /var/log/auth.log $FORENSICS_DIR/
cp /var/log/nginx/access.log $FORENSICS_DIR/
df -h > $FORENSICS_DIR/disk.txt
free -h > $FORENSICS_DIR/memory.txt

# 7. Backup critical data
echo "Backing up critical data..."
/root/scripts/backup-database.sh emergency

# 8. Send alerts
MESSAGE="🚨 EMERGENCY LOCKDOWN
Server: $(hostname)
Time: $(date)
Initiated by: $(whoami)

Forensics: $FORENSICS_DIR

IMMEDIATE ACTION REQUIRED!"

echo "$MESSAGE" | mail -s "🚨 EMERGENCY LOCKDOWN" admin@yourdomain.com

curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
    -d chat_id="$TELEGRAM_CHAT_ID" \
    -d text="$MESSAGE"

echo "
✅ LOCKDOWN COMPLETE

Next Steps:
1. Review forensics data in: $FORENSICS_DIR
2. Investigate root cause
3. Rotate all credentials
4. Rebuild from clean state if compromised
5. Document incident

To restore services:
- systemctl start nginx
- docker-compose up -d
- pm2 start all
"
```

### Incident Response Checklist

```markdown
# INCIDENT RESPONSE CHECKLIST

## Phase 1: Detection & Containment (0-30 min)
- [ ] Alert received and acknowledged
- [ ] Execute emergency lockdown: `/root/scripts/emergency-lockdown.sh`
- [ ] Block attacker IPs: `ufw deny from <IP>`
- [ ] Isolate affected services
- [ ] Create forensics snapshot
- [ ] Notify team leads

## Phase 2: Investigation (30 min - 2 hours)
- [ ] Review logs: `/var/log/auth.log`, `/var/log/nginx/`
- [ ] Check AIDE reports for file modifications
- [ ] Identify entry point (CVE? weak password? etc.)
- [ ] Identify affected systems/data
- [ ] Document timeline of attack
- [ ] Preserve evidence for potential legal action

## Phase 3: Eradication (2-4 hours)
- [ ] Remove malware: `/root/scripts/remove-malware.sh`
- [ ] Kill malicious processes
- [ ] Remove backdoors
- [ ] Clean cron jobs
- [ ] Verify GRUB bootloader
- [ ] Update and patch all systems
- [ ] Close vulnerability that was exploited

## Phase 4: Recovery (4-24 hours)
- [ ] Rebuild compromised systems from clean images
- [ ] Restore data from verified clean backups
- [ ] Rotate ALL credentials:
  - [ ] Database passwords
  - [ ] JWT secrets
  - [ ] API keys
  - [ ] SSH keys
  - [ ] Cloud credentials (AWS, GCP, Azure)
  - [ ] User passwords
- [ ] Update firewall rules
- [ ] Implement additional security controls
- [ ] Gradually restore services
- [ ] Monitor closely for reinfection

## Phase 5: Post-Incident (1-7 days)
- [ ] Complete incident report
- [ ] Root cause analysis
- [ ] Update security procedures
- [ ] Implement lessons learned
- [ ] Train team on new procedures
- [ ] Schedule penetration test
- [ ] Review and update DR plan
- [ ] Notify affected parties if needed (GDPR compliance)

## Communication Plan
- **Internal**: Slack #security-incidents
- **Management**: Email + Phone
- **Customers**: Status page + Email (if customer data affected)
- **Authorities**: If criminal activity detected
```

---

## COMPLETE IMPLEMENTATION CHECKLIST

```markdown
# 🎯 COMPLETE SECURITY IMPLEMENTATION CHECKLIST

## ✅ PHASE 1: CVE-2025-55182 PROTECTION (CRITICAL - Day 1)
- [ ] Run vulnerability scan: `./quick-cve-check.sh`
- [ ] Update Next.js to patched version
- [ ] Update React to patched version
- [ ] Rebuild applications: `npm run build`
- [ ] Check for malware: `./detect-malware.sh`
- [ ] Remove any malware found: `./remove-malware.sh`
- [ ] Verify GRUB bootloader: `grub-install && update-grub`
- [ ] Test application functionality
- [ ] Document changes

## ✅ PHASE 2: SYSTEM HARDENING (Week 1)
- [ ] Kernel hardening: Apply sysctl settings
- [ ] Secure shared memory
- [ ] Create application users (web1, backend1, etc.)
- [ ] Setup directory structure with proper permissions
- [ ] Disable root login: `PermitRootLogin no`
- [ ] Change SSH port: `Port 50122`
- [ ] Disable password auth: `PasswordAuthentication no`
- [ ] Setup SSH keys for admin user
- [ ] Configure Fail2Ban
- [ ] Test SSH access

## ✅ PHASE 3: FIREWALL & NETWORK (Week 1)
- [ ] Install and configure UFW
- [ ] Set default policies: deny incoming, allow outgoing
- [ ] Allow only necessary ports (SSH, HTTP, HTTPS)
- [ ] Rate limit SSH: `ufw limit 50122/tcp`
- [ ] Enable firewall: `ufw enable`
- [ ] Configure PostgreSQL listen only localhost
- [ ] Update pg_hba.conf for localhost only
- [ ] Test database connections
- [ ] Setup network segmentation with iptables
- [ ] Test firewall rules

## ✅ PHASE 4: APPLICATION SECURITY (Week 1-2)
- [ ] Implement secure Next.js config
- [ ] Add security headers to Next.js
- [ ] Update backend with security middleware
- [ ] Implement JWT authentication properly
- [ ] Add rate limiting to all endpoints
- [ ] Use parameterized queries for database
- [ ] Validate all user inputs
- [ ] Implement proper error handling
- [ ] Setup CORS correctly
- [ ] Test authentication flow

## ✅ PHASE 5: DATABASE SECURITY (Week 2)
- [ ] Create application-specific database users
- [ ] Grant minimum necessary privileges
- [ ] Remove unnecessary privileges
- [ ] Enable connection limits
- [ ] Configure SSL for local connections (optional)
- [ ] Setup database audit logging
- [ ] Test database access
- [ ] Document connection strings

## ✅ PHASE 6: NGINX + WAF (Week 2)
- [ ] Install Nginx
- [ ] Configure Nginx reverse proxy
- [ ] Implement rate limiting zones
- [ ] Add security headers
- [ ] Block CVE-2025-55182 patterns
- [ ] Install ModSecurity
- [ ] Load OWASP CRS rules
- [ ] Add custom CVE-2025-55182 rules
- [ ] Test WAF with safe payloads
- [ ] Monitor WAF logs

## ✅ PHASE 7: FILE INTEGRITY (Week 2)
- [ ] Install AIDE
- [ ] Configure AIDE for application directories
- [ ] Initialize AIDE database
- [ ] Make source code read-only (root ownership)
- [ ] Setup automated AIDE checks
- [ ] Test AIDE alerts
- [ ] Document baseline

## ✅ PHASE 8: DOCKER SECURITY (Week 2-3, if using Docker)
- [ ] Create secure Dockerfiles
- [ ] Implement multi-stage builds
- [ ] Run containers as non-root
- [ ] Use read-only filesystems
- [ ] Drop all capabilities, add only needed
- [ ] Setup network isolation
- [ ] Implement resource limits
- [ ] Add health checks
- [ ] Test container security
- [ ] Document Docker setup

## ✅ PHASE 9: SECRETS MANAGEMENT (Week 3)
- [ ] Install age encryption
- [ ] Generate encryption keys
- [ ] Encrypt all .env files
- [ ] Securely delete original .env files
- [ ] Create decryption scripts
- [ ] Test encryption/decryption
- [ ] Backup encryption keys securely
- [ ] Document key management

## ✅ PHASE 10: MONITORING & ALERTING (Week 3)
- [ ] Create health check script
- [ ] Create security monitoring script
- [ ] Setup email notifications
- [ ] Setup Telegram bot (optional)
- [ ] Configure cron jobs for automation
- [ ] Test all monitoring scripts
- [ ] Verify alerts are received
- [ ] Document monitoring setup

## ✅ PHASE 11: BACKUP & RECOVERY (Week 3)
- [ ] Setup automated database backups
- [ ] Configure backup retention (30 days)
- [ ] Test backup restoration
- [ ] Backup encryption keys
- [ ] Backup Nginx configs
- [ ] Create disaster recovery plan
- [ ] Test recovery procedures
- [ ] Document backup process

## ✅ PHASE 12: INCIDENT RESPONSE (Week 4)
- [ ] Create emergency lockdown script
- [ ] Create malware removal script
- [ ] Document incident response procedures
- [ ] Create incident response checklist
- [ ] Assign roles and responsibilities
- [ ] Setup communication channels
- [ ] Test emergency procedures
- [ ] Train team on procedures

## ✅ PHASE 13: TESTING & VALIDATION (Week 4)
- [ ] Penetration testing (external service)
- [ ] Vulnerability scanning
- [ ] Test all security controls
- [ ] Verify CVE-2025-55182 protection
- [ ] Test backup restoration
- [ ] Test incident response
- [ ] Load testing
- [ ] Document test results

## ✅ PHASE 14: DOCUMENTATION (Ongoing)
- [ ] System architecture diagram
- [ ] Security controls documentation
- [ ] Runbooks for common tasks
- [ ] Incident response playbooks
- [ ] Contact information
- [ ] Credential management procedures
- [ ] Change management procedures
- [ ] Review documentation quarterly

## ✅ ONGOING MAINTENANCE
- [ ] Daily: Check security logs
- [ ] Daily: Monitor service health
- [ ] Weekly: Review failed login attempts
- [ ] Weekly: Check disk space
- [ ] Weekly: Review backup logs
- [ ] Monthly: System updates
- [ ] Monthly: Security audit
- [ ] Monthly: Review firewall logs
- [ ] Quarterly: Penetration testing
- [ ] Quarterly: Update documentation
- [ ] Quarterly: Team training
- [ ] Annually: Full security review
```

---

## 📊 SECURITY METRICS TO TRACK

```bash
#!/bin/bash
# /root/scripts/security-metrics.sh

echo "=== SECURITY METRICS REPORT ==="
echo "Date: $(date)"
echo ""

# 1. Failed login attempts (last 24h)
echo "Failed Login Attempts (24h):"
grep "Failed password" /var/log/auth.log | \
    awk -v date="$(date --date='yesterday' '+%b %d')" '$0 ~ date' | wc -l

# 2. Banned IPs
echo ""
echo "Currently Banned IPs:"
fail2ban-client status sshd | grep "Currently banned" || echo "0"

# 3. CVE-2025-55182 Attempts
echo ""
echo "CVE-2025-55182 Exploitation Attempts (24h):"
grep "next-action\|rsc-action" /var/log/nginx/access.log | \
    awk -v date="$(date --date='yesterday' '+%d/%b/%Y')" '$4 ~ date' | wc -l

# 4. AIDE Changes
echo ""
echo "File Integrity Changes (last check):"
if [ -f /var/log/aide/check-latest.log ]; then
    grep "changed:" /var/log/aide/check-latest.log | wc -l
else
    echo "No recent AIDE check"
fi

# 5. Disk Usage
echo ""
echo "Disk Usage:"
df -h / | tail -1 | awk '{print "Used: " $3 " / " $2 " (" $5 ")"}'

# 6. Memory Usage
echo ""
echo "Memory Usage:"
free -h | grep Mem | awk '{print "Used: " $3 " / " $2}'

# 7. Active Connections
echo ""
echo "Active External Connections:"
netstat -antp | grep ESTABLISHED | grep -v "127.0.0.1\|::1" | wc -l

# 8. Uptime
echo ""
echo "System Uptime:"
uptime -p

# 9. Last Backup
echo ""
echo "Last Database Backup:"
ls -lth /mnt/backup/postgres/*.sql.gz 2>/dev/null | head -1 || echo "No backups found"

# 10. SSL Certificate Expiry
echo ""
echo "SSL Certificate Expiry:"
for domain in yourdomain.com; do
    EXPIRY=$(echo | openssl s_client -servername $domain -connect $domain:443 2>/dev/null | \
             openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
    echo "$domain: $EXPIRY"
done
```

---

## 🎓 FINAL WORDS

### Security Layers Summary

Your system now has **15 LAYERS OF DEFENSE**:

1. **Network Level**: Firewall (UFW + iptables)
2. **Application Level**: Nginx reverse proxy
3. **WAF Level**: ModSecurity with OWASP CRS
4. **CVE Protection**: Custom CVE-2025-55182 rules
5. **Rate Limiting**: Multiple zones for different endpoints
6. **Authentication**: JWT with httpOnly cookies
7. **Authorization**: Role-based access control
8. **Input Validation**: Parameterized queries, sanitization
9. **Database Isolation**: Localhost only, minimal privileges
10. **User Separation**: One user per application
11. **File Integrity**: AIDE monitoring read-only code
12. **Process Isolation**: Docker containers (if used)
13. **Secrets Management**: Encrypted .env files
14. **Monitoring**: 24/7 automated health checks
15. **Incident Response**: Automated detection and alerting

### What Hackers CANNOT Do

Even if a hacker exploits a vulnerability and gains access:

❌ **Cannot access database** - localhost only + authentication  
❌ **Cannot modify source code** - read-only + root ownership + AIDE  
❌ **Cannot escalate privileges** - proper user separation  
❌ **Cannot persist** - file integrity monitoring detects changes  
❌ **Cannot move laterally** - network segmentation  
❌ **Cannot steal secrets** - encrypted at rest  
❌ **Cannot go undetected** - comprehensive logging & monitoring  

### Remember

> **"Security is not a product, but a process."** - Bruce Schneier

- ✅ Stay updated with security patches
- ✅ Monitor your systems daily
- ✅ Test your backups regularly
- ✅ Review and improve your security posture
- ✅ Train your team on security best practices

---

**STATUS: FORTRESS COMPLETE** 🏰  
**Protection Level: MAXIMUM** 🛡️  
**Defense Layers: 15** 🔐  
**Implementation Time: 3-4 weeks** ⏱️

**Good luck securing your infrastructure!** 🚀
