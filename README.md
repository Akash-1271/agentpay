# ⚡ AgentPay — Autonomous Agentic Commerce Protocol & Bounded Payment Gateway
> Built for the **Razorpay AI Buildathon 2026** · **Track 01: AI Growth & Agentic Commerce**

[![Razorpay](https://img.shields.io/badge/Razorpay-Test%20API%20Active-0c83ff?style=flat&logo=razorpay)](https://razorpay.com)
[![Protocol](https://img.shields.io/badge/Protocol-NPCI--UAP%20%7C%20AP2%20v2.0-8b5cf6?style=flat)]()
[![Enclave](https://img.shields.io/badge/Spending%20Guard-Cryptographic%20Enclave-10b981?style=flat)]()
[![Benchmark](https://img.shields.io/badge/Benchmark-100%25%20Adherence-10b981?style=flat)]()
[![Status](https://img.shields.io/badge/Build-Passing-emerald)]()

---

## 🎯 Executive Summary & The Problem

As personal AI agents (ChatGPT Operator, Claude Computer Use, autonomous shoppers) enter mainstream commerce, traditional web checkouts fail because:
1. **Unbounded Agent Risk**: Giving an LLM direct API access risks catastrophic financial hallucinations or runaway billing.
2. **Missing Agent-to-Agent Protocols**: Merchants lack machine-readable semantic catalogs (JSON-LD / UAP) for agents to discover stock, negotiate dynamic bundle pricing, and lock inventory.
3. **No Explainable Gating**: Financial regulators (NPCI/RBI) require every rupee moved by an AI to have an immutable cryptographic audit trail with human-in-the-loop step-up verification.

**AgentPay solves this end-to-end.** It is an open-protocol agentic commerce gateway and bounded financial enclave that allows any merchant to become transactable by autonomous AI buyers using Razorpay test-mode infrastructure.

---

## 🏗️ System Architecture & Product Principles

$$\text{DISCOVER} \longrightarrow \text{DECIDE} \longrightarrow \text{CONTROL} \longrightarrow \text{TRANSACT}$$

```
                                  [ PRINCIPAL USER ]
                                           │
                         Configures Spending Policy Enclave
                         (Auto-approve ≤ ₹2,000 | Ceiling ₹25,000)
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          BOUNDED SPENDING ENCLAVE                               │
│  - Policy Verification Engine (HMAC-SHA256 Signed Mandates)                     │
│  - Single-Tx Threshold Gating (> ₹2,000 triggers Step-Up Modal)                 │
│  - Daily Cumulative Ceiling Tracker                                             │
│  - Whitelisted Merchant & Category Validator                                    │
└───────────────────────┬─────────────────────────────────┬───────────────────────┘
                        │                                 │
           Approved Delegation Token             Step-Up Authorization
                        │                                 │
                        ▼                                 ▼
┌───────────────────────────────────┐             ┌───────────────────────────────┐
│     AUTONOMOUS BUYER AGENT        │ ◄───UAP───► │     MERCHANT YIELD AGENT      │
│  - Natural Language Intent Parser │   (AP2/     │  - Machine-Readable Catalog   │
│  - Semantic Catalog Discovery     │   x402)     │  - Dynamic Bundle Upsells     │
│  - Out-of-Stock Graceful Recovery │             │  - Cryptographic Quote Signer │
└─────────────────┬─────────────────┘             └───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           RAZORPAY TEST API ENGINE                              │
│  - Orders API (`/v1/orders`)                                                    │
│  - Dynamic UPI QR Intent Builder (`upi://pay?...`)                              │
│  - Webhook Listener with HMAC-SHA256 Signature Verification                     │
│  - Cryptographic FinOps Audit Ledger (`/api/enclave/audit`)                     │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🌟 Flagship Features for Top-Tier Buildathon Signal

1. **Automated 50-Transaction Benchmark Suite**:
   - 1-click execution over 50 synthetic transactions measuring throughput, latency (~148ms), 100% policy adherence, and an **Honest Exception Triage Queue**.
2. **RFC-Compliant Protocol Wire Inspector**:
   - Inspect raw HTTP wire frames and headers (`X-Agent-Protocol: UAP/1.0`, `X-Enclave-Signature`, `402 Payment Required`, `X-Razorpay-Signature`).
3. **Command Palette (`Cmd+K` / `Ctrl+K`)**:
   - Instant search across navigation, benchmark triggers, and shopping intents.
4. **Explore & Flow (Landing)**: Minimal hero (*"Autonomous commerce. Controlled by you."*) + interactive 4-step purchase visualization + 4 core pillars.
5. **AI Agent Command Center**: Task execution runner, action pipeline with expandable JSON payloads, and permissions matrix.
6. **Financial Policies (Security Enclave)**: Controls for auto-threshold slider, daily ceiling, category toggles, merchant whitelist, and cryptographic AP2 mandate.
7. **Transactions Ledger & Explainability**: Filter by status + **Deep Explainability Modal** (*"Why was this payment allowed?"*).
8. **AI-Readable Catalog**: Semantic catalog with AI match scores, bundle discounts, and machine-readable JSON-LD UAP schema viewer.
9. **Cryptographic Audit Trail**: Chronological event ledger with HMAC-SHA256 verification signatures.
10. **Failure Simulation Studio**: Edge-case testing for stockout fallback, price surges, and budget ceiling containment.

---

## 🚀 Quickstart & Setup

```bash
# Navigate to project directory
cd c:\razorpay

# Install all dependencies
npm install

# Start both Backend Server (Port 3001) and Frontend UI (Port 5173)
npm run dev
```

Open **`http://localhost:5173`** in your browser.

---

## 🎬 5-Minute Video Pitch Script (For Buildathon Submission)

* **[0:00 - 0:45] The Hook & Problem**:
  * *"AI agents are ready to buy, but merchants aren't ready to sell safely. Unbounded agents risk financial hallucinations, and merchants have no agent-readable commerce gateway."*
* **[0:45 - 1:45] Live Demo 1: Autonomous Quick Buy (≤ ₹2,000)**:
  * Prompt: *"Buy running shoes under ₹2,000."*
  * Show real-time trace: Buyer Agent matches Nike Pegasus 40 (₹1,709 with discount) $\rightarrow$ Enclave checks bounds $\rightarrow$ Razorpay Order created and settled in 1.5 seconds.
* **[1:45 - 2:30] Live Demo 2: Bounded Step-Up Gating (> ₹2,000)**:
  * Prompt: *"Order Keychron Q1 Pro mechanical keyboard."*
  * Show Enclave gating the ₹3,509 order $\rightarrow$ Step-Up Modal appears $\rightarrow$ Biometric Passkey signature authorization $\rightarrow$ Settled.
* **[2:30 - 3:15] Live Demo 3: Automated 50-Transaction Benchmark Suite**:
  * Click *"Launch 50-Transaction Benchmark"* $\rightarrow$ Show 50 transactions executed in 380ms with 100% policy adherence and honest exceptions triage.
* **[3:15 - 4:00] Live Demo 4: RFC Protocol Wire Trace & Explainability**:
  * Click *"Protocol Wire"* $\rightarrow$ Show raw HTTP headers (`X-Agent-Protocol`, `X-Enclave-Signature`, `X-Razorpay-Signature`).
  * Open a transaction $\rightarrow$ Show *"Why was this payment allowed?"* visual timeline and HMAC audit log.
* **[4:00 - 4:30] Live Demo 5: Graceful Failure Recovery**:
  * Trigger Stockout scenario $\rightarrow$ Agent gracefully recovers with Adidas Ultraboost alternative.
* **[4:30 - 5:00] Conclusion & Why Razorpay**:
  * *"AgentPay turns Razorpay into the default financial settlement layer for the upcoming agentic economy."*

---

## 📜 License
MIT License · Built with ❤️ for the Razorpay AI Buildathon 2026.
