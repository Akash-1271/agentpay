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
  badge?: string;
  bestFor?: string;
  reviewSummary?: string;
  pros?: string[];
  cons?: string[];
  customerSentiments?: {
    positivePct: number;
    fitAccuracy: string;
    comfortRating: string;
  };
  bundleDeals: Array<{
    addonId: string;
    addonName: string;
    addonPrice: number;
    bundleDiscountPct: number;
  }>;
}

export interface AmazonBrandComparisonReport {
  query: string;
  totalFound: number;
  topPick: AmazonProductItem;
  bestValue: AmazonProductItem;
  bestComfort: AmazonProductItem;
  brandSummary: string;
  products: AmazonProductItem[];
}

export class AmazonMerchantAdapter {
  private static mockAmazonCatalog: AmazonProductItem[] = [
    {
      asin: 'B0C7Q4W9X2',
      title: 'Nike Air Zoom Pegasus 40 Men Road Running Shoes',
      brand: 'Nike',
      category: 'Athletics & Apparel',
      price: 1899,
      originalPrice: 2499,
      currency: 'INR',
      primeEligible: true,
      deliveryEstimate: 'Tomorrow by 11:00 AM (Prime Express)',
      rating: 4.9,
      reviewCount: 12480,
      merchantId: 'merch_nike_india',
      merchantName: 'Nike India (Amazon Cloudtail)',
      inStock: true,
      stockCount: 24,
      badge: "Amazon's Choice · #1 Best Seller",
      bestFor: 'Daily 5K–21K Road Running & High Mileage Training',
      reviewSummary: '89% of marathoners praise responsive Zoom Air cushioning & light weight. True to size with great arch support.',
      pros: ['Dual Zoom Air units for springy energy return', 'Engineered breathable mesh upper', 'Durable waffle-inspired road traction'],
      cons: ['Slightly snug toe-box for very wide feet'],
      customerSentiments: {
        positivePct: 94,
        fitAccuracy: '92% say True to Size',
        comfortRating: '4.9 / 5.0 (Exceptional Cushioning)',
      },
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
      asin: 'B0DF9M9Q2R',
      title: 'Adidas Ultraboost Light High-Energy Running Shoes',
      brand: 'Adidas',
      category: 'Athletics & Apparel',
      price: 1799,
      originalPrice: 2199,
      currency: 'INR',
      primeEligible: true,
      deliveryEstimate: 'Tomorrow by 1:00 PM (Prime)',
      rating: 4.8,
      reviewCount: 8920,
      merchantId: 'merch_adidas_store',
      merchantName: 'Adidas India Authorized',
      inStock: true,
      stockCount: 19,
      badge: 'Best Cushioning & Recovery',
      bestFor: 'Plush Long-Distance Recovery Runs & Casual Walking',
      reviewSummary: 'Plauded for supreme step-in comfort and energy return. Continental rubber delivers exceptional wet weather grip.',
      pros: ['Ultra-plush Light BOOST midsole', 'Continental natural rubber outsole', 'Sock-like Primeknit+ upper'],
      cons: ['Slightly heavier than race flats (295g)'],
      customerSentiments: {
        positivePct: 91,
        fitAccuracy: '88% say True to Size',
        comfortRating: '4.8 / 5.0 (Plush Cloud-like Feel)',
      },
      features: ['Light BOOST Midsole', 'Continental Natural Rubber Outsole', 'Primeknit+ Upper'],
      imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400&q=80',
      bundleDeals: []
    },
    {
      asin: 'B0CP889K2P',
      title: 'Puma Velocity Nitro 2 Lightweight Road Running Shoes',
      brand: 'Puma',
      category: 'Athletics & Apparel',
      price: 1499,
      originalPrice: 1999,
      currency: 'INR',
      primeEligible: true,
      deliveryEstimate: 'Today by 8:00 PM (Same-Day Prime)',
      rating: 4.7,
      reviewCount: 5410,
      merchantId: 'merch_puma_store',
      merchantName: 'Puma India Official',
      inStock: true,
      stockCount: 30,
      badge: 'Best Budget Value',
      bestFor: 'Versatile Daily Training, Gym Workouts & Tempo Runs',
      reviewSummary: 'Top-tier nitrogen-infused foam at an unbeatable price point. PUMAGRIP outsole is widely rated the stickiest grip in the class.',
      pros: ['Nitrogen-infused NITRO FOAM', 'Superb PUMAGRIP wet/dry traction', 'Unmatched value under ₹1,500'],
      cons: ['Firm heel counter requires 1–2 days break-in'],
      customerSentiments: {
        positivePct: 89,
        fitAccuracy: '90% say True to Size',
        comfortRating: '4.7 / 5.0 (Bouncy & Responsive)',
      },
      features: ['NITRO Foam Cushioning', 'PUMAGRIP Outsole', 'Reflective Accents'],
      imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80',
      bundleDeals: []
    },
    {
      asin: 'B0CN992J1K',
      title: 'Asics Gel-Kayano 30 Maximum Stability Marathon Shoes',
      brand: 'Asics',
      category: 'Athletics & Apparel',
      price: 1949,
      originalPrice: 2499,
      currency: 'INR',
      primeEligible: true,
      deliveryEstimate: 'Tomorrow by 10:00 AM (Prime Express)',
      rating: 4.9,
      reviewCount: 9340,
      merchantId: 'merch_asics_india',
      merchantName: 'Asics Official India',
      inStock: true,
      stockCount: 15,
      badge: 'Best Marathon Stability & Overpronation',
      bestFor: 'Overpronators, Flat Feet & Full Marathon Training',
      reviewSummary: 'The gold standard in stability. 4D Guidance System adapts to foot fatigue without feeling rigid or heavy.',
      pros: ['4D Guidance System for adaptive stability', 'PureGEL technology for soft heel landings', 'Recommended by orthopedic physiotherapists'],
      cons: ['Premium price point near the ₹2,000 threshold'],
      customerSentiments: {
        positivePct: 96,
        fitAccuracy: '94% say True to Size',
        comfortRating: '4.9 / 5.0 (Unmatched Arch Support)',
      },
      features: ['PureGEL Cushioning', '4D Guidance System', 'FF BLAST PLUS ECO Foam'],
      imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80',
      bundleDeals: []
    },
    {
      asin: 'B0B88K7N3F',
      title: 'Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones',
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
      badge: '#1 Premium ANC Headphones',
      bestFor: 'Flights, Deep Focus Work, Audiophile Wireless Listening',
      reviewSummary: 'Flawless noise cancellation with 8 microphones. 30-hour battery life with 3-minute quick charge for 3 hours playback.',
      pros: ['Unmatched active noise cancellation', '30-hour battery life', 'Ultra-clear voice calls'],
      cons: ['Does not fold into a compact hinge'],
      customerSentiments: {
        positivePct: 95,
        fitAccuracy: 'Lightweight & comfortable for 8+ hour sessions',
        comfortRating: '4.9 / 5.0 (Silent Sanctuary)',
      },
      features: ['Auto NC Optimizer', '30-hour Battery', 'Multipoint Connection'],
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
      bundleDeals: []
    },
    {
      asin: 'B08P2H5V6D',
      title: 'Keychron Q1 Pro QMK/VIA Wireless Custom Mechanical Keyboard',
      brand: 'Keychron',
      category: 'Electronics & Peripherals',
      price: 3899,
      originalPrice: 4499,
      currency: 'INR',
      primeEligible: true,
      deliveryEstimate: 'Tomorrow by 2:00 PM',
      rating: 4.8,
      reviewCount: 920,
      merchantId: 'merch_amazon',
      merchantName: 'Amazon India (Keychron Authorized)',
      inStock: true,
      stockCount: 8,
      badge: 'Best Custom Keyboard',
      bestFor: 'Software Engineers, Mechanical Keyboard Enthusiasts',
      reviewSummary: 'Heavy CNC aluminum frame with double-gasket dampening provides deep acoustic "thock" sound and smooth typing.',
      pros: ['Full CNC aluminum chassis', 'Hot-swappable tactile brown switches', 'QMK/VIA key remapping support'],
      cons: ['Heavy weight (1.8kg) intended for desk use'],
      customerSentiments: {
        positivePct: 93,
        fitAccuracy: '75% compact ergonomic layout',
        comfortRating: '4.8 / 5.0 (Superior Typing Acoustic)',
      },
      features: ['CNC Aluminum Body', 'Double-Gasket Design', 'Hot-Swappable RGB'],
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80',
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
        (item.bestFor && item.bestFor.toLowerCase().includes(q)) ||
        item.features.some(f => f.toLowerCase().includes(q));
      return match;
    });

