# 📤 HƯỚNG DẪN WINSCP - ĐƠN GIẢN NHẤT

Hướng dẫn từng bước upload bằng WinSCP.

## 🎯 Mục tiêu

Upload 2 thư mục lên VPS:
- `backend/` → `/var/www/banyco.vn/ecommerce-backend/`
- `frontend/` → `/var/www/banyco.vn/ecommerce-frontend/`

## 📋 Bước 1: Kết nối WinSCP

1. Mở WinSCP
2. Click **New Session**
3. Điền thông tin:
   ```
   File protocol: SFTP
   Host name: your-vps-ip
   Port number: 22
   User name: root
   Password: [nhập password]
   ```
4. Click **Save** (để lưu session)
5. Click **Login**

## 📤 Bước 2: Upload Backend

1. **Bên trái (Local)**: 
   - Navigate đến: `D:\PROJECT\Cursor\Banyco v2\Ecommerce\deploy\backend`

2. **Bên phải (Remote)**:
   - Navigate đến: `/var/www/banyco.vn/`
   - Tạo thư mục `ecommerce-backend` nếu chưa có:
     - Right-click → **New** → **Directory** → Tên: `ecommerce-backend`

3. **Upload**:
   - Chọn tất cả files trong `backend/` (Ctrl+A)
   - Kéo thả vào `ecommerce-backend/` bên phải
   - Hoặc: Right-click → **Upload** → Chọn destination: `ecommerce-backend`

## 📤 Bước 3: Upload Frontend

1. **Bên trái (Local)**:
   - Navigate đến: `D:\PROJECT\Cursor\Banyco v2\Ecommerce\deploy\frontend`

2. **Bên phải (Remote)**:
   - Navigate đến: `/var/www/banyco.vn/`
   - Tạo thư mục `ecommerce-frontend` nếu chưa có

3. **Upload**:
   - Chọn tất cả files trong `frontend/` (Ctrl+A)
   - Kéo thả vào `ecommerce-frontend/` bên phải

## ⚙️ Bước 4: Setup trên VPS (SSH)

Sau khi upload xong, mở terminal trong WinSCP:
- Click **Commands** → **Open Terminal** (hoặc F9)

Hoặc SSH riêng:
```bash
ssh root@your-vps-ip
```

Chạy các lệnh setup (xem README.md)

## 💡 Tips WinSCP

### Upload nhanh hơn
- **Queue**: Upload nhiều files cùng lúc
  - Commands → **Transfer Settings** → **Queue**
  - Chọn files → Right-click → **Add to Queue**
  - Commands → **Process Queue**

### Resume upload nếu bị gián đoạn
- WinSCP tự động resume nếu bị gián đoạn
- Hoặc chọn **Resume** khi upload lại

### Xem progress
- Window → **Transfer** (hoặc F9) để xem progress

### Sync folders
- Commands → **Synchronize** để sync 2 thư mục

## ✅ Checklist

- [ ] Backend đã upload vào `/var/www/banyco.vn/ecommerce-backend/`
- [ ] Frontend đã upload vào `/var/www/banyco.vn/ecommerce-frontend/`
- [ ] Có file `package.json` trong cả 2 thư mục
- [ ] Backend có thư mục `dist/`
- [ ] Frontend có thư mục `.next/`

## 🐛 Troubleshooting

### Upload bị lỗi "Permission denied"
```bash
# Trên VPS, set permissions:
chown -R root:root /var/www/banyco.vn
```

### Upload chậm
- Kiểm tra kết nối mạng
- Thử upload từng phần nhỏ
- Dùng Queue để upload tuần tự

### File bị corrupt
- Upload lại với mode Binary
- Preferences → Transfer → Binary









