# 🔧 QUICK FIX - SAU KHI UPLOAD DEPLOY MỚI

Hướng dẫn nhanh để fix sau khi upload bản deploy mới.

## ⚡ Fix nhanh nhất

SSH vào VPS và chạy:

```bash
cd /var/www/banyco.vn
bash FIX_AND_RESTART.sh
```

Script này sẽ tự động:
- ✅ Cài đặt dependencies
- ✅ Kiểm tra environment files
- ✅ Restart services
- ✅ Test endpoints

## 📋 Hoặc làm thủ công từng bước

### Bước 1: Cài đặt dependencies

```bash
# Backend
cd /var/www/banyco.vn/ecommerce-backend
npm install --omit=dev

# Frontend
cd /var/www/banyco.vn/ecommerce-frontend
npm install --omit=dev
```

### Bước 2: Kiểm tra environment files

```bash
# Kiểm tra backend .env.local
ls -la /var/www/banyco.vn/ecommerce-backend/.env.local

# Kiểm tra frontend .env.local
ls -la /var/www/banyco.vn/ecommerce-frontend/.env.local
```

Nếu thiếu, tạo từ template (xem README.md)

### Bước 3: Restart PM2 services

```bash
# Restart tất cả
pm2 restart all

# Hoặc restart từng service
pm2 restart ecommerce-backend
pm2 restart ecommerce-frontend

# Kiểm tra status
pm2 status
```

### Bước 4: Kiểm tra logs

```bash
# Xem logs tất cả services
pm2 logs

# Xem logs backend
pm2 logs ecommerce-backend

# Xem logs frontend
pm2 logs ecommerce-frontend
```

### Bước 5: Test endpoints

```bash
# Test backend
curl http://localhost:3012/api/health

# Test frontend
curl http://localhost:3000
```

## 🐛 Các lỗi thường gặp

### 1. "Cannot find module"

**Nguyên nhân**: Chưa cài dependencies

**Fix**:
```bash
cd /var/www/banyco.vn/ecommerce-backend
npm install --omit=dev

cd /var/www/banyco.vn/ecommerce-frontend
npm install --omit=dev
```

### 2. "ECONNREFUSED" hoặc database error

**Nguyên nhân**: Database connection failed

**Fix**:
```bash
# Kiểm tra .env.local có đúng không
cat /var/www/banyco.vn/ecommerce-backend/.env.local | grep DB_

# Test database connection
psql -h localhost -U spa_cms_user -d spa_cms_db
```

### 3. Service không start

**Nguyên nhân**: Port đã bị chiếm hoặc config sai

**Fix**:
```bash
# Check port
netstat -tuln | grep -E ":(3000|3012)"

# Kill process nếu cần
pm2 delete all
pm2 start ecosystem.config.js
```

### 4. Frontend hiển thị maintenance page

**Nguyên nhân**: Frontend chưa build hoặc .next/ thiếu

**Fix**:
```bash
# Rebuild frontend (nếu cần)
cd /var/www/banyco.vn/ecommerce-frontend
npm run build

# Restart
pm2 restart ecommerce-frontend
```

### 5. 502 Bad Gateway

**Nguyên nhân**: Backend/Frontend không chạy hoặc Nginx config sai

**Fix**:
```bash
# Check services
pm2 status

# Check Nginx
sudo nginx -t
sudo systemctl status nginx

# Restart Nginx
sudo systemctl restart nginx
```

## ✅ Checklist

Sau khi upload, đảm bảo:

- [ ] Dependencies đã được cài: `npm install --omit=dev` trong cả 2 thư mục
- [ ] `.env.local` files đã được tạo và điền đầy đủ
- [ ] PM2 services đang chạy: `pm2 status`
- [ ] Ports đang được sử dụng: `netstat -tuln | grep -E ":(3000|3012)"`
- [ ] Backend respond: `curl http://localhost:3012/api/health`
- [ ] Frontend respond: `curl http://localhost:3000`
- [ ] Nginx đang chạy: `sudo systemctl status nginx`

## 🔍 Debug chi tiết

Chạy script kiểm tra:

```bash
cd /var/www/banyco.vn
bash CHECK_STATUS.sh
```

Script này sẽ kiểm tra tất cả và báo lỗi cụ thể.









