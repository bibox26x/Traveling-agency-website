import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/layout/Layout';
import Head from 'next/head';

export default function AboutPage() {
  const { t } = useTranslation('common');

  const pageTitle = `${t('about.meta.title')} - ${t('common.brand')}`;

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={t('about.meta.description')} />
      </Head>

      <div className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-display font-bold text-primary-900 mb-4">
              {t('about.hero.title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('about.hero.subtitle')}
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">{t('about.mission.title')}</h2>
              <p className="text-gray-600">{t('about.mission.description')}</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">{t('about.vision.title')}</h2>
              <p className="text-gray-600">{t('about.vision.description')}</p>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-primary-900 text-center mb-8">
              {t('about.whyChooseUs.title')}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-2">{t('about.whyChooseUs.expert.title')}</h3>
                <p className="text-gray-600">{t('about.whyChooseUs.expert.description')}</p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-2">{t('about.whyChooseUs.secure.title')}</h3>
                <p className="text-gray-600">{t('about.whyChooseUs.secure.description')}</p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-2">{t('about.whyChooseUs.support.title')}</h3>
                <p className="text-gray-600">{t('about.whyChooseUs.support.description')}</p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-primary-900 text-center mb-8">
              {t('about.contact.title')}
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-xl font-bold text-primary-900 mb-2">{t('about.contact.address.title')}</h3>
                <p className="text-gray-600">
                  {t('about.contact.address.street')}<br />
                  {t('about.contact.address.city')}<br />
                  {t('about.contact.address.country')}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary-900 mb-2">{t('about.contact.info.title')}</h3>
                <p className="text-gray-600">
                  {t('about.contact.info.phone')}<br />
                  {t('about.contact.info.email')}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary-900 mb-2">{t('about.contact.hours.title')}</h3>
                <p className="text-gray-600">
                  {t('about.contact.hours.weekdays')}<br />
                  {t('about.contact.hours.saturday')}<br />
                  {t('about.contact.hours.sunday')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
}; 