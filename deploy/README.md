# 🚀 HƯỚNG DẪN DEPLOY BẰNG WINSCP

Hướng dẫn upload thư mục `deploy/` lên VPS bằng WinSCP.

## 📁 Cấu trúc thư mục deploy

```
deploy/
├── backend/              # Backend application
│   ├── dist/            # Compiled JavaScript
│   ├── package.json
│   └── package-lock.json
│
├── frontend/            # Frontend application
│   ├── .next/          # Next.js build output ✅
│   ├── app/            # Next.js app directory ✅ (CẦN THIẾT!)
│   ├── components/     # React components ✅
│   ├── lib/            # Libraries & utilities ✅
│   ├── config/         # Config files ✅
│   ├── public/         # Static files ✅
│   ├── middleware.ts   # Next.js middleware ✅
│   ├── tsconfig.json   # TypeScript config ✅
│   ├── package.json    ✅
│   └── next.config.mjs  ✅
│
└── uploads/            # HÌNH ẢNH - QUAN TRỌNG! 📸
    ├── 2025-10-28/
    ├── 2025-10-29/
    └── ... (277+ files)
```

**⚠️ LƯU Ý:** Thư mục `uploads/` chứa tất cả hình ảnh sản phẩm. Phải upload lên VPS vào `/var/www/banyco.vn/ecommerce-uploads/`

**Xem:** `deploy/UPLOAD_IMAGES.md` để biết cách upload hình ảnh.

## 🔨 Build Production Đầy Đủ

**⚠️ QUAN TRỌNG: Phải cấu hình production domain trước khi build!**

### ⚠️ VẤN ĐỀ HIỆN TẠI

File `frontend/.env.local` đang có `localhost:3012`. Nếu build với cấu hình này, app sẽ dùng `localhost` trên production và gây lỗi!

**Xem:** `deploy/FIX_ENV_BEFORE_BUILD.md` để biết cách sửa.

### Bước 1: Cập nhật file `.env.local`

**Sửa file `frontend/.env.local`:**

```env
# Thay đổi từ:
# NEXT_PUBLIC_API_DOMAIN=localhost:3012
# NODE_ENV=development

# Thành:
NEXT_PUBLIC_API_DOMAIN=banyco.vn
NODE_ENV=production
```

**Hoặc** set environment variables trước khi build:
```powershell
# Windows
$env:NEXT_PUBLIC_API_DOMAIN="banyco.vn"
$env:NODE_ENV="production"

# Linux/Mac
export NEXT_PUBLIC_API_DOMAIN=banyco.vn
export NODE_ENV=production
```

### Bước 2: Chạy script build

**Windows:**
```powershell
cd deploy
.\BUILD_PRODUCTION.ps1
```

**Linux/Mac:**
```bash
cd deploy
bash BUILD_PRODUCTION.sh
```

Script này sẽ:
- ✅ Kiểm tra environment variables
- ✅ Build backend và frontend với production domain
- ✅ Copy đầy đủ tất cả files cần thiết
- ✅ Đảm bảo có cả `.next/` VÀ `app/` folder
- ✅ Verify tất cả files trước khi deploy

**Xem thêm:** `deploy/ENV_SETUP.md` để biết chi tiết về cấu hình environment variables.

## ⚠️ QUAN TRỌNG: Thư mục app/ là BẮT BUỘC

Next.js production **CẦN** thư mục `app/` để chạy, không chỉ có `.next/`.

Đảm bảo upload **CẢ 2**:
- ✅ `.next/` folder (build output)
- ✅ `app/` folder (source code)

## 📤 Bước 1: Upload bằng WinSCP

### Kết nối WinSCP

1. Mở WinSCP
2. Tạo session mới:
   - **File protocol**: SFTP
   - **Host name**: `your-vps-ip`
   - **Port number**: `22`
   - **User name**: `root` (hoặc username của bạn)
   - **Password**: Nhập password VPS
3. Click **Login**

### Upload files

1. **Bên trái (Local)**: Navigate đến thư mục `deploy/`
2. **Bên phải (Remote)**: Navigate đến `/var/www/banyco.vn/`

