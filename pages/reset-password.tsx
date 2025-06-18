import type { NextPage } from 'next';
import Head from 'next/head';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';
import SimpleLayout from '../components/SimpleLayout';

const ResetPassword: NextPage = () => {
  return (
    <SimpleLayout>
      <Head>
        <title>Reset Password - Travel Agency</title>
        <meta name="description" content="Reset your password" />
      </Head>
      <ResetPasswordForm />
    </SimpleLayout>
  );
};

export default ResetPassword; 