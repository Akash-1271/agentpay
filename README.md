# ⚡ AgentPay — Autonomous Agentic Commerce Protocol & Bounded Payment Gateway
> Built for the **Razorpay AI Buildathon 2026** · **Track 01: AI Growth & Agentic Commerce**

[![Razorpay](https://img.shields.io/badge/Razorpay-Test%20API%20Active-0c83ff?style=flat&logo=razorpay)](https://razorpay.com)
[![Protocol](https://img.shields.io/badge/Protocol-UAP%201.0%20%7C%20AP2%20v2.0-8b5cf6?style=flat)]()
[![Enclave](https://img.shields.io/badge/Spending%20Guard-Non--Bypassable%20Enclave-10b981?style=flat)]()
[![Ledger](https://img.shields.io/badge/FinOps-SQLite%20Double--Entry-059669?style=flat)]()
[![Tests](https://img.shields.io/badge/Tests-14%2F14%20Passed-10b981?style=flat)]()

---

## 🎯 Executive Summary

As personal and enterprise AI agents (autonomous buyers, workflow automations, procurement bots) enter mainstream e-commerce, traditional web checkouts fail because:
1. **Unbounded Agent Risk**: Giving an AI direct payment credentials risks runaway billing or hallucinated purchases.
2. **Missing Machine-Readable Layer**: Merchants lack standardized semantic catalogs for agents to discover inventory, lock stock, and negotiate dynamic bundle discounts.
3. **No Non-Bypassable Gating**: Financial regulators and enterprises require every rupee moved by an AI to be explainable, bounded, gated, and backed by an immutable cryptographic audit trail.

**AgentPay solves this end-to-end.** It is an open-protocol agentic commerce gateway and server-side bounded financial enclave that enables any merchant to become fully transactable by autonomous AI buyers using Razorpay test-mode infrastructure.

---

## 🏗️ System Architecture

$$\text{DISCOVER (UAP)} \longrightarrow \text{NEGOTIATE (AP2)} \longrightarrow \text{ENCLAVE GUARD} \longrightarrow \text{TRANSACT (Razorpay)} \longrightarrow \text{FINOPS LEDGER}$$

```
                                  [ PRINCIPAL USER ]
                                           │
                         Configures Spending Policy Enclave
                       (Auto-approve ≤ ₹2,000 | Ceiling ₹25,000)
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                 BOUNDED SPENDING ENCLAVE (Server-Side Only)                     │
│  - Non-Bypassable Policy Engine with HMAC-SHA256 Signed Mandates                │
│  - Single-Transaction Threshold Gating (> ₹2,000 requires Step-Up passkey)      │
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
│  - Standard Checkout Widget & Dynamic UPI QR Simulator                          │
│  - Webhook Listener with HMAC-SHA256 Signature Verification                     │
│  - Live Logistics Dispatch (AWB tracking) & GST Tax Invoicing                   │
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

## 🌟 Core Architecture & Track 01 Requirements

### 1. 🛡️ Bounded Spending Enclave (Policy Engine)
* **Server-Side Non-Bypassable Enforcement**: All money-moving decisions are verified on the backend before any order is created.
* **Per-Transaction Auto-Approval Ceiling**: Default ₹2,000. Purchases exceeding this trigger a human-in-the-loop Step-Up authorization modal.
* **Cumulative Daily Spending Ceiling**: Default ₹25,000. Transactions exceeding the cumulative budget are blocked immediately with **zero financial movement**.
* **Merchant & Category Whitelists**: Restricts agent purchases strictly to authorized merchants and approved categories.
* **Pre-Execution Audit Logging**: Every evaluation is permanently logged in SQLite with HMAC signatures prior to quote execution.

### 2. 📒 Persistent Double-Entry FinOps Ledger
* **SQLite Persistence**: Uses `better-sqlite3` for durable, transactional accounting records.
* **Balanced Journal Entries**: Every transaction creates balanced Debit and Credit line items (`Total Debits == Total Credits`).
* **Idempotency Protection**: Every transaction enforces unique idempotency keys to prevent duplicate billing.
* **Integrity Auditing**: Verifies cryptographic HMAC signatures and cross-account balance consistency.

### 3. 📦 Agent-Readable Catalog (UAP Protocol)
* **Canonical JSON Schema**: Standardized product specifications (`id`, `name`, `price`, `stock`, `rating`, `specifications`, `bundleDeals`).
* **Dynamic CSV Importer**: `POST /api/uap/catalog/import-csv` imports and indexes merchant catalogs instantly.
* **Structured Tools**: Exposes `search_products`, `get_product`, `check_inventory`, `request_signed_quote` to the Buyer Agent.

### 4. 🤖 Autonomous ReAct Buyer Agent
* **Multi-Step Tool-Calling Loop**: Intent Parsing $\rightarrow$ Semantic Discovery $\rightarrow$ Inventory Verification $\rightarrow$ Quote Negotiation $\rightarrow$ Policy Evaluation $\rightarrow$ Settlement $\rightarrow$ FinOps Ledger.
* **Explainable Reasoning Trail**: Every action produces structured step-by-step logs explaining *why this product, why this price, and which policy checks passed*.
* **Dual Execution Engine**: Supports optional OpenAI/Gemini/Anthropic API keys, with a built-in deterministic heuristic semantic engine when keys are omitted.

### 5. 💳 Razorpay Test-Mode Integration
* **Orders API**: Creates real Razorpay test-mode orders (`order_...`).
* **Payment Links API**: Generates genuine payment links for cart recovery (`plink_...`).
* **Standard Checkout**: Interactive checkout modal with UPI QR intent.
* **Webhook Verification**: Validates `x-razorpay-signature` using HMAC-SHA256 secret.

### 6. 📈 Merchant Revenue Growth Engine
* **Dynamic Bundles**: Algorithmic bundle discounts based on product category affinity and inventory margins.
* **Abandoned Cart Recovery**: Real recovery studio generating Razorpay payment links with personalized VIP incentives.
* **Honest Analytics**: Metrics computed directly from SQLite database transactions (no fabricated percentages).

### 7. 🚨 3 Verified Failure Modes
1. **Stockout Mid-Flow Recovery**: Primary item has 0 stock $\rightarrow$ Agent detects stockout and autonomously reroutes to an in-stock alternative without failing.
2. **High-Value Step-Up Gating**: Purchase exceeds ₹2,000 $\rightarrow$ Enclave halts autonomous execution and requires a human passkey signature.
3. **Daily Ceiling Breach**: Purchase exceeds daily limit $\rightarrow$ Enclave hard blocks transaction with `CEILING_EXCEEDED` and zero money moves.

---

## 🚀 Quickstart Guide

### Prerequisites
* Node.js v18+ installed

### Setup & Run
```bash
# 1. Clone repository
git clone https://github.com/Akash-1271/agentpay.git
cd agentpay

# 2. Install dependencies
npm install

# 3. Configure environment (optional: add your Razorpay test keys)
cp .env.example .env

# 4. Start backend (port 3001) and frontend (port 5173)
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🧪 Automated Test Suite

Run the 14-test verification suite:
```bash
npm test
```

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

## 🎬 5-Minute Judge Demo

For a step-by-step walkthrough of all features and failure modes, see the official [Demo Script](file:///c:/razorpay/docs/demo-script.md).

---

## 📄 License
MIT © 2026 AgentPay Core Contributors. Built for the Razorpay AI Buildathon 2026.
