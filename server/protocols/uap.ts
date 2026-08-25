import crypto from 'crypto';
import { AgentPayDatabase, CatalogProductRecord } from '../db/database.js';
import { CONFIG } from '../config.js';

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
  imageUrl?: string;
}

export class UAPCatalogEngine {
  public static getAgentSchemaDescription() {
    return {
      protocol: 'Universal Agent Protocol (UAP/1.0)',
      version: '1.0.0',
      description: 'Canonical agent-readable e-commerce catalog and semantic discovery specification.',
      endpoints: {
        catalogDiscovery: 'GET /api/uap/catalog',
        productDetails: 'GET /api/uap/products/:id',
        quoteNegotiation: 'POST /api/uap/quote',
        csvCatalogImport: 'POST /api/uap/catalog/import-csv',
      },
      itemSchema: {
        id: 'string (unique product identifier)',
        name: 'string (product title)',
        category: 'string (authorized merchant category)',
        description: 'string (detailed specs and characteristics)',
        price: 'number (base INR price)',
        currency: 'string (default: INR)',
        stock: 'integer (available live units)',
        rating: 'number (0.0 to 5.0)',
        merchantId: 'string (authorized merchant identifier)',
        merchantName: 'string (human-readable merchant title)',
        tags: 'string[] (semantic indexing keywords)',
        specifications: 'object (key-value technical specs)',
        bundleDeals: 'array of addon deals with discount percentages'
      }
    };
  }

  public static queryCatalog(filters: {
    query?: string;
    category?: string;
    maxPrice?: number;
    minRating?: number;
    inStockOnly?: boolean;
    merchantId?: string;
  }): ProductItem[] {
    const rawProducts = AgentPayDatabase.getCatalogProducts();
    const items: ProductItem[] = rawProducts.map(this.mapDbRecordToProductItem);

    let filtered = items;

    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      filtered = filtered.filter(item => {
        const titleMatch = item.name.toLowerCase().includes(q);
        const descMatch = item.description.toLowerCase().includes(q);
        const catMatch = item.category.toLowerCase().includes(q);
        const tagMatch = item.tags.some(t => t.toLowerCase().includes(q));
        const specMatch = Object.values(item.specifications).some(val =>
          typeof val === 'string' && val.toLowerCase().includes(q)
        );
        return titleMatch || descMatch || catMatch || tagMatch || specMatch;
      });
    }

    if (filters.category && filters.category.trim() && filters.category !== 'All') {
      filtered = filtered.filter(item =>
        item.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    if (filters.merchantId && filters.merchantId.trim()) {
      filtered = filtered.filter(item =>
        item.merchantId.toLowerCase() === filters.merchantId!.toLowerCase()
      );
    }

    if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
      filtered = filtered.filter(item => item.price <= filters.maxPrice!);
    }

    if (filters.minRating !== undefined && !isNaN(filters.minRating)) {
      filtered = filtered.filter(item => item.rating >= filters.minRating!);
    }

    if (filters.inStockOnly) {
      filtered = filtered.filter(item => item.stock > 0);
    }

    return filtered;
  }

  public static getProductById(id: string): ProductItem | null {
    const record = AgentPayDatabase.getProductById(id);
    if (!record) return null;
    return this.mapDbRecordToProductItem(record);
  }

  public static decrementInventory(productId: string, qty: number = 1): boolean {
    return AgentPayDatabase.decrementStock(productId, qty);
  }

  public static importFromCsv(csvText: string): { importedCount: number; catalog: ProductItem[] } {
    if (!csvText || !csvText.trim()) {
      throw new Error('CSV text content is empty or invalid.');
    }

    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length < 2) {
      throw new Error('CSV must contain a header row and at least one data row.');
    }

    const header = lines[0].split(',').map(h => h.trim().toLowerCase());
    const idIdx = header.indexOf('id');
    const nameIdx = header.indexOf('name');
    const catIdx = header.indexOf('category');
    const priceIdx = header.indexOf('price');
    const stockIdx = header.indexOf('stock');
    const merchIdIdx = header.indexOf('merchantid');
    const merchNameIdx = header.indexOf('merchantname');
    const descIdx = header.indexOf('description');

    if (nameIdx === -1 || priceIdx === -1) {
      throw new Error("CSV header missing required columns: 'name' and 'price'.");
    }

    let importedCount = 0;

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map(c => c.trim());
      if (row.length < 2 || !row[nameIdx]) continue;

      const name = row[nameIdx];
      const price = parseFloat(row[priceIdx]) || 100;
      const id = idIdx !== -1 && row[idIdx] ? row[idIdx] : `prod_${crypto.randomBytes(4).toString('hex')}`;
      const category = catIdx !== -1 && row[catIdx] ? row[catIdx] : 'Electronics';
      const stock = stockIdx !== -1 && row[stockIdx] ? parseInt(row[stockIdx], 10) : 10;
      const merchantId = merchIdIdx !== -1 && row[merchIdIdx] ? row[merchIdIdx] : 'merch_apex_gear';
      const merchantName = merchNameIdx !== -1 && row[merchNameIdx] ? row[merchNameIdx] : 'Apex Gear India';
      const description = descIdx !== -1 && row[descIdx] ? row[descIdx] : `${name} available on AgentPay UAP network.`;

      AgentPayDatabase.upsertProduct({
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
        bundleDeals: []
      });

      importedCount++;
    }

    AgentPayDatabase.insertAuditLog({
      agentId: 'merchant_uap_catalog_manager',
      principalUser: CONFIG.DEFAULT_BUYER_ID,
      action: 'CATALOG_DISCOVERY',
      currency: 'INR',
      details: { importedCount },
      reasoning: `Dynamically imported and indexed ${importedCount} product items via UAP CSV pipeline.`
    });

    const currentCatalog = AgentPayDatabase.getCatalogProducts().map(this.mapDbRecordToProductItem);
    return { importedCount, catalog: currentCatalog };
  }

  private static mapDbRecordToProductItem(record: CatalogProductRecord): ProductItem {
    return {
      id: record.id,
      name: record.name,
      category: record.category,
      description: record.description,
      price: record.price,
      currency: record.currency,
      stock: record.stock,
      rating: record.rating,
      merchantId: record.merchant_id,
      merchantName: record.merchant_name,
      tags: JSON.parse(record.tags_json || '[]'),
      specifications: JSON.parse(record.specifications_json || '{}'),
      bundleDeals: JSON.parse(record.bundle_deals_json || '[]'),
      imageUrl: record.image_url || undefined,
    };
  }
}
