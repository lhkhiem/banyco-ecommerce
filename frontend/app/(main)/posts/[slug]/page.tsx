import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { fetchPostBySlug, fetchRelatedPosts, PostDetailDTO, PostSummaryDTO } from '@/lib/api/posts';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import Button from '@/components/ui/Button/Button';
import ShareButton from './ShareButton';
import { FiClock, FiUser, FiTag, FiArrowLeft } from 'react-icons/fi';
import { buildSiteUrl, getSiteUrl, buildApiUrl } from '@/config/site';
import { sanitizeContentHtml } from '@/lib/utils/sanitizeHtml';
import { normalizeMediaUrl } from '@/lib/utils/domainUtils';

interface PostDetailPageProps {
  params: { slug: string };
}

// Normalize slug to handle various formats
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

// Fetch post with no cache for metadata generation
async function fetchPostForMetadata(slug: string): Promise<PostDetailDTO | null> {
  try {
    const cleanSlug = slug.trim().replace(/^-+|-+$/g, '');
    const url = buildApiUrl(`/public/posts/slug/${cleanSlug}`);
    
    // Use fetch with no-cache to ensure fresh data
    const response = await fetch(url, {
      cache: 'no-store', // No caching for metadata
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (!data?.success || !data?.data) {
      return null;
    }

    const rawPost = data.data;
    
    // Handle topics
    let topic: string | null = null;
    if (rawPost.topics && Array.isArray(rawPost.topics) && rawPost.topics.length > 0) {
      topic = rawPost.topics[0].name || rawPost.topics[0];
    } else if (rawPost.topic) {
      topic = typeof rawPost.topic === 'string' ? rawPost.topic : rawPost.topic?.name;
    }

    // Handle tags
    let tags: string[] = [];
    if (rawPost.tags && Array.isArray(rawPost.tags)) {
      tags = rawPost.tags.map((tag: any) => 
        typeof tag === 'string' ? tag : (tag.name || tag)
      ).filter(Boolean);
    }

    return {
      id: rawPost.id,
      title: rawPost.title,
      slug: rawPost.slug,
      excerpt: rawPost.excerpt || rawPost.description || null,
      content: rawPost.content || rawPost.body || rawPost.description || null,
      readTime: rawPost.read_time || rawPost.readTime || null,
      category: (typeof rawPost.category === 'object' && rawPost.category ? rawPost.category.name : null) || rawPost.category || null,
      topic,
      tags,
      postType: rawPost.post_type || 'blog',
      imageUrl: normalizeMediaUrl(
        rawPost.cover_asset?.url || rawPost.cover_asset?.cdn_url || rawPost.image_url || rawPost.cover_image || rawPost.image
      ),
      publishedAt: rawPost.published_at || rawPost.publishedAt || rawPost.created_at || null,
      author: rawPost.author
        ? {
            id: rawPost.author.id,
            name: rawPost.author.name || rawPost.author.username || 'Admin',
            avatar: normalizeMediaUrl(rawPost.author.avatar),
          }
        : null,
      seo: rawPost.seo || null,
    } as PostDetailDTO & { seo?: any };
  } catch (error) {
    console.error('[fetchPostForMetadata] Error:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
  const normalizedSlug = normalizeSlug(params.slug);
  const path = `/posts/${normalizedSlug}`;
  
  // Lấy metadata trực tiếp từ post với no-cache
  const post = await fetchPostForMetadata(normalizedSlug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const siteUrl = getSiteUrl();
  const fullUrl = buildSiteUrl(path);
  const postImageUrl = post.imageUrl?.startsWith('http') 
    ? post.imageUrl 
    : post.imageUrl 
      ? `${siteUrl}${post.imageUrl}`
      : '';

  // Sử dụng metadata từ post (có thể từ post.seo hoặc các trường riêng nếu có)
  type PostWithSEO = PostDetailDTO & {
    seo?: { title?: string; description?: string; ogImage?: string };
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
  const postWithSEO = post as PostWithSEO;
  
  // Debug: Log seo data
  if (process.env.NODE_ENV === 'development') {
    console.log('[generateMetadata] Post SEO data:', {
      hasSeo: !!postWithSEO.seo,
      seo: postWithSEO.seo,
      title: post.title,
      seoTitle: postWithSEO.seo?.title,
    });
  }
  
  const metaTitle = postWithSEO.seo?.title || postWithSEO.metaTitle || post.title;
  const metaDescription = postWithSEO.seo?.description || postWithSEO.metaDescription || post.excerpt || post.title;
  const ogImage = postWithSEO.seo?.ogImage || postWithSEO.ogImage || postImageUrl;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: ogImage ? [ogImage] : [],
      type: 'article',
      url: fullUrl,
      publishedTime: post.publishedAt || undefined,
      authors: post.author ? [post.author.name] : undefined,
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

// Force dynamic rendering to ensure metadata is always fresh from database
export const dynamic = 'force-dynamic';
export const revalidate = 0; // No caching for metadata

const formatDate = (dateString: string | null): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return '';
  }
};

const PostContent = ({ content }: { content: string | null }) => {
  if (!content) {
    return (
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600">Nội dung đang được cập nhật...</p>
      </div>
    );
  }

  // If content is HTML, render it directly (sanitized)
  if (content.includes('<')) {
    return (
      <div
        className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-red-600 prose-a:no-underline hover:prose-a:text-red-700 hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-img:rounded-lg prose-img:shadow-md"
        dangerouslySetInnerHTML={{ __html: sanitizeContentHtml(content) }}
      />
    );
  }

  // If content is plain text, format it
  const paragraphs = content.split('\n\n').filter((p) => p.trim());
  return (
    <div className="prose prose-lg max-w-none">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="mb-4 text-gray-700 leading-relaxed">
          {paragraph}
        </p>
      ))}
    </div>
  );
};

const RelatedPostCard = ({ post }: { post: PostSummaryDTO }) => {
  const fallbackImage = '/images/placeholder-image.svg';
  
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl"
    >
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <Image
          src={post.imageUrl || fallbackImage}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-6">
        {post.topic && (
          <span className="mb-2 inline-block text-xs font-semibold text-red-700">
            {post.topic}
          </span>
        )}
        <h3 className="mb-2 font-semibold text-gray-900 group-hover:text-red-700 line-clamp-2 transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mb-3 text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
        )}
        <div className="flex items-center text-xs text-gray-500">
          {post.readTime && (
            <>
              <FiClock className="mr-1 h-3 w-3" />
              <span>{post.readTime}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  let { slug } = params;
  
  // Clean slug - remove trailing/leading dashes and whitespace
  slug = slug.trim().replace(/^-+|-+$/g, '');
  
  // Try multiple slug variations
  const slugVariations = [
    slug, // Cleaned original
    normalizeSlug(slug), // Normalized
  ];
  
  // Remove duplicates
  const uniqueSlugs = Array.from(new Set(slugVariations.filter(Boolean)));
  
  let post = null;
  for (const slugToTry of uniqueSlugs) {
    try {
      post = await fetchPostBySlug(slugToTry);
      if (post) {
        break;
      }
    } catch (e) {
      // Continue to next variation
    }
  }

  if (!post) {
    notFound();
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/posts' },
    { label: post.title, href: `/posts/${post.slug}` },
  ];

  const relatedPosts = post.relatedPosts || (await fetchRelatedPosts(post.id, 3));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Compact & Elegant */}
      <section className="relative min-h-[50vh] md:min-h-[55vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background Image */}
        {post.imageUrl && (
          <div className="absolute inset-0">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
              style={{
                filter: 'brightness(0.35) saturate(1.1)',
              }}
            />
          </div>
        )}
        
        {/* Gradient Overlay - Dark blue/gray instead of red */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/85 to-indigo-900/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] bg-[size:20px_20px]" />
        
        {/* Content */}
        <div className="relative container-custom py-12 md:py-16 z-10">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb - Simple text only */}
            <div className="mb-6">
              <nav className="flex text-white/90" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm">
                  {breadcrumbItems.map((item, index) => (
                    <li key={index} className="flex items-center">
                      {index > 0 && (
                        <svg
                          className="mx-2 h-4 w-4 text-white/70"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {item.href && index < breadcrumbItems.length - 1 ? (
                        <Link
                          href={item.href}
                          className="text-white/90 hover:text-white transition-colors"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <span className="text-white">{item.label}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
            
            {/* Topic Badge - Clickable link */}
            {post.topic && (
              <div className="mb-5">
                <Link
                  href={`/posts?topic=${encodeURIComponent(post.topic)}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white/25 backdrop-blur-md border border-white/35 px-4 py-1.5 text-xs font-semibold text-white shadow-xl hover:bg-white/35 hover:border-white/45 transition-all cursor-pointer"
                >
                  <FiTag className="h-3.5 w-3.5" />
                  {post.topic}
                </Link>
              </div>
            )}
            
            {/* Title - High contrast white text */}
            <h1 className="mb-5 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="mb-8 text-base leading-relaxed text-white/95 md:text-lg lg:text-xl font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] max-w-3xl">
                {post.excerpt}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-white/95">
              {post.author && (
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/25 shadow-md">
                  <FiUser className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium">{post.author.name}</span>
                </div>
              )}
              
              {post.publishedAt && (
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/25 shadow-md">
                  <span className="text-sm font-medium">{formatDate(post.publishedAt)}</span>
                </div>
              )}
              
              {post.readTime && (
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/25 shadow-md">
                  <FiClock className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium">{post.readTime}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Bottom Gradient Fade - Smooth transition to content */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent via-gray-50/50 to-gray-50 pointer-events-none" />
      </section>

      {/* Main Content - Seamless transition */}
      <div className="container-custom py-12 -mt-24">
        <div className="mx-auto max-w-7xl">
          {/* Featured Image */}
          {post.imageUrl ? (
            <div className="relative mb-12 h-[400px] overflow-hidden rounded-2xl shadow-2xl md:h-[500px]">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="relative mb-12 h-[300px] overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 shadow-2xl md:h-[400px]">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <FiTag className="mx-auto h-16 w-16 text-red-300" />
                </div>
              </div>
            </div>
          )}

          {/* Article Content */}
          <article className="mb-12 rounded-2xl bg-white p-8 shadow-lg md:p-12">
            <PostContent content={post.content} />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 border-t border-gray-200 pt-8">
                <div className="flex flex-wrap items-center gap-2">
                  <FiTag className="h-5 w-5 text-gray-400" />
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-8">
              <Button href="/posts" variant="outline" size="sm">
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Quay lại Blog
              </Button>
              
              <ShareButton
                title={post.title}
                excerpt={post.excerpt}
                url={buildSiteUrl(`/posts/${post.slug}`)}
              />
            </div>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mb-12">
              <h2 className="mb-8 text-3xl font-bold text-gray-900">
                Bài viết liên quan
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <RelatedPostCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}

