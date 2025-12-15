const fs = require('fs').promises;
const path = require('path');

// Try to load from frontend node_modules first, then root
let axios, sharp;
try {
  // Try frontend node_modules
  const frontendNodeModules = path.join(__dirname, '../frontend/node_modules');
  const axiosModule = require(path.join(frontendNodeModules, 'axios'));
  axios = axiosModule.default || axiosModule;
  sharp = require(path.join(frontendNodeModules, 'sharp'));
} catch (e) {
  try {
    // Try root node_modules
    const axiosModule = require('axios');
    axios = axiosModule.default || axiosModule;
    sharp = require('sharp');
  } catch (e2) {
    console.error('❌ Please install dependencies:');
    console.error('   cd frontend && npm install axios sharp --save-dev');
    process.exit(1);
  }
}

// Cấu hình
const OUTPUT_DIR = path.join(__dirname, '../frontend/public/images/backgrounds');
const IMAGE_MAP_FILE = path.join(__dirname, '../frontend/lib/data/backgroundImageMap.json');

// Danh sách ảnh background cần tải (URL Unsplash -> tên file local)
const BACKGROUND_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=1920&h=1200',
    filename: 'about-hero.jpg',
    description: 'About page hero background'
  },
  {
    url: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1920&q=80',
    filename: 'contact-hero.jpg',
    description: 'Contact page hero background'
  },
  {
    url: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1920&q=80',
    filename: 'faqs-hero.jpg',
    description: 'FAQs page hero background'
  },
  {
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920&q=80',
    filename: 'posts-hero.jpg',
    description: 'Posts page hero background'
  },
  {
    url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1920&q=80',
    filename: 'shipping-hero.jpg',
    description: 'Shipping page hero background'
  },
  {
    url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&h=1080&fit=crop',
    filename: 'contact-form-bg.jpg',
    description: 'Contact form section background'
  },
  {
    url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&h=1080&fit=crop',
    filename: 'brand-showcase-bg.jpg',
    description: 'Brand showcase background'
  },
];

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

async function downloadAndOptimizeImage(item) {
  try {
    console.log(`📥 Downloading: ${item.filename}...`);
    
    // Download image
    const response = await axios.get(item.url, {
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // Optimize with sharp - resize to max 1920px width, convert to WebP
    const outputPath = path.join(OUTPUT_DIR, item.filename.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
    
    await sharp(response.data)
      .resize(1920, undefined, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .webp({ quality: 85 })
      .toFile(outputPath);
    
    const webpFilename = item.filename.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    console.log(`✅ Optimized: ${item.filename} → ${webpFilename}`);
    return webpFilename;
  } catch (error) {
    console.error(`❌ Error downloading ${item.filename}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting background images download...\n');
  
  // Ensure output directory exists
  await ensureDir(OUTPUT_DIR);
  
  // Download all images
  const imageMap = {};
  const results = [];
  
  for (let i = 0; i < BACKGROUND_IMAGES.length; i++) {
    const item = BACKGROUND_IMAGES[i];
    const filename = await downloadAndOptimizeImage(item);
    
    if (filename) {
      const localPath = `/images/backgrounds/${filename}`;
      imageMap[item.url] = localPath;
      results.push({
        originalUrl: item.url,
        localPath: localPath,
        filename: filename,
        description: item.description
      });
    }
    
    // Delay to avoid rate limiting
    if (i < BACKGROUND_IMAGES.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Save mapping file
  await ensureDir(path.dirname(IMAGE_MAP_FILE));
  await fs.writeFile(
    IMAGE_MAP_FILE,
    JSON.stringify(imageMap, null, 2),
    'utf-8'
  );
  
  console.log(`\n📊 Summary:`);
  console.log(`✅ Successfully downloaded: ${results.length}/${BACKGROUND_IMAGES.length}`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log(`📝 Mapping file: ${IMAGE_MAP_FILE}`);
  console.log(`\n✨ Done!`);
  
  // Print mapping for easy reference
  console.log(`\n📋 Image Mapping:`);
  results.forEach((result) => {
    console.log(`  ${result.description}: ${result.localPath}`);
  });
}

main().catch(console.error);