3. **Upload backend:**
   - Chọn thư mục `backend/` bên trái
   - Kéo thả vào `/var/www/banyco.vn/ecommerce-backend/` bên phải
   - Hoặc: Right-click `backend/` → **Upload** → Chọn destination: `/var/www/banyco.vn/ecommerce-backend/`

4. **Upload frontend (QUAN TRỌNG - upload đầy đủ):**
   - Chọn thư mục `frontend/` bên trái
   - Kéo thả vào `/var/www/banyco.vn/ecommerce-frontend/` bên phải
   - **Đảm bảo upload CẢ:**
     - ✅ `.next/` folder
     - ✅ `app/` folder (BẮT BUỘC!)
     - ✅ `components/` folder
     - ✅ `lib/` folder
     - ✅ `config/` folder
     - ✅ `public/` folder
     - ✅ `middleware.ts`
     - ✅ `tsconfig.json`
     - ✅ `package.json`
     - ✅ `next.config.mjs`

5. **Upload uploads (HÌNH ẢNH - QUAN TRỌNG!):**
   - Chọn thư mục `uploads/` bên trái
   - Kéo thả vào `/var/www/banyco.vn/ecommerce-uploads/` bên phải
   - **Đảm bảo upload TOÀN BỘ** thư mục `uploads/` (277+ files)
   - **Xem:** `deploy/UPLOAD_IMAGES.md` để biết chi tiết

### Lưu ý khi upload

- ✅ **Upload mode**: Binary (mặc định)
- ✅ **Preserve timestamp**: Có thể bật
- ✅ **Overwrite**: Chọn "Overwrite" nếu file đã tồn tại
- ✅ **Upload cả thư mục ẩn**: Settings → Preferences → Transfer → "Show hidden files"

## 🔧 Bước 2: Setup trên VPS

Sau khi upload xong, SSH vào VPS và chạy:

```bash
# Tạo thư mục nếu chưa có
mkdir -p /var/www/banyco.vn/ecommerce-backend
mkdir -p /var/www/banyco.vn/ecommerce-frontend

# Di chuyển vào thư mục
cd /var/www/banyco.vn

# Cài đặt dependencies cho backend
cd ecommerce-backend
npm install --omit=dev

# Cài đặt dependencies cho frontend
cd ../ecommerce-frontend
npm install --omit=dev
```

## ⚙️ Bước 3: Cấu hình Environment Variables

### Backend `.env.local`

Tạo file `/var/www/banyco.vn/ecommerce-backend/.env.local`:

```bash
NODE_ENV=production

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=spa_cms_user
DB_PASSWORD=your_db_password
DB_NAME=spa_cms_db

# JWT Secrets (min 32 chars)
JWT_SECRET=your_jwt_secret_minimum_32_characters_long
JWT_REFRESH_SECRET=your_jwt_refresh_secret_minimum_32_characters_long

# Domains
FRONTEND_DOMAIN=banyco.vn
API_DOMAIN=api.banyco.vn
PRODUCTION_FRONTEND_DOMAIN=https://banyco.vn
PRODUCTION_API_DOMAIN=https://api.banyco.vn
PRODUCTION_DOMAIN_SUFFIX=banyco.vn

# Port
API_PORT=3012

# CORS
ECOMMERCE_FRONTEND_ORIGIN=https://banyco.vn
```

### Frontend `.env.local`

Tạo file `/var/www/banyco.vn/ecommerce-frontend/.env.local`:

```bash
NODE_ENV=production

# API
NEXT_PUBLIC_API_URL=https://api.banyco.vn
NEXT_PUBLIC_API_DOMAIN=api.banyco.vn
NEXT_PUBLIC_API_PORT=3012

# Site
NEXT_PUBLIC_SITE_URL=https://banyco.vn
```

## 🗄️ Bước 4: Setup Database

```bash
# Tạo database và user
sudo -u postgres psql

# Trong PostgreSQL shell:
CREATE USER spa_cms_user WITH PASSWORD 'your_password';
CREATE DATABASE spa_cms_db OWNER spa_cms_user;
GRANT ALL PRIVILEGES ON DATABASE spa_cms_db TO spa_cms_user;
\c spa_cms_db
GRANT ALL ON SCHEMA public TO spa_cms_user;
\q

# Chạy migrations
cd /var/www/banyco.vn/ecommerce-backend
npm run migrate
```

