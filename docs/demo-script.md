# 🎬 AgentPay — 5-Minute Judge Demonstration Script
> **Razorpay AI Buildathon 2026 · Track 01: AI Growth & Agentic Commerce**

This demo guide walks through the live, verifiable end-to-end capabilities of **AgentPay**. Every step interacts directly with the server-side Bounded Spending Enclave, persistent SQLite Double-Entry Ledger, and Razorpay test-mode gateway.

---

## ⚡ 1. Rapid Setup (< 2 Minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start the server (Backend: 3001, Frontend: 5173)
npm run dev

# 3. (Optional) Run the 14-test production verification suite
npm test
```

Open your browser at **[http://localhost:5173](http://localhost:5173)**.

---

## 🧭 2. Step-by-Step Live Demonstration

### 🟢 Scenario 1: Autonomous Buyer Flow & Auto-Approval (≤ ₹2,000)
1. In the sidebar or top masthead, navigate to **AI Agent Arena**.
2. Click the quick intent chip: **"Search Amazon for Nike Pegasus under ₹2,000"** (or type your own prompt).
3. Click **"Dispatch Autonomous Commerce Agent"**.
4. **What to Observe**:
   - **Step 1 (Parse Intent)**: Agent parses price ceiling (₹2,000) and product target.
   - **Step 2 (Catalog Query)**: Discovers *Nike Air Zoom Pegasus 40* at ₹1,899.
   - **Step 3 (Signed Quote)**: Merchant issues AP2 cryptographically signed quote with dynamic bundle savings.
   - **Step 4 (Enclave Check)**: Policy Engine validates merchant whitelist and verifies ₹1,899 $\le$ ₹2,000.
   - **Step 5 (Razorpay Order)**: Creates real Razorpay test order (`order_...`) and generates live UPI QR intent.
   - **Step 6 (FinOps Ledger)**: Posts balanced double-entry journal entry debiting user wallet and crediting merchant settlement.
   - **Step 7 (Fulfillment)**: Generates guaranteed courier AWB tracking and GST tax invoice.

---

### 🟡 Scenario 2: Failure Mode 1 — Stockout Mid-Flow & Autonomous Recovery
1. In the AI Agent Arena, select or type:
   > *"Order Ultrahuman Ring AIR sleep tracker"*
   *(Note: This item has 0 stock in the database).*
2. Click **"Dispatch Autonomous Commerce Agent"**.
3. **What to Observe**:
   - **Stock Check Failed**: Merchant Agent flags `stock: 0` for Ultrahuman Ring.
   - **Autonomous Recovery Fallback**: Buyer Agent does **not crash**; it immediately queries the catalog for in-stock alternatives, discovers a related product, negotiates a new AP2 quote, passes enclave checks, and successfully settles the order.
   - Status badge shows: **`FAILED_RECOVERED`**.

---

### 🟠 Scenario 3: Failure Mode 2 — High-Value Step-Up Gating (> ₹2,000)
1. In the AI Agent Arena, select or type:
   > *"Order Keychron Q1 Pro custom mechanical keyboard"*
   *(Item price is ₹3,899, which exceeds the ₹2,000 auto-approval threshold).*
2. Click **"Dispatch Autonomous Commerce Agent"**.
3. **What to Observe**:
   - The Enclave **halts execution** and refuses to move funds autonomously.
   - Status badge displays **`STEP_UP_REQUIRED`**.
   - An interactive **Biometric Passkey / Human Authorization Modal** automatically pops up.
   - Click **"Authenticate with Passkey (Biometric)"** in the modal.
   - The server verifies the signature, unlocks the enclave hold, and completes the Razorpay settlement.

---

### 🔴 Scenario 4: Failure Mode 3 — Daily Cumulative Ceiling Breach (> ₹25,000)
1. Navigate to **Failure Modes** or the **Policy Engine** view.
2. In the AI Agent Arena, trigger a massive budget request:
   > *"Provision 10,000 H100 GPU Cluster Nodes for ₹99,999"*
3. **What to Observe**:
   - The Enclave identifies that the amount breaches the ₹25,000 daily cumulative ceiling.
   - Status displays **`REJECTED_POLICY`** with code **`CEILING_EXCEEDED`**.
   - **Zero funds moved, zero Razorpay orders created, zero ledger leakage**.

---

### 📈 Scenario 5: Merchant Revenue Growth & Abandoned Cart Recovery
1. In the sidebar, navigate to **Revenue Growth**.
2. **Dynamic Upsell Bundles**:
   - View dynamic affinity bundles (e.g., Running Shoes + Dri-FIT Socks, Mechanical Keyboard + Wrist Rest).
3. **Abandoned Cart Recovery**:
   - Inspect the live abandoned carts table.
   - Click **"Dispatch AI VIP Recovery Link"** on an abandoned cart.
   - A genuine Razorpay Payment Link (`https://rzp.io/i/...`) is generated with a 15% VIP retention discount.
   - The cart status immediately transitions from `PENDING_RECOVERY` to `RECOVERED`.
4. **Computed Real-Time Analytics**:
   - Inspect GMV, Average Order Value (AOV), and conversion lift calculated directly from SQLite database transactions.

---

### 📒 Scenario 6: Persistent Double-Entry FinOps Ledger & Audit Trail
1. Navigate to **Transactions** or **Audit Trail** in the sidebar.
2. Inspect the **Double-Entry Journal**:
   - Every transaction contains strictly balanced Debit and Credit line items (`Total Debits == Total Credits`).
   - Every entry is stamped with an HMAC-SHA256 signature and unique `idempotencyKey`.
3. Inspect the **Cryptographic Audit Ledger**:
   - Every single action (discovery, quote negotiation, policy evaluation, step-up holds, payment capture) is logged in chronological order with nonces and signatures.

---

### ⚡ Scenario 7: Live Stress Test & Benchmark Suite
1. In the sidebar, navigate to **Live Benchmark**.
2. Click **"Run 50-Transaction Benchmark"**.
3. **What to Observe**:
   - The engine runs real synthetic transactions against the live agent and policy engine.
   - Real measured execution duration and latency per transaction (e.g. ~140ms–220ms).
   - Real calculated Policy Adherence Rate (100.0%) and audit completeness.
   - Real exception triage table listing every step-up gate, stockout recovery, and blocked rogue attempt.

---

### 🧪 Scenario 8: Automated Terminal Test Suite
Run from your terminal at any time:
```bash
npm test
```
**Results**:
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
