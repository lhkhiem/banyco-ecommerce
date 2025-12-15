# 🔧 Cấu hình Environment Variables cho Local Development

## ⚠️ QUAN TRỌNG

Để chạy frontend trên môi trường dev local và kết nối với backend localhost, bạn cần tạo file `.env.local` trong thư mục `frontend/`.

## 📝 Cách tạo file `.env.local`

1. Tạo file mới tên `.env.local` trong thư mục `frontend/`
2. Copy nội dung sau vào file:

```env
# API Configuration for Local Development
NEXT_PUBLIC_API_URL=http://localhost:3012/api

# Alternative: You can also use NEXT_PUBLIC_API_DOMAIN
# NEXT_PUBLIC_API_DOMAIN=localhost:3012

# Frontend Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

## ✅ Sau khi tạo file

1. **Restart Next.js dev server** để áp dụng thay đổi:
   ```powershell
   # Dừng server hiện tại (Ctrl+C)
   # Sau đó chạy lại:
   npm run dev
   ```

2. **Kiểm tra** xem API đã trỏ về localhost chưa:
   - Mở DevTools → Network tab
   - Xem các request API có đang gọi đến `http://localhost:3012/api` không

## 🔍 Troubleshooting

### Vẫn thấy `ecommerce-api.banyco.vn` trong Network tab?

- Đảm bảo file `.env.local` đã được tạo đúng trong thư mục `frontend/`
- Restart Next.js dev server
- Xóa thư mục `.next/` và chạy lại:
  ```powershell
  Remove-Item -Recurse -Force .next
  npm run dev
  ```

### Lỗi CORS?

- Đảm bảo backend đang chạy trên `http://localhost:3012`
- Kiểm tra CORS settings trong backend

## 📌 Lưu ý

- File `.env.local` có **ưu tiên cao nhất** và sẽ override các giá trị trong `.env`
- File `.env.local` đã được gitignore, nên an toàn để lưu config local
- File `.env` vẫn giữ config cho production build


