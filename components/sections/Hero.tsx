import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import OptimizedImage from '../ui/OptimizedImage';

export default function Hero() {
  const { t } = useTranslation('common');

  return (
    <div className="relative min-h-[90vh] w-full flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <OptimizedImage
          src="/images/hero-bg.jpg"
          alt={t('home.hero.backgroundAlt')}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={85}
          lowQualityPlaceholder={true}
        />
        <div className="absolute inset-0 bg-[#0F3E61]/80" />
      </div>

      {/* Content */}
      <div className="relative w-full">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-white mb-4 animate-fade-in">
              {t('home.hero.title')}
              <span className="block text-secondary-400 mt-2">{t('home.hero.subtitle')}</span>
            </h1>
            
            <p className="mt-6 text-xl sm:text-2xl text-white/90 max-w-2xl animate-slide-in">
              {t('home.hero.description')}
            </p>

            <div className="mt-8 sm:mt-10 flex flex-wrap gap-4 animate-slide-in-delayed">
              <Link 
                href="/destinations"
                className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-secondary-500 to-secondary-400 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-secondary-500/30 hover:-translate-y-0.5 active:translate-y-0 transform transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                {t('home.hero.primaryButton')}
                <svg 
                  className="w-6 h-6 transform transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 8l4 4m0 0l-4 4m4-4H3" 
                  />
                </svg>
              </Link>
              <Link 
                href="/about"
                className="group w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl text-lg font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg hover:shadow-white/20 hover:-translate-y-0.5 active:translate-y-0 transform inline-flex items-center justify-center gap-2"
              >
                {t('home.hero.secondaryButton')}
                <svg 
                  className="w-6 h-6 transform transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 8l4 4m0 0l-4 4m4-4H3" 
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 