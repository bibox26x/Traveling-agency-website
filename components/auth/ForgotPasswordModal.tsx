import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { auth } from '../../services/api';
import Button from '../ui/Button';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('common');
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      await auth.forgotPassword(email);
      setMessage(t('auth.resetCodeSent'));
      setStep('reset');
    } catch (err: any) {
      setError(err.message || t('errors.unexpectedError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      await auth.resetPassword(email, resetToken, newPassword);
      setMessage(t('auth.passwordResetSuccess'));
      setTimeout(() => {
        onClose();
        // Reset form state
        setStep('email');
        setEmail('');
        setResetToken('');
        setNewPassword('');
        setConfirmPassword('');
        setMessage('');
        setError('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || t('errors.unexpectedError'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-8 w-full max-w-md">
        <div className="bg-white shadow-2xl rounded-3xl px-8 py-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-display font-bold tracking-tight text-gray-900">
              {step === 'email' ? t('auth.forgotPassword') : t('auth.resetPassword')}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
              aria-label={t('common.close')}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {message && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700 font-medium">{message}</p>
                </div>
              </div>
            </div>
          )}

          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('ui.form.email')}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-500 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder')}
                />
              </div>

              <div className="flex flex-col space-y-3">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  fullWidth
                  size="lg"
                >
                  {t('auth.sendResetInstructions')}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  fullWidth
                >
                  {t('common.cancel')}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetSubmit} className="space-y-6">
              <div>
                <label htmlFor="reset-token" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.resetCode')}
                </label>
                <input
                  id="reset-token"
                  name="reset-token"
                  type="text"
                  required
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-500 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder={t('auth.resetCodePlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.newPassword')}
                </label>
                <input
                  id="new-password"
                  name="new-password"
                  type="password"
                  required
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-500 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t('auth.newPasswordPlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.confirmPassword')}
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-500 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                />
              </div>

              <div className="flex flex-col space-y-3">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  fullWidth
                  size="lg"
                >
                  {t('auth.resetPassword')}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep('email')}
                  fullWidth
                >
                  {t('auth.backToEmail')}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal; 