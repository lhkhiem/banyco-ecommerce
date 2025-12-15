# 🔧 CẤU HÌNH ENVIRONMENT VARIABLES CHO PRODUCTION BUILD

## ⚠️ QUAN TRỌNG

Next.js **embed** các biến `NEXT_PUBLIC_*` vào code khi build. Nếu build mà không có production domain, app sẽ dùng `localhost`!

## 📝 Cách 1: Tạo file `.env.local` (KHUYẾN NGHỊ)

Tạo file `frontend/.env.local` với nội dung:

```env
# API Configuration
NEXT_PUBLIC_API_DOMAIN=banyco.vn
# Hoặc dùng full URL:
# NEXT_PUBLIC_API_URL=https://banyco.vn/api

# Frontend Domain (optional)
NEXT_PUBLIC_FRONTEND_DOMAIN=banyco.vn

# Node Environment
NODE_ENV=production
```

Sau đó chạy build:
```powershell
cd deploy
.\BUILD_PRODUCTION.ps1
```

## 📝 Cách 2: Set Environment Variables trước khi build

**Windows PowerShell:**
```powershell
$env:NEXT_PUBLIC_API_DOMAIN="banyco.vn"
$env:NODE_ENV="production"
cd deploy
.\BUILD_PRODUCTION.ps1
```

**Linux/Mac:**
```bash
export NEXT_PUBLIC_API_DOMAIN=banyco.vn
export NODE_ENV=production
cd deploy
bash BUILD_PRODUCTION.sh
```

## 📝 Cách 3: Build trên VPS với đúng environment

1. Upload source code lên VPS
2. Tạo `.env.local` trên VPS với production domain
3. Build trên VPS:
```bash
cd /var/www/banyco.vn/ecommerce-frontend
npm install --omit=dev
npm run build
```

## ✅ Kiểm tra sau khi build

Sau khi build, kiểm tra file `.next/server/app-paths-manifest.json` hoặc search trong `.next/` để xem có `localhost` không:

```powershell
# Windows
Select-String -Path "deploy\frontend\.next\**\*.js" -Pattern "localhost:3012"

# Linux/Mac
grep -r "localhost:3012" deploy/frontend/.next/
```

Nếu thấy `localhost`, nghĩa là build chưa dùng production domain!

## 🔍 Troubleshooting

### Lỗi: "Failed to fetch" hoặc "Network Error"

**Nguyên nhân:** Build đã embed `localhost` vào code.

**Giải pháp:**
1. Xóa `.next/` folder
2. Tạo `.env.local` với production domain
3. Build lại: `npm run build`

### Lỗi: "CORS error"

**Nguyên nhân:** Backend chưa cấu hình CORS cho production domain.

**Giải pháp:** Kiểm tra backend CORS settings trong `backend/src/app.ts`

## 📋 Checklist

- [ ] Đã tạo `frontend/.env.local` với `NEXT_PUBLIC_API_DOMAIN=banyco.vn`
- [ ] Đã set `NODE_ENV=production`
- [ ] Đã xóa `.next/` folder cũ (nếu có)
- [ ] Đã build lại với production env vars
- [ ] Đã kiểm tra không còn `localhost` trong build output
- [ ] Đã upload `.env.local` lên VPS (hoặc tạo mới trên VPS)