## 🚀 Bước 5: Start Services với PM2

```bash
# Cài đặt PM2 (nếu chưa có)
npm install -g pm2

# Tạo ecosystem.config.js
cat > /var/www/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'ecommerce-backend',
      script: './dist/index.js',
      cwd: '/var/www/banyco.vn/ecommerce-backend',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3012
      },
      error_file: '/var/log/ecommerce-backend/error.log',
      out_file: '/var/log/ecommerce-backend/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G'
    },
    {
      name: 'ecommerce-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/banyco.vn/ecommerce-frontend',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/ecommerce-frontend/error.log',
      out_file: '/var/log/ecommerce-frontend/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G'
    }
  ]
};
EOF

# Tạo log directories
mkdir -p /var/log/ecommerce-backend
mkdir -p /var/log/ecommerce-frontend

# Start services
cd /var/www
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🌐 Bước 6: Setup Nginx

```bash
# Tạo nginx config
sudo nano /etc/nginx/sites-available/ecommerce
```

Paste nội dung:

```nginx
# Backend API
upstream ecommerce_backend {
    server 127.0.0.1:3012;
    keepalive 64;
}

# Frontend
upstream ecommerce_frontend {
    server 127.0.0.1:3000;
    keepalive 64;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.banyco.vn banyco.vn www.banyco.vn;
    return 301 https://$server_name$request_uri;
}

# Backend API Server
server {
    listen 443 ssl http2;
    server_name api.banyco.vn;

    ssl_certificate /etc/letsencrypt/live/api.banyco.vn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.banyco.vn/privkey.pem;

    location / {
        proxy_pass http://ecommerce_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend Server
server {
    listen 443 ssl http2;
    server_name banyco.vn www.banyco.vn;

    ssl_certificate /etc/letsencrypt/live/banyco.vn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/banyco.vn/privkey.pem;

    location / {
        proxy_pass http://ecommerce_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable và reload:

```bash
sudo ln -s /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔐 Bước 7: Setup SSL

```bash
sudo certbot --nginx -d api.banyco.vn
sudo certbot --nginx -d banyco.vn -d www.banyco.vn
```

## ✅ Kiểm tra

```bash
# Check PM2
pm2 status
pm2 logs

# Check backend
curl http://localhost:3012/api/health

# Check frontend
curl http://localhost:3000

# Check app folder exists
ls -la /var/www/banyco.vn/ecommerce-frontend/app/
```

## 🐛 Troubleshooting

### Lỗi: "Cannot find module 'app' or 'pages'"

**Nguyên nhân**: Thiếu thư mục `app/` trong frontend

**Fix**:
1. Upload lại thư mục `app/` từ `deploy/frontend/app/` lên VPS
2. Đảm bảo có trong `/var/www/banyco.vn/ecommerce-frontend/app/`
3. Restart: `pm2 restart ecommerce-frontend`

### Lỗi: "Cannot find module 'middleware'"

**Fix**: Upload `middleware.ts` vào `/var/www/banyco.vn/ecommerce-frontend/`

## 📝 Lưu ý

1. **WinSCP Settings**: 
   - Preferences → Transfer → Binary (cho file binary)
   - Preferences → Transfer → Preserve timestamp (tùy chọn)
   - Preferences → Panels → Show hidden files (để thấy .next)

2. **Upload lớn**: 
   - Nếu upload bị gián đoạn, có thể upload lại từng phần
   - Hoặc dùng Queue để upload tuần tự

3. **Permissions**: 
   - Sau khi upload, có thể cần set permissions:
   ```bash
   chown -R root:root /var/www/banyco.vn
   ```

## 🔄 Update sau này

1. Build lại trên local
2. Upload lại bằng WinSCP (chỉ upload thư mục thay đổi)
3. Restart services:
   ```bash
   pm2 restart ecommerce-backend
   pm2 restart ecommerce-frontend
   ```
