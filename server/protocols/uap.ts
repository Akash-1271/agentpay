import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const catalogPath = path.resolve(__dirname, '../data/catalog.json');

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  rating: number;
  merchantId: string;
  merchantName: string;
  tags: string[];
  specifications: Record<string, string>;
  bundleDeals: Array<{
    addonId: string;
    addonName: string;
    addonPrice: number;
    bundleDiscountPct: number;
  }>;
}

export class UAPCatalogEngine {
  private static getCatalog(): ProductItem[] {
    try {
      const raw = fs.readFileSync(catalogPath, 'utf8');
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error reading catalog file:', e);
      return [];
    }
  }

  public static queryCatalog(params: {
    query?: string;
    category?: string;
    maxPrice?: number;
    minRating?: number;
    inStockOnly?: boolean;
    tags?: string[];
  }): ProductItem[] {
    const catalog = this.getCatalog();
    const q = params.query ? params.query.toLowerCase() : '';

    return catalog.filter((item) => {
      if (params.inStockOnly !== false && item.stock <= 0) {
        if (params.query?.toLowerCase().includes('ultrahuman') || params.query?.toLowerCase().includes('ring')) {
          // keep for failure demonstration
        } else if (params.inStockOnly === true) {
          return false;
        }
      }

      if (params.category && item.category.toLowerCase() !== params.category.toLowerCase()) {
        return false;
      }

      if (params.maxPrice && item.price > params.maxPrice) {
        return false;
      }

      if (params.minRating && item.rating < params.minRating) {
        return false;
      }

      if (q) {
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));
        const matchesSpecs = Object.values(item.specifications).some((val) =>
          val.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesDesc && !matchesTags && !matchesSpecs) {
          return false;
        }
      }

      return true;
    });
  }

  public static getProductById(id: string): ProductItem | undefined {
    const catalog = this.getCatalog();
    return catalog.find((item) => item.id === id);
  }

  public static updateStock(productId: string, delta: number): boolean {
    const catalog = this.getCatalog();
    const item = catalog.find((i) => i.id === productId);
    if (item && item.stock + delta >= 0) {
      item.stock += delta;
      fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf8');
      return true;
    }
    return false;
  }

  public static getAgentSchemaDescription(): object {
    return {
      protocol: 'UAP/1.0',
      version: '2026.08',
      standard: 'NPCI-UAP & ACP Compliant Agentic Commerce Gateway',
      supportedCapabilities: [
        'semantic-catalog-search',
        'real-time-inventory-lock',
        'dynamic-bundle-pricing',
        'ap2-cryptographic-quotes',
        'razorpay-bounded-checkout'
      ],
      endpoints: {
        searchCatalog: '/api/uap/catalog',
        requestQuote: '/api/uap/quote',
        reserveInventory: '/api/uap/reserve',
        executePayment: '/api/uap/transact'
      }
    };
  }
}
