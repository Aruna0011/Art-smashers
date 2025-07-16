// Paytm Node.js backend for order initiation and callback verification
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PaytmChecksum = require('paytmchecksum');
const https = require('https');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// === CONFIGURATION ===
const MID = process.env.PAYTM_MID; // Use your test MID in .env for test mode
const MKEY = process.env.PAYTM_MKEY; // Use your test Merchant Key in .env for test mode
const WEBSITE = process.env.PAYTM_WEBSITE || 'WEBSTAGING'; // 'WEBSTAGING' for test mode
const FRONTEND_CALLBACK = process.env.PAYTM_CALLBACK_URL; // e.g. http://localhost:5173/paytm-callback for test mode

// === INITIATE ORDER ENDPOINT ===
app.post('/api/paytm/initiate', async (req, res) => {
  const { orderId, amount, customerId, callbackUrl, email, phone } = req.body;
  const paytmParams = {
    MID,
    WEBSITE,
    INDUSTRY_TYPE_ID: 'Retail',
    CHANNEL_ID: 'WEB',
    ORDER_ID: orderId,
    CUST_ID: customerId,
    TXN_AMOUNT: amount,
    CALLBACK_URL: callbackUrl || FRONTEND_CALLBACK,
    EMAIL: email,
    MOBILE_NO: phone,
  };
  const checksum = await PaytmChecksum.generateSignature(paytmParams, MKEY);
  res.json({ ...paytmParams, CHECKSUMHASH: checksum });
});

// === CALLBACK ENDPOINT ===
app.post('/api/paytm/callback', (req, res) => {
  const paytmParams = req.body;
  const paytmChecksum = paytmParams.CHECKSUMHASH;
  delete paytmParams.CHECKSUMHASH;

  const isVerifySignature = PaytmChecksum.verifySignature(paytmParams, MKEY, paytmChecksum);
  if (isVerifySignature) {
    // Verify payment status with Paytm server
    const params = {
      MID: MID,
      ORDERID: paytmParams.ORDER_ID,
    };
    PaytmChecksum.generateSignature(params, MKEY).then((checksum) => {
      params.CHECKSUMHASH = checksum;
      const post_data = JSON.stringify(params);
      const options = {
        hostname: 'securegw-stage.paytm.in', // Staging gateway for test mode
        port: 443,
        path: '/order/status',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': post_data.length,
        },
      };
      let response = '';
      const post_req = https.request(options, (post_res) => {
        post_res.on('data', (chunk) => {
          response += chunk;
        });
        post_res.on('end', () => {
          const result = JSON.parse(response);
          if (result.STATUS === 'TXN_SUCCESS') {
            // Payment successful, redirect to frontend with transaction ID
            res.redirect(`${FRONTEND_CALLBACK}?status=success&orderId=${params.ORDERID}&txnId=${result.TXNID}`);
          } else {
            res.redirect(`${FRONTEND_CALLBACK}?status=failure&orderId=${params.ORDERID}`);
          }
        });
      });
      post_req.write(post_data);
      post_req.end();
    });
  } else {
    res.redirect(`${FRONTEND_CALLBACK}?status=failure`);
  }
});

// === MONGODB CONNECTION ===
const MONGO_URI = process.env.MONGO_URI || 'your-mongodb-uri-here';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// === PRODUCT SCHEMA ===
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  description: String,
  image: String,
  images: [String],
  sold: { type: Number, default: 0 },
  status: { type: String, default: 'active' },
}, { timestamps: true });
const Product = mongoose.model('Product', productSchema);

// === PRODUCT API ENDPOINTS ===
// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add a new product
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add product' });
  }
});

// Update a product
app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update product' });
  }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete product' });
  }
});

app.listen(5000, () => console.log('Paytm backend running on port 5000')); 