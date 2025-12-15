# 📸 CƠ CHẾ LOAD ẢNH - PHÂN TÍCH VÀ ĐỀ XUẤT TỐI ƯU

## 📋 MỤC LỤC
1. [Cơ chế hiện tại](#cơ-chế-hiện-tại)
2. [Ưu điểm](#ưu-điểm)
3. [Nhược điểm](#nhược-điểm)
4. [Đề xuất phương án tối ưu](#đề-xuất-phương-án-tối-ưu)

---

## 🔄 CƠ CHẾ HIỆN TẠI

### 1. Nguồn ảnh trong Database

#### A. Hero Slider
```sql
SELECT COALESCE(a.cdn_url, a.url, s.image_url) AS image_url
FROM sliders s
LEFT JOIN assets a ON s.image_id = a.id
```
**Ưu tiên:**
1. `assets.cdn_url` (nếu có `image_id`)
2. `assets.url` (nếu có `image_id`)
3. `sliders.image_url` (fallback - direct URL)

#### B. Product Images
```sql
-- Thumbnail
SELECT thumb.url, thumb.cdn_url
FROM products p
LEFT JOIN assets thumb ON thumb.id = p.thumbnail_id

-- Gallery
SELECT a.url, a.cdn_url
FROM product_images pi
JOIN assets a ON a.id = pi.asset_id
```
**Ưu tiên:**
1. `assets.cdn_url`
2. `assets.url`
3. Không có fallback

#### C. Post Images
```sql
SELECT a.url, a.cdn_url
FROM posts p
LEFT JOIN assets a ON a.id = p.cover_asset_id
```
**Ưu tiên:**
1. `assets.cdn_url`
2. `assets.url`
3. `posts.content->meta->imageUrl` (fallback từ JSONB)

### 2. URL Normalization

Tất cả URLs đều được normalize qua `normalizeMediaUrl()`:

```typescript
// Thay thế localhost/CMS URLs với Ecommerce backend URL
// Relative paths → Ecommerce backend URL
// Absolute URLs → Normalize domain
```

**Flow:**
```
Database URL → normalizeMediaUrl() → Ecommerce Backend URL
```

### 3. Image Serving Flow

```
Request: /uploads/2025-11-30/uuid/image.webp
    ↓
Step 1: Tìm trong local storage
    ├─ CMS storage: CMS/backend/storage/uploads (ưu tiên)
    └─ Ecommerce storage: backend/storage/uploads (fallback)
    ↓
Step 2: Nếu không tìm thấy + có IMAGE_SOURCE_URL
    └─ Proxy từ IMAGE_SOURCE_URL (CMS backend hoặc S3)
    ↓
Step 3: Nếu proxy fail → 404
```

### 4. Storage Priority

```typescript
// Ưu tiên 1: CMS storage (nếu accessible)
const cmsUploadDir = 'CMS/backend/storage/uploads';

// Ưu tiên 2: Ecommerce storage (fallback)
const ecommerceUploadDir = 'backend/storage/uploads';
```

---

## ✅ ƯU ĐIỂM

### 1. **Tự động đồng bộ (cùng server)**
- ✅ CMS và Ecommerce cùng server → ảnh tự động đồng bộ
- ✅ Upload trong CMS admin → Ecommerce đọc được ngay
- ✅ Không cần sync thủ công

### 2. **Fallback linh hoạt**
- ✅ CMS storage → Ecommerce storage
- ✅ Local file → Image proxy
- ✅ Multiple fallback layers

### 3. **URL normalization**
- ✅ Tự động thay thế localhost/CMS URLs
- ✅ Hỗ trợ cả relative và absolute URLs
- ✅ Tương thích dev và production

### 4. **Performance**
- ✅ Static file serving (nhanh)
- ✅ Cache headers (1 year)
- ✅ CORS headers cho images

---

## ❌ NHƯỢC ĐIỂM

### 1. **Phụ thuộc CMS Storage (cùng server)**
- ❌ Nếu CMS storage không accessible → fallback sang Ecommerce storage
- ❌ Ảnh mới upload trong CMS không có trong Ecommerce storage → không hiển thị
- ❌ Phụ thuộc vào file system structure

### 2. **Image Proxy Dependency**
- ❌ Nếu `IMAGE_SOURCE_URL` trỏ đến CMS backend
- ❌ Và ảnh không có trong local storage
- ❌ → Proxy fail khi CMS backend stop → ảnh không hiển thị

### 3. **Không có sync tự động (khác server)**
- ❌ Nếu CMS và Ecommerce khác server
- ❌ Ảnh mới upload trong CMS không tự động sync
- ❌ Cần sync thủ công hoặc dùng proxy

### 4. **Storage Duplication Risk**
- ❌ Có thể có ảnh duplicate giữa CMS và Ecommerce storage
- ❌ Tốn dung lượng disk
- ❌ Khó quản lý

### 5. **Single Point of Failure**
- ❌ Nếu CMS storage folder bị xóa/lỗi
- ❌ Và không có trong Ecommerce storage
- ❌ → Tất cả ảnh không hiển thị

---

## 🎯 ĐỀ XUẤT PHƯƠNG ÁN TỐI ƯU

### **Phương án 1: S3/CDN Storage (KHUYẾN NGHỊ) ⭐**

#### Mô tả
- Upload tất cả ảnh lên S3 (AWS S3, DigitalOcean Spaces, Cloudflare R2)
- CMS và Ecommerce đều lưu URL S3 trong database
- Serve ảnh trực tiếp từ S3/CDN

#### Implementation

**1. Cấu hình S3:**
```env
# backend/.env.local
AWS_S3_BUCKET=your-bucket-name
AWS_S3_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_ENDPOINT=https://s3.ap-southeast-1.amazonaws.com
AWS_S3_CDN_URL=https://cdn.banyco.vn  # Optional: CDN URL
```

**2. Update CMS Backend:**
- Khi upload ảnh → Upload lên S3
- Lưu S3 URL vào `assets.url` và `assets.cdn_url`
- Format: `https://cdn.banyco.vn/uploads/2025-11-30/uuid/image.webp`

**3. Update Ecommerce Backend:**
- Remove dependency CMS storage
- Serve ảnh trực tiếp từ S3/CDN URL
- Không cần image proxy

**4. Update normalizeMediaUrl():**
```typescript
// Nếu URL là S3/CDN URL → giữ nguyên
if (url.includes('s3.amazonaws.com') || url.includes('cdn.banyco.vn')) {
  return url; // Không normalize
}
```

#### Ưu điểm
- ✅ **Hoàn toàn độc lập**: CMS và Ecommerce không phụ thuộc nhau
- ✅ **Scalable**: CDN tự động scale
- ✅ **Reliability**: S3 có 99.99% uptime
- ✅ **Performance**: CDN cache toàn cầu
- ✅ **Cost-effective**: Chỉ trả tiền storage và bandwidth
- ✅ **Backup tự động**: S3 có versioning và backup

#### Nhược điểm
- ❌ Cần setup S3/CDN (một lần)
- ❌ Có chi phí (nhưng rất thấp)
- ❌ Cần migrate ảnh hiện có lên S3

#### Migration Steps
1. Setup S3 bucket và CDN
2. Upload tất cả ảnh hiện có lên S3
3. Update database: `assets.url` và `assets.cdn_url` → S3 URLs
4. Update CMS backend: Upload mới → S3
5. Remove image proxy và CMS storage dependency từ Ecommerce backend

---

### **Phương án 2: Shared Network Storage (NFS/SMB)**

#### Mô tả
- Dùng network storage (NFS/SMB) được mount trên cả 2 servers
- CMS và Ecommerce đều đọc/ghi vào cùng storage
- Không cần sync

#### Implementation

**1. Setup Network Storage:**
```bash
# Trên storage server
# Mount NFS share
sudo mount -t nfs storage-server:/shared/uploads /mnt/shared-uploads
```

**2. Cấu hình:**
```env
# CMS backend/.env.local
UPLOAD_PATH=/mnt/shared-uploads

# Ecommerce backend/.env.local
UPLOAD_PATH=/mnt/shared-uploads
```

#### Ưu điểm
- ✅ Tự động đồng bộ (cùng storage)
- ✅ Không cần sync
- ✅ Không phụ thuộc CMS backend process

#### Nhược điểm
- ❌ Phụ thuộc network storage
- ❌ Nếu network storage fail → cả 2 đều fail
- ❌ Cần setup network storage
- ❌ Latency cao hơn local storage

---

### **Phương án 3: Sync Script (Cron Job)**

#### Mô tả
- Giữ nguyên cơ chế hiện tại
- Thêm sync script chạy định kỳ (rsync)
- Sync ảnh từ CMS storage sang Ecommerce storage

#### Implementation

**1. Tạo sync script:**
```bash
#!/bin/bash
# sync-images.sh

CMS_STORAGE="/var/www/CMS/backend/storage/uploads"
ECOMMERCE_STORAGE="/var/www/Ecommerce/backend/storage/uploads"

# Sync từ CMS sang Ecommerce
rsync -av --delete "$CMS_STORAGE/" "$ECOMMERCE_STORAGE/"

echo "Images synced at $(date)"
```

**2. Setup Cron Job:**
```bash
# Chạy mỗi 5 phút
*/5 * * * * /path/to/sync-images.sh >> /var/log/image-sync.log 2>&1
```

**3. Update Ecommerce Backend:**
- Chỉ serve từ Ecommerce storage
- Remove CMS storage dependency

#### Ưu điểm
- ✅ Không cần thay đổi nhiều code
- ✅ Ecommerce độc lập (sau khi sync)
- ✅ Có thể sync real-time với inotify

#### Nhược điểm
- ❌ Delay sync (5 phút)
- ❌ Tốn disk space (duplicate)
- ❌ Phụ thuộc cron job
- ❌ Có thể miss ảnh nếu sync fail

---

### **Phương án 4: Event-Driven Sync (Webhook)**

#### Mô tả
- CMS backend gửi webhook khi upload ảnh
- Ecommerce backend nhận webhook và download ảnh
- Real-time sync

#### Implementation

**1. CMS Backend:**
```typescript
// Sau khi upload ảnh thành công
await axios.post('https://ecommerce-api.banyco.vn/api/sync/image', {
  imagePath: '/uploads/2025-11-30/uuid/image.webp',
  sourceUrl: 'https://cms-api.banyco.vn/uploads/...',
});
```

**2. Ecommerce Backend:**
```typescript
// POST /api/sync/image
// Download ảnh từ CMS và lưu vào Ecommerce storage
```

#### Ưu điểm
- ✅ Real-time sync
- ✅ Không cần cron job
- ✅ Ecommerce độc lập sau khi sync

#### Nhược điểm
- ❌ Phụ thuộc CMS backend (để gửi webhook)
- ❌ Phức tạp hơn
- ❌ Cần handle retry nếu sync fail

---

## 📊 SO SÁNH CÁC PHƯƠNG ÁN

| Phương án | Độc lập | Performance | Cost | Complexity | Reliability |
|-----------|---------|-------------|------|------------|-------------|
| **S3/CDN** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Network Storage** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Sync Script** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Webhook** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |

---

## 🎯 KHUYẾN NGHỊ

### **Cho Production: Phương án 1 (S3/CDN)** ⭐

**Lý do:**
1. ✅ **Hoàn toàn độc lập**: CMS và Ecommerce không phụ thuộc nhau
2. ✅ **Scalable**: Tự động scale với traffic
3. ✅ **Reliable**: 99.99% uptime
4. ✅ **Performance**: CDN cache toàn cầu
5. ✅ **Future-proof**: Dễ migrate sang cloud khác

**Migration Plan:**
1. Week 1: Setup S3 bucket và CDN
2. Week 2: Upload ảnh hiện có lên S3
3. Week 3: Update database với S3 URLs
4. Week 4: Update CMS backend upload → S3
5. Week 5: Remove image proxy và CMS dependency từ Ecommerce

### **Cho Development: Giữ nguyên**

**Lý do:**
- Đơn giản, không cần setup S3
- Cùng server → tự động đồng bộ
- Đủ cho development

---

## 📝 CHECKLIST MIGRATION (Nếu chọn S3/CDN)

### Phase 1: Setup
- [ ] Tạo S3 bucket
- [ ] Setup CDN (Cloudflare/CDN provider)
- [ ] Cấu hình CORS cho S3
- [ ] Test upload/download

### Phase 2: Migration
- [ ] Backup database hiện tại
- [ ] Upload tất cả ảnh lên S3
- [ ] Update `assets.url` và `assets.cdn_url` với S3 URLs
- [ ] Verify ảnh hiển thị đúng

### Phase 3: Update Code
- [ ] Update CMS backend: Upload → S3
- [ ] Update Ecommerce backend: Remove CMS storage dependency
- [ ] Update `normalizeMediaUrl()`: Handle S3 URLs
- [ ] Remove image proxy (nếu không cần)

### Phase 4: Testing
- [ ] Test upload ảnh mới trong CMS
- [ ] Test hiển thị ảnh trên Ecommerce frontend
- [ ] Test performance (CDN cache)
- [ ] Test khi CMS backend stop (ảnh vẫn hiển thị)

### Phase 5: Cleanup
- [ ] Remove CMS storage dependency code
- [ ] Remove image proxy code
- [ ] Archive old storage (backup)
- [ ] Update documentation

---

## 🔍 CHI TIẾT KỸ THUẬT

### Current Image Flow Diagram

```
┌─────────────────┐
│  CMS Admin      │
│  Upload Image   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  CMS Backend    │
│  Save to:       │
│  CMS/storage/   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Database       │
│  assets.url     │
│  assets.cdn_url │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Ecommerce      │
│  Query DB       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  normalizeUrl() │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Image Serving  │
│  1. CMS storage │
│  2. Ecom storage│
│  3. Proxy       │
└─────────────────┘
```

### Proposed S3/CDN Flow

```
┌─────────────────┐
│  CMS Admin      │
│  Upload Image   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  CMS Backend    │
│  Upload to S3   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  S3/CDN         │
│  cdn.banyco.vn  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Database       │
│  assets.url =   │
│  S3 URL         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Ecommerce      │
│  Query DB       │
│  Get S3 URL     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Frontend       │
│  Load from CDN  │
└─────────────────┘
```

---

## 💰 COST ESTIMATION (S3/CDN)

### AWS S3 + CloudFront
- **Storage**: $0.023/GB/month (first 50TB)
- **Bandwidth**: $0.085/GB (first 10TB)
- **Requests**: $0.005 per 1,000 requests

**Example (10GB images, 100GB/month bandwidth):**
- Storage: 10GB × $0.023 = $0.23/month
- Bandwidth: 100GB × $0.085 = $8.50/month
- Requests: ~1M requests × $0.005/1K = $5/month
- **Total: ~$13.73/month**

### DigitalOcean Spaces
- **Storage**: $5/month (250GB included)
- **Bandwidth**: $0.01/GB (after 250GB free)

**Example (10GB images, 100GB/month bandwidth):**
- Storage: $5/month (250GB included)
- Bandwidth: Free (under 250GB)
- **Total: $5/month**

### Cloudflare R2
- **Storage**: $0.015/GB/month
- **Bandwidth**: FREE (no egress fees)
- **Requests**: FREE

**Example (10GB images, unlimited bandwidth):**
- Storage: 10GB × $0.015 = $0.15/month
- **Total: $0.15/month** ⭐ Best value

---

## ⚠️ YÊU CẦU BẮT BUỘC ĐỂ HÌNH ẢNH TẢI ĐẦY ĐỦ Ở PRODUCTION

### 1. **Storage Configuration**

#### A. CMS Storage (Nếu dùng shared storage)
```bash
# Đảm bảo CMS storage folder tồn tại và có quyền đọc
CMS_STORAGE="/var/www/CMS/backend/storage/uploads"
chmod -R 755 $CMS_STORAGE
chown -R www-data:www-data $CMS_STORAGE
```

#### B. Ecommerce Storage (Fallback)
```bash
# Đảm bảo Ecommerce storage folder tồn tại
ECOMMERCE_STORAGE="/var/www/banyco.vn/ecommerce-uploads"
mkdir -p $ECOMMERCE_STORAGE
chmod -R 755 $ECOMMERCE_STORAGE
chown -R www-data:www-data $ECOMMERCE_STORAGE
```

#### C. Environment Variables
```env
# backend/.env.local (Ecommerce Backend)
UPLOAD_PATH=/var/www/banyco.vn/ecommerce-uploads

# Nếu dùng image proxy (không khuyến nghị)
IMAGE_SOURCE_URL=https://cms-api.banyco.vn  # Chỉ dùng nếu cần proxy
```

### 2. **Database Requirements**

#### A. Assets Table Phải Có Đầy Đủ Dữ Liệu
```sql
-- Kiểm tra assets có URL
SELECT COUNT(*) FROM assets WHERE url IS NOT NULL OR cdn_url IS NOT NULL;

-- Kiểm tra products có thumbnail
SELECT COUNT(*) FROM products WHERE thumbnail_id IS NOT NULL;

-- Kiểm tra sliders có image
SELECT COUNT(*) FROM sliders WHERE image_id IS NOT NULL OR image_url IS NOT NULL;
```

#### B. URL Format Phải Đúng
```sql
-- URLs phải là relative paths hoặc absolute URLs hợp lệ
-- ✅ Đúng: /uploads/2025-11-30/uuid/image.webp
-- ✅ Đúng: https://cdn.banyco.vn/uploads/...
-- ❌ Sai: localhost:3011/uploads/...
-- ❌ Sai: ../../uploads/...
```

### 3. **File System Requirements**

#### A. Tất Cả Ảnh Phải Có Trong Storage
```bash
# Kiểm tra ảnh trong database có tồn tại trong storage
# Script kiểm tra (cần tạo):
# - Query tất cả URLs từ database
# - Check file tồn tại trong storage
# - Report missing files
```

#### B. Permissions
```bash
# Storage folder phải có quyền đọc cho web server
chmod -R 755 /var/www/banyco.vn/ecommerce-uploads
chown -R www-data:www-data /var/www/banyco.vn/ecommerce-uploads

# Nếu dùng CMS storage
chmod -R 755 /var/www/CMS/backend/storage/uploads
chown -R www-data:www-data /var/www/CMS/backend/storage/uploads
```

### 4. **Backend Configuration**

#### A. Ecommerce Backend Phải Serve Static Files
```typescript
// backend/src/app.ts
// Đảm bảo có static file serving
app.use('/uploads', express.static(uploadDir, staticOptions));
```

#### B. URL Normalization Phải Hoạt Động
```typescript
// backend/src/utils/domainUtils.ts
// normalizeMediaUrl() phải:
// 1. Thay thế localhost với production domain
// 2. Thay thế CMS URLs với Ecommerce URLs
// 3. Convert relative paths thành absolute URLs
```

#### C. Environment Variables Phải Đúng
```env
# Production environment
NODE_ENV=production
API_DOMAIN=banyco.vn
FRONTEND_DOMAIN=banyco.vn
PRODUCTION_DOMAIN_SUFFIX=banyco.vn
```

### 5. **Nginx Configuration (Nếu dùng)**

#### A. Static File Serving
```nginx
# /etc/nginx/sites-available/banyco.vn
location /uploads/ {
    alias /var/www/banyco.vn/ecommerce-uploads/;
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
}
```

#### B. CORS Headers (Nếu cần)
```nginx
location /uploads/ {
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods "GET, HEAD, OPTIONS";
}
```

### 6. **Image Proxy Configuration (Nếu dùng)**

#### A. IMAGE_SOURCE_URL Phải Đúng
```env
# Chỉ set nếu thực sự cần proxy
IMAGE_SOURCE_URL=https://cms-api.banyco.vn

# ⚠️ LƯU Ý: Nếu CMS backend stop, proxy sẽ fail
# → Ảnh không có trong local storage sẽ không hiển thị
```

#### B. Timeout Configuration
```typescript
// backend/src/app.ts
// Image proxy timeout phải đủ lớn
timeout: 15000, // 15 seconds
```

### 7. **Frontend Configuration**

#### A. Environment Variables
```env
# frontend/.env.local (Production)
NODE_ENV=production
NEXT_PUBLIC_API_DOMAIN=banyco.vn
NEXT_PUBLIC_API_URL=https://banyco.vn/api

# ❌ KHÔNG được dùng localhost trong production
```

#### B. Image Optimization
```typescript
// frontend/next.config.mjs
// Đảm bảo Next.js Image component có remotePatterns đúng
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'banyco.vn',
    },
    {
      protocol: 'https',
      hostname: 'cdn.banyco.vn', // Nếu dùng CDN
    },
  ],
}
```

### 8. **Deployment Checklist**

#### Pre-Deployment
- [ ] Tất cả ảnh đã được upload lên storage
- [ ] Database có đầy đủ URLs (không có NULL)
- [ ] Storage folder có quyền đọc
- [ ] Environment variables đã set đúng
- [ ] Không có localhost trong production config

#### Post-Deployment
- [ ] Test load ảnh từ frontend
- [ ] Test ảnh hiển thị đúng (không 404)
- [ ] Test performance (CDN cache nếu có)
- [ ] Test khi CMS backend stop (nếu không dùng S3)

### 9. **Monitoring & Alerts**

#### A. Health Check
```typescript
// backend/src/routes/health.ts
// Thêm check storage accessibility
app.get('/api/health/images', async (req, res) => {
  const storagePath = process.env.UPLOAD_PATH || '../storage/uploads';
  const exists = await fs.access(storagePath).then(() => true).catch(() => false);
  
  res.json({
    storage: {
      path: storagePath,
      accessible: exists,
    },
  });
});
```

#### B. Missing Images Detection
```sql
-- Query để tìm ảnh có URL nhưng file không tồn tại
-- (Cần script để check file system)
SELECT 
  a.id,
  a.url,
  a.cdn_url
FROM assets a
WHERE a.url IS NOT NULL
  AND a.url NOT LIKE 'http%'  -- Chỉ check local files
```

### 10. **Critical Requirements Summary**

#### ✅ BẮT BUỘC PHẢI CÓ:

1. **Storage Folder Tồn Tại**
   ```bash
   /var/www/banyco.vn/ecommerce-uploads/  # Phải tồn tại
   ```

2. **Tất Cả Ảnh Trong Database Phải Có File**
   - Assets URLs → Files trong storage
   - Product thumbnails → Files trong storage
   - Slider images → Files trong storage

3. **Environment Variables Đúng**
   ```env
   NODE_ENV=production
   API_DOMAIN=banyco.vn  # KHÔNG phải localhost
   ```

4. **URLs Trong Database Phải Đúng Format**
   - Relative: `/uploads/2025-11-30/uuid/image.webp`
   - Absolute: `https://cdn.banyco.vn/uploads/...`
   - ❌ KHÔNG: `localhost:3011/uploads/...`

5. **Permissions Đúng**
   ```bash
   chmod 755 /var/www/banyco.vn/ecommerce-uploads
   chown www-data:www-data /var/www/banyco.vn/ecommerce-uploads
   ```

#### ⚠️ NẾU THIẾU MỘT TRONG CÁC YÊU CẦU TRÊN:

- ❌ Ảnh sẽ không hiển thị (404 Not Found)
- ❌ Frontend sẽ báo lỗi load image
- ❌ User experience bị ảnh hưởng nghiêm trọng

### 11. **Quick Verification Script**

```bash
#!/bin/bash
# verify-images.sh - Kiểm tra ảnh production

echo "=== Kiểm tra Storage ==="
STORAGE="/var/www/banyco.vn/ecommerce-uploads"
if [ -d "$STORAGE" ]; then
    echo "✅ Storage folder tồn tại: $STORAGE"
    echo "   Files: $(find $STORAGE -type f | wc -l)"
    echo "   Size: $(du -sh $STORAGE | cut -f1)"
else
    echo "❌ Storage folder KHÔNG tồn tại: $STORAGE"
fi

echo ""
echo "=== Kiểm tra Permissions ==="
if [ -r "$STORAGE" ]; then
    echo "✅ Storage có quyền đọc"
else
    echo "❌ Storage KHÔNG có quyền đọc"
fi

echo ""
echo "=== Kiểm tra Environment ==="
if [ "$NODE_ENV" = "production" ]; then
    echo "✅ NODE_ENV=production"
else
    echo "⚠️  NODE_ENV=$NODE_ENV (nên là production)"
fi

echo ""
echo "=== Kiểm tra Database URLs ==="
# Cần kết nối database để check
# psql -c "SELECT COUNT(*) FROM assets WHERE url LIKE 'localhost%';"
```

---

## 🔗 TÀI LIỆU THAM KHẢO

- AWS S3: https://aws.amazon.com/s3/
- DigitalOcean Spaces: https://www.digitalocean.com/products/spaces
- Cloudflare R2: https://www.cloudflare.com/products/r2/
- Rsync: https://linux.die.net/man/1/rsync
- NFS: https://linux.die.net/man/5/nfs

---

**Tác giả:** AI Assistant  
**Ngày tạo:** 2025-01-XX  
**Phiên bản:** 1.0

