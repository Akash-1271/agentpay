import {
  ProductItem,
  AP2DelegationMandate,
  AP2SignedQuote,
  AgentTransactionOutcome,
  AuditRecord,
} from '../types';

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

export const CLIENT_AMAZON_CATALOG: AmazonProductItem[] = [
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
    reviewSummary: 'Unrivaled 8-microphone ANC silences office hum and airplane cabin rumble. 30-hour battery life and LDAC hi-res audio.',
    sentimentSummary: 'Unrivaled 8-microphone ANC silences office hum and airplane cabin rumble. 30-hour battery life and LDAC hi-res audio.',
    agentRecommendationScore: 98,
    isBestValue: true,
    pros: ['Best-in-class Active Noise Cancellation', '30-hour battery with 3-minute fast charging', 'Ultra-comfortable synthetic soft-fit leather'],
    cons: ['Non-folding hinge takes slightly more bag space'],
    customerSentiments: {
      positivePct: 96,
      fitAccuracy: 'Super-plush earcups without clamping fatigue',
      comfortRating: '4.9 / 5.0 (Cloud Comfort)',
    },
    features: ['Dual V1/QN1 Processors', 'LDAC Hi-Res Audio', 'Auto-NC Optimizer', 'Speak-to-Chat'],
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    bundleDeals: []
  },
  {
    asin: 'B09V7N8K4P',
    title: 'Bose QuietComfort 45 Bluetooth Wireless Noise Cancelling Headphones',
    brand: 'Bose',
    category: 'Audio',
    price: 19999,
    originalPrice: 26990,
    currency: 'INR',
    primeEligible: true,
    deliveryEstimate: 'Tomorrow by 11:00 AM (Flipkart Assured)',
    rating: 4.8,
    reviewCount: 14210,
    totalReviews: 14210,
    merchantId: 'merch_test',
    merchantName: 'Flipkart India (Bose Authorized)',
    source: 'Flipkart.com',
    inStock: true,
    stockCount: 9,
    badge: 'Best Lightweight Long-Wear Comfort',
    bestFor: 'All-Day Office Wear, Commuting & Crystal Clear Voice Calls',
    bestUseFor: 'All-Day Office Wear, Commuting & Crystal Clear Voice Calls',
    reviewSummary: 'Legendary Bose comfort combined with Quiet and Aware modes. Physical buttons provide tactile control without accidental touch triggers.',
    sentimentSummary: 'Legendary Bose comfort combined with Quiet and Aware modes. Physical buttons provide tactile control without accidental touch triggers.',
    agentRecommendationScore: 94,
    isBestValue: false,
    pros: ['Classic fold-flat design for compact travel', 'Physical buttons for reliable volume/track control', 'TriPort acoustic architecture'],
    cons: ['No LDAC high-resolution Bluetooth codec'],
    customerSentiments: {
      positivePct: 94,
      fitAccuracy: 'Featherlight 240g design for 8+ hour workdays',
      comfortRating: '4.9 / 5.0 (Legendary Bose Fit)',
    },
    features: ['Quiet & Aware Modes', 'TriPort Architecture', '24-Hour Battery', 'Foldable Case'],
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80',
    bundleDeals: []
  },

  // ----------------- SMART RINGS & FITNESS -----------------
  {
    asin: 'B0C99J2K1L',
    title: 'Ultrahuman Ring AIR — Titanium Raw Smart Fitness & Sleep Tracker',
    brand: 'Ultrahuman',
    category: 'Wearables & Health',
    price: 4999,
    originalPrice: 7999,
    currency: 'INR',
    primeEligible: true,
    deliveryEstimate: 'Tomorrow by 12:00 PM (Amazon Prime)',
    rating: 4.8,
    reviewCount: 3120,
    totalReviews: 3120,
    merchantId: 'merch_amazon',
    merchantName: 'Amazon India (Ultrahuman Flagship)',
    source: 'Amazon.in',
    inStock: true,
    stockCount: 15,
    badge: 'Editor Pick · Fighter-Jet Grade Titanium',
    bestFor: 'Circadian Rhythm Syncing, Sleep Tracking & Glucose Biomarkers',
    bestUseFor: 'Circadian Rhythm Syncing, Sleep Tracking & Glucose Biomarkers',
    reviewSummary: 'At only 2.4 grams, this titanium ring tracks sleep stages, skin temperature, and recovery scores without screen distraction.',
    sentimentSummary: 'At only 2.4 grams, this titanium ring tracks sleep stages, skin temperature, and recovery scores without screen distraction.',
    agentRecommendationScore: 97,
    isBestValue: true,
    pros: ['Ultra-light 2.4g fighter-jet titanium build', 'Medical-grade PPG sensors for heart rate & HRV', 'No monthly subscription required'],
    cons: ['Requires ring size kit before final delivery'],
    customerSentiments: {
      positivePct: 95,
      fitAccuracy: 'Hypoallergenic smooth inner resin coating',
      comfortRating: '4.9 / 5.0 (Zero Screen Distraction)',
    },
    features: ['Fighter-Jet Titanium', 'Circadian Phase Tracking', '6-Day Battery', 'Water Resistant 100m'],
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80',
    bundleDeals: []
  },
  {
    asin: 'B0D88K3N7M',
    title: 'Noise Luna Ring — Advanced Smart Health Tracker with Sleep Index',
    brand: 'Noise',
    category: 'Wearables & Health',
    price: 3999,
    originalPrice: 5999,
    currency: 'INR',
    primeEligible: true,
    deliveryEstimate: 'Tomorrow by 2:00 PM (Flipkart Assured)',
    rating: 4.6,
    reviewCount: 2180,
    totalReviews: 2180,
    merchantId: 'merch_test',
    merchantName: 'Flipkart India (Noise Direct)',
    source: 'Flipkart.com',
    inStock: true,
    stockCount: 20,
    badge: 'Best Value Smart Ring',
    bestFor: 'Daily Activity, Body Temperature & Readiness Score',
    bestUseFor: 'Daily Activity, Body Temperature & Readiness Score',
    reviewSummary: 'Fighter jet-grade titanium with Diamond-Like Carbon (DLC) coating delivers durability and 70+ health metrics on a budget.',
    sentimentSummary: 'Fighter jet-grade titanium with Diamond-Like Carbon (DLC) coating delivers durability and 70+ health metrics on a budget.',
    agentRecommendationScore: 91,
    isBestValue: false,
    pros: ['Durable DLC scratch-resistant coating', '7 days battery life on a single 60-min charge', 'Sub-₹4,000 price point'],
    cons: ['App sync can take 3–5 seconds upon wake'],
    customerSentiments: {
      positivePct: 91,
      fitAccuracy: 'Available in Stardust Silver & Midnight Black',
      comfortRating: '4.6 / 5.0 (Smooth Daily Wear)',
    },
    features: ['DLC Coating', '7-Day Battery', 'Infrared Photoplethysmography (PPG)', 'Water Resistance 50m'],
    imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&q=80',
    bundleDeals: []
  }
];

