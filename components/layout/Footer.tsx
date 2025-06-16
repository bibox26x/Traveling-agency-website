import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const Footer = () => {
  const { t } = useTranslation('common');
  const currentYear = new Date().getFullYear();

  const navigation = {
    company: [
      { name: 'footer.company.about', href: '/about' },
      { name: 'footer.company.contact', href: '/contact' },
      { name: 'footer.company.careers', href: '/careers' },
      { name: 'footer.company.blog', href: '/blog' }
    ],
    support: [
      { name: 'footer.support.helpCenter', href: '/help' },
      { name: 'footer.support.terms', href: '/terms' },
      { name: 'footer.support.privacy', href: '/privacy' },
      { name: 'footer.support.faq', href: '/faq' }
    ],
    social: [
      { name: 'footer.social.facebook', href: 'https://facebook.com' },
      { name: 'footer.social.twitter', href: 'https://twitter.com' },
      { name: 'footer.social.instagram', href: 'https://instagram.com' },
      { name: 'footer.social.linkedin', href: 'https://linkedin.com' }
    ]
  };

  return (
    <footer className="bg-[#0F3E61] text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        {t('footer.title')}
      </h2>
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-playfair-display font-bold">
                {t('footer.brand')}
              </span>
            </Link>
            <p className="text-sm leading-6 text-gray-300 max-w-md">
              {t('footer.description')}
            </p>
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{t(item.name)}</span>
                  {t(item.name)}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div>
              <h3 className="text-sm font-semibold leading-6 text-white uppercase tracking-wider">
                {t('footer.sections.company')}
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className="text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      {t(item.name)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-6 text-white uppercase tracking-wider">
                {t('footer.sections.support')}
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.support.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className="text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      {t(item.name)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-700/50">
          <p className="text-sm text-gray-300 text-center">
            {t('footer.copyright', { year: currentYear })}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 