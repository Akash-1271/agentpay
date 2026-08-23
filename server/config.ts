import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  DEFAULT_BUYER_ID: 'user_akash_ai_shopper',
  DEFAULT_MERCHANT_ID: 'merch_apex_gear',
  ENCLAVE_SECRET_SALT: process.env.ENCLAVE_SECRET_SALT || 'development-only-enclave-salt',
};
