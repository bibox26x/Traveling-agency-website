import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogImage = '/images/og-default.jpg',
  noIndex = false,
  noFollow = false,
}) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const locale = router.locale || 'en';

  // Get translated meta content or fallback to provided values
  const metaTitle = title ? title + ' - ' + t('common.brand') : t('meta.defaultTitle');
  const metaDescription = description || t('meta.defaultDescription');
  const metaKeywords = keywords || t('meta.defaultKeywords');

  // Construct canonical URL
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${router.asPath}`;

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />

      {/* Robots */}
      <meta
        name="robots"
        content={`${noIndex ? 'noindex' : 'index'},${noFollow ? 'nofollow' : 'follow'}`}
      />

      {/* Open Graph */}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={locale} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Alternate Language Links */}
      {router.locales?.map((loc) => (
        <link
          key={loc}
          rel="alternate"
          hrefLang={loc}
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/${loc}${router.asPath}`}
        />
      ))}
    </Head>
  );
}; 