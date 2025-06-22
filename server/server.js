import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';

const app = express();
const port = process.env.PORT || 4000;

// Connect to DB and Cloudinary
await connectDB();
await connectCloudinary();

// ✅ Allowed frontend origins
//const allowedOrigins = ['https://greencart-f7f7.vercel.app'];

const allowedOrigins = [
  'https://greencart-f7f7.vercel.app',
  'https://greencart-f7f7-bmp1zchrx-yashbansal200005-gmailcoms-projects.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


// ✅ Explicitly handle OPTIONS preflight requests
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true,
}));

// ✅ Stripe webhook route must come before express.json()
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// ✅ General middlewares (after Stripe)
app.use(express.json());
app.use(cookieParser());

// ✅ Basic route
app.get('/', (req, res) => res.send("API is Working"));

// ✅ App routes
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

// ✅ Start server
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
