# 📸 HƯỚNG DẪN UPLOAD HÌNH ẢNH LÊN VPS

## ⚠️ QUAN TRỌNG

Website cần thư mục `uploads/` chứa tất cả hình ảnh sản phẩm. Nếu thiếu, website sẽ hiển thị lỗi 404 cho tất cả hình ảnh.

## 📁 Vị trí thư mục uploads

**Local (sau khi build):**
```
deploy/
└── uploads/          # Thư mục này chứa tất cả hình ảnh
    ├── 2025-10-28/
    ├── 2025-10-29/
    └── ...
```

**Trên VPS:**
```
/var/www/banyco.vn/ecommerce-uploads/
```

## 📤 Cách 1: Upload bằng WinSCP (KHUYẾN NGHỊ)

### Bước 1: Kết nối WinSCP

1. Mở WinSCP
2. Kết nối đến VPS (như đã làm với backend/frontend)

### Bước 2: Upload thư mục uploads

1. **Bên trái (Local)**: Navigate đến `deploy/uploads/`
2. **Bên phải (Remote)**: Navigate đến `/var/www/banyco.vn/`

3. **Upload:**
   - Chọn toàn bộ thư mục `uploads/` bên trái
   - Kéo thả vào `/var/www/banyco.vn/ecommerce-uploads/` bên phải
   - Hoặc: Right-click `uploads/` → **Upload** → Destination: `/var/www/banyco.vn/ecommerce-uploads/`

### Bước 3: Kiểm tra permissions

Sau khi upload, SSH vào VPS và chạy:

```bash
# Kiểm tra thư mục đã tồn tại chưa
ls -la /var/www/banyco.vn/ecommerce-uploads/

# Set permissions (nếu cần)
sudo chown -R www-data:www-data /var/www/banyco.vn/ecommerce-uploads
sudo chmod -R 755 /var/www/banyco.vn/ecommerce-uploads
```

## 📤 Cách 2: Upload bằng SCP (Command line)

**Windows PowerShell:**
```powershell
# Từ thư mục deploy/
scp -r uploads root@your-vps-ip:/var/www/banyco.vn/ecommerce-uploads
```

**Linux/Mac:**
```bash
# Từ thư mục deploy/
scp -r uploads root@your-vps-ip:/var/www/banyco.vn/ecommerce-uploads
```

## ⚙️ Cấu hình Backend

Đảm bảo backend trên VPS có file `.env.local` với:

```env
UPLOAD_PATH=/var/www/banyco.vn/ecommerce-uploads
```

Sau đó restart backend:
```bash
pm2 restart ecommerce-backend
```

## 🔍 Kiểm tra sau khi upload

1. **Kiểm tra file đã upload:**
```bash
# Đếm số file
find /var/www/banyco.vn/ecommerce-uploads -type f | wc -l

# Xem một vài file
ls -la /var/www/banyco.vn/ecommerce-uploads/2025-11-21/
```

2. **Kiểm tra backend có serve được ảnh không:**
```bash
# Test một URL ảnh
curl -I https://ecommerce-api.banyco.vn/uploads/2025-11-21/efc4a514-ab0c-48fd-827d-e8245919c42f/original_Anh%20may%20massage%202.png
```

Nếu trả về `200 OK`, nghĩa là đã thành công!

3. **Kiểm tra trên website:**
   - Mở `https://banyco.vn`
   - Mở DevTools → Network tab
   - Reload trang
   - Kiểm tra các request ảnh có trả về `200 OK` không

## 🐛 Troubleshooting

### Lỗi 404 Not Found cho tất cả ảnh

**Nguyên nhân:** Thư mục uploads chưa được upload hoặc path không đúng.

**Giải pháp:**
1. Kiểm tra thư mục tồn tại: `ls -la /var/www/banyco.vn/ecommerce-uploads/`
2. Kiểm tra `.env.local` có `UPLOAD_PATH` đúng không
3. Restart backend: `pm2 restart ecommerce-backend`

### Lỗi Permission Denied

**Nguyên nhân:** Backend không có quyền đọc thư mục.

**Giải pháp:**
```bash
sudo chown -R www-data:www-data /var/www/banyco.vn/ecommerce-uploads
sudo chmod -R 755 /var/www/banyco.vn/ecommerce-uploads
```

### Một số ảnh hiển thị, một số không

**Nguyên nhân:** Chỉ upload một phần file.

**Giải pháp:** Upload lại toàn bộ thư mục `uploads/`

## 📋 Checklist

- [ ] Đã chạy `BUILD_PRODUCTION.ps1` để tạo thư mục `deploy/uploads/`
- [ ] Đã upload thư mục `uploads/` lên `/var/www/banyco.vn/ecommerce-uploads/`
- [ ] Đã kiểm tra số lượng file trên VPS (phải ~277 files)
- [ ] Đã cấu hình `UPLOAD_PATH` trong backend `.env.local`
- [ ] Đã restart backend: `pm2 restart ecommerce-backend`
- [ ] Đã test một URL ảnh và nhận được `200 OK`
- [ ] Đã kiểm tra website hiển thị ảnh đúng









