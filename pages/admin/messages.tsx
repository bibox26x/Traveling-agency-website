import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Layout from '../../components/layout/Layout';
import withAuth from '../../components/auth/withAuth';
import ContactMessages from '../../components/admin/ContactMessages';

function AdminMessages() {
  const { t } = useTranslation();

  return (
    <Layout>
      <Head>
        <title>{t('admin.contact.title')} - {t('common.brand')}</title>
      </Head>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary-500 to-secondary-400 bg-clip-text text-transparent">
              {t('admin.contact.title')}
            </h1>
            <p className="mt-2 text-gray-600">
              {t('admin.contact.description')}
            </p>
          </div>

          <ContactMessages />
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};

export default withAuth(AdminMessages); 