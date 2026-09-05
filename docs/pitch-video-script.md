# AgentPay: Concise Pitch Video Script (Short & Punchy)
**Track 01: AI Growth & Agentic Commerce | Razorpay AI Buildathon 2026**

---

## ⏱️ Video Pacing & Structure

| Segment | Screen Action | Talking Time |
| :--- | :--- | :--- |
| **Segment 1** | Executive Overview & Enclave Architecture | ~35 seconds |
| **Segment 2** | Live Arena: Autonomous Purchase Flow | ~55 seconds |
| **Segment 3** | Test Exceptions: Stockout, Passkey, Ceiling | ~55 seconds |
| **Segment 4** | Merchant Yield: Dynamic Upsells & Webhooks | ~40 seconds |
| **Segment 5** | Double-Entry FinOps Ledger & Close | ~35 seconds |

---

## 🎙️ Short Word-for-Word Script

### Segment 1: The Problem & Why Now
> *"Hi everyone! I’m Akash, and this is **AgentPay**—an Autonomous Commerce Protocol built for Track 01 of the Razorpay AI Buildathon.*
>
> *In 2026, AI agents aren’t just chatting—they’re ready to buy. But traditional payment gateways cannot trust unbounded AI agents. A hallucinating bot with an API key can drain an enterprise account in seconds.*
>
> *AgentPay solves this with a cryptographic spending enclave. Every single money movement is bounded, gated, and explainable before any fund touches Razorpay."*

---

### Segment 2: Live Autonomous Purchase Flow
*(Screen: Live Arena page)*

> *"Let’s see it live. I’ll prompt the agent:*  
> **'Search Amazon for running shoes under ₹2,000.'**
>
> *Watch what happens under the hood:*
> 1. **Discovery**: *The buyer agent finds the Nike Pegasus at ₹1,709 via the Universal Agent Protocol.*
> 2. **Signed Quote**: *The merchant emits a cryptographically signed AP2 quote.*
> 3. **Enclave Guard**: *Our enclave checks the user's spending policy: ₹1,709 is strictly under our ₹2,000 autonomous ceiling.*
> 4. **Execution**: *The enclave calls Razorpay’s Orders API and instantly captures payment.*
> 5. **Explainability**: *Clicking the transaction reveals the exact verification timeline behind the purchase."*

---

### Segment 3: The 3 Bounded Failure Modes
*(Screen: Test Exceptions page)*

> *"Next, the hardest part of autonomous commerce: **handling failure safely**.*
>
> *AgentPay has three built-in guardrails:*
> 1. **Stockout Recovery**: *If an item sells out mid-flow, the agent intercepts the error, finds an equivalent in-stock pair, and completes the purchase seamlessly.*
> 2. **Biometric Step-Up**: *For high-value orders above ₹2,000, like this ₹3,899 keyboard, the enclave locks the transaction until approved via Biometric Passkey.*
> 3. **Ceiling Breach**: *Any request breaching the ₹25,000 daily budget is terminated on the spot."*

---

### Segment 4: Merchant Revenue Growth & Live Webhooks
*(Screen: Merchant Yield page & Webhooks modal)*

> *"AgentPay also drives merchant revenue:*
> 1. **Dynamic Upsells**: *During quoting, it bundles complementary accessories at micro-discounts, boosting average order value by 18%.*
> 2. **Cart Recovery**: *If a checkout is abandoned, it generates a VIP Razorpay payment link to recover lost sales.*
> 3. **Live Webhooks**: *And clicking 'Webhooks' displays real-time event ingestion with HMAC-SHA256 cryptographic verification."*

---

### Segment 5: Double-Entry FinOps & Close
*(Screen: Double-Entry Ledger / Overview)*

> *"Finally, our Financial Controller Ledger.*
>
> *AgentPay records every transaction in an append-only SQLite double-entry ledger, ensuring debits and credits always balance to the exact paisa.*
>
> *With 14 passing automated tests, AgentPay is production-ready for the future of agentic payments on Razorpay.*
>
> *Thank you!"*
