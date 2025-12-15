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
