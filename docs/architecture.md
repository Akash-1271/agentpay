# AgentPay: System Architecture & Trust Boundary Specification
**Razorpay AI Buildathon 2026 | Track 01: AI Growth & Agentic Commerce**

---

## 1. System Architecture Overview

AgentPay acts as a cryptographically bounded execution layer between autonomous AI buyer agents and Razorpay payment rails.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AGENTIC COMMERCE MESH                             │
├───────────────────────────────┬─────────────────────────────────────────────┤
│   AI Buyer Agent (UAP 1.0)    │       Merchant Payee Agent (AP2 v2.0)       │
│   • Intent Understanding      │       • Semantic Catalog Discovery          │
│   • Multi-Attribute Ranking   │       • Dynamic Affinity Upsell Bundles     │
│   • Review Intelligence       │       • HMAC-Signed Cryptographic Quotes    │
└───────────────┬───────────────┴──────────────────────┬──────────────────────┘
                │                                      │
                ▼                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     AGENTPAY BOUNDED ENCLAVE SANDBOX                        │
│                                                                             │
│   1. Delegation Mandate Verification (Allowed Categories & Whitelisted IDs) │
│   2. Dynamic Threshold Gating (≤ ₹2,000 Auto / > ₹2,000 WebAuthn Passkey)  │
│   3. Daily Cumulative Velocity & Budget Ceiling Guard (₹25,000 Hard Limit) │
│   4. Idempotency Nonce & Signature Verification (HMAC-SHA256)              │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         RAZORPAY PAYMENT GATEWAY                            │
│                                                                             │
│   • Orders API (`/v1/orders`)               • Payment Links API             │
│   • Standard Checkout.js Modal              • UPI Dynamic QR Payload        │
│   • Webhook Ingestion & HMAC Verification   • Settlement Event Stream       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    IMMUTABLE DOUBLE-ENTRY FINOPS LEDGER                     │
│                                                                             │
│   • SQLite Journal (Append-Only)            • Balancing Check: ΣDr == ΣCr   │
│   • Merchant Yield Analytics                • Cart Recovery Engine          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Protocol Specifications

### 2.1 Universal Agent Protocol (UAP 1.0)
- **Discovery Endpoint**: `GET /api/uap/catalog`
- **Payload Schema**:
  ```json
  {
    "id": "prod_kb_01",
    "name": "Keychron Q1 Pro Wireless Custom Mechanical Keyboard",
    "category": "Electronics & Peripherals",
    "price": 3899,
    "currency": "INR",
    "stock": 8,
    "merchantId": "merch_apex_gear",
    "bundleDeals": [
      {
        "addonId": "prod_wrist_01",
        "addonName": "Walnut Hardwood Ergonomic Wrist Rest",
        "addonPrice": 499,
        "bundleDiscountPct": 15
      }
    ]
  }
  ```

### 2.2 Autonomous Payment Protocol (AP2 v2.0)
- **Signed Quote Format**:
  ```json
  {
    "quoteId": "quote_ap2_89f0a2",
    "productId": "prod_shoe_07",
    "netAmount": 1709,
    "currency": "INR",
    "nonce": "nonce_7f90b21a884c01",
    "validUntil": "2026-09-04T12:00:00Z",
    "signature": "SIG_HMAC_SHA256_7f90b21a884c01"
  }
  ```

---

## 3. Trust Boundaries & Threat Model

| Threat Scenario | Attack Vector | Enclave Defense Mechanism |
| :--- | :--- | :--- |
| **Agent Hallucination** | Agent loops and makes repeated ₹1,500 purchases. | **Velocity Filter**: Daily cumulative ceiling (₹25,000) terminates the agent session when exhausted. |
| **Price Hijacking** | Malicious merchant agent returns ₹20,000 for a ₹200 cable. | **Dual Gating**: Orders > ₹2,000 force a cryptographic biometric passkey step-up modal. |
| **Rogue Merchant** | Agent purchases from an unauthorized scam store. | **Merchant Whitelist**: Enclave verifies `merchantId` against the user's signed delegation mandate. |
| **Replay Attack** | Intercepted signed quote replayed by external party. | **Idempotency Nonce**: Every AP2 quote has a single-use nonce with timestamp expiration. |

---

## 4. Double-Entry Accounting Invariants

Every autonomous transaction generates twin balanced entries in SQLite:
$$\sum \text{Debits} = \sum \text{Credits}$$

- **Customer Ledger**: `Dr. Customer Inventory` / `Cr. Cash / Gateway Escrow`
- **Merchant Ledger**: `Dr. Gateway Receivable` / `Cr. Merchant Revenue`
- **Platform Ledger**: `Dr. Gateway Inflow` / `Cr. Net Payouts + Razorpay Fee`
