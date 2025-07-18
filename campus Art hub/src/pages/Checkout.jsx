import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  Alert,
  Chip,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LocalShipping, CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cartStore } from '../utils/cartStore';
import upiIcon from '../assets/upi.png';
import qrCode from '../assets/qr code.jpg';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { orderStore } from '../utils/orderStore';
import userService from '../utils/userService';

// Meesho-style progress bar
const steps = [
  { label: 'Cart' },
  { label: 'Address' },
  { label: 'Payment' },
  { label: 'Summary' },
];

function ProgressBar({ currentStep = 2 }) {
  // currentStep: 0=Cart, 1=Address, 2=Payment, 3=Summary
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', mb: 3, mt: 1 }}>
      {steps.map((step, idx) => (
        <React.Fragment key={step.label}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: idx <= currentStep ? '#b39ddb' : '#eee',
                color: idx <= currentStep ? '#fff' : '#888',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 16,
                mb: 0.5,
                border: idx === currentStep ? '2.5px solid #6a11cb' : '2px solid #eee',
                transition: 'all 0.2s',
              }}
            >
              {idx + 1}
            </Box>
            <Typography sx={{ fontSize: 13, fontWeight: idx === currentStep ? 700 : 500, color: idx === currentStep ? '#6a11cb' : '#888', mt: 0.5 }}>{step.label}</Typography>
          </Box>
          {idx < steps.length - 1 && (
            <Box sx={{ flex: 1, height: 2, background: idx < currentStep ? '#6a11cb' : '#eee', mx: 1.5, borderRadius: 1 }} />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
}

function PaymentSection({ paymentMethod, setPaymentMethod, orderTotal, discount, setDiscount }) {
  const [selectedOnline, setSelectedOnline] = React.useState('upi');
  const [expanded, setExpanded] = React.useState(paymentMethod);

  // Update discount when payment method changes
  React.useEffect(() => {
    if (paymentMethod === 'online') {
      setDiscount(10);
    } else {
      setDiscount(0);
    }
  }, [paymentMethod, setDiscount]);

  const payOnlineOptions = [
    {
      value: 'upi',
      label: 'Pay by any UPI App',
      offers: '',
      content: (
        <Box sx={{ textAlign: 'center', py: 1 }}>
          <img
            src={qrCode}
            alt="UPI QR Code"
            style={{ width: 110, height: 110, marginBottom: 6, borderRadius: 6, border: '1px solid #eee' }}
          />
          <Typography variant="body2" sx={{ mt: 1, fontSize: '0.98rem', fontWeight: 500 }}>
            Scan QR code for payment
          </Typography>
        </Box>
      ),
    },
    {
      value: 'wallet',
      label: 'Wallet',
      offers: '',
      content: <Typography variant="body2" color="text.secondary">(Wallet payment coming soon)</Typography>,
    },
    {
      value: 'card',
      label: 'Debit/Credit Cards',
      offers: '',
      content: <Typography variant="body2" color="text.secondary">(Card payment coming soon)</Typography>,
    },
    {
      value: 'netbanking',
      label: 'Net Banking',
      offers: '',
      content: <Typography variant="body2" color="text.secondary">(Netbanking coming soon)</Typography>,
    },
  ];
  const paymentOptions = [
    {
      value: 'cod',
      label: 'Cash on Delivery',
      price: orderTotal,
      icon: <LocalShipping sx={{ fontSize: 28, color: '#6a11cb' }} />,
      details: null,
    },
    {
      value: 'online',
      label: 'Pay Online',
      price: orderTotal - discount,
      icon: <img src={upiIcon} alt="Pay Online" style={{ width: 28, height: 28, borderRadius: '50%' }} />, // Use provided upi.png
      save: discount > 0 ? `Save ₹${discount}` : null,
      extra: '', // Removed extra discount info bar
      details: (
        <Box>
          {/* Flat list for Pay Online sub-options, with details shown directly below selected row */}
          <Box sx={{ px: 0, pb: 2 }}>
            {payOnlineOptions.map(opt => (
              <React.Fragment key={opt.value}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 1.5,
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer',
                    background: selectedOnline === opt.value ? '#f7f7fa' : 'transparent',
                    fontWeight: selectedOnline === opt.value ? 700 : 500,
                    color: selectedOnline === opt.value ? '#6a11cb' : 'inherit',
                    transition: 'background 0.2s',
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedOnline(selectedOnline === opt.value ? null : opt.value);
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <Typography sx={{ fontWeight: selectedOnline === opt.value ? 700 : 500 }}>{opt.label}</Typography>
                    {opt.offers && <Typography color="success.main" sx={{ fontWeight: 700, fontSize: '0.98rem', ml: 1 }}>{opt.offers}</Typography>}
                  </Box>
                  <ChevronRightIcon sx={{ color: '#bdbdbd', fontSize: 22 }} />
                </Box>
                {/* Show details directly below the selected option */}
                {selectedOnline === opt.value && (
                  <Box sx={{ px: 2, py: 1 }}>
                    {opt.content}
                  </Box>
                )}
              </React.Fragment>
            ))}
          </Box>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', pt: 2 }}>
      {/* Heading above payment method section */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, pl: 1, fontSize: '1.18rem', letterSpacing: 0.1 }}>
        Select Payment Method
      </Typography>
      {paymentOptions.map(option => (
        <Box
          key={option.value}
          sx={{
            borderRadius: 2.5,
            border: paymentMethod === option.value ? '2px solid #6a11cb' : '1.5px solid #e0e0e0',
            background: 'transparent',
            mb: 2,
            cursor: 'pointer',
            position: 'relative',
            transition: 'border-color 0.2s, background 0.2s',
            boxShadow: { xs: '0 1px 6px rgba(160,89,230,0.07)', md: 'none' },
            mx: { xs: 1, md: 0 },
            p: { xs: 1, md: 2 },
            minHeight: { xs: 60, md: 80 },
          }}
          onClick={() => {
            if (expanded === option.value) {
              setExpanded(null);
              setPaymentMethod(null);
            } else {
              setPaymentMethod(option.value);
              setExpanded(option.value);
              if (option.value === 'online') setSelectedOnline('upi');
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <Box sx={{ minWidth: 60, textAlign: 'center' }}>
              {option.value === 'online' ? (
                <>
                  <Typography variant="body2" sx={{ color: '#888', textDecoration: 'line-through', fontWeight: 600 }}>
                    ₹{orderTotal}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1aaf5d', lineHeight: 1 }}>
                    ₹{orderTotal - discount}
                  </Typography>
                  {discount > 0 && (
                    <Chip label={`Save ₹${discount}`} color="success" size="small" sx={{ mt: 0.5, fontWeight: 600, background: '#e6f4ea', color: '#1aaf5d', position: 'absolute', top: 8, right: 8 }} />
                  )}
                </>
              ) : (
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  ₹{orderTotal}
                </Typography>
              )}
            </Box>
            <Box sx={{ flex: 1, ml: 2, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>{option.label}</Typography>
              <Box sx={{ ml: 1 }}>{option.icon}</Box>
            </Box>
            {/* Custom radio circle at the end */}
            <Box
              sx={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                border: paymentMethod === option.value ? '6px solid #6a11cb' : '2px solid #bbb',
                background: '#fff',
                ml: 2,
                boxSizing: 'border-box',
                transition: 'border 0.2s',
                display: 'inline-block',
              }}
            />
          </Box>
          {/* Accordion details: only show if expanded */}
          {expanded === option.value && option.details && (
            <Box>{option.details}</Box>
          )}
        </Box>
      ))}
    </Box>
  );
}

function PriceDetails({ subtotal, deliveryFee, total, discount, paymentMethod }) {
  return (
    <Box
      sx={{
        background: '#fff',
        border: '1.5px solid #eee',
        borderRadius: 2.5,
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        p: 3,
        width: '100%',
        mb: 2,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Price Details (1 Item)
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography color="text.secondary">Total Product Price</Typography>
        <Typography>+ ₹{subtotal}</Typography>
      </Box>
      {discount > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography color="text.secondary">Total Discounts</Typography>
          <Typography color="success.main">- ₹{discount}</Typography>
        </Box>
      )}
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Order Total</Typography>
        <Typography variant="h6">₹{total}</Typography>
      </Box>
      {discount > 0 && (
        <Alert
          severity="success"
          sx={{
            mb: 2,
            py: 1,
            px: 2,
            fontWeight: 600,
            background: '#c7ceea', // pastel lavender
            color: '#6a11cb', // deeper lavender for text
            borderRadius: 1.5,
          }}
        >
          Yay! Your total discount is ₹{discount}
        </Alert>
      )}
    </Box>
  );
}

function PriceBar({ orderTotal, onContinue }) {
  return (
    <Box sx={{
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      bgcolor: '#fff',
      borderTop: '1.5px solid #eee',
      boxShadow: '0 -2px 8px rgba(0,0,0,0.04)',
      zIndex: 1200,
      py: 2,
      px: { xs: 2, md: 8 },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>₹{orderTotal}</Typography>
        {/* Removed VIEW PRICE DETAILS text */}
      </Box>
      <Button variant="contained" color="secondary" sx={{ px: 4, py: 1.2, fontWeight: 700, fontSize: '1.1rem', background: '#b39ddb', '&:hover': { background: '#b39ddb' } }} onClick={onContinue}>
        Continue
      </Button>
    </Box>
  );
}

const Checkout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [discount, setDiscount] = useState(0);
  const [isPaytmLoading, setIsPaytmLoading] = useState(false);
  const navigate = useNavigate();
  const [showSummary, setShowSummary] = useState(false);

  // Get cart data from store
  const cartItems = cartStore.getCartItems();
  const subtotal = cartStore.getTotal();
  const deliveryFee = 0; // Free delivery
  const total = subtotal + deliveryFee - discount;
  const currentUser = userService.getCurrentUser();

  // Place order and trigger Paytm payment
  const handlePaytmPayment = async () => {
    setIsPaytmLoading(true);
    const orderId = 'ORDER_' + Date.now();
    const amount = total.toFixed(2);
    const customerId = currentUser?.id || 'guest_' + Date.now();
    const email = currentUser?.email || '';
    const phone = currentUser?.phone || '';
    const callbackUrl = window.location.origin + '/paytm-callback';

    // Save order as pending before payment
    orderStore.addOrder({
      id: orderId,
      items: cartItems,
      total: total,
      paymentMethod: 'upi',
      status: 'pending',
      customer: currentUser,
      placedAt: new Date().toISOString(),
    });

    // Call backend to get Paytm params
    const res = await fetch('http://localhost:5000/api/paytm/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, amount, customerId, callbackUrl, email, phone })
    });
    const data = await res.json();

    // Create a form and submit to Paytm
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://securegw.paytm.in/theia/processTransaction';
    Object.entries(data).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
    setIsPaytmLoading(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'flex-start',
        width: '100%',
        minHeight: '100vh',
        background: '#fff',
        px: { xs: 0, md: 4 },
        pt: { xs: 2, md: 6 },
        pb: 10, // space for sticky bar
        gap: { xs: 0, md: 4 },
      }}
    >
      {/* Main content column */}
      <Box sx={{ flex: 2, width: { xs: '100%', md: '60%' }, maxWidth: 520, mx: 'auto', px: { xs: 0.5, md: 0 } }}>
        {/* Progress bar */}
        <ProgressBar currentStep={2} />
        {/* Summary Toggle */}
        <Button
          variant="outlined"
          sx={{ mb: 1, width: '100%', color: '#b39ddb', borderColor: '#b39ddb', fontWeight: 600, fontSize: { xs: '0.95rem', md: '1rem' }, py: { xs: 0.7, md: 1.2 } }}
          onClick={() => setShowSummary((prev) => !prev)}
        >
          {showSummary ? 'Hide Summary' : 'Show Summary'}
        </Button>
        {showSummary && (
          <Box sx={{ mb: 1, p: { xs: 1, md: 2 }, border: '1.5px solid #eee', borderRadius: 2, background: '#fafaff', fontSize: { xs: '0.95rem', md: '1rem' } }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.05rem', md: '1.2rem' } }}>Order Summary</Typography>
            {cartItems.map((item, idx) => (
              <Box key={item.id || idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>{item.name} x{item.quantity}</Typography>
                <Typography sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>₹{(item.price * item.quantity).toLocaleString()}</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography>Total</Typography>
              <Typography>₹{subtotal}</Typography>
            </Box>
            {discount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography>Discount</Typography>
                <Typography color="success.main">- ₹{discount}</Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              <Typography variant="h6" sx={{ fontSize: { xs: '1.05rem', md: '1.2rem' } }}>Grand Total</Typography>
              <Typography variant="h6" sx={{ fontSize: { xs: '1.05rem', md: '1.2rem' } }}>₹{total}</Typography>
            </Box>
          </Box>
        )}
        {/* Payment method accordion */}
        <PaymentSection
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          orderTotal={subtotal}
          discount={discount}
          setDiscount={setDiscount}
        />
      </Box>
      {/* Price Details column */}
      <Box sx={{ flex: 1, width: { xs: '100%', md: '40%' }, maxWidth: 420, mx: { xs: 'auto', md: 0 }, mt: { xs: 2, md: 0 }, px: { xs: 0.5, md: 0 } }}>
        <PriceDetails
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
          discount={discount}
          paymentMethod={paymentMethod}
        />
      </Box>
      {/* Sticky Bottom Bar */}
      <Box sx={{ position: 'fixed', left: 0, right: 0, bottom: 0, bgcolor: '#fff', borderTop: '1.5px solid #eee', boxShadow: '0 -2px 8px rgba(0,0,0,0.04)', zIndex: 1200, py: 2, px: { xs: 2, md: 8 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>₹{total}</Typography>
        </Box>
        {paymentMethod === 'online' ? (
          <Button
            variant="contained"
            color="secondary"
            sx={{ px: 4, py: 1.2, fontWeight: 700, fontSize: '1.1rem', background: '#b39ddb', '&:hover': { background: '#b39ddb' } }}
            onClick={handlePaytmPayment}
            disabled={isPaytmLoading}
          >
            {isPaytmLoading ? 'Processing...' : 'Continue'}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            sx={{ px: 4, py: 1.2, fontWeight: 700, fontSize: '1.1rem', background: '#b39ddb', '&:hover': { background: '#b39ddb' } }}
            onClick={() => toast.success('Order placed!')}
          >
            Continue
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Checkout; 