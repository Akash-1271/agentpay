import { UAPCatalogEngine, ProductItem } from '../protocols/uap.js';
import { MerchantAgent, AP2QuoteResult } from './merchantAgent.js';
import { BoundedSpendingEnclave, PolicyValidationResult } from '../protocols/guardEnclave.js';
import { RazorpayEngine, RazorpayOrderResponse } from '../razorpay/client.js';
import { DoubleEntryLedgerEngine, DoubleEntryTransaction } from '../protocols/doubleEntryLedger.js';
import { AP2SignedQuote } from '../protocols/ap2.js';

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, { type: string; description: string; enum?: string[] }>;
    required: string[];
  };
}

export const AGENT_TOOLS: ToolDefinition[] = [
  {
    name: 'search_products',
    description: 'Search the canonical agent-readable UAP catalog with semantic filters.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search keywords or product name' },
        category: { type: 'string', description: 'Product category filter' },
        maxPrice: { type: 'number', description: 'Maximum budget in INR' },
        minRating: { type: 'number', description: 'Minimum customer star rating (0-5)' },
        inStockOnly: { type: 'boolean', description: 'Only return items with positive stock' }
      },
      required: []
    }
  },
  {
    name: 'get_product',
    description: 'Retrieve full specifications, stock levels, and bundle deals for a specific product ID.',
    parameters: {
      type: 'object',
      properties: {
        productId: { type: 'string', description: 'Product ID (e.g. prod_shoe_07)' }
      },
      required: ['productId']
    }
  },
  {
    name: 'check_inventory',
    description: 'Verify live stock inventory lock for a product.',
    parameters: {
      type: 'object',
      properties: {
        productId: { type: 'string', description: 'Product ID' },
        quantity: { type: 'number', description: 'Requested purchase quantity' }
      },
      required: ['productId']
    }
  },
  {
    name: 'request_signed_quote',
    description: 'Negotiate price and obtain a cryptographically signed AP2 Quote from the Merchant Agent with dynamic bundle discounts.',
    parameters: {
      type: 'object',
      properties: {
        productId: { type: 'string', description: 'Product ID' },
        quantity: { type: 'number', description: 'Requested quantity' },
        acceptBundles: { type: 'boolean', description: 'Whether to accept merchant upsell bundle deals' },
        forceBundleIds: { type: 'string', description: 'Comma-separated bundle add-on IDs' }
      },
      required: ['productId']
    }
  },
  {
    name: 'evaluate_enclave_policy',
    description: 'Submit an AP2 quote to the server-side Bounded Spending Enclave for non-bypassable policy verification.',
    parameters: {
      type: 'object',
      properties: {
        quoteId: { type: 'string', description: 'Quote ID' },
        netAmount: { type: 'number', description: 'Final net transaction amount in INR' },
        category: { type: 'string', description: 'Product category' }
      },
      required: ['quoteId', 'netAmount']
    }
  },
  {
    name: 'create_razorpay_order',
    description: 'Create an official test-mode Razorpay order for authorized transaction.',
    parameters: {
      type: 'object',
      properties: {
        amountInRupees: { type: 'number', description: 'Order total in INR' },
        receipt: { type: 'string', description: 'Unique receipt reference' }
      },
      required: ['amountInRupees', 'receipt']
    }
  },
  {
    name: 'record_finops_ledger',
    description: 'Post an append-only balanced double-entry accounting journal transaction in the FinOps ledger.',
    parameters: {
      type: 'object',
      properties: {
        transactionId: { type: 'string', description: 'Agent transaction ID' },
        razorpayOrderId: { type: 'string', description: 'Associated Razorpay order ID' },
        amount: { type: 'number', description: 'Amount in INR' },
        description: { type: 'string', description: 'Accounting description' },
        idempotencyKey: { type: 'string', description: 'Unique idempotency key' }
      },
      required: ['transactionId', 'razorpayOrderId', 'amount', 'description']
    }
  }
];

export class AgentToolExecutor {
  public static async executeTool(toolName: string, args: any): Promise<any> {
    switch (toolName) {
      case 'search_products': {
        const results = UAPCatalogEngine.queryCatalog({
          query: args.query,
          category: args.category,
          maxPrice: args.maxPrice ? parseFloat(args.maxPrice) : undefined,
          minRating: args.minRating ? parseFloat(args.minRating) : undefined,
          inStockOnly: args.inStockOnly !== undefined ? Boolean(args.inStockOnly) : undefined
        });
        return { count: results.length, products: results };
      }

      case 'get_product': {
        const product = UAPCatalogEngine.getProductById(args.productId);
        if (!product) return { error: 'PRODUCT_NOT_FOUND', productId: args.productId };
        return { product };
      }

      case 'check_inventory': {
        const product = UAPCatalogEngine.getProductById(args.productId);
        if (!product) return { available: false, stock: 0, reason: 'Product does not exist' };
        const qty = args.quantity || 1;
        const available = product.stock >= qty;
        return { available, stock: product.stock, requested: qty };
      }

      case 'request_signed_quote': {
        const quote = MerchantAgent.evaluateAndGenerateQuote({
          productId: args.productId,
          quantity: args.quantity || 1,
          acceptBundles: args.acceptBundles,
          forceBundleIds: args.forceBundleIds ? (typeof args.forceBundleIds === 'string' ? args.forceBundleIds.split(',') : args.forceBundleIds) : undefined
        });
        return quote;
      }

      case 'evaluate_enclave_policy': {
        const quote: AP2SignedQuote = args.quote;
        const validation = BoundedSpendingEnclave.evaluateQuote(quote, args.category);
        return validation;
      }

      case 'create_razorpay_order': {
        const order = await RazorpayEngine.createOrder({
          amountInRupees: args.amountInRupees,
          receipt: args.receipt,
          notes: args.notes
        });
        return order;
      }

      case 'record_finops_ledger': {
        const entry = DoubleEntryLedgerEngine.recordTransaction({
          transactionId: args.transactionId,
          razorpayOrderId: args.razorpayOrderId,
          amount: args.amount,
          description: args.description,
          idempotencyKey: args.idempotencyKey
        });
        return entry;
      }

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }
}
