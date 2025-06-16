import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import Layout from '../../components/layout/Layout';
import withAuth from '../../components/auth/withAuth';
import ContactMessages from '../../components/admin/ContactMessages';

function AdminDashboard() {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {t('admin.dashboard.title')}
          </h1>

          {/* Stats Section */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Add your stats cards here */}
          </div>

          {/* Contact Messages Section */}
          <div className="mb-8">
            <ContactMessages />
          </div>

          {/* Other dashboard sections */}
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

export default withAuth(AdminDashboard); 