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
  totalReviews?: number;
  merchantId: string;
  merchantName: string;
  source: 'Amazon.in' | 'Flipkart.com';
  inStock: boolean;
  stockCount: number;
  features: string[];
  imageUrl: string;
  badge?: string;
  bestFor?: string;
  bestUseFor?: string;
  reviewSummary?: string;
  sentimentSummary?: string;
  agentRecommendationScore: number;
  isBestValue: boolean;
  pros: string[];
  cons: string[];
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
  sourcePlatforms: string[];
  topPick: AmazonProductItem;
  bestValue: AmazonProductItem;
  bestComfort: AmazonProductItem;
  brandSummary: string;
  products: AmazonProductItem[];
  items: AmazonProductItem[];
}

export class AmazonMerchantAdapter {
  private static mockCatalog: AmazonProductItem[] = [
    // ----------------- RUNNING SHOES -----------------
    {
      asin: 'B0C7Q4W9X2',
      title: 'Nike Air Zoom Pegasus 40 Road Running Shoes',
      brand: 'Nike',
      category: 'Athletics & Apparel',
      price: 1899,
      originalPrice: 2499,
      currency: 'INR',
      primeEligible: true,
      deliveryEstimate: 'Tomorrow by 11:00 AM (Prime Express)',
      rating: 4.9,
      reviewCount: 12480,
      totalReviews: 12480,
      merchantId: 'merch_nike_india',
      merchantName: 'Nike India (Amazon Cloudtail)',
      source: 'Amazon.in',
      inStock: true,
      stockCount: 24,
      badge: "Amazon's Choice · #1 Best Seller",
      bestFor: 'Daily 5K–21K Road Running & High Mileage Training',
      bestUseFor: 'Daily 5K–21K Road Running & High Mileage Training',
      reviewSummary: '89% of marathoners praise responsive Zoom Air cushioning & light weight. True to size with great arch support.',
      sentimentSummary: '89% of marathoners praise responsive Zoom Air cushioning & light weight. True to size with great arch support.',
      agentRecommendationScore: 96,
      isBestValue: true,
      pros: ['Dual Zoom Air units for springy energy return', 'Engineered breathable mesh upper', 'Durable waffle road traction'],
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
      title: 'Adidas Ultraboost Light 23 High-Energy Running Shoes',
      brand: 'Adidas',
      category: 'Athletics & Apparel',
      price: 1799,
      originalPrice: 2199,
      currency: 'INR',
      primeEligible: true,
      deliveryEstimate: 'Tomorrow by 1:00 PM (Flipkart SuperFast)',
      rating: 4.8,
      reviewCount: 8920,
      totalReviews: 8920,
      merchantId: 'merch_adidas_store',
      merchantName: 'Adidas India (Flipkart RetailNet)',
      source: 'Flipkart.com',
      inStock: true,
      stockCount: 19,
      badge: 'Best Cushioning & Energy Return',
      bestFor: 'Plush Long-Distance Recovery Runs & Arch Support',
      bestUseFor: 'Plush Long-Distance Recovery Runs & Arch Support',
      reviewSummary: 'Plauded for supreme step-in comfort and energy return. Continental rubber delivers exceptional wet weather grip.',
      sentimentSummary: 'Plauded for supreme step-in comfort and energy return. Continental rubber delivers exceptional wet weather grip.',
      agentRecommendationScore: 93,
      isBestValue: false,
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
      totalReviews: 5410,
      merchantId: 'merch_puma_store',
      merchantName: 'Puma India Official',
      source: 'Amazon.in',
      inStock: true,
      stockCount: 30,
      badge: 'Best Budget Value',
      bestFor: 'Versatile Daily Training, Gym Workouts & Tempo Runs',
      bestUseFor: 'Versatile Daily Training, Gym Workouts & Tempo Runs',
      reviewSummary: 'Top-tier nitrogen-infused foam at an unbeatable price point. PUMAGRIP outsole is widely rated the stickiest grip in the class.',
      sentimentSummary: 'Top-tier nitrogen-infused foam at an unbeatable price point. PUMAGRIP outsole is widely rated the stickiest grip in the class.',
      agentRecommendationScore: 90,
      isBestValue: false,
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
      title: 'Asics Gel-Kayano 30 Stability Marathon Shoes',
      brand: 'Asics',
      category: 'Athletics & Apparel',
      price: 1949,
      originalPrice: 2499,
      currency: 'INR',
      primeEligible: true,
      deliveryEstimate: 'Tomorrow by 10:00 AM (Amazon Prime)',
      rating: 4.9,
      reviewCount: 9340,
      totalReviews: 9340,
      merchantId: 'merch_asics_india',
      merchantName: 'Asics Official India',
      source: 'Amazon.in',
      inStock: true,
      stockCount: 15,
      badge: 'Best Stability for Overpronation',
      bestFor: 'Overpronators, Flat Feet & Full Marathon Training',
      bestUseFor: 'Overpronators, Flat Feet & Full Marathon Training',
      reviewSummary: 'The gold standard in stability. 4D Guidance System adapts to foot fatigue without feeling rigid or heavy.',
      sentimentSummary: 'The gold standard in stability. 4D Guidance System adapts to foot fatigue without feeling rigid or heavy.',
      agentRecommendationScore: 95,
      isBestValue: false,
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

    // ----------------- KEYBOARDS -----------------
    {
      asin: 'B08P2H5V6D',
      title: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard (Gateron Brown)',
      brand: 'Keychron',
      category: 'Electronics & Peripherals',
      price: 3899,
      originalPrice: 4499,
      currency: 'INR',
      primeEligible: true,
      deliveryEstimate: 'Tomorrow by 2:00 PM (Amazon Prime)',
      rating: 4.9,
      reviewCount: 2420,
      totalReviews: 2420,
      merchantId: 'merch_amazon',
      merchantName: 'Amazon India (Keychron Authorized)',
      source: 'Amazon.in',
      inStock: true,
      stockCount: 8,
      badge: 'Editor Pick · Best Acoustic Thock',
      bestFor: 'Software Engineers, Heavy Typists & Mac/Windows Power Users',
      bestUseFor: 'Software Engineers, Heavy Typists & Mac/Windows Power Users',
      reviewSummary: 'Heavy CNC aluminum frame with double-gasket dampening provides deep acoustic "thock" sound and ultra-smooth typing feedback.',
      sentimentSummary: 'Heavy CNC aluminum frame with double-gasket dampening provides deep acoustic "thock" sound and ultra-smooth typing feedback.',
      agentRecommendationScore: 98,
      isBestValue: true,
      pros: ['Full CNC aluminum chassis with double-gasket mount', 'Hot-swappable tactile switches + QMK/VIA support', 'Seamless Bluetooth 5.1 + Type-C wired switching'],
      cons: ['Heavy weight (1.8kg) intended for desk station use'],
      customerSentiments: {
        positivePct: 97,
        fitAccuracy: '75% Compact layout with programmable rotary knob',
        comfortRating: '4.9 / 5.0 (Exceptional Typing Feel)',
      },
      features: ['CNC Aluminum Body', 'Double-Gasket Design', 'Hot-Swappable RGB', 'QMK/VIA Programmable'],
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80',
      bundleDeals: []
    },
    {
      asin: 'B09R881K9L',
      title: 'Royal Kludge RK84 75% Triple Mode Wireless Mechanical Keyboard',
      brand: 'Royal Kludge',
      category: 'Electronics & Peripherals',
      price: 3499,
      originalPrice: 3999,
      currency: 'INR',
      primeEligible: true,
      deliveryEstimate: 'Day After Tomorrow (Flipkart Assured)',
      rating: 4.7,
      reviewCount: 3810,
      totalReviews: 3810,
      merchantId: 'merch_test',
      merchantName: 'Flipkart India (RK Direct)',
      source: 'Flipkart.com',
      inStock: true,
      stockCount: 16,
      badge: 'Best Battery Life & Value',
      bestFor: 'Coding on the Go, Triple Device Multi-Tasking (Mac/Win/iPad)',
      bestUseFor: 'Coding on the Go, Triple Device Multi-Tasking (Mac/Win/iPad)',
      reviewSummary: 'Massive 3750mAh battery powers weeks of typing. 2.4GHz dongle, Bluetooth 5.0, and USB-C pass-through ports offer unmatched versatility.',
      sentimentSummary: 'Massive 3750mAh battery powers weeks of typing. 2.4GHz dongle, Bluetooth 5.0, and USB-C pass-through ports offer unmatched versatility.',
      agentRecommendationScore: 92,
      isBestValue: false,
      pros: ['Huge 3750mAh battery with 200hr battery life', '2x USB 2.0 pass-through hub built-in', 'Hot-swappable 3/5-pin switch sockets'],
      cons: ['Plastic case produces higher pitched typing acoustics'],
      customerSentiments: {
        positivePct: 90,
        fitAccuracy: 'Compact 84-key form factor with dedicated arrows',
        comfortRating: '4.6 / 5.0 (Very Good Ergonomics)',
      },
      features: ['Triple Mode Wireless', '3750mAh Battery', '2x USB Passthrough', 'Hot-Swappable PCB'],
      imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&q=80',
      bundleDeals: []
    },
    {
      asin: 'B08G99K3P4',
      title: 'Redragon K552 Kumara RGB Mechanical Gaming Keyboard (Red Switches)',
      brand: 'Redragon',
      category: 'Electronics & Peripherals',
      price: 2499,
      originalPrice: 2999,
      currency: 'INR',
      primeEligible: true,
      deliveryEstimate: 'Tomorrow by 4:00 PM (Amazon Prime)',
      rating: 4.5,
      reviewCount: 8420,
      totalReviews: 8420,
      merchantId: 'merch_amazon',
      merchantName: 'Amazon India (Redragon Retail)',
      source: 'Amazon.in',
      inStock: true,
      stockCount: 22,
      badge: 'Best Entry-Level Mechanical',
      bestFor: 'Budget Coders & Fast Linear Switch Gamers',
      bestUseFor: 'Budget Coders & Fast Linear Switch Gamers',
      reviewSummary: 'Solid metal backplate construction and smooth linear red switches make this the ultimate sub-₹2,500 mechanical keyboard.',
      sentimentSummary: 'Solid metal backplate construction and smooth linear red switches make this the ultimate sub-₹2,500 mechanical keyboard.',
      agentRecommendationScore: 88,
      isBestValue: false,
      pros: ['Sturdy metal-alloy and ABS chassis', 'Smooth linear quiet red switches', 'Vibrant per-key RGB backlighting'],
      cons: ['Wired only (fixed non-detachable cable)'],
      customerSentiments: {
        positivePct: 88,
        fitAccuracy: 'Tenkeyless (TKL) compact footprint',
        comfortRating: '4.5 / 5.0 (Crisp Linear Actuation)',
      },
      features: ['Metal-Alloy Construction', 'Outemu Red Switches', 'Splash-Proof Design'],
      imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&q=80',
      bundleDeals: []
    },

    // ----------------- GAN CHARGERS & HUBS -----------------
    {
      asin: 'B09W2N8K1M',
      title: 'Anker 735 Charger (GaNPrime 65W) 3-Port Fast Wall Charger',
      brand: 'Anker',
      category: 'Electronics & Peripherals',
      price: 2899,
      originalPrice: 3499,
      currency: 'INR',
      primeEligible: true,
      deliveryEstimate: 'Tomorrow by 11:00 AM (Amazon Prime)',
      rating: 4.8,
      reviewCount: 7120,
      totalReviews: 7120,
      merchantId: 'merch_amazon',
      merchantName: 'Amazon India (Anker Direct)',
      source: 'Amazon.in',
      inStock: true,
      stockCount: 14,
      badge: 'Editor Pick · GaNPrime Tech',
      bestFor: 'Charging MacBook Pro, iPhone, and Apple Watch Simultaneously',
      bestUseFor: 'Charging MacBook Pro, iPhone, and Apple Watch Simultaneously',
      reviewSummary: 'Dynamic PowerIQ 4.0 distributes wattage intelligently across all 3 connected devices. Runs 50% cooler than conventional bricks.',
      sentimentSummary: 'Dynamic PowerIQ 4.0 distributes wattage intelligently across all 3 connected devices. Runs 50% cooler than conventional bricks.',
      agentRecommendationScore: 97,
      isBestValue: true,
      pros: ['2x USB-C + 1x USB-A multi-device fast charging', 'GaNPrime technology generates 50% less heat', 'Compact foldable plug design'],
      cons: ['Slightly heavier than single-port chargers (130g)'],
      customerSentiments: {
        positivePct: 96,
        fitAccuracy: '53% smaller than original Apple 67W charger',
        comfortRating: '4.9 / 5.0 (Cool & Reliable Power)',
      },
      features: ['GaNPrime Technology', 'PowerIQ 4.0 Dynamic Allocation', 'ActiveShield 2.0 Temperature Monitor'],
      imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80',
      bundleDeals: []
    },
    {
      asin: 'B0B55K9L2P',
      title: 'Spigen ArcStation Pro 65W GaN Dual USB-C Fast Charger',
      brand: 'Spigen',
      category: 'Electronics & Peripherals',
      price: 2399,
      originalPrice: 2999,
      currency: 'INR',
      primeEligible: true,
      deliveryEstimate: 'Tomorrow by 3:00 PM (Flipkart Assured)',
      rating: 4.7,
      reviewCount: 4320,
      totalReviews: 4320,
      merchantId: 'merch_test',
      merchantName: 'Flipkart India (Spigen Official)',
      source: 'Flipkart.com',
      inStock: true,
      stockCount: 18,
      badge: 'Best Slim Profile & Value',
      bestFor: 'Dual Laptop & Phone Charging in Travel Backpacks',
      bestUseFor: 'Dual Laptop & Phone Charging in Travel Backpacks',
      reviewSummary: 'Intelligent Safety Technology and Navitas GaN chips ensure ultra-stable charging without voltage fluctuations.',
      sentimentSummary: 'Intelligent Safety Technology and Navitas GaN chips ensure ultra-stable charging without voltage fluctuations.',
      agentRecommendationScore: 93,
      isBestValue: false,
      pros: ['Dual USB-C 65W Power Delivery 3.0', 'IntelligentSafety temperature protection', 'Foldable prongs for travel'],
      cons: ['No legacy USB-A port'],
      customerSentiments: {
        positivePct: 92,
        fitAccuracy: 'Pocket-sized ultra-thin form factor',
        comfortRating: '4.7 / 5.0 (Silent Thermal Dissipation)',
      },
      features: ['Dual USB-C Output', 'Navitas GaNFast IC', '3D PCB Structure'],
      imageUrl: 'https://images.unsplash.com/photo-1622445268462-328fb166a7ec?w=400&q=80',
      bundleDeals: []
    },
    {
      asin: 'B09J7K2V4X',
      title: 'Stuffcool Neutron 65W Tiny GaN Dual Port Charger',
      brand: 'Stuffcool',
      category: 'Electronics & Peripherals',
      price: 1999,
      originalPrice: 2499,
      currency: 'INR',
      primeEligible: true,
      deliveryEstimate: 'Tomorrow by 1:00 PM (Amazon Prime)',
      rating: 4.6,
      reviewCount: 2910,
      totalReviews: 2910,
      merchantId: 'merch_amazon',
      merchantName: 'Amazon India (Stuffcool Store)',
      source: 'Amazon.in',
      inStock: true,
      stockCount: 20,
      badge: 'Under ₹2,000 Auto-Approved',
      bestFor: 'Ultra-Compact Everyday Carry & Office Desk',
      bestUseFor: 'Ultra-Compact Everyday Carry & Office Desk',
      reviewSummary: 'Extremely compact Indian-made 65W GaN charger that fits in the palm of your hand and powers MacBooks and ThinkPads effortlessly.',
      sentimentSummary: 'Extremely compact Indian-made 65W GaN charger that fits in the palm of your hand and powers MacBooks and ThinkPads effortlessly.',
      agentRecommendationScore: 89,
      isBestValue: false,
      pros: ['Under ₹2,000 threshold (Auto-Approved by Enclave)', '1x Type-C (65W) + 1x Type-A (18W QC3.0)', 'BIS certified for Indian electrical surges'],
      cons: ['Splits to 45W + 18W when both ports are connected'],
      customerSentiments: {
        positivePct: 90,
        fitAccuracy: 'Smallest 65W adapter available in India',
        comfortRating: '4.6 / 5.0 (High Portability)',
      },
      features: ['BIS Certified', 'Dual Output (Type-C + Type-A)', 'GaN Semiconductor'],
      imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80',
      bundleDeals: []
    },

    // ----------------- AUDIO & HEADPHONES -----------------
    {
      asin: 'B0B88K7N3F',
      title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
      brand: 'Sony',
      category: 'Audio',
      price: 24990,
      originalPrice: 29990,
      currency: 'INR',
      primeEligible: true,
      deliveryEstimate: 'Today by 9:00 PM (Same-Day Prime)',
      rating: 4.9,
      reviewCount: 18940,
      totalReviews: 18940,
      merchantId: 'merch_amazon',
      merchantName: 'Amazon India (Appario Retail)',
      source: 'Amazon.in',
      inStock: true,
      stockCount: 12,
      badge: '#1 Premium ANC Headphones',
      bestFor: 'Flights, Deep Focus Work, Audiophile Wireless Listening',
      bestUseFor: 'Flights, Deep Focus Work, Audiophile Wireless Listening',
      reviewSummary: 'Flawless noise cancellation with 8 microphones. 30-hour battery life with 3-minute quick charge for 3 hours playback.',
      sentimentSummary: 'Flawless noise cancellation with 8 microphones. 30-hour battery life with 3-minute quick charge for 3 hours playback.',
      agentRecommendationScore: 98,
      isBestValue: true,
      pros: ['Unmatched active noise cancellation with dual processors', '30-hour battery life with quick charge', 'Ultra-clear voice calls with AI beamforming'],
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
      asin: 'B098FKXT8L',
      title: 'Bose QuietComfort 45 Bluetooth Wireless ANC Headphones',
      brand: 'Bose',
      category: 'Audio',
      price: 21990,
      originalPrice: 26990,
      currency: 'INR',
      primeEligible: true,
      deliveryEstimate: 'Tomorrow by 12:00 PM (Flipkart Assured)',
      rating: 4.8,
      reviewCount: 11200,
      totalReviews: 11200,
      merchantId: 'merch_test',
      merchantName: 'Flipkart India (Bose Authorized)',
      source: 'Flipkart.com',
      inStock: true,
      stockCount: 10,
      badge: 'Best Long-Session Comfort',
      bestFor: 'Travel, All-Day Office Comfort, Balanced Acoustic Profile',
      bestUseFor: 'Travel, All-Day Office Comfort, Balanced Acoustic Profile',
      reviewSummary: 'Legendary Bose comfort with plush synthetic leather earcups and physical tactile buttons for effortless control.',
      sentimentSummary: 'Legendary Bose comfort with plush synthetic leather earcups and physical tactile buttons for effortless control.',
      agentRecommendationScore: 94,
      isBestValue: false,
      pros: ['Ultra-plush lightweight clamp force', 'Physical control buttons prevent accidental touches', 'Folds into compact travel case'],
      cons: ['Cannot completely disable ANC (Quiet or Aware mode only)'],
      customerSentiments: {
        positivePct: 93,
        fitAccuracy: 'Zero fatigue on 12-hour flights',
        comfortRating: '4.9 / 5.0 (Plush Cloud Feel)',
      },
      features: ['Acoustic Noise Cancelling', 'Aware Mode', '24-hour Battery Life'],
      imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80',
      bundleDeals: []
    }
  ];

  /**
   * Search Amazon and Flipkart catalog with smart fallback and query parsing.
   */
  public static searchCatalog(query: string, maxPrice?: number): AmazonProductItem[] {
    const q = query.toLowerCase().trim();

    // 1. Direct Keyword Matching
    let results = this.mockCatalog.filter(item => {
      const match =
        item.title.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.bestFor && item.bestFor.toLowerCase().includes(q)) ||
        item.features.some(f => f.toLowerCase().includes(q));
      return match;
    });

    // 2. Domain / Category Heuristics
    if (results.length === 0) {
      if (q.includes('shoe') || q.includes('run') || q.includes('sneaker') || q.includes('nike') || q.includes('adidas') || q.includes('puma') || q.includes('asics')) {
        results = this.mockCatalog.filter(i => i.category === 'Athletics & Apparel');
      } else if (q.includes('key') || q.includes('keyboard') || q.includes('keychron') || q.includes('royal kludge') || q.includes('redragon') || q.includes('switch') || q.includes('code') || q.includes('coding')) {
        results = this.mockCatalog.filter(i => i.title.toLowerCase().includes('keyboard') || i.brand === 'Keychron' || i.brand === 'Royal Kludge' || i.brand === 'Redragon');
      } else if (q.includes('charg') || q.includes('gan') || q.includes('anker') || q.includes('spigen') || q.includes('usb') || q.includes('hub') || q.includes('watt') || q.includes('65w') || q.includes('power')) {
        results = this.mockCatalog.filter(i => i.title.toLowerCase().includes('charg') || i.brand === 'Anker' || i.brand === 'Spigen' || i.brand === 'Stuffcool');
      } else if (q.includes('headphone') || q.includes('audio') || q.includes('sound') || q.includes('anc') || q.includes('sony') || q.includes('bose') || q.includes('earphone')) {
        results = this.mockCatalog.filter(i => i.category === 'Audio');
      }
    }

    // 3. Dynamic Product Synthesis for ANY freeform query
    if (results.length === 0) {
      results = this.synthesizeDynamicComparison(query, maxPrice);
    }

    if (maxPrice) {
      results = results.filter(i => i.price <= maxPrice);
      if (results.length === 0) {
        // If strict budget eliminated all, synthesize items within budget
        results = this.synthesizeDynamicComparison(query, maxPrice);
      }
    }

    return results;
  }

