import { useState } from 'react';
import { useRouter } from 'next/router';
import { payments } from '../../services/api';
import { useTranslation } from 'next-i18next';
import toast from 'react-hot-toast';

interface PaymentFormProps {
  bookingId: number;
  amount: number;
  onSuccess?: () => void;
}

export default function PaymentForm({ bookingId, amount, onSuccess }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank_transfer'>('bank_transfer');
  const [proofImage, setProofImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { t } = useTranslation('common');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await payments.create({
        bookingId,
        amount,
        paymentMethod,
        proofImage,
      });

      toast.success(t('payments.notifications.paymentSubmitted'));
      
      if (onSuccess) {
        onSuccess();
      }
      router.push('/bookings');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit payment';
      setError(errorMessage);
      toast.error(t('payments.errors.paymentFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
        <p className="text-sm text-gray-500 mb-4">
          Please select your payment method and provide the necessary details.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount to Pay
        </label>
        <div className="text-2xl font-bold text-primary-600">
          ${amount.toFixed(2)}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Method
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className={`p-4 border rounded-lg text-center ${
              paymentMethod === 'bank_transfer'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-primary-500'
            }`}
            onClick={() => setPaymentMethod('bank_transfer')}
          >
            <div className="font-medium">Bank Transfer</div>
            <div className="text-sm text-gray-500">Transfer to our account</div>
          </button>
          <button
            type="button"
            className={`p-4 border rounded-lg text-center ${
              paymentMethod === 'cash'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-primary-500'
            }`}
            onClick={() => setPaymentMethod('cash')}
          >
            <div className="font-medium">Cash</div>
            <div className="text-sm text-gray-500">Pay at our office</div>
          </button>
        </div>
      </div>

      {paymentMethod === 'bank_transfer' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bank Account Details
          </label>
          <div className="bg-gray-50 p-4 rounded border">
            <p className="text-sm text-gray-600">
              Bank: Example Bank<br />
              Account Name: Travel Agency<br />
              Account Number: 1234567890<br />
              Sort Code: 12-34-56
            </p>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Proof
        </label>
        <input
          type="text"
          value={proofImage}
          onChange={(e) => setProofImage(e.target.value)}
          placeholder="Enter payment proof image URL"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
        <p className="mt-2 text-sm text-gray-500">
          Please upload your payment proof to an image hosting service and paste the URL here.
        </p>
      </div>

      {error && (
        <div className="text-red-600 bg-red-50 p-4 rounded-md">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Payment'}
        </button>
      </div>
    </form>
  );
} 