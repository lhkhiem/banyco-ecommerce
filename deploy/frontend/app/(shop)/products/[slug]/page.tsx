import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';
import { fetchProductDetail, ProductDetailDTO } from '@/lib/api/products';
import { buildSiteUrl, getSiteUrl, buildApiUrl } from '@/config/site';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

const FALLBACK_IMAGE = '/images/placeholder-product.jpg';

// Normalize slug to handle various formats (same as post page)
const normalizeSlug = (slug: string): string => {
  // Decode URL-encoded characters first
  try {
    slug = decodeURIComponent(slug);
  } catch (e) {
    // If decode fails, use original slug
  }
  
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-') // Replace special chars with dash
    .replace(/-+/g, '-') // Replace multiple dashes with single dash
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
};

const extractDescription = (product: ProductDetailDTO): string | null => {
  if (product.description) {
    return product.description;
  }

  if (product.content && typeof product.content === 'object' && 'meta' in product.content) {
    const meta = (product.content as Record<string, any>).meta;
    if (meta && typeof meta.description === 'string') {
      return meta.description;
    }
  }

  return null;
};

// Fetch product with no cache for metadata generation
async function fetchProductForMetadata(slug: string): Promise<ProductDetailDTO | null> {
  try {
    const url = buildApiUrl(API_ENDPOINTS.PRODUCTS.DETAIL(slug));
    
    // Use fetch with no-cache to ensure fresh data
    const response = await fetch(url, {
      cache: 'no-store', // No caching for metadata
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    if (!payload?.data) {
      return null;
    }

    return payload.data as ProductDetailDTO;
  } catch (error) {
    console.error('[fetchProductForMetadata] Error:', error);
    return null;
  }
}

export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  // Normalize slug to match backend normalization
  const normalizedSlug = normalizeSlug(params.slug);
  const path = `/products/${normalizedSlug}`;
  
  // Lấy metadata trực tiếp từ product với no-cache
  const product = await fetchProductForMetadata(normalizedSlug);
  
  if (!product) {
    return { title: 'Product Not Found' };
  }

  const siteUrl = getSiteUrl();
  const fullUrl = buildSiteUrl(path);
  const productImageUrl = product.images?.[0]?.url 
    ? (product.images[0].url.startsWith('http') 
        ? product.images[0].url 
        : `${siteUrl}${product.images[0].url}`)
    : '';
  
  // Sử dụng metadata từ product (có thể từ product.seo hoặc các trường riêng nếu có)
  type ProductWithSEO = ProductDetailDTO & {
    seo?: { title?: string; description?: string; ogImage?: string };
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
  const productWithSEO = product as ProductWithSEO;
  const metaTitle = productWithSEO.seo?.title || productWithSEO.metaTitle || `${product.name} - Banyco`;
  const metaDescription = productWithSEO.seo?.description || productWithSEO.metaDescription || extractDescription(product) || product.name;
  const ogImage = productWithSEO.seo?.ogImage || productWithSEO.ogImage || productImageUrl;
  
  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: ogImage ? [ogImage] : [],
      url: fullUrl,
      type: 'website',
      siteName: 'Banyco',
      locale: 'vi_VN',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: ogImage ? [ogImage] : [],
    },
  };
}

// Force dynamic rendering to ensure metadata is always fresh from CMS
export const dynamic = 'force-dynamic';
export const revalidate = 0; // No caching for metadata

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  // Normalize slug for fetching product
  const normalizedSlug = normalizeSlug(params.slug);
  const detail = await fetchProductDetail(normalizedSlug);

  if (!detail) {
    notFound();
  }

  const breadcrumb = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
  ];

  if (detail.categories?.length) {
    const firstCategory = detail.categories[0];
    breadcrumb.push({
      label: firstCategory.name,
      href: `/categories/${firstCategory.slug}`,
    });
  }

  breadcrumb.push({
    label: detail.name,
    href: `/products/${detail.slug}`,
  });

  const images = (detail.images ?? []).map((image) => ({
    id: image.id,
    url: image.url ?? detail.thumbnailUrl ?? FALLBACK_IMAGE,
    width: image.width ?? null,
    height: image.height ?? null,
    format: image.format ?? null,
  }));

  if (!images.length && detail.thumbnailUrl) {
    images.push({
      id: 'thumbnail',
      url: detail.thumbnailUrl,
      width: null,
      height: null,
      format: null,
    });
  }

  const relatedProducts = (detail.relatedProducts ?? []).map((related) => ({
    id: related.id,
    slug: related.slug,
    name: related.name,
    price: related.price,
    comparePrice:
      related.comparePrice !== null && related.comparePrice !== undefined
        ? related.comparePrice
        : null,
    thumbnailUrl: related.thumbnailUrl ?? FALLBACK_IMAGE,
    rating: related.rating ?? 0,
    reviewCount: related.reviewCount ?? 0,
    isFeatured: related.isFeatured ?? false,
    isBestSeller: related.isBestSeller ?? false,
    inStock: Number((related as any).stock ?? 0) > 0,
  }));

  // Ghi chú: Chuẩn hóa dữ liệu server → client để client component chỉ lo hiển thị
  const productForClient = {
    id: detail.id,
    slug: detail.slug,
    name: detail.name,
    sku: detail.sku ?? null,
    baseName: detail.baseName ?? detail.name,
    baseSlug: detail.baseSlug ?? detail.slug,
    baseSku: detail.baseSku ?? null,
    description: extractDescription(detail),
    richContent: detail.content,
    price: detail.price,
    comparePrice: detail.comparePrice ?? null,
    stock: detail.stock ?? 0,
    rating: detail.rating ?? 0,
    reviewCount: detail.reviewCount ?? 0,
    brandName: detail.brand?.name ?? null,
    breadcrumb,
    images,
    attributes: detail.attributes ?? [],
    variantCount: detail.variantCount ?? 0,
    selectedVariantId: detail.selectedVariantId ?? null,
    selectedVariantSlug: detail.selectedVariantSlug ?? null,
    variants:
      detail.variants?.map((variant) => ({
        id: variant.id,
        sku: variant.sku ?? null,
        slug: variant.slug ?? variant.sku ?? `${detail.slug}-${variant.id}`,
        summary: variant.summary ?? null,
        price: Number(variant.price),
        comparePrice:
          variant.comparePrice !== null && variant.comparePrice !== undefined
            ? Number(variant.comparePrice)
            : null,
        stock: Number.isFinite(Number(variant.stock)) ? Number(variant.stock) : 0,
        status: variant.status ?? 'active',
        optionValues: variant.optionValues ?? [],
        attributes: variant.attributes ?? [],
        titleOverride: variant.titleOverride ?? null,
        shortDescription: variant.shortDescription ?? null,
        longDescription: variant.longDescription ?? null,
        thumbnailUrl: variant.thumbnailUrl ?? null,
      })) ?? [],
    relatedProducts,
  };

  return <ProductDetailClient product={productForClient} />;
}
