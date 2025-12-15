'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button/Button';
import { fetchHeroSlides, HeroSlideDTO } from '@/lib/api/publicHomepage';
import { normalizeMediaUrl } from '@/lib/utils/domainUtils';

interface Slide {
  id: string;
  image: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

const PLACEHOLDER_IMAGE = '/images/placeholder-image.svg';

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length === 0) {
      return () => undefined;
    }

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    let isMounted = true;

    const loadSlides = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const data = await fetchHeroSlides();
        
        if (!isMounted) {
          return;
        }

        if (!data || !data.length) {
          setHasError(true);
          setIsLoading(false);
          return;
        }

        const mapped: Slide[] = data
          .map((slide: HeroSlideDTO) => {
            const normalizedImageUrl = normalizeMediaUrl(slide.imageUrl);
            return {
              id: slide.id,
              image: normalizedImageUrl ?? PLACEHOLDER_IMAGE,
              title: slide.title,
              description: slide.description ?? '',
              ctaText: slide.ctaText ?? 'Learn More',
              ctaLink: slide.ctaLink ?? '#',
            };
          })
          .filter((slide) => Boolean(slide.image));

        if (!mapped.length) {
          setHasError(true);
          setIsLoading(false);
          return;
        }

        setSlides(mapped);
        setCurrentSlide(0);
        setIsLoading(false);
        
        // Preload first hero image from API - Critical for LCP
        if (mapped[0]?.image && typeof document !== 'undefined') {
          const existing = document.querySelector(`link[rel="preload"][href="${mapped[0].image}"]`);
          if (!existing) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = mapped[0].image;
            link.setAttribute('fetchpriority', 'high');
            document.head.insertBefore(link, document.head.firstChild);
          }
        }
      } catch (error) {
        console.error('[HeroSlider] Failed to load slides:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    loadSlides();

    return () => {
      isMounted = false;
    };
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="relative w-full overflow-hidden pt-[120px]">
        <div className="relative w-full min-h-[60vh] bg-gray-200 animate-pulse" />
      </div>
    );
  }

  // Error state - show placeholder
  if (hasError || !slides.length) {
    return (
      <div className="relative w-full overflow-hidden pt-[120px]">
        <section
          className="relative w-full min-h-[60vh] overflow-hidden mb-0"
          style={{
            backgroundImage: `url(${PLACEHOLDER_IMAGE})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            minHeight: '50vh',
          }}
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="parallax-inner relative z-20 flex items-center">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
              <div className="py-16">
                <div className="text-white pl-8 sm:pl-12 md:pl-16 lg:pl-24 xl:pl-32">
                  <h1 className="mb-4 text-3xl font-bold md:text-5xl lg:text-6xl leading-tight max-w-2xl">
                    Không tải được nội dung
                  </h1>
                  <p className="mb-8 text-base md:text-xl max-w-2xl">
                    Vui lòng thử lại sau hoặc liên hệ với chúng tôi nếu vấn đề vẫn tiếp tục.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative w-full overflow-hidden pt-[120px]">
      {/* Hero with optimized background-image for faster LCP */}
      {/* Critical: Inline styles for fastest rendering, preloaded image */}
      <section
        className="relative w-full min-h-[60vh] md:min-h-[60vh] sm:min-h-[50vh] overflow-hidden mb-0"
        style={{
          backgroundImage: `url(${currentSlideData.image})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          // Optimize rendering
          willChange: 'auto',
          // Prevent layout shift
          minHeight: '50vh',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10" />

        {/* Content - Scrolls normally while background stays fixed */}
        <div className="parallax-inner relative z-20 flex items-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
            <div className="py-16">
              <div className="text-white pl-8 sm:pl-12 md:pl-16 lg:pl-24 xl:pl-32">
                <h1 className="mb-4 text-3xl font-bold md:text-5xl lg:text-6xl leading-tight max-w-2xl">
                  {currentSlideData.title}
                </h1>
                <p className="mb-8 text-base md:text-xl max-w-2xl">{currentSlideData.description}</p>
                <Button
                  href={currentSlideData.ctaLink}
                  size="lg"
                  className="bg-white text-brand-purple-600 hover:bg-gray-100"
                >
                  {currentSlideData.ctaText}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 space-x-2 z-30">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 w-3 rounded-full transition-all ${
                  index === currentSlide ? 'w-8 bg-white' : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
