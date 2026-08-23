export interface AmazonProductItem {
  asin: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  currency: string;
  primeEligible: boolean;
  deliveryEstimate: string;
  rating: number;
  reviewCount: number;
  merchantId: string;
  merchantName: string;
  inStock: boolean;
  stockCount: number;
  features: string[];
  imageUrl: string;
  bundleDeals: Array<{
    addonId: string;
    addonName: string;
    addonPrice: number;
    bundleDiscountPct: number;
  }>;
}

export class AmazonMerchantAdapter {
  private static mockAmazonCatalog: AmazonProductItem[] = [
    {
      asin: 'B0C7Q4W9X2',
      title: 'Nike Air Zoom Pegasus 40 Men Road Running Shoes (Black/White)',
      brand: 'Nike',
      category: 'Athletics & Apparel',
      price: 1899,
      originalPrice: 2499,
      currency: 'INR',
      primeEligible: true,
      deliveryEstimate: 'Tomorrow by 11:00 AM (Prime Express)',
      rating: 4.8,
      reviewCount: 4120,
      merchantId: 'merch_amazon',
      merchantName: 'Amazon India (Cloudtail Logistics)',
      inStock: true,
      stockCount: 24,
      features: ['Dual Zoom Air Units', 'Engineered Mesh Upper', 'React Foam Cushioning'],
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
      bundleDeals: [
        {
          addonId: 'amz_addon_socks',
          addonName: 'Nike Dri-FIT Anti-Blister Running Socks (Pack of 3)',
          addonPrice: 299,
          bundleDiscountPct: 20
        }
      ]
    },
    {
      asin: 'B0B88K7N3F',
      title: 'Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones (Silver)',
      brand: 'Sony',
      category: 'Audio',
      price: 24990,
      originalPrice: 29990,
      currency: 'INR',
      primeEligible: true,
      deliveryEstimate: 'Today by 9:00 PM (Same-Day Prime)',
      rating: 4.9,
      reviewCount: 18940,
      merchantId: 'merch_amazon',
      merchantName: 'Amazon India (Appario Retail)',
      inStock: true,
      stockCount: 12,
      features: ['Auto NC Optimizer', '30-hour Battery', 'Multipoint Connection'],
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
      bundleDeals: [
        {
          addonId: 'amz_addon_case',
          addonName: 'Hard Shell EVA Travel Case with Cable Organiser',
          addonPrice: 799,
          bundleDiscountPct: 30
        }
      ]
    },
    {
      asin: 'B08P2H5V6D',
      title: 'Keychron Q1 Pro QMK/VIA Wireless Custom Mechanical Keyboard (Red Switches)',
      brand: 'Keychron',
      category: 'Electronics & Peripherals',
      price: 3899,
      originalPrice: 4499,
      currency: 'INR',
      primeEligible: true,
      deliveryEstimate: 'Tomorrow by 2:00 PM',
      rating: 4.7,
      reviewCount: 920,
      merchantId: 'merch_amazon',
      merchantName: 'Amazon India (Keychron Authorized)',
      inStock: true,
      stockCount: 8,
      features: ['CNC Aluminum Body', 'Double-Gasket Design', 'Hot-Swappable RGB'],
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80',
      bundleDeals: [
        {
          addonId: 'amz_addon_coiled_cable',
          addonName: 'Custom Coiled Aviator USB-C Cable (Braided Black)',
          addonPrice: 499,
          bundleDiscountPct: 25
        }
      ]
    },
    {
      asin: 'B09HM94V5S',
      title: 'Logitech MX Master 3S Performance Wireless Mouse (Graphite 8K DPI)',
      brand: 'Logitech',
      category: 'Electronics & Peripherals',
      price: 1899,
      originalPrice: 2299,
      currency: 'INR',
      primeEligible: true,
      deliveryEstimate: 'Tomorrow by 11:00 AM',
      rating: 4.9,
      reviewCount: 32800,
      merchantId: 'merch_amazon',
      merchantName: 'Amazon India (Cloudtail Logistics)',
      inStock: true,
      stockCount: 35,
      features: ['Quiet Clicks', '8000 DPI Track-on-Glass', 'MagSpeed Electromagnetic Scroll'],
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80',
      bundleDeals: [
        {
          addonId: 'amz_addon_deskmat',
          addonName: 'Logitech Studio Series Spill-Resistant Desk Mat',
          addonPrice: 399,
          bundleDiscountPct: 20
        }
      ]
    },
    {
      asin: 'B0CG7W9K1L',
      title: 'Anker 7-in-1 USB-C Hub with 4K HDMI, 100W Power Delivery & SD Card Reader',
      brand: 'Anker',
      category: 'Electronics & Peripherals',
      price: 1499,
      originalPrice: 1999,
      currency: 'INR',
      primeEligible: true,
      deliveryEstimate: 'Today by 8:00 PM',
      rating: 4.8,
      reviewCount: 7420,
      merchantId: 'merch_amazon',
      merchantName: 'Amazon India (Anker Direct)',
      inStock: true,
      stockCount: 40,
      features: ['100W Passthrough Charging', '4K 60Hz HDMI Out', '5Gbps USB-A 3.0'],
      imageUrl: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=400&q=80',
      bundleDeals: [
        {
          addonId: 'amz_addon_hdmi_cable',
          addonName: 'Anker Premium 8K Ultra-High-Speed HDMI 2.1 Cable (2m)',
          addonPrice: 299,
          bundleDiscountPct: 20
        }
      ]
    },
    {
      asin: 'B0DF9M9Q2R',
      title: 'Adidas Ultraboost Light Running Shoes (Core Black/Solar Red)',
      brand: 'Adidas',
      category: 'Athletics & Apparel',
      price: 1799,
      originalPrice: 2199,
      currency: 'INR',
      primeEligible: true,
      deliveryEstimate: 'Tomorrow by 1:00 PM',
      rating: 4.7,
      reviewCount: 2940,
      merchantId: 'merch_amazon',
      merchantName: 'Amazon India (Adidas Retail)',
      inStock: true,
      stockCount: 19,
      features: ['Light BOOST Midsole', 'Continental Natural Rubber Outsole', 'Primeknit+ Upper'],
      imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400&q=80',
      bundleDeals: []
    }
  ];

  public static searchAmazon(query: string, maxPrice?: number): AmazonProductItem[] {
    const q = query.toLowerCase().trim();
    let results = this.mockAmazonCatalog.filter(item => {
      const match =
        item.title.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.features.some(f => f.toLowerCase().includes(q));
      return match;
    });

    if (results.length === 0) {
      // Fallback keyword search
      if (q.includes('shoe') || q.includes('run') || q.includes('nike') || q.includes('adidas')) {
        results = this.mockAmazonCatalog.filter(i => i.category === 'Athletics & Apparel');
      } else if (q.includes('key') || q.includes('keyboard') || q.includes('mouse') || q.includes('hub')) {
        results = this.mockAmazonCatalog.filter(i => i.category === 'Electronics & Peripherals');
      } else if (q.includes('headphone') || q.includes('audio') || q.includes('sound')) {
        results = this.mockAmazonCatalog.filter(i => i.category === 'Audio');
      } else {
        results = this.mockAmazonCatalog;
      }
    }

    if (maxPrice) {
      results = results.filter(i => i.price <= maxPrice);
    }

    return results;
  }

  public static getByAsin(asin: string): AmazonProductItem | undefined {
    return this.mockAmazonCatalog.find(i => i.asin === asin);
  }
}