    if (results.length === 0) {
      if (q.includes('shoe') || q.includes('run') || q.includes('nike') || q.includes('adidas') || q.includes('puma') || q.includes('asics')) {
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

  public static analyzeAndCompare(query: string, maxBudget?: number): AmazonBrandComparisonReport {
    const matched = this.searchAmazon(query, maxBudget);
    const sortedByRating = [...matched].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    const sortedByPrice = [...matched].sort((a, b) => a.price - b.price);

    const topPick = sortedByRating[0] || this.mockAmazonCatalog[0];
    const bestValue = sortedByPrice[0] || topPick;
    const bestComfort = matched.find(i => i.brand === 'Adidas') || topPick;

    const brandNames = Array.from(new Set(matched.map(m => m.brand))).join(', ');

    return {
      query,
      totalFound: matched.length,
      topPick,
      bestValue,
      bestComfort,
      brandSummary: `Analyzed ${matched.length} top items across ${brandNames}. Over ${(matched.reduce((acc, i) => acc + i.reviewCount, 0)).toLocaleString()} verified customer reviews parsed.`,
      products: sortedByRating,
    };
  }

  public static getByAsin(asin: string): AmazonProductItem | undefined {
    return this.mockAmazonCatalog.find(i => i.asin === asin);
  }
}
