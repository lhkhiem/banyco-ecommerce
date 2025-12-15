# ⚠️ FIX: Cập nhật .env.local trước khi build production

## Vấn đề hiện tại

File `frontend/.env.local` đang có:
```env
NODE_ENV=development
NEXT_PUBLIC_API_DOMAIN=localhost:3012
```

Nếu build với cấu hình này, Next.js sẽ embed `localhost:3012` vào code, gây lỗi trên production!

## ✅ Giải pháp

### Cách 1: Cập nhật `.env.local` (KHUYẾN NGHỊ)

Sửa file `frontend/.env.local`:

```env
# Production Configuration
NODE_ENV=production
NEXT_PUBLIC_API_DOMAIN=banyco.vn
# NEXT_PUBLIC_API_PORT=3012  # Không cần nếu dùng domain không có port
```

### Cách 2: Tạo `.env.production` riêng

Tạo file `frontend/.env.production`:

```env
NODE_ENV=production
NEXT_PUBLIC_API_DOMAIN=banyco.vn
```

Next.js sẽ tự động load `.env.production` khi `NODE_ENV=production`.

### Cách 3: Set environment variables trước khi build

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

## 🔍 Kiểm tra sau khi build

Sau khi build, kiểm tra xem có còn `localhost` trong build output không:

```powershell
# Windows
Select-String -Path "deploy\frontend\.next\**\*.js" -Pattern "localhost:3012" | Select-Object -First 5

# Linux/Mac
grep -r "localhost:3012" deploy/frontend/.next/ | head -5
```

Nếu **KHÔNG** thấy `localhost`, nghĩa là build đã dùng production domain ✅

Nếu **VẪN** thấy `localhost`, cần:
1. Xóa `.next/` folder: `Remove-Item -Recurse frontend\.next`
2. Cập nhật `.env.local` với production domain
3. Build lại: `npm run build`

## 📝 Lưu ý

- `.env.local` có priority cao nhất trong Next.js
- `NEXT_PUBLIC_*` variables được embed vào code khi build
- Phải set đúng trước khi chạy `npm run build`
- Sau khi build, không thể thay đổi được (phải build lại)









