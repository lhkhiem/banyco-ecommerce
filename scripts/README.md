# 📥 Scripts Download Ảnh

## Download Background Images

Script này tải các ảnh background từ Unsplash về local và optimize thành WebP.

### Cách sử dụng:

1. **Cài đặt dependencies** (nếu chưa có):
   ```bash
   npm install axios sharp --save-dev
   ```

2. **Chạy script download**:
   ```bash
   cd frontend
   npm run download-backgrounds
   ```
   
   Hoặc từ root:
   ```bash
   node scripts/download-background-images.js
   ```

3. **Ảnh sẽ được lưu vào**:
   - `frontend/public/images/backgrounds/`
   - Format: WebP (đã optimize)
   - Kích thước: Tối đa 1920px width

### Ảnh được download:

- `about-hero.webp` - About page hero background
- `contact-hero.webp` - Contact page hero background  
- `faqs-hero.webp` - FAQs page hero background
- `posts-hero.webp` - Posts page hero background
- `shipping-hero.webp` - Shipping page hero background
- `contact-form-bg.webp` - Contact form section background
- `brand-showcase-bg.webp` - Brand showcase background

### Sử dụng trong code:

```typescript
import { BACKGROUND_IMAGES } from '@/lib/utils/backgroundImages';

// Sử dụng
<ParallaxSection backgroundImage={BACKGROUND_IMAGES.aboutHero} />
```

### Lưu ý:

- Script có delay 1 giây giữa các request để tránh rate limiting
- Ảnh được optimize tự động thành WebP với quality 85%
- Nếu download fail, component sẽ fallback về placeholder image








