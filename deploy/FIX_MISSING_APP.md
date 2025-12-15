# 🔧 FIX: Thiếu thư mục app hoặc pages

## ❌ Vấn đề

Next.js báo lỗi: "Cannot find module 'app' or 'pages'"

## ✅ Nguyên nhân

Next.js production cần:
- ✅ `.next/` folder (build output) - ĐÃ CÓ
- ✅ `app/` folder (source code) - THIẾU!
- ✅ `package.json`, `next.config.mjs` - ĐÃ CÓ
- ✅ `public/` folder - ĐÃ CÓ
- ✅ `middleware.ts` (nếu có) - CẦN THÊM
- ✅ `tsconfig.json` (nếu có) - CẦN THÊM

## 🔧 Giải pháp

### Cách 1: Copy thêm thư mục app (Đã tự động)

Files đã được copy vào `deploy/frontend/`:
- ✅ `app/` folder
- ✅ `middleware.ts`
- ✅ `tsconfig.json`

### Cách 2: Upload thủ công bằng WinSCP

Nếu vẫn thiếu, upload thêm:

1. **Upload thư mục `app/`:**
   - Local: `frontend/app/`
   - Remote: `/var/www/banyco.vn/ecommerce-frontend/app/`

2. **Upload các file root:**
   - `middleware.ts` → `/var/www/banyco.vn/ecommerce-frontend/`
   - `tsconfig.json` → `/var/www/banyco.vn/ecommerce-frontend/`

### Cách 3: Trên VPS, copy từ source (nếu có)

Nếu bạn có source code trên VPS:

```bash
# Copy app folder
cp -r /path/to/source/frontend/app /var/www/banyco.vn/ecommerce-frontend/

# Copy middleware và config
cp /path/to/source/frontend/middleware.ts /var/www/banyco.vn/ecommerce-frontend/
cp /path/to/source/frontend/tsconfig.json /var/www/banyco.vn/ecommerce-frontend/
```

## 📁 Cấu trúc đầy đủ cần có

```
/var/www/banyco.vn/ecommerce-frontend/
├── .next/              ✅ Build output
├── app/                 ✅ Source code (CẦN THIẾT!)
│   ├── layout.tsx
│   ├── (main)/
│   ├── (shop)/
│   └── (account)/
├── public/              ✅ Static files
├── middleware.ts        ✅ (nếu có)
├── tsconfig.json         ✅ (nếu có)
├── package.json          ✅
├── next.config.mjs       ✅
└── .env.local            ✅
```

## ✅ Sau khi copy

Restart frontend:

```bash
pm2 restart ecommerce-frontend
```

## 🐛 Nếu vẫn lỗi

Kiểm tra:

```bash
# Check app folder exists
ls -la /var/www/banyco.vn/ecommerce-frontend/app/

# Check Next.js can find it
cd /var/www/banyco.vn/ecommerce-frontend
node -e "console.log(require('fs').existsSync('./app'))"

# Check PM2 logs
pm2 logs ecommerce-frontend
```









