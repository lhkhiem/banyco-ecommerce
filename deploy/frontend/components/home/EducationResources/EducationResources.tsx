'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Keyboard, Mousewheel, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { fetchLearningPosts, LearningPostDTO } from '@/lib/api/publicHomepage';

interface LearningPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  readTime: string;
  topic: string;
  image: string;
}

const PLACEHOLDER_IMAGE = '/images/placeholder-image.svg';

export default function EducationResources() {
  const [posts, setPosts] = useState<LearningPost[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadPosts = async () => {
      try {
        const data = await fetchLearningPosts(8);
        if (!isMounted) {
          return;
        }

        if (!data || !data.length) {
          setPosts([]);
          return;
        }

        const mapped: LearningPost[] = data.map((item: LearningPostDTO) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          excerpt: item.excerpt ?? '',
          readTime: item.readTime ?? '',
          topic: item.topic ?? item.category ?? '',
          image: item.imageUrl ?? PLACEHOLDER_IMAGE,
        }));

        setPosts(mapped);
      } catch (error) {
        console.error('[EducationResources] failed to load learning posts', error);
        setPosts([]);
      }
    };

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const showSlider = posts.length > 2;

  return (
    <section className="bg-white py-16">
      <div className="container-custom">
        <div>
          <h3 className="mb-3 text-2xl font-bold text-gray-900">Thư Viện Kiến Thức</h3>
          <p className="mb-8 text-gray-600">
            Cập nhật xu hướng làm đẹp, bí quyết vận hành spa và những câu chuyện truyền cảm hứng dành riêng cho chuyên gia.
          </p>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Không tải được nội dung. Vui lòng thử lại sau.</p>
            </div>
          ) : (
            <div className="relative">
            {showSlider ? (
              <div className="learning-swiper-wrapper">
                <Swiper
                  modules={[Mousewheel, Pagination, Keyboard, Autoplay]}
                  direction="horizontal"
                  slidesPerView={1}
                  slidesPerGroup={1}
                  spaceBetween={24}
                  loop
                  mousewheel={{ forceToAxis: true }}
                  keyboard={{ enabled: true, onlyInViewport: true }}
                  pagination={{ clickable: true }}
                  autoplay={{
                    delay: 4500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  speed={650}
                  breakpoints={{
                    768: { slidesPerView: 2 },
                  }}
                  className="learning-swiper rounded-[32px] bg-gradient-to-r from-white via-purple-50/40 to-white p-4 shadow-xl pb-16"
                >
                  {posts.map((post) => (
                    <SwiperSlide key={post.id} className="!h-auto">
                      <ArticleCard post={post} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {posts.map((post) => (
                  <ArticleCard key={post.id} post={post} />
                ))}
              </div>
            )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ArticleCard({ post }: { post: LearningPost }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group flex h-full flex-col rounded-2xl bg-white/95 p-5 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-2xl">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 35vw"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
          {post.topic || 'Learning'}
        </span>
      </div>
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{post.readTime || '3 min read'}</span>
      <h4 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-brand-purple-600">
        {post.title}
      </h4>
      <p className="text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
      <span className="mt-auto text-sm font-semibold text-brand-purple-600">Xem thêm →</span>
    </Link>
  );
}
