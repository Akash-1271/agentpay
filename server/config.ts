import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CONFIG = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_AgentPayLiveDemo2026',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'agentpay_test_secret_key_2026',
  WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || 'whsec_agentpay_secret_2026',
  DEFAULT_BUYER_ID: 'user_akash_ai_shopper',
  DEFAULT_MERCHANT_ID: 'merch_apex_gear',
  ENCLAVE_SECRET_SALT: process.env.ENCLAVE_SECRET_SALT || 'agentpay-cryptographic-enclave-salt-2026',
  get DB_PATH(): string {
    return process.env.DB_PATH || path.join(__dirname, 'data', 'agentpay.db');
  },
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
};
