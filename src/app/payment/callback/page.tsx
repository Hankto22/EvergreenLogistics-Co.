import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVerifyPaymentMutation } from "../../../store/paymentApi";

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifyPayment] = useVerifyPaymentMutation();

  const reference = searchParams.get('reference');

  useEffect(() => {
    if (reference) {
      verifyPayment(reference).unwrap().then((result) => {
        navigate('/dashboard/client?tab=invoices', { state: { message: 'Payment successful!', invoiceId: result.invoiceId } });
      }).catch(() => {
        navigate('/dashboard/client?tab=invoices', { state: { message: 'Payment verification failed. Please contact support.' } });
      });
    } else {
      navigate('/dashboard/client?tab=invoices');
    }
  }, [reference, verifyPayment, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-lg">Verifying payment...</p>
      </div>
    </div>
  );
}
