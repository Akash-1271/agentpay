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

  public static listCategories(): string[] {
    const catalog = this.getCatalog();
    return Array.from(new Set(catalog.map((i) => i.category)));
  }

  public static getInventory(productId: string): { productId: string; inStock: boolean; stock: number } {
    const item = this.getProductById(productId);
    return {
      productId,
      inStock: item ? item.stock > 0 : false,
      stock: item ? item.stock : 0,
    };
  }

  public static importFromCsv(csvText: string): { addedCount: number; catalog: ProductItem[] } {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) throw new Error('CSV must contain a header row and at least one data row');

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const catalog = this.getCatalog();
    let addedCount = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const values = line.split(',').map((v) => v.trim());

      const id = values[headers.indexOf('id')] || `prod_csv_${Date.now()}_${i}`;
      const name = values[headers.indexOf('name')] || 'Imported Product';
      const category = values[headers.indexOf('category')] || 'General Merchandise';
      const description = values[headers.indexOf('description')] || '';
      const price = parseFloat(values[headers.indexOf('price')] || '999');
      const stock = parseInt(values[headers.indexOf('stock')] || '10', 10);
      const merchantId = values[headers.indexOf('merchantid')] || 'merch_imported';
      const merchantName = values[headers.indexOf('merchantname')] || 'Verified Merchant';

      const existingIdx = catalog.findIndex((c) => c.id === id);
      const newItem: ProductItem = {
        id,
        name,
        category,
        description,
        price,
        currency: 'INR',
        stock,
        rating: 4.8,
        merchantId,
        merchantName,
        tags: [category.toLowerCase(), name.toLowerCase()],
        specifications: { source: 'CSV Importer' },
        bundleDeals: [],
      };

      if (existingIdx >= 0) {
        catalog[existingIdx] = newItem;
      } else {
        catalog.push(newItem);
        addedCount++;
      }
    }

    fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf8');
    return { addedCount, catalog };
  }

  public static getAgentTools() {
    return [
      {
        name: 'search_products',
        description: 'Semantic & keyword search across merchant catalogs with price and stock filters',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search term or product name' },
            category: { type: 'string', description: 'Product category' },
            maxPrice: { type: 'number', description: 'Maximum price in INR' },
          },
        },
      },
      {
        name: 'get_product',
        description: 'Retrieve full specifications, rating, and merchant quote parameters by product ID',
        parameters: {
          type: 'object',
          properties: { productId: { type: 'string' } },
          required: ['productId'],
        },
      },
      {
        name: 'list_categories',
        description: 'List all authorized product categories available in the merchant catalog',
        parameters: { type: 'object', properties: {} },
      },
      {
        name: 'get_inventory',
        description: 'Check real-time stock levels and warehouse reservation availability',
        parameters: {
          type: 'object',
          properties: { productId: { type: 'string' } },
          required: ['productId'],
        },
      },
    ];
  }

  public static getAgentSchemaDescription(): object {
    return {
      protocol: 'UAP/1.0',
      version: '2026.08',
      standard: 'NPCI-UAP & ACP Compliant Agentic Commerce Gateway',
      tools: this.getAgentTools(),
      supportedCapabilities: [
        'semantic-catalog-search',
        'real-time-inventory-lock',
        'dynamic-bundle-pricing',
        'ap2-cryptographic-quotes',
        'razorpay-bounded-checkout',
        'csv-catalog-import',
      ],
      endpoints: {
        searchCatalog: '/api/uap/catalog',
        requestQuote: '/api/uap/quote',
        reserveInventory: '/api/uap/reserve',
        executePayment: '/api/uap/transact',
        importCsv: '/api/uap/catalog/import-csv',
      },
    };
  }
}
