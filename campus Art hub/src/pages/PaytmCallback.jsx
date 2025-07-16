import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { orderStore } from '../utils/orderStore';

const PaytmCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const orderId = params.get('orderId');
    const txnId = params.get('txnId');

    if (status === 'success' && orderId && txnId) {
      // Update the order in orderStore with txnId and mark as paid
      const orders = orderStore.getAllOrders();
      const idx = orders.findIndex(o => o.id === orderId);
      if (idx !== -1) {
        orders[idx].status = 'paid';
        orders[idx].upiTransactionId = txnId;
        orderStore.saveToStorage();
      }
      setTimeout(() => {
        navigate('/checkout?paytmPaid=true');
      }, 1500);
    } else {
      setTimeout(() => {
        navigate('/checkout?paytmPaid=false');
      }, 2000);
    }
  }, [location, navigate]);

  const params = new URLSearchParams(location.search);
  const status = params.get('status');

  return (
    <div style={{ textAlign: 'center', marginTop: 80 }}>
      <h2>Processing Payment...</h2>
      {status === 'success' && <p style={{ color: 'green' }}>Payment successful! Redirecting...</p>}
      {status === 'failure' && <p style={{ color: 'red' }}>Payment failed. Redirecting...</p>}
    </div>
  );
};

export default PaytmCallback; 