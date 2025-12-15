# ✅ CHECKLIST UPLOAD WINSCP

Checklist để đảm bảo upload đầy đủ, tránh lỗi "thiếu thư mục app".

## 📦 Backend - Cần upload

Upload thư mục `backend/` vào `/var/www/banyco.vn/ecommerce-backend/`:

- [ ] `dist/` folder (QUAN TRỌNG!)
- [ ] `package.json`
- [ ] `package-lock.json`
- [ ] `migrations/` folder (nếu có SQL files)

## 📦 Frontend - Cần upload (QUAN TRỌNG!)

Upload thư mục `frontend/` vào `/var/www/banyco.vn/ecommerce-frontend/`:

### Bắt buộc phải có:
- [ ] `.next/` folder (Build output - QUAN TRỌNG!)
- [ ] `app/` folder (Source code - QUAN TRỌNG! Không được thiếu!)
- [ ] `public/` folder
- [ ] `package.json`
- [ ] `package-lock.json`
- [ ] `next.config.mjs`
- [ ] `middleware.ts` (nếu có)
- [ ] `tsconfig.json` (nếu có)

## ⚠️ LƯU Ý QUAN TRỌNG

### Next.js CẦN cả 2 thư mục:
1. ✅ `.next/` - Build output (đã compile)
2. ✅ `app/` - Source code (để Next.js resolve routes)

**KHÔNG CHỈ UPLOAD `.next/`!**

## 📤 Cách upload bằng WinSCP

### Option 1: Upload cả thư mục frontend (Khuyến nghị)

1. Chọn toàn bộ thư mục `frontend/` bên trái
2. Kéo thả vào `/var/www/banyco.vn/ecommerce-frontend/` bên phải
3. WinSCP sẽ upload tất cả files và folders

### Option 2: Upload từng phần

Nếu upload từng phần, đảm bảo upload:

1. **`.next/` folder:**
   - Local: `deploy/frontend/.next/`
   - Remote: `/var/www/banyco.vn/ecommerce-frontend/.next/`

2. **`app/` folder (BẮT BUỘC!):**
   - Local: `deploy/frontend/app/`
   - Remote: `/var/www/banyco.vn/ecommerce-frontend/app/`

3. **`public/` folder:**
   - Local: `deploy/frontend/public/`
   - Remote: `/var/www/banyco.vn/ecommerce-frontend/public/`

4. **Các file root:**
   - `package.json`
   - `next.config.mjs`
   - `middleware.ts`
   - `tsconfig.json`

## ✅ Verification sau khi upload

SSH vào VPS và kiểm tra:

```bash
# Check app folder
ls -la /var/www/banyco.vn/ecommerce-frontend/app/

# Check .next folder
ls -la /var/www/banyco.vn/ecommerce-frontend/.next/

# Check các file cần thiết
ls -la /var/www/banyco.vn/ecommerce-frontend/ | grep -E "(package.json|next.config|middleware|tsconfig)"
```

Phải thấy:
- ✅ `app/` directory
- ✅ `.next/` directory
- ✅ `package.json`
- ✅ `next.config.mjs`

## 🔧 Nếu vẫn thiếu app/

Upload lại thư mục `app/`:

```bash
# Trên VPS, tạo thư mục nếu chưa có
mkdir -p /var/www/banyco.vn/ecommerce-frontend/app

# Upload lại bằng WinSCP:
# Local: deploy/frontend/app/
# Remote: /var/www/banyco.vn/ecommerce-frontend/app/
```

Sau đó restart:
```bash
pm2 restart ecommerce-frontend
```

## 📝 Cấu trúc đầy đủ trên VPS

```
/var/www/banyco.vn/ecommerce-frontend/
├── .next/              ✅ Build output
├── app/                 ✅ Source code (BẮT BUỘC!)
│   ├── layout.tsx
│   ├── (main)/
│   ├── (shop)/
│   └── (account)/
├── public/              ✅ Static files
├── middleware.ts        ✅
├── tsconfig.json         ✅
├── package.json          ✅
├── next.config.mjs       ✅
└── .env.local           ✅ (sẽ tạo khi setup)
```

## 🎯 Tóm tắt

**QUAN TRỌNG NHẤT:**
- ✅ Upload **CẢ** `.next/` VÀ `app/` folder
- ✅ Không chỉ upload `.next/` thôi
- ✅ Next.js cần `app/` để resolve routes