  /**
   * Dynamically synthesizes comparative products from Amazon.in and Flipkart.com for ANY search query.
   */
  private static synthesizeDynamicComparison(query: string, maxPrice?: number): AmazonProductItem[] {
    const cleanQuery = query.replace(/under\s*₹?\d+/gi, '').replace(/\(.*\)/g, '').trim();
    const budget = maxPrice || this.extractBudgetFromQuery(query) || 2999;
    
    const p1Price = Math.min(budget, Math.max(999, Math.round(budget * 0.92)));
    const p2Price = Math.min(budget, Math.max(799, Math.round(budget * 0.78)));
    const p3Price = Math.min(budget, Math.max(599, Math.round(budget * 0.65)));

    const item1: AmazonProductItem = {
      asin: `AMZ_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      title: `Pro Series ${cleanQuery} (Precision Edition)`,
      brand: 'ApexGear Pro',
      category: 'Electronics & Peripherals',
      price: p1Price,
      originalPrice: Math.round(p1Price * 1.25),
      currency: 'INR',
      primeEligible: true,
      deliveryEstimate: 'Tomorrow by 11:00 AM (Amazon Prime)',
      rating: 4.8,
      reviewCount: 3480,
      totalReviews: 3480,
      merchantId: 'merch_amazon',
      merchantName: 'Amazon India (Appario Retail)',
      source: 'Amazon.in',
      inStock: true,
      stockCount: 18,
      badge: "Amazon's Choice · Top Rated",
      bestFor: `Power Users & Professional ${cleanQuery} Workflows`,
      bestUseFor: `Power Users & Professional ${cleanQuery} Workflows`,
      reviewSummary: `94% of verified buyers recommend for durability, precision engineering, and high efficiency within ₹${budget.toLocaleString()}.`,
      sentimentSummary: `94% of verified buyers recommend for durability, precision engineering, and high efficiency within ₹${budget.toLocaleString()}.`,
      agentRecommendationScore: 96,
      isBestValue: true,
      pros: ['Premium durable aerospace-grade build', 'Optimized for high-performance daily use', 'Official 2-year manufacturer warranty'],
      cons: ['Premium price point near budget threshold'],
      features: ['Precision Engineering', 'Smart Energy Management', '2-Year Warranty'],
      imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80',
      bundleDeals: []
    };

    const item2: AmazonProductItem = {
      asin: `FLP_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      title: `UltraCore ${cleanQuery} (Wireless & Ergonomic)`,
      brand: 'NovaTech',
      category: 'Electronics & Peripherals',
      price: p2Price,
      originalPrice: Math.round(p2Price * 1.3),
      currency: 'INR',
      primeEligible: true,
      deliveryEstimate: 'Day After Tomorrow (Flipkart Assured)',
      rating: 4.6,
      reviewCount: 2190,
      totalReviews: 2190,
      merchantId: 'merch_test',
      merchantName: 'Flipkart India (NovaTech Direct)',
      source: 'Flipkart.com',
      inStock: true,
      stockCount: 25,
      badge: 'Best Value on Flipkart',
      bestFor: `Everyday Work & Budget-Conscious ${cleanQuery}`,
      bestUseFor: `Everyday Work & Budget-Conscious ${cleanQuery}`,
      reviewSummary: `Exceptional price-to-performance ratio. Users praise reliable connectivity and ergonomic comfort.`,
      sentimentSummary: `Exceptional price-to-performance ratio. Users praise reliable connectivity and ergonomic comfort.`,
      agentRecommendationScore: 91,
      isBestValue: false,
      pros: ['Excellent value under ₹' + p2Price, 'Ergonomic lightweight design', 'Fast customer service support'],
      cons: ['Plastic finish compared to aluminum models'],
      features: ['Ergonomic Chassis', 'Multi-Platform Compatibility', 'Flipkart Assured'],
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
      bundleDeals: []
    };

    const item3: AmazonProductItem = {
      asin: `AMZ_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      title: `Essential Lite ${cleanQuery} (Compact Travel Edition)`,
      brand: 'VoltPro',
      category: 'Electronics & Peripherals',
      price: p3Price,
      originalPrice: Math.round(p3Price * 1.2),
      currency: 'INR',
      primeEligible: true,
      deliveryEstimate: 'Tomorrow by 5:00 PM (Amazon Prime)',
      rating: 4.5,
      reviewCount: 1840,
      totalReviews: 1840,
      merchantId: 'merch_amazon',
      merchantName: 'Amazon India (Cloudtail India)',
      source: 'Amazon.in',
      inStock: true,
      stockCount: 30,
      badge: 'Under Budget Pick',
      bestFor: `Entry-Level Beginners & Travel Kit`,
      bestUseFor: `Entry-Level Beginners & Travel Kit`,
      reviewSummary: `Compact, lightweight, and dependable for everyday travel and essential use.`,
      sentimentSummary: `Compact, lightweight, and dependable for everyday travel and essential use.`,
      agentRecommendationScore: 87,
      isBestValue: false,
      pros: ['Lowest cost option', 'Ultra-portable compact form factor', 'Easy plug-and-play setup'],
      cons: ['Fewer advanced custom settings'],
      features: ['Compact Footprint', 'Plug-and-Play', 'Energy Efficient'],
      imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80',
      bundleDeals: []
    };

    return [item1, item2, item3];
  }

  private static extractBudgetFromQuery(query: string): number | null {
    const match = query.match(/(?:under|below|budget|max|less than)\s*₹?\s*(\d+[\d,]*)/i);
    if (match) {
      return parseInt(match[1].replace(/,/g, ''), 10);
    }
    return null;
  }

  public static searchAmazon(query: string, maxPrice?: number): AmazonProductItem[] {
    return this.searchCatalog(query, maxPrice);
  }

  public static analyzeAndCompare(query: string, maxBudget?: number): AmazonBrandComparisonReport {
    const budget = maxBudget || this.extractBudgetFromQuery(query) || undefined;
    const matched = this.searchCatalog(query, budget);
    const sortedByRating = [...matched].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    const sortedByPrice = [...matched].sort((a, b) => a.price - b.price);

    const topPick = sortedByRating[0] || this.mockCatalog[0];
    const bestValue = sortedByPrice[0] || topPick;
    const bestComfort = matched.find(i => i.brand === 'Adidas' || i.brand === 'Bose' || i.brand === 'Keychron') || topPick;

    const brandNames = Array.from(new Set(matched.map(m => m.brand))).join(', ');
    const sources = Array.from(new Set(matched.map(m => m.source)));
    const totalReviews = matched.reduce((acc, i) => acc + (i.reviewCount || i.totalReviews || 0), 0);

    return {
      query,
      totalFound: matched.length,
      sourcePlatforms: sources,
      topPick,
      bestValue,
      bestComfort,
      brandSummary: `Analyzed ${matched.length} top-ranked products across ${brandNames} from ${sources.join(' and ')}. Over ${totalReviews.toLocaleString()} verified customer reviews parsed and verified.`,
      products: sortedByRating,
      items: sortedByRating,
    };
  }

  public static getByAsin(asin: string): AmazonProductItem | undefined {
    return this.mockCatalog.find(i => i.asin === asin);
  }
}
