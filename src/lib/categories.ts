/**
 * categories.ts
 *
 * Single source of truth for all product category definitions.
 * Each category has:
 *  - SEO metadata (title, description, keywords)
 *  - Keyword arrays for matching products by name
 *  - Buying guide content (E-E-A-T signal)
 *  - Bilingual FAQs (English + Tagalog) for FAQ schema + featured snippets
 */

import { shopeeProducts } from './shopee-loader';
import type { CMSProduct } from '../types/product';

export interface CategoryFaq {
  q: string;
  a: string;
}

export interface CategoryDefinition {
  slug: string;
  name: string;
  emoji: string;
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  /** Lowercase substrings matched against product name */
  matchKeywords: string[];
  /** Priority keywords — matched first (higher relevance) */
  priorityKeywords: string[];
  heroContent: string;
  buyingGuide: string;
  faqs: CategoryFaq[];
}

export const CATEGORIES: CategoryDefinition[] = [
  {
    slug: 'gadgets',
    name: 'Gadgets & Tech',
    emoji: '📱',
    tagline: 'Budget tech finds that actually work',
    metaTitle: 'Best Budget Gadgets on Shopee Philippines 2026 | smartly.sale',
    metaDescription: 'Discover the best budget gadgets and tech deals on Shopee Philippines. Laptops, power banks, earphones, Bluetooth speakers, and more — curated for Filipino shoppers.',
    keywords: 'budget gadgets Philippines, Shopee gadgets 2026, cheap tech Philippines, power bank Shopee, earphone Shopee Philippines, laptop Shopee Philippines, bluetooth speaker Philippines',
    priorityKeywords: ['laptop', 'tablet', 'earphone', 'earbuds', 'bluetooth', 'power bank', 'powerbank', 'speaker', 'wifi', 'smart watch', 'smartwatch'],
    matchKeywords: [
      'laptop', 'tablet', 'earphone', 'earbuds', 'bluetooth', 'power bank', 'powerbank',
      'speaker', 'wifi', 'smartwatch', 'smart watch', 'solar panel', 'led light',
      'usb', 'hdmi', 'charger', 'charging', 'camera', 'drone', 'printer', 'keyboard',
      'mouse', 'monitor', 'headphone', 'headset', 'gaming', 'rgb', 'ssd', 'hard disk',
      'router', 'modem', 'cable', 'adapter', 'hub', 'webcam', 'microphone', 'projector',
      'flashlight', 'dash cam', 'dashcam', 'action cam', 'gimbal', 'tripod', 'selfie',
      'phone holder', 'phone case', 'screen protector', 'power strip',
    ],
    heroContent: `Finding reliable gadgets on Shopee Philippines without overspending is a skill every Filipino shopper needs. From budget earphones that sound like they cost three times more, to power banks that survive a Cebu Pacific flight — we've curated the tech deals that actually deliver.`,
    buyingGuide: `**What to look for when buying gadgets on Shopee Philippines**

**Check the seller rating first.** A seller with 4.8 stars and 1,000+ reviews is almost always safer than a new seller offering the same item 20% cheaper. Reputable sellers also process returns much faster if something goes wrong.

**Read the actual reviews, not just the star count.** Filter for reviews with photos — these are real buyers who actually received the item. Look for comments about build quality, battery life, and whether the product matches the description.

**Look for Shopee Mall listings when possible.** Shopee Mall sellers are officially verified and offer a 15-day return policy as standard. For higher-ticket items like laptops or tablets, the extra protection is worth it.

**Understand Philippine voltage compatibility.** The Philippines runs on 220V / 60Hz. Most modern chargers and power banks are dual-voltage, but always check the label. Some imported electronics (especially from US-based sellers) may need a voltage converter.

**For wireless products, check frequency bands.** Bluetooth 5.0+ offers significantly better range and connection stability than older Bluetooth 4.2 devices — worth paying a bit more for headphones or speakers you'll use daily.

**Compare the price per unit for accessories.** Cables, chargers, and adapters are often dramatically cheaper when bought in bulk sets. A 3-pack of USB cables frequently costs less than two individual cables.`,
    faqs: [
      {
        q: 'What are the best budget gadgets on Shopee Philippines under ₱500?',
        a: 'Top budget gadget picks under ₱500 on Shopee Philippines include USB-C charging cables, phone stands, LED desk lights, earphone/earbud options from brands like Haylou and QCY, screen protectors, and mini Bluetooth speakers. Look for items with 4.7+ ratings and 100+ sold counts to ensure quality.'
      },
      {
        q: 'Is it safe to buy electronics on Shopee Philippines?',
        a: 'Yes, buying electronics on Shopee Philippines is generally safe when you stick to Shopee Mall sellers or sellers with 4.8+ ratings and at least 500 completed transactions. Always check buyer reviews with photos, confirm the item ships from the Philippines (faster delivery, easier returns), and use Shopee\'s buyer protection — never pay outside the platform.'
      },
      {
        q: 'Ano ang pinakamabentang gadget sa Shopee Philippines ngayon?',
        a: 'Ang mga pinakamabentang gadget sa Shopee Philippines ngayon ay kinabibilangan ng mga power bank, wireless earphones, USB hubs, phone holders, at portable Bluetooth speakers. Ang mga produktong ito ay popular dahil sa mababang presyo at mataas na kalidad, lalo na ang mga brand na Anker, Baseus, at Romoss.'
      },
      {
        q: 'Paano malaman kung legit ang seller ng gadgets sa Shopee?',
        a: 'Para malaman kung legit ang isang gadget seller sa Shopee: (1) Tingnan ang seller rating — dapat 4.7 pataas. (2) Suriin ang bilang ng naibentang produkto — mas marami, mas mapagkakatiwalaan. (3) Basahin ang mga review na may larawan mula sa tunay na mamimili. (4) Piliin ang Shopee Mall sellers para sa dagdag na proteksyon. (5) Iwasan ang mga seller na humihingi ng bayad sa labas ng Shopee platform.'
      },
    ],
  },

  {
    slug: 'home-living',
    name: 'Home & Living',
    emoji: '🏠',
    tagline: 'Transform your space without breaking the bank',
    metaTitle: 'Best Home & Living Deals on Shopee Philippines 2026 | smartly.sale',
    metaDescription: 'Shop the best home and living products on Shopee Philippines. Fans, mattresses, kitchen organizers, curtains, and viral home finds — all curated for Filipino homes.',
    keywords: 'home living Shopee Philippines, home organizer Shopee, electric fan Philippines Shopee, mattress Shopee Philippines, kitchen appliances Shopee, home decor Philippines',
    priorityKeywords: ['fan', 'mattress', 'curtain', 'organizer', 'storage', 'kitchen', 'blender', 'airfryer', 'air fryer'],
    matchKeywords: [
      'fan', 'mattress', 'curtain', 'organizer', 'storage', 'kitchen', 'blender',
      'airfryer', 'air fryer', 'cookware', 'pot', 'pan', 'pillow', 'blanket',
      'bedding', 'bed', 'sofa', 'chair', 'table', 'shelf', 'rack', 'cabinet',
      'drawer', 'lamp', 'light bulb', 'ceiling', 'wall', 'floor', 'carpet',
      'rug', 'curtain', 'blind', 'door', 'window', 'hook', 'hanger', 'laundry',
      'washing', 'vacuum', 'mop', 'broom', 'cleaning', 'iron', 'steamer',
      'rice cooker', 'pressure cooker', 'microwave', 'oven', 'toaster', 'kettle',
      'water dispenser', 'refrigerator', 'freezer', 'trolley', 'cart', 'stove',
      'gas stove', 'induction', 'cutting board', 'knife', 'utensil',
    ],
    heroContent: `Whether you're moving into a new condo unit in BGC or refreshing a family home in the province, Shopee Philippines has become the go-to source for home essentials at prices that make sense. From silent electric fans perfect for the Philippine heat, to space-saving organizers that work in even the smallest Manila apartments.`,
    buyingGuide: `**Smart guide to buying home & living products on Shopee Philippines**

**Measure before you order.** Shopee listings sometimes use international sizing (cm vs inches), and a shelf that's "perfect" in the photos may not fit your hallway. Always check the exact dimensions in the product description before adding to cart.

**Electric fans: check the noise level.** DC motor fans are significantly quieter and more energy-efficient than AC motor fans — important if you use the fan overnight. Look for fans listed as "DC motor" or "inverter" for bedroom use.

**Mattresses need at least 2–3 weeks to fully expand.** Foam and spring mattresses shipped in vacuum-rolled packaging look thin when they arrive. Give them 48–72 hours to expand to their full thickness before judging.

**Kitchen appliances — check the wattage.** Higher wattage usually means faster cooking (e.g., a 1500W air fryer preheats faster than a 900W one). But also check if your home's electrical circuit can handle it — older Filipino homes with 10-amp circuits can trip with multiple high-wattage appliances running simultaneously.

**For storage and organizers, read the load capacity.** Cheap plastic shelves rated for only 10kg per shelf will sag under heavy books or appliances. Look for steel-framed options for heavier items.

**Avoid buying items with only 1–5 reviews for home appliances.** A fan or appliance with 500+ reviews at 4.7+ stars gives you much more confidence than a brand-new listing with 5 reviews, even if it's cheaper.`,
    faqs: [
      {
        q: 'What are the best home organizers available on Shopee Philippines?',
        a: 'The most popular home organizers on Shopee Philippines include multi-layer trolley carts (great for kitchens and bathrooms), under-bed storage boxes, drawer dividers, cable organizers, and wall-mounted shelves. Look for heavy-duty options with 4.8+ ratings, and check load capacity in the description for items meant to hold heavy objects.'
      },
      {
        q: 'Which electric fan brand is best to buy on Shopee Philippines?',
        a: 'Top electric fan brands on Shopee Philippines include American Home, Hanabishi, Dowell, and Fandis for local brands, plus international brands like Xiaomi and Baseus for tower fans. For bedroom use, look for DC motor fans which are quieter. For living rooms or offices, a 16-18 inch stand fan with remote control offers the best convenience.'
      },
      {
        q: 'Ano ang mga magandang bilhin para sa bahay sa Shopee?',
        a: 'Ang mga pinakamabentang home products sa Shopee Philippines ay ang mga electric fan, storage organizer, mattress topper, kitchen rack, at curtain blinds. Para sa mga bagong bahay o condo, ang mga organizer at storage items ay laging kapaki-pakinabang. Siguraduhin na basahin ang mga review bago bumili, lalo na para sa malalaking kasangkapan.'
      },
      {
        q: 'May libreng delivery ba ang home products sa Shopee?',
        a: 'Oo, maraming home products sa Shopee Philippines ang may free shipping, lalo na kung gumagamit ka ng Shopee free shipping vouchers o kung ang seller ay naka-enroll sa Shopee\'s free shipping promo. Ang mga Shopee Mall sellers ay madalas na nag-aalok ng libre o subsidized shipping. Para sa mabibigat na produkto tulad ng mattress o furniture, baka may dagdag na bayad sa delivery depende sa lokasyon.'
      },
    ],
  },

  {
    slug: 'fashion',
    name: 'Fashion & Apparel',
    emoji: '👗',
    tagline: 'Trendy Filipino fashion at Shopee prices',
    metaTitle: 'Trending Fashion & Apparel on Shopee Philippines 2026 | smartly.sale',
    metaDescription: 'Find the latest fashion trends on Shopee Philippines. Shirts, dresses, caps, bags, shoes, and accessories — all the viral apparel finds for Filipino shoppers.',
    keywords: 'fashion Shopee Philippines, clothes Shopee Philippines, bags Shopee Philippines, shoes Philippines Shopee, trending fashion Philippines 2026, outfit ideas Philippines',
    priorityKeywords: ['shirt', 'dress', 'shoes', 'bag', 'cap', 'jacket', 'pants', 'skirt'],
    matchKeywords: [
      'shirt', 'dress', 'shoes', 'bag', 'cap', 'jacket', 'pants', 'skirt',
      'blouse', 'top', 'shorts', 'jeans', 'tshirt', 't-shirt', 'polo',
      'hoodie', 'sweater', 'cardigan', 'coat', 'blazer', 'suit', 'terno',
      'barong', 'watch', 'jewelry', 'necklace', 'bracelet', 'ring', 'earring',
      'sunglasses', 'glasses', 'hat', 'beanie', 'scarf', 'belt', 'wallet',
      'purse', 'handbag', 'backpack', 'sling bag', 'tote', 'sandal', 'slipper',
      'sneaker', 'heel', 'boots', 'flip flop', 'loafer', 'wedding', 'formal',
      'swimwear', 'bikini', 'swimsuit', 'lingerie', 'underwear', 'socks',
      'helmet', 'apparel', 'clothing', 'wear', 'outfit',
    ],
    heroContent: `From office OOTD to beach day fits, Filipino fashion on Shopee Philippines covers everything — and at prices that make sense for any budget. Whether you're hunting for Korean-style streetwear, plus-size finds, or Batik-inspired pieces for special occasions, the best deals are hiding in plain sight.`,
    buyingGuide: `**How to shop for clothes and fashion on Shopee Philippines without regret**

**Always check the size chart — not your usual size.** Shopee fashion items, especially those from Chinese or Korean suppliers, often run smaller than Philippine standard sizing. A "Large" on Shopee may fit like a Philippine Medium. Always check the actual measurements (bust, waist, hip, length) in centimeters before ordering.

**Read reviews that mention fit and fabric.** The most valuable reviews say things like "fits true to size" or "fabric is thicker than expected." Filter for reviews with photos on real bodies — mannequin photos can be misleading.

**Check the return and exchange policy before buying.** Most Shopee fashion sellers offer size exchanges but not full returns for fit issues — check the seller's policy tab. Shopee Mall fashion stores typically have a 15-day return window.

**Look for COD (Cash on Delivery) options for first-time purchases.** If you're buying from a seller for the first time, paying COD lets you inspect the item before payment. This is especially useful for bags, shoes, and higher-priced items.

**Accessories and jewelry: check material descriptions carefully.** "Stainless steel" and "surgical steel" are more durable than "alloy" for everyday jewelry. Alloy accessories tend to tarnish faster in the Philippine humidity and heat.

**For shoes, order up half a size when unsure.** Shopee shoes (especially athletic and sneaker styles) often run slightly small. If you're between sizes, going half a size up is usually the safer bet.`,
    faqs: [
      {
        q: 'How do I choose the right size when buying clothes on Shopee Philippines?',
        a: 'Always refer to the specific size chart provided in the product listing, not generic S/M/L labels. Measure your bust, waist, and hips in centimeters and compare to the chart. Shopee items from Korean or Chinese sellers often run 1-2 sizes smaller than Philippine standards. When in doubt, size up — most sellers allow exchanges for size issues within 7-15 days.'
      },
      {
        q: 'What are the most popular fashion brands on Shopee Philippines?',
        a: 'Popular fashion brands on Shopee Philippines include local brands like Bench, Penshoppe, and Human for basics; international fast-fashion brands for trendy pieces; and Korean-inspired brands for K-fashion styles. Shopee Mall hosts many of these official brand stores with verified products and return guarantees. For accessories, brands like Lovelinks and Ximena Accessories are trending.'
      },
      {
        q: 'Paano malaman kung maganda ang kalidad ng damit sa Shopee?',
        a: 'Para malaman ang kalidad ng damit sa Shopee: (1) Basahin ang mga review na nagsasabi tungkol sa tela at sukat — "makapal," "magaan," "totoo sa kulay." (2) Tingnan ang mga review na may larawan ng tunay na mamimili, hindi mannequin. (3) Piliin ang mga produkto na may 4.7+ rating at maraming nabibili. (4) Itanong sa seller ang eksaktong material ng tela bago bilhin. (5) Para sa mahal na items, pumili ng Shopee Mall sellers na may return policy.'
      },
      {
        q: 'Libre ba ang return ng damit na hindi fit sa Shopee Philippines?',
        a: 'Depende sa seller. Ang karamihan sa Shopee fashion sellers ay tumatanggap ng palitan (exchange) para sa maling sukat, ngunit hindi palaging libre ang pagbabalik. Ang Shopee Mall sellers ay may 15-day return/exchange policy. Para sa regular sellers, tingnan ang "Return Policy" tab sa product page bago bumili. Maaari ring gamitin ang Shopee Return feature sa app kung hindi tugma ang item sa description.'
      },
    ],
  },

  {
    slug: 'beauty',
    name: 'Beauty & Health',
    emoji: '✨',
    tagline: 'Glow-up finds for every skin type',
    metaTitle: 'Best Beauty & Health Products on Shopee Philippines 2026 | smartly.sale',
    metaDescription: 'Shop the best beauty and health products on Shopee Philippines. Skincare, vitamins, makeup, hair care, and wellness essentials — curated for Filipino skin and lifestyle.',
    keywords: 'beauty Shopee Philippines, skincare Philippines Shopee, vitamins Philippines, makeup Shopee Philippines, hair care Shopee, health products Philippines 2026',
    priorityKeywords: ['serum', 'sunscreen', 'moisturizer', 'vitamin', 'collagen', 'whitening', 'skincare'],
    matchKeywords: [
      'serum', 'sunscreen', 'moisturizer', 'vitamin', 'collagen', 'whitening',
      'skincare', 'lotion', 'cream', 'toner', 'cleanser', 'face wash',
      'makeup', 'lipstick', 'lip', 'foundation', 'concealer', 'blush',
      'mascara', 'eyeliner', 'eyeshadow', 'contour', 'highlighter',
      'shampoo', 'conditioner', 'hair mask', 'hair oil', 'hair serum',
      'hair dryer', 'hair straightener', 'curler', 'hair treatment',
      'perfume', 'cologne', 'deodorant', 'antiperspirant',
      'supplement', 'glutathione', 'zinc', 'iron supplement',
      'facial', 'face mask', 'peel off', 'sheet mask', 'under eye',
      'nail', 'nail polish', 'nail art', 'cuticle',
      'body scrub', 'body butter', 'stretch mark', 'cellulite',
      'razor', 'epilator', 'waxing', 'tweezers',
      'toothbrush', 'toothpaste', 'whitening strips', 'dental',
      'cotton pad', 'makeup remover', 'micellar', 'tanning',
    ],
    heroContent: `The Philippine beauty market has exploded on Shopee, with everything from K-beauty staples to locally made skincare brands now accessible to every Filipino. Whether you're dealing with the heat and humidity of Manila summers or looking for a glow-up routine that works on morena skin, the right products are out there — and they don't have to cost a fortune.`,
    buyingGuide: `**How to shop beauty and health products safely on Shopee Philippines**

**Look for FDA-registered products.** The Philippine FDA (Food and Drug Administration) requires all cosmetics and health supplements sold in the Philippines to be registered. Legitimate sellers will have the FDA Certificate of Product Registration (CPR) number in the product listing or will provide it upon request. Avoid unregistered whitening products or supplements that make extreme claims.

**Patch test everything new — even highly-rated products.** Filipino skin reacts differently to products depending on skin type, allergies, and the tropical climate. Before applying a new serum or cream to your full face, test it on your inner arm for 24–48 hours.

**Check the expiration date.** Shopee beauty products should always have a manufacturing date and expiry date. Reputable sellers include this in product photos. If it's not shown, ask the seller directly before purchasing.

**For supplements and vitamins, stick to known brands.** Brands like Myra, Conzace, Immunoboost, and Nature's Bounty have FDA clearance and reliable quality control. Be cautious of unknown supplement brands making dramatic health claims, especially for weight loss or skin whitening.

**Skincare layering matters.** For Filipino skin, a basic but effective routine in the Philippine climate is: gentle cleanser → toner → Vitamin C serum (morning) → moisturizer → SPF 30+ sunscreen. Many Shopee sellers offer bundled sets that are more affordable than buying each step separately.

**Hair care: match products to your water type.** Metro Manila has hard water, which can make hair dry and prone to breakage. Look for shampoos specifically labeled for hard water or clarifying shampoos used weekly to remove mineral buildup.`,
    faqs: [
      {
        q: 'What are the best skincare products for Filipino skin on Shopee?',
        a: 'Top-selling skincare for Filipino skin on Shopee Philippines includes: SPF sunscreens (Biore UV, Skin Aqua, and local brand Cocofloss), Vitamin C serums (Skintific, Somethinc), niacinamide serums for pore control, and lightweight moisturizers suited to the Philippine humidity. For morena/brown skin, look for products that even skin tone without harsh bleaching agents. Always check for FDA registration.'
      },
      {
        q: 'Are beauty products on Shopee Philippines authentic?',
        a: 'Many beauty products on Shopee Philippines are authentic, but there are counterfeits too. To stay safe: (1) Buy from Shopee Mall or brand-official stores. (2) Check for FDA-registered products — ask the seller for the CPR number. (3) Compare the price to the official brand price — if it\'s 70% cheaper, be cautious. (4) Read reviews mentioning authenticity. (5) For Korean beauty products, look for "authorized reseller" in the seller profile.'
      },
      {
        q: 'Anong mga beauty products ang maganda bilhin sa Shopee Philippines?',
        a: 'Ang mga pinakasikat na beauty products sa Shopee Philippines ay kinabibilangan ng: (1) Sunscreen — importanteng proteksyon sa araw ng Pilipinas. (2) Vitamin C serum — para sa mas maliwanag na balat. (3) Collagen supplements — sikat sa mga Pilipino para sa anti-aging. (4) Korean sheet masks — abot-kayang self-care treat. (5) Niacinamide toner — para sa malaking pores at oily skin. Siguraduhing FDA-registered ang lahat ng skincare at supplements.'
      },
      {
        q: 'Ligtas bang uminom ng supplements na binibili sa Shopee Philippines?',
        a: 'Ligtas ang mga supplements na FDA-registered at galing sa kilala at mapagkakatiwalaang sellers. Bago bumili: (1) Hanapin ang FDA registration number sa listing. (2) Pumili ng mga kilalang brand tulad ng Myra E, Immunoboost, o Nature\'s Bounty. (3) Iwasan ang mga supplements na may sobrang malaking pangako tulad ng "pampapayat sa 7 araw" o "panggagamot ng sakit." (4) Kumonsulta sa doktor bago magsimula ng bagong supplement regimen, lalo na kung may kondisyon ka.'
      },
    ],
  },

  {
    slug: 'sports-outdoor',
    name: 'Sports & Outdoor',
    emoji: '⛺',
    tagline: 'Gear up for adventure, Filipino-style',
    metaTitle: 'Best Sports & Outdoor Gear on Shopee Philippines 2026 | smartly.sale',
    metaDescription: 'Find the best sports and outdoor gear on Shopee Philippines. Camping equipment, fitness gear, bicycles, hiking gear, and more — for every Filipino adventurer.',
    keywords: 'sports gear Philippines Shopee, camping equipment Philippines, outdoor Shopee Philippines, bicycle Shopee Philippines, gym equipment Philippines, hiking gear Philippines',
    priorityKeywords: ['camping', 'tent', 'bicycle', 'bike', 'gym', 'fishing', 'hiking'],
    matchKeywords: [
      'camping', 'tent', 'bicycle', 'bike', 'gym', 'fishing', 'hiking',
      'outdoor', 'sports', 'fitness', 'exercise', 'yoga', 'dumbbell',
      'barbell', 'resistance band', 'jump rope', 'pull up', 'push up',
      'treadmill', 'cycling', 'swimming', 'running', 'jogging',
      'backpack', 'hiking bag', 'trail', 'mountain', 'rappelling',
      'helmet', 'knee pad', 'elbow pad', 'gloves', 'sports shoes',
      'basketball', 'volleyball', 'football', 'badminton', 'tennis',
      'table tennis', 'chess', 'martial arts', 'boxing', 'muay thai',
      'fishing rod', 'fishing reel', 'lure', 'tackle', 'bait',
      'inflatable', 'kayak', 'snorkel', 'diving', 'surf',
      'sleeping bag', 'hammock', 'lantern', 'cooler', 'thermos',
      'raincoat', 'rain boots', 'umbrella', 'waterproof',
    ],
    heroContent: `The Philippines is an adventure playground — 7,641 islands, world-class diving spots, and mountain trails from Luzon to Mindanao. Whether you're weekend camping in Benguet, fishing in Laguna de Bay, or starting a home gym to beat the summer heat, Shopee Philippines has the gear that won't drain your budget before the adventure even starts.`,
    buyingGuide: `**How to buy sports and outdoor gear on Shopee Philippines**

**Camping gear: prioritize waterproofing ratings.** In the Philippines, an outdoor tent rated below 1,500mm hydrostatic head (HH) will leak in moderate rain. Look for tents with at least 2,000mm HH for any camping trip outside of the dry season. The rainy season runs June to November — a leaky tent in Sagada is a miserable experience.

**Check bicycle compatibility before buying parts.** If you're buying cycling accessories or replacement parts on Shopee, always confirm compatibility with your specific bike model and wheel size (700c for road bikes, 27.5" or 29" for MTBs). Sellers often list compatible models in the product description.

**Fishing gear: match the line strength to your target fish.** Tilapia, bangus, and carp fishing needs a different line weight than deep-sea or game fishing. Budget fishing setups on Shopee work well for casual use — just ensure the rod and reel combo is rated for the type of fishing you're doing (freshwater vs. saltwater).

**Gym equipment: check the weight capacity.** Cheap workout benches on Shopee may be rated for only 100–120kg. If you're lifting heavy or are on the heavier side, look for benches with 150kg+ capacity. The description should list this — if it doesn't, ask the seller.

**For outdoor footwear, read the sole description.** Hiking shoes with "rubber outsole" and "anti-slip" features provide far better grip on the muddy Philippine mountain trails than standard sneakers. Look for shoes with Vibram soles for serious hikes.

**Sports clothing: synthetic over cotton for the Philippine climate.** Cotton holds moisture in the heat and takes forever to dry. Polyester or nylon athletic wear (often labeled "moisture-wicking" or "dri-fit") keeps you cooler and dries faster — essential in the Philippine humidity.`,
    faqs: [
      {
        q: 'What camping gear should I buy on Shopee Philippines for beginners?',
        a: 'A beginner camping kit from Shopee Philippines should include: a tent rated 2,000mm+ waterproofing, a sleeping bag rated for Philippine night temperatures (around 15-25°C depending on elevation), a portable gas stove with butane canisters, a headlamp or camping lantern, a lightweight backpack (40-60L), and a basic first aid kit. Look for sellers with 4.7+ ratings and check the return policy for large gear items.'
      },
      {
        q: 'Are bicycles on Shopee Philippines good quality?',
        a: 'Shopee Philippines has a wide range of bicycles — from entry-level bikes under ₱5,000 to mid-range mountain bikes up to ₱15,000+. For casual use and flat city roads, Shopee bikes are good value. For serious trail riding, investing in a bike from a dedicated bike shop may be better for quality assurance and after-sales support. Always check if the seller offers bike assembly service or instructions, as most ship partially assembled.'
      },
      {
        q: 'Ano ang magandang outdoor gear na mabibili sa Shopee para sa mga camping sa Pilipinas?',
        a: 'Para sa camping sa Pilipinas, ang mga importanteng outdoor gear na available sa Shopee ay: (1) Waterproof tent — kailangan ng mataas na HH rating dahil sa madalas na ulan. (2) Portable gas stove — para sa pagluluto sa labas. (3) Sleeping bag — kahit mainit ang Pilipinas, malamig ang gabi sa bundok. (4) Headlamp — mas maginhawa kaysa flashlight. (5) Mosquito repellent — mahalaga sa labas ng lungsod. Maghanap ng mga produktong may maraming positibong review mula sa mga Pilipinong nag-camping.'
      },
      {
        q: 'Paano mag-setup ng home gym gamit ang mga biniling sa Shopee Philippines?',
        a: 'Para mag-setup ng home gym sa Shopee Philippines nang hindi masyadong mahal: (1) Bumili ng adjustable dumbbells — mas matipid kaysa fixed-weight sets. (2) Magdagdag ng resistance bands — versatile at mura. (3) Kunin ang gym mat para sa floor protection at comfort. (4) Para sa cardio, ang jump rope ay isa sa pinaka-epektibong at pinakamurang options. (5) Kung may espasyo, ang pull-up bar para sa pintuan ay magandang investment. Ang isang basic home gym setup ay kayang gawin sa ₱2,000–₱5,000 sa Shopee.'
      },
    ],
  },

  {
    slug: 'food-snacks',
    name: 'Food & Snacks',
    emoji: '🍜',
    tagline: 'Pasalubong-worthy eats delivered to your door',
    metaTitle: 'Best Food & Snacks on Shopee Philippines 2026 | smartly.sale',
    metaDescription: 'Discover the best food finds and snacks on Shopee Philippines. Coffee, local delicacies, imported snacks, health food, and pasalubong favorites — all delivered nationwide.',
    keywords: 'food Shopee Philippines, snacks Philippines Shopee, coffee Philippines online, imported snacks Philippines, health food Shopee, pasalubong Philippines',
    priorityKeywords: ['coffee', 'snack', 'chocolate', 'tea', 'noodle', 'chips'],
    matchKeywords: [
      'coffee', 'snack', 'chocolate', 'tea', 'noodle', 'chips', 'candy',
      'biscuit', 'cookie', 'cracker', 'popcorn', 'nuts', 'dried fruit',
      'dried mango', 'pastry', 'bread', 'cake mix', 'sauce', 'seasoning',
      'spice', 'vinegar', 'soy sauce', 'fish sauce', 'patis', 'toyo',
      'food', 'edible', 'drink', 'juice', 'energy drink', 'protein shake',
      'protein powder', 'whey', 'meal prep', 'diet food', 'healthy snack',
      'granola', 'oatmeal', 'cereal', 'honey', 'jam', 'peanut butter',
      'condensed milk', 'evaporated milk', 'coconut milk', 'gata',
      'instant noodle', 'ramen', 'cup noodle', 'soup',
      'chili garlic', 'hot sauce', 'siling labuyo',
    ],
    heroContent: `From Benguet strawberry jam to imported Japanese Kit-Kats, Shopee Philippines has turned grocery shopping into a discovery experience. Foodies, health-conscious Filipinos, and pasalubong hunters alike now turn to Shopee for food finds that aren't available at the local supermarket — and often at better prices too.`,
    buyingGuide: `**How to shop for food and snacks safely on Shopee Philippines**

**Always check the expiration date listing.** Reputable food sellers on Shopee will display the manufacturing and expiration dates in the product photos or description. For snacks and packaged foods, a remaining shelf life of at least 3–6 months is standard. If the listing doesn't show expiry information, ask the seller directly before purchasing.

**Look for FDA/DA registration for health foods and supplements.** The Philippine Food and Drug Administration (FDA) and Department of Agriculture (DA) regulate food products sold in the Philippines. Processed foods, health supplements, and imported food items should have proper registration. Legit sellers will have this information available.

**Coffee: check if it's freshly roasted or vacuum-sealed.** For specialty coffee beans and ground coffee, freshness matters enormously. Look for sellers who indicate the roast date, and choose vacuum-sealed packaging that extends freshness. Local Philippine coffee from Benguet, Sagada, and Mt. Apo is often significantly cheaper on Shopee than in specialty coffee shops.

**Imported snacks: beware of customs and authenticity.** Some "imported" snacks on Shopee are locally repacked versions of foreign products. Look for sellers who provide photos of actual packaging with foreign language labels, and check reviews mentioning authenticity. Expect slightly longer delivery times for items shipped from abroad.

**Proper packaging matters for the Philippine climate.** The heat and humidity can ruin poorly packaged food during delivery. Look for sellers who describe their packaging (bubble wrap, ice packs for perishables, sealed containers). Read reviews mentioning whether items arrived intact.

**Health food: read the nutritional label photos.** For health-conscious shoppers, always read the actual nutritional information, not just the marketing claims. "Sugar-free" and "low-calorie" labels on Shopee products should be verified against the nutrition facts panel shown in product photos.`,
    faqs: [
      {
        q: 'What local Filipino food products can I buy on Shopee Philippines?',
        a: 'Shopee Philippines is an excellent source for local Filipino food products including: dried mangoes from Cebu, Benguet coffee and strawberry products, Batangas barako coffee, Laguna buko pie, Iloilo biscocho, Pampanga tocino and longganisa, Bacolod chicken inasal marinade, Davao durian products, and various homemade delicacies from sellers across the Philippines. Many local producers sell directly on Shopee, making it easy to support Filipino entrepreneurs.'
      },
      {
        q: 'Is it safe to buy food products on Shopee Philippines?',
        a: 'Yes, buying food on Shopee Philippines is generally safe when you follow these guidelines: (1) Check for FDA registration for processed foods and supplements. (2) Verify expiration dates — ask the seller if not shown. (3) Read reviews about packaging quality and delivery conditions. (4) For perishables, check if the seller uses insulated packaging or ice packs. (5) Stick to sellers with 4.8+ ratings and 100+ completed orders for food items. Avoid sellers with vague product descriptions or no expiry information.'
      },
      {
        q: 'Ano ang mga masarap na pagkain at meryenda na mabibili sa Shopee?',
        a: 'Ang mga pinakasikat na pagkain at meryenda sa Shopee Philippines ay: (1) Dried mango mula Cebu — laging paboritong pasalubong. (2) Japanese at Korean imported snacks — Kit-Kat flavors, Pocky, Pepero, at iba pa. (3) Local coffee — Benguet at Sagada coffee beans. (4) Chili garlic products — sikat na condiment na nagagamit sa lahat. (5) Healthy snacks — granola, mixed nuts, at dried fruits para sa mga health-conscious. Siguraduhing tignan ang expiry date at reviews bago bumili.'
      },
      {
        q: 'Puwede bang mag-order ng pagkain mula sa ibang rehiyon ng Pilipinas sa Shopee?',
        a: 'Oo! Ito nga ang isa sa pinakamahusay na feature ng Shopee Philippines para sa pagkain. Maaari kang mag-order ng: Iloilo kakanin, Cebu lechon marinade, Pampanga tocino, Bacolod products, Davao malagos products, at marami pang local delicacies mula sa iba\'t ibang lalawigan — lahat ay dine-deliver sa buong Pilipinas. Tingnan ang seller location para malaman kung saan nagmula ang produkto, at tanungin ang tungkol sa packaging para sa mahabang biyahe.'
      },
    ],
  },
];

/** Get a category by slug. Returns undefined if not found. */
export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return CATEGORIES.find(c => c.slug === slug);
}

/** Filter shopeeProducts to those matching a category's keywords */
export function getProductsForCategory(slug: string, limit = 24): CMSProduct[] {
  const cat = getCategoryBySlug(slug);
  if (!cat) return [];

  const allKeywords = [...cat.priorityKeywords, ...cat.matchKeywords];

  // Score each product: +2 for priority keyword match, +1 for regular match
  const scored = shopeeProducts
    .filter(p => !p.fieldData._draft && !p.fieldData._archived)
    .map(p => {
      const nameLower = p.fieldData.name.toLowerCase();
      let score = 0;
      for (const kw of cat.priorityKeywords) {
        if (nameLower.includes(kw.toLowerCase())) { score += 2; break; }
      }
      for (const kw of cat.matchKeywords) {
        if (nameLower.includes(kw.toLowerCase())) { score += 1; break; }
      }
      return { product: p, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ product }) => product);
}

/** Count products per category (used for category hub page) */
export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const cat of CATEGORIES) {
    counts[cat.slug] = getProductsForCategory(cat.slug, 999).length;
  }
  return counts;
}
