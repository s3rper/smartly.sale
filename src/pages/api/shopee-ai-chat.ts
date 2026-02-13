import type { APIRoute } from 'astro';
import affiliateProductsData from '../../data/affiliate-products.json';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ShopeeProduct {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  shopeeLink: string;
  whyRecommend: string;
  cmsOfferLink?: string;
}

interface JSONProductData {
  item_id: string;
  productOfferLink: string;
  batch_item_for_item_card_full: {
    name: string;
    image: string;
    price: string;
    price_before_discount?: string;
    discount?: string;
    item_rating?: {
      rating_star: number;
    };
    historical_sold?: number;
    historical_sold_text?: string;
    shop_location?: string;
    shop_name?: string;
    shop_rating?: number;
  };
}

// Convert JSON product to ShopeeProduct format
function convertJSONToShopeeProduct(jsonProduct: JSONProductData): ShopeeProduct {
  const item = jsonProduct.batch_item_for_item_card_full;
  
  // Convert price from cents to PHP (divide by 100000)
  const price = parseInt(item.price) / 100000;
  const originalPrice = item.price_before_discount 
    ? parseInt(item.price_before_discount) / 100000 
    : undefined;
  
  // Get rating
  const rating = item.item_rating?.rating_star || 4.5;
  
  // Get reviews/sold count
  const reviews = item.historical_sold || 0;
  
  // Build image URL from Shopee CDN
  const image = `https://down-ph.img.susercontent.com/file/${item.image}`;
  
  return {
    id: jsonProduct.item_id,
    title: item.name,
    price,
    originalPrice,
    rating,
    reviews,
    image,
    shopeeLink: jsonProduct.productOfferLink,
    cmsOfferLink: jsonProduct.productOfferLink,
    whyRecommend: ''
  };
}

// Shuffle array randomly
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get random products from JSON
function getRandomProducts(count: number = 3): ShopeeProduct[] {
  console.log(`[Random] Starting with ${affiliateProductsData.length} JSON products`);

  // Convert all JSON products to ShopeeProduct format
  const allProducts = affiliateProductsData.map(p => convertJSONToShopeeProduct(p as JSONProductData));

  console.log(`[Random] Converted to ${allProducts.length} valid products`);

  if (allProducts.length === 0) {
    console.log('[Random] ❌ No valid products found!');
    return [];
  }

  // Shuffle and return random products
  const shuffled = shuffleArray(allProducts);
  const results = shuffled.slice(0, Math.min(count, shuffled.length));
  
  console.log(`[Random] ✅ Returning ${results.length} random products`);
  results.forEach((p, i) => {
    console.log(`[Random]   ${i + 1}. ${p.title} - ₱${p.price}`);
  });

  return results;
}

// Generate AI recommendation explanation
function generateWhyRecommend(product: ShopeeProduct, query: string): string {
  const reasons = [];
  
  if (product.rating >= 4.8) {
    reasons.push('Highly rated by buyers');
  } else if (product.rating >= 4.5) {
    reasons.push('Great customer reviews');
  }
  
  if (product.originalPrice && product.price < product.originalPrice) {
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    reasons.push(`${discount}% discount`);
  }
  
  if (product.reviews > 1000) {
    reasons.push('Trusted by thousands');
  } else if (product.reviews > 500) {
    reasons.push('Popular choice');
  } else if (product.reviews > 100) {
    reasons.push('Well-reviewed product');
  }
  
  if (query.toLowerCase().includes('budget') || query.toLowerCase().includes('cheap')) {
    reasons.push('Great value for money');
  }
  
  if (reasons.length === 0) {
    reasons.push('Excellent choice for your needs');
  }
  
  return reasons.join('. ') + '!';
}

// Generate dynamic AI response based on products
function generateAIResponse(products: ShopeeProduct[], message: string): string {
  if (products.length === 0) {
    return "I'm sorry, but I couldn't find any products at the moment. Please try again or let me know what you're looking for! 😊";
  }

  const responses = [
    `Perfect! I found ${products.length} amazing products for you. Check out these top picks! 🛍️`,
    `Great choice! Here are ${products.length} highly-rated products that I think you'll love! ⭐`,
    `Awesome! I've curated ${products.length} fantastic options just for you. Take a look! 🎁`,
    `Excellent! Here are ${products.length} trending products that match your interest! 🔥`,
    `Nice! I've selected ${products.length} popular items that are getting great reviews! 💯`,
    `Sweet! Check out these ${products.length} bestsellers - they're flying off the shelves! 🚀`,
  ];

  // Return a random response
  return responses[Math.floor(Math.random() * responses.length)];
}

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('[API] ========== New Request ==========');
    
    const { message, conversationHistory } = await request.json();

    console.log('[API] Received message:', message);

    if (!message) {
      console.log('[API] ❌ No message provided');
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get random products from JSON (always return 3 random products)
    console.log('[API] Getting random products from JSON...');
    const products = getRandomProducts(3);
    console.log(`[API] Selected ${products.length} random products`);

    // Generate dynamic AI response
    const aiResponse = generateAIResponse(products, message);
    console.log('[API] AI Response:', aiResponse);

    // Add "why recommend" to products
    const enrichedProducts: ShopeeProduct[] = products.map(product => ({
      ...product,
      whyRecommend: generateWhyRecommend(product, message)
    }));

    console.log(`[API] ✅ Returning ${enrichedProducts.length} enriched products`);

    const response = {
      response: aiResponse,
      products: enrichedProducts
    };

    console.log('[API] ========== Request Complete ==========');

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[API] ❌ Fatal Error:', error);
    if (error instanceof Error) {
      console.error('[API] Error message:', error.message);
      console.error('[API] Error stack:', error.stack);
    }
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
