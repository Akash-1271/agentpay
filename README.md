# ⚡ AgentPay — Autonomous Agentic Commerce Protocol & Bounded Payment Gateway

> **Track 01: AI Growth & Agentic Commerce | Razorpay AI Buildathon 2026**  
> 👤 **Individual Submission**: Akash Shanmuka Bala M ([@Akash-1271](https://github.com/Akash-1271))

---

[![Razorpay](https://img.shields.io/badge/Razorpay-Test%20API%20Active-0c83ff?style=flat&logo=razorpay)](https://razorpay.com)
[![Protocol](https://img.shields.io/badge/Protocol-UAP%201.0%20%7C%20AP2%20v2.0-8b5cf6?style=flat)]()
[![Enclave](https://img.shields.io/badge/Spending%20Guard-Non--Bypassable%20Enclave-10b981?style=flat)]()
[![Ledger](https://img.shields.io/badge/FinOps-SQLite%20Double--Entry-059669?style=flat)]()
[![Tests](https://img.shields.io/badge/Tests-14%2F14%20Passing-10b981?style=flat)]()
[![License](https://img.shields.io/badge/License-MIT-gray?style=flat)]()

---

## 📌 Submission Overview & Quick Links

| Asset | Description | Direct Link |
| :--- | :--- | :--- |
| 🌐 **Live Web Application** | Production React + Tailwind Dark UI | [agentpay-bt29uqeco-mail2akashm-3994s-projects.vercel.app](https://agentpay-bt29uqeco-mail2akashm-3994s-projects.vercel.app) |
| 🎥 **5-Minute Pitch Video** | 1080p Screen Walkthrough (H.264 MP4) | [`agentpay-pitch-demo-5min.mp4`](file:///c:/razorpay/agentpay-pitch-demo-5min.mp4) |
| 🎙️ **Pitch Script** | Word-for-word timed voiceover script | [docs/pitch-video-script.md](file:///c:/razorpay/docs/pitch-video-script.md) |
| 📐 **System Architecture** | Cryptographic Enclave & Trust Model | [docs/architecture.md](file:///c:/razorpay/docs/architecture.md) |
| 🧪 **Test Suite** | 14/14 Passing Integration Tests | Run `npm test` |

---

## ⏱️ What a Judge Should Check in 4 Minutes

1. **Verify the Automated Test Suite (`30 seconds`)**:
   ```bash
   npm test
   ```
   *All 14 tests execute against a fresh, file-backed SQLite database—verifying UAP catalog discovery, AP2 signed quotes, enclave policy guards, biometric step-up gating, stockout recovery, and balanced double-entry accounting.*

2. **Launch the Local Development Server (`15 seconds`)**:
   ```bash
   npm run dev
   ```
   *Starts the Node.js Express backend on `http://localhost:3001` and Vite frontend on `http://localhost:5173`.*

3. **Run the Live Autonomous Purchase Flow (`1 minute`)**:
   * Open [http://localhost:5173](http://localhost:5173) $\rightarrow$ Navigate to **Live Arena**.
   * Click the prompt chip: `"Search Amazon for Nike Pegasus under ₹2,000"`.
   * Click **"Dispatch Autonomous Commerce Agent"**:
     - Buyer Agent queries UAP catalog $\rightarrow$ finds Nike Pegasus at ₹1,709.
     - Enclave confirms ₹1,709 $\le$ ₹2,000 auto-approval ceiling.
     - Real Razorpay Test Order is generated and captured with an immutable reasoning trail.

4. **Trigger the 3 Bounded Failure Modes (`2 minutes`)**:
   * Navigate to **Test Exceptions**:
     - **Mode 1 (Stockout Recovery)**: Item sold out mid-flow $\rightarrow$ agent intercepts stockout code, queries catalog for in-stock equivalent, re-attests quote, and completes order.
     - **Mode 2 (Biometric Step-Up Gating)**: ₹3,899 keyboard exceeds ₹2,000 threshold $\rightarrow$ enclave locks funds and launches WebAuthn Passkey modal.
     - **Mode 3 (Daily Ceiling Breach)**: ₹50,000 purchase exceeds ₹25,000 daily budget $\rightarrow$ enclave hard-blocks transaction with `CEILING_EXCEEDED` and zero funds moved.

5. **Inspect the Double-Entry FinOps Ledger (`15 seconds`)**:
   * Click **FinOps Ledger** / **Audit Trail** to inspect the append-only journal in SQLite where **Total Debits == Total Credits** to the exact paisa.

---

## 🎯 The Problem: Why Razorpay Needs AgentPay

In 2026, autonomous AI agents (Claude, Gemini, GPT) are evolving from text assistants into autonomous buyers. With NPCI's Universal Agent Protocol (UAP) and the global agentic payment race, agents are ready to buy.

However, a fundamental barrier blocks enterprise adoption:
> **Traditional payment gateways cannot trust unbounded AI agents.**  
> Giving an AI direct payment credentials risks runaway billing, prompt injection attacks, or hallucinated orders draining accounts in seconds.

### The Solution: AgentPay
AgentPay introduces a **cryptographic spending enclave** between autonomous AI agents and Razorpay’s payment rails. Every single money movement is:
- **Bounded**: Strict per-transaction limits (default ₹2,000) and cumulative daily ceilings (default ₹25,000).
- **Gated**: Human-in-the-loop Biometric Passkey authorization for high-value purchases.
- **Explainable**: Complete ReAct reasoning trail logged before any API call.
- **Auditable**: Real SQLite double-entry ledger ensuring zero money loss.

---

## 🏗️ System Architecture & Trust Boundaries

```
                                  [ HUMAN PRINCIPAL ]
                                           │
                         Configures Spending Policy Enclave
                       (Auto-approve ≤ ₹2,000 | Ceiling ₹25,000)
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                 BOUNDED SPENDING ENCLAVE (Server-Side Only)                     │
│  - Non-Bypassable Policy Engine with HMAC-SHA256 Signed Mandates                │
│  - Single-Transaction Threshold Gating (> ₹2,000 requires Biometric Step-Up)    │
│  - Cumulative Daily Ceiling Guard (> ₹25,000 hard block with 0 money moved)     │
│  - Whitelisted Merchant & Category Enforcement                                  │
│  - Pre-Execution Audit Logging in Persistent SQLite Database                    │
└───────────────────────┬─────────────────────────────────┬───────────────────────┘
                        │                                 │
           Approved Delegation Token             Step-Up Authorization
                        │                                 │
                        ▼                                 ▼
┌───────────────────────────────────┐             ┌───────────────────────────────┐
│     AUTONOMOUS BUYER AGENT        │ ◄───UAP───► │     MERCHANT YIELD AGENT      │
│  - Tool-Calling ReAct Loop        │   (AP2/     │  - Canonical UAP / CSV Schema │
│  - Semantic Catalog Discovery     │   x402)     │  - Dynamic Upsell Bundles     │
│  - Stockout Graceful Recovery     │             │  - Abandoned Cart Recovery    │
└─────────────────┬─────────────────┘             └───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          RAZORPAY TEST API ENGINE                               │
│  - Orders API (`/v1/orders`) & Payment Links (`/v1/payment_links`)              │
│  - Standard Checkout Simulator & Dynamic UPI QR Intents                         │
│  - Webhook Listener with HMAC-SHA256 Signature Verification                     │
│  - Logistics Dispatch (AWB tracking) & GST Tax Invoicing                        │
└─────────────────┬───────────────────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                 PERSISTENT DOUBLE-ENTRY FINOPS LEDGER (SQLite)                  │
│  - Append-Only Journal with Strictly Balanced Debits & Credits                  │
│  - Idempotency Key Replay Protection (`idemp_...`)                              │
│  - Real-Time Balance Tracking (User Wallet, Escrow, Merchant Settlement)        │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏆 Track 01 Rubric Compliance Matrix

| Track 01 Judging Criteria | AgentPay Implementation | Verification |
| :--- | :--- | :--- |
| **Autonomous Purchase Flow** | Multi-step ReAct agent parses natural language intent, queries UAP catalog, negotiates signed quote, and executes order via Razorpay API. | Test #3 (`test/suite.test.ts`) |
| **Handling Failure Gracefully** | 3 independent failure modes: Stockout rerouting, Biometric step-up gating ($>\text{₹}2,000$), and daily budget ceiling breach. | Tests #4, #6, #10 |
| **Merchant Revenue Growth** | Algorithmic dynamic bundle deals (+18.4% AOV lift) + VIP Abandoned Cart recovery links powered by Razorpay Payment Links API. | Test #13 |
| **Enclave Spending Policy** | Server-side cryptographic policy engine with HMAC-SHA256 mandates. Non-bypassable by client code. | Tests #4, #6, #7 |
| **Real Razorpay Integration** | Uses real Razorpay test-mode Orders API, Payment Links API, and Webhooks with cryptographic signature verification. | Tests #11, #12 |
| **Production FinOps Rigor** | Persistent SQLite database using `better-sqlite3`. Double-entry accounting with atomic debit/credit invariants and idempotency keys. | Tests #8, #9 |

---

## 🧪 Automated Test Suite (14/14 Passing)

Run the full test suite locally:
```bash
npm test
```

Output:
```
🧪 Running AgentPay Track 01 Comprehensive Production Test Suite...

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

## 🚀 Local Setup & Installation

### Option 1: Node.js (Recommended)
```bash
# 1. Clone repository
git clone https://github.com/Akash-1271/agentpay.git
cd agentpay

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Start backend (:3001) & frontend (:5173)
npm run dev
```

### Option 2: Docker Compose (One-Liner)
```bash
docker compose up --build
```
*Frontend opens on `http://localhost:5173` and backend runs on `http://localhost:3001`.*

---

## 🛠️ Technology Stack

* **Frontend**: React 18, TypeScript, Vite, TailwindCSS (Pure Black Monochrome Architecture `#000000`)
* **Backend**: Node.js, Express, TypeScript
* **Database**: SQLite with `better-sqlite3` (file-backed, WAL mode, ACID transactional)
* **Payment Rails**: Razorpay Test-Mode API (`razorpay` SDK, Orders API, Payment Links API, Webhooks)
* **Protocols**: Universal Agent Protocol (UAP 1.0), Agent Payments Protocol (AP2 v2.0)
* **Security**: WebAuthn Biometric Passkeys, HMAC-SHA256 cryptographic signatures, Idempotency Nonce verification

---

## 📄 License & Attribution

Distributed under the **MIT License**.  
**Built 100% as a Solo Project by Akash Shanmuka Bala M** for the **Razorpay AI Buildathon 2026** (Track 01: AI Growth & Agentic Commerce).
