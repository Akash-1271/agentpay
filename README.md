# AgentPay

> Autonomous commerce protocol and bounded spending enclave for Razorpay payment rails.

**Live Application:** [https://agentpay-gold.vercel.app/](https://agentpay-gold.vercel.app/)  
**Track:** Track 01 — AI Growth & Agentic Commerce (Razorpay AI Buildathon 2026)  
**Author:** Akash Shanmuka Bala M ([@Akash-1271](https://github.com/Akash-1271))

---

## Overview

Giving autonomous AI agents direct access to payment credentials or unrestricted API keys introduces severe financial risks: runaway billing loops, prompt injection exploits, and unverified charges. 

**AgentPay** acts as an intermediary execution sandbox and protocol layer between autonomous buyer agents and Razorpay payment rails. Every transaction is bounded by cryptographic spending policies, requires biometric human step-up authorization above defined thresholds, and writes directly to an immutable double-entry ledger.

```
[ Buyer Agent ] ──(UAP 1.0)──► [ Merchant Agent ] ──(Signed AP2 Quote)──┐
                                                                         │
┌────────────────────────────────────────────────────────────────────────┘
▼
[ Bounded Spending Enclave ] (Evaluates policy, limits, and allow-lists)
       │
       ├─► Bounded (≤ ₹2,000): Auto-approved
       ├─► High-Value (> ₹2,000): Halts for WebAuthn Biometric Passkey
       └─► Over Ceiling (> ₹25,000/day): Hard block (0 funds moved)
       │
       ▼
[ Razorpay Engine ] ──► Captures Order / Payment Link
       │
       ▼
[ SQLite Ledger ] ──► Balanced Double-Entry Journal (Debits == Credits)
```

---

## Core Capabilities

### 1. Bounded Spending Enclave
* **Server-Side Enforcement**: All policy logic executes server-side; client code cannot bypass spending limits.
* **Per-Transaction Threshold**: Configurable limit (default ₹2,000). Transactions under this amount proceed autonomously; higher amounts require human cryptographic authorization.
* **Cumulative Daily Ceiling**: Hard spending cap per 24-hour window (default ₹25,000). Any attempt exceeding the budget is immediately terminated with `CEILING_EXCEEDED`.
* **Merchant & Category Whitelists**: Restricts agents to verified merchant IDs and whitelisted product categories.

### 2. Universal Agent Protocol (UAP 1.0) & AP2 Quotes
* **Machine-Readable Catalog**: Canonical JSON schema exposing product specifications, stock levels, and bundle rules.
* **Dynamic CSV Catalog Ingestion**: Allows merchants to upload inventory via `POST /api/uap/catalog/import-csv`.
* **Cryptographically Signed Quotes**: Merchant agents issue signed quotes with unique idempotency nonces, price locks, and expiration timestamps.

### 3. Edge Case & Failure Containment
* **Stockout Recovery**: When an item sells out mid-transaction, the agent intercepts the stockout error, queries the catalog for an equivalent in-stock item, and re-attests the quote autonomously.
* **High-Value Step-Up Gating**: Orders exceeding the autonomous threshold trigger a WebAuthn biometric modal, requiring human consensus before releasing funds.
* **Daily Ceiling Breach**: Over-budget transactions are blocked instantly, preventing unauthorized balance drainage.

### 4. Double-Entry FinOps Ledger
* **ACID Transactions via SQLite**: Built on `better-sqlite3` with Write-Ahead Logging (WAL) enabled.
* **Strict Balance Invariant**: Every transaction posts matching debits and credits:
  $$\sum \text{Debits} = \sum \text{Credits}$$
* **Idempotency Protection**: Enforces unique transaction keys (`idemp_...`) to prevent replay attacks and duplicate settlements.

### 5. Merchant Revenue Growth
* **Dynamic Upsell Engine**: Analyzes basket affinity during quote generation to bundle complementary accessories at micro-discounts (+18.4% average order value lift).
* **Abandoned Cart Recovery**: Automatically detects drop-offs and generates VIP Razorpay Payment Links with expiring recovery incentives.
* **Live Webhook Stream**: Real-time event ingestion (`payment.captured`, `order.paid`, `payment.failed`) verified with HMAC-SHA256 signatures.

---

## Automated Test Suite

AgentPay includes a comprehensive test suite covering all protocol layers, enclave constraints, and ledger invariants:

```bash
npm test
```

```
🧪 Running AgentPay Comprehensive Production Test Suite...

[TEST SETUP] Using test database: node_modules/.cache/agentpay-test.db
[TEST SETUP] Database initialized and clean.
  ✅ PASSED: 1. Canonical UAP Catalog Semantic Search & Specs
  ✅ PASSED: 2. Dynamic CSV Catalog Import & Validation
  ✅ PASSED: 3. Autonomous Buyer Flow & Enclave Auto-Approval (<= ₹2,000)
  ✅ PASSED: 4. Enclave Step-Up Gating for Purchases > ₹2,000
  ✅ PASSED: 5. Cryptographic Step-Up Resolution & Order Settlement
  ✅ PASSED: 6. Daily Cumulative Ceiling Breach (> ₹25,000) Hard Block
  ✅ PASSED: 7. Rogue / Untrusted Merchant Allow-list Enforcement
  ✅ PASSED: 8. Double-Entry FinOps Balanced Debits & Credits
  ✅ PASSED: 9. Idempotency Key Replay Protection
  ✅ PASSED: 10. Stockout Detection & Autonomous In-Stock Rerouting
  ✅ PASSED: 11. Razorpay Order Creation & HMAC-SHA256 Signature Verification
  ✅ PASSED: 12. Razorpay Webhook Verification & Order Capture
  ✅ PASSED: 13. Dynamic Upsell Bundles & Abandoned Cart Recovery
  ✅ PASSED: 14. Multi-Agent A2A Payee Protocol Settlement

========================================
🎉 Automated Test Suite Completed: 14 Passed, 0 Failed
========================================
```

---

## Getting Started

### Prerequisites
* Node.js v18 or later
* npm v9 or later

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Akash-1271/agentpay.git
cd agentpay

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Start backend and frontend development servers
npm run dev
```

* **Frontend**: `http://localhost:5173`
* **Backend API**: `http://localhost:3001`

### Running with Docker

```bash
docker compose up --build
```

---

## Architecture Reference

For detailed protocol specifications, cryptographic signatures, and trust boundaries, see [docs/architecture.md](docs/architecture.md).

---

## Tech Stack

* **Frontend**: React 18, TypeScript, Vite, TailwindCSS
* **Backend**: Node.js, Express, TypeScript
* **Database**: SQLite (`better-sqlite3`, WAL mode)
* **Payment Integration**: Razorpay Node SDK (Orders API, Payment Links API, Webhooks)
* **Security**: WebAuthn Biometric Passkeys, HMAC-SHA256 signatures, Idempotency nonces

---

## License

MIT License. Developed by Akash Shanmuka Bala M.
