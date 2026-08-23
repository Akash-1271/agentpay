# ⚡ AgentPay — Redesigned Production-Grade Fintech Interface & Walkthrough
> **Razorpay AI Buildathon 2026** · **Track 01: AI Growth & Agentic Commerce**

---

## 🎨 Frontend Redesign Overview

The AgentPay frontend has been completely redesigned from the ground up into a sleek, production-grade fintech infrastructure product tailored for presentations to Razorpay engineers.

### Aesthetic Principles Applied:
- **Dark Premium Fintech Look**: Deep obsidian/navy surfaces (`#080b11`, `#0d121f`), subtle micro-borders (`rgba(255, 255, 255, 0.07)`), and Inter/Geist typography.
- **Restrained Accents**: Purposeful Razorpay-blue (`#0c83ff`), emerald for verified transactions, amber for gated step-ups, and rose for blocked breaches. No excessive cartoonish glassmorphism or distracting decorative blobs.
- **Core Product Principle on Every Screen**:
  $$\text{DISCOVER} \longrightarrow \text{DECIDE} \longrightarrow \text{CONTROL} \longrightarrow \text{TRANSACT}$$

---

## 🌟 Redesigned Sections & Capabilities

### 1. Minimal Landing Page (`Explore & Flow`)
- **Headline**: *"Autonomous commerce. Controlled by you."*
- **Supporting**: *"AgentPay gives AI agents the ability to discover, negotiate and transact — while you control exactly how your money can be used."*
- **Interactive Purchase Flow Stepper**:
  - `01 / INTENT`: User requests *"Buy running shoes under ₹2,000"*.
  - `02 / DISCOVERY`: AI matches *Nike Air Zoom Pegasus 40* (₹1,899, In stock).
  - `03 / POLICY`: 4 checks verified (Spending limit $\le$ ₹2,000, Merchant approved, Stock confirmed, Payment authorized).
  - `04 / TRANSACT`: ₹1,899 Razorpay Payment Completed (`order_...`).
- **4 Pillars**: Discover (UAP 1.0 JSON-LD), Decide (AP2 Quotes & Bundles), Control (Enclave Policy), Transact (Razorpay Orders & HMAC Webhooks).

### 2. Professional Sidebar Navigation
- Clean navigation items: Overview, AI Agent, Transactions, Financial Policies, Catalog, Audit Trail, Failure Studio.
- Bottom panel with Protocol Specs & API docs modal, real-time status pill (`● Agent Online · Razorpay Test Engine`).

### 3. Dashboard / Overview
- **Greeting**: *"Good afternoon · Your AI commerce gateway is operating normally."*
- **Restrained Metrics**: Autonomous Spend (₹X / ₹Y), Total Transactions, Successful Payments (98.4%), Blocked Transactions (3).
- **Live Agent Activity**: Real-time chronological action stream with timestamps and actor badges.
- **Quick Intent Dispatcher**: Execute prompts directly from the dashboard.

### 4. AI Agent Command Center
- Status: `● Online · UAP 1.0 / AP2`.
- Interactive action & reasoning pipeline: `Understanding request` $\rightarrow$ `Searching catalog` $\rightarrow$ `Comparing products` $\rightarrow$ `Checking stock` $\rightarrow$ `Validating policy` $\rightarrow$ `Initiating payment`.
- Expandable JSON payload inspector for each step.
- Agent Permissions Matrix (Discovery, Negotiation, Upselling, Bounded Payment).

### 5. Financial Policies (Security Control Center)
- Max autonomous transaction threshold slider (default ₹2,000).
- Daily cumulative spending ceiling slider (default ₹25,000).
- Whitelisted Merchants tag editor (Nike, Adidas, Apex Gear, Amazon, Razorpay Store, Nebula Cloud, BioWear) + Unknown merchants blocked policy.
- Authorized Categories selector.
- Active Cryptographic AP2 Mandate Certificate with HMAC-SHA256 signature.

### 6. Transactions Ledger & Deep Explainability
- Filter by status: All, Completed, Step-Up Gated, Blocked.
- **Transaction Detail / Explainability Modal**:
  - *"Why was this payment allowed?"* / *"Why was this payment gated/blocked?"*
  - Step-by-step visual explainability trace with exact checks.
  - Technical audit verification: Order ID, Payment ID, Merchant ID, Enclave HMAC Hash.

### 7. AI-Readable Catalog & Metadata Inspector
- Structured product cards with prices, stock, merchant, category, and AI recommendation scores.
- Dynamic Upsell Bundles with real-time discounts.
- Modal to view the exact machine-readable UAP JSON-LD schema consumed by external LLM agents.

### 8. Cryptographic Audit Trail
- Chronological, tamper-evident audit log with search, filters, expandable payloads, and HMAC verification signatures.

### 9. Failure Simulation Studio
- 3 interactive test scenarios:
  1. *Product Out of Stock*: Nike shoes stockout $\rightarrow$ Graceful alternative discovery (Adidas Ultraboost ₹1,799).
  2. *Price Surge*: ₹1,899 $\rightarrow$ ₹2,499 exceeds ₹2,000 limit $\rightarrow$ Gated Step-Up authorization.
  3. *Cumulative Daily Ceiling Breach*: ₹99,999 exceeds limit $\rightarrow$ Blocked with zero financial loss.

---

## 🚀 How to Run

```bash
cd c:\razorpay
npm run dev
```

- **Frontend Application**: `http://localhost:5173/`
- **Backend API Gateway**: `http://localhost:3001/`
