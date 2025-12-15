# ⚡ QUICK FIX: Sửa .env.local để build production

## ❌ Lỗi hiện tại

File `frontend/.env.local` đang có:
```env
NODE_ENV=development
NEXT_PUBLIC_API_DOMAIN=localhost:3012
```

## ✅ Cách sửa nhanh

### Bước 1: Mở file `.env.local`

Mở file: `frontend/.env.local`

### Bước 2: Sửa nội dung

**Thay đổi:**
```env
NODE_ENV=development
NEXT_PUBLIC_API_DOMAIN=localhost:3012
NEXT_PUBLIC_API_PORT=3012
```

**Thành:**
```env
NODE_ENV=production
NEXT_PUBLIC_API_DOMAIN=banyco.vn
# NEXT_PUBLIC_API_PORT=3012  # Không cần nếu dùng domain không có port
```

### Bước 3: Lưu file

Lưu file và chạy lại:
```powershell
cd deploy
.\BUILD_PRODUCTION.ps1
```

## 🔍 Kiểm tra

Sau khi sửa, file `.env.local` phải có:
- ✅ `NEXT_PUBLIC_API_DOMAIN=banyco.vn` (KHÔNG có localhost)
- ✅ `NODE_ENV=production`

## ⚠️ Lưu ý

- **KHÔNG** dùng `localhost` khi build production
- **PHẢI** dùng domain thật: `banyco.vn`
- Sau khi build, các giá trị này được embed vào code và không thể thay đổi