export function analyzeReviewsOffline(query: string, maxBudget?: number): AmazonBrandComparisonReport {
  const q = (query || '').toLowerCase();
  
  let matched = CLIENT_AMAZON_CATALOG.filter((item) => {
    if (maxBudget && item.price > maxBudget) return false;
    if (!q) return true;
    
    // Category matching
    if (q.includes('keyboard') || q.includes('keychron') || q.includes('royal kludge') || q.includes('redragon')) {
      return item.category === 'Electronics & Peripherals' && item.title.toLowerCase().includes('keyboard');
    }
    if (q.includes('shoe') || q.includes('running') || q.includes('nike') || q.includes('adidas') || q.includes('puma') || q.includes('asics')) {
      return item.category === 'Athletics & Apparel';
    }
    if (q.includes('charger') || q.includes('gan') || q.includes('anker') || q.includes('spigen') || q.includes('stuffcool') || q.includes('65w') || q.includes('usb-c')) {
      return item.title.toLowerCase().includes('charger') || item.title.toLowerCase().includes('gan');
    }
    if (q.includes('headphone') || q.includes('earphone') || q.includes('sony') || q.includes('bose') || q.includes('noise cancelling') || q.includes('anc')) {
      return item.category === 'Audio';
    }
    if (q.includes('ring') || q.includes('smartwatch') || q.includes('fitness') || q.includes('ultrahuman') || q.includes('noise')) {
      return item.category === 'Wearables & Health';
    }

    // Generic match
    return (
      item.title.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.pros.some((p) => p.toLowerCase().includes(q))
    );
  });

  if (matched.length === 0) {
    matched = CLIENT_AMAZON_CATALOG.slice(0, 6);
  }

  // Sort by recommendation score descending
  matched.sort((a, b) => b.agentRecommendationScore - a.agentRecommendationScore);

  const topPick = matched[0] || CLIENT_AMAZON_CATALOG[0];
  const bestValue = matched.find((i) => i.isBestValue) || matched[0];
  const bestComfort = matched[1] || matched[0];

  const brandNames = Array.from(new Set(matched.map((i) => i.brand))).join(', ');
  const summary = `Evaluated verified customer sentiment across Amazon.in and Flipkart.com for ${brandNames}. ${topPick.brand} leads in overall reliability and build (${topPick.agentRecommendationScore}/100), while ${bestValue.brand} offers the highest value quotient.`;

  return {
    query,
    totalFound: matched.length,
    sourcePlatforms: ['Amazon.in', 'Flipkart.com'],
    topPick,
    bestValue,
    bestComfort,
    brandSummary: summary,
    products: matched,
    items: matched,
  };
}
