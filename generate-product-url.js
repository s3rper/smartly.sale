/**
 * Simple script to generate product detail URLs
 * Usage: node generate-product-url.js
 * 
 * This script helps you quickly generate URLs for your Facebook Ads campaigns
 */

const sampleProductData = {
  "item_id": "22057240522",
  "long_link": "https://shopee.ph/universal-link/product/704270867/22057240522?gads_t_sig=VTJGc2RHVmtYMTlxTFVSVVRrdENkVlBXTnFLbGtLY21IOVhMT0xMVGhrdUVEUGtBZldka1I1NVhxdUVsU1EvcENPS2lEaWVWVTRxdXc3MFhxNkhhb1BjYy8wTE9Wa2VkU3VZbWpGdTN2d2trZnNwejFXUHlrWThMTitCT2NiNGwyUGZPUFhYZG9oY1o0VHNSaEVqL2plRmQ2aEhiVVlXdk9ldjhOZ0NXOXhBPQ&utm_campaign=-&utm_content=----&utm_medium=affiliates&utm_source=an_13391000172",
  "product_link": "https://shopee.ph/product/704270867/22057240522",
  "is_free_sample": false,
  "max_commission_rate": "0%",
  "seller_commission_rate": "10%",
  "default_commission_rate": "12.5%",
  "batch_item_for_item_card_full": {
    "itemid": "22057240522",
    "shopid": "704270867",
    "name": "5 in 1 Cute Stationery School Supplies Set Birthday Christmas Gift Ideas Giveaways for kids",
    "image": "ph-11134207-7ra0o-mcg6ku6zzi1d9c",
    "images": [
      "ph-11134207-7ra0o-mcg6ku6zzi1d9c",
      "ph-11134207-7r991-lmmt582otbwv1f",
      "ph-11134207-7r98r-lmmt582nyfap40",
      "ph-11134207-7r98y-lmmt582odvnza9",
      "ph-11134207-81ztc-meselj3ovo5dd0",
      "ph-11134207-7rasg-m8uaex54dnyl51"
    ],
    "currency": "PHP",
    "stock": 586158,
    "status": 1,
    "ctime": 1696829997,
    "sold": 10000,
    "sold_text": "10K+",
    "historical_sold": 10000,
    "historical_sold_text": "10K+",
    "liked": false,
    "liked_count": 1884,
    "view_count": "0",
    "catid": 100638,
    "brand": "",
    "cmt_count": 1804,
    "flag": 196608,
    "cb_option": 0,
    "item_status": "normal",
    "price": "400000",
    "price_min": "400000",
    "price_max": "1300000",
    "price_min_before_discount": "2000000",
    "price_max_before_discount": "10000000",
    "hidden_price_display": "",
    "price_before_discount": "2000000",
    "has_lowest_price_guarantee": false,
    "show_discount": 87,
    "raw_discount": 87,
    "discount": "87%",
    "is_category_failed": false,
    "size_chart": "",
    "tier_variations": [
      {
        "options": [
          "1#Christmas",
          "2#Christmas",
          "3#Christmas",
          "4#Christmas",
          "5#Christmas",
          "1#New 5 in 1",
          "2#New 5 in 1",
          "3#New 5 in 1",
          "4#New 5 in 1",
          "5 in 1 Girl",
          "5 in 1 Astronaut",
          "5 in 1 Children",
          "5 in 1 Rabbit bear",
          "5 in 1 PINK",
          "5 in 1 BLUE",
          "5 in 1 YELLOW",
          "5 in 1 PURPLE",
          "Random 1pc pencil"
        ],
        "images": [
          "ph-11134207-81ztk-mh0ainyil0jxab",
          "ph-11134207-81ztl-mh305bi8g5je9c",
          "ph-11134207-81ztg-mh305cfjg2ksfe",
          "ph-11134207-81ztk-mh305ir60s273a",
          "ph-11134207-81ztm-mh305ozx1ibw36",
          "ph-11134207-7rasc-m9v2nkc99cjo40",
          "ph-11134207-7rasi-m9v2o5p4081wab",
          "ph-11134207-7rase-m9v2oad965zg03",
          "ph-11134207-7rasl-m9v2oby4uxfw39",
          "ph-11134207-7r98s-lmmop8wbyvw108",
          "ph-11134207-7r98r-lmmop8wc0agh44",
          "ph-11134207-7r98q-lmmop8wc1p0xfd",
          "ph-11134207-7r98o-lmmop8wc33ld63",
          "ph-11134207-7rask-m1cjk1cpn7y7d0",
          "ph-11134207-7rasf-m1cjk98a49a105",
          "ph-11134207-7rasb-m1cjk1cpn7y7d0",
          "ph-11134207-7rasf-m1cjkoevwd1bb0",
          "ph-11134207-81ztg-mh1ikkvp7ax43f"
        ],
        "properties": [],
        "name": "Types",
        "type": 0
      }
    ],
    "item_rating": {
      "rating_count": [
        1804,
        22,
        6,
        62,
        125,
        1589
      ],
      "rating_star": 4.802338530066815,
      "rcount_with_context": 208,
      "rcount_with_image": 180
    },
    "item_type": 0,
    "reference_item_id": "",
    "transparent_background_image": "",
    "is_adult": false,
    "badge_icon_type": 0,
    "shopee_verified": true,
    "is_official_shop": false,
    "show_official_shop_label": false,
    "show_shopee_verified_label": true,
    "show_official_shop_label_in_title": false,
    "is_cc_installment_payment_eligible": false,
    "is_non_cc_installment_payment_eligible": false,
    "coin_earn_label": "",
    "show_free_shipping": false,
    "preview_info": null,
    "coin_info": null,
    "exclusive_price_info": null,
    "can_use_bundle_deal": false,
    "bundle_deal_info": null,
    "is_group_buy_item": false,
    "has_group_buy_stock": false,
    "group_buy_info": null,
    "welcome_package_type": 0,
    "welcome_package_info": null,
    "add_on_deal_info": {
      "add_on_deal_id": "373056208257853",
      "add_on_deal_label": "Free Gift",
      "sub_type": 1,
      "status": 1
    },
    "can_use_wholesale": false,
    "is_preferred_plus_seller": false,
    "shop_location": "Obando, Bulacan",
    "has_model_with_available_shopee_stock": false,
    "voucher_info": {
      "promotion_id": "1275118131765248",
      "voucher_code": "WRIT1105",
      "label": "₱5 off"
    },
    "can_use_cod": true,
    "is_on_flash_sale": false,
    "spl_installment_tenure": 0,
    "is_live_streaming_price": false,
    "shop_name": "writing notebook",
    "shop_rating": 4.811168,
    "deep_discount_skin": null,
    "is_mart": false,
    "pack_size": "",
    "overlay_images": [],
    "optimized_names": [],
    "live_stream_session": null,
    "bundle_deal_id": "0"
  },
  "productOfferLink": "https://s.shopee.ph/5L4KlPufIJ"
};

function generateProductUrl(productData, baseUrl = 'https://smartly.sale') {
  const encodedData = encodeURIComponent(JSON.stringify(productData));
  return `${baseUrl}/product-details?data=${encodedData}`;
}

function extractMinimalData(fullData) {
  // Extract only essential fields to make URL shorter
  const product = fullData.batch_item_for_item_card_full;
  return {
    item_id: fullData.item_id,
    productOfferLink: fullData.productOfferLink || fullData.long_link,
    batch_item_for_item_card_full: {
      itemid: product.itemid,
      shopid: product.shopid,
      name: product.name,
      image: product.image,
      images: product.images?.slice(0, 6), // Max 6 images
      price: product.price,
      price_min: product.price_min,
      price_max: product.price_max,
      price_before_discount: product.price_before_discount,
      discount: product.discount,
      stock: product.stock,
      sold_text: product.sold_text,
      item_rating: product.item_rating,
      shop_name: product.shop_name,
      shop_location: product.shop_location,
      shop_rating: product.shop_rating,
      shopee_verified: product.shopee_verified,
      is_official_shop: product.is_official_shop,
      tier_variations: product.tier_variations,
      can_use_cod: product.can_use_cod,
      show_free_shipping: product.show_free_shipping,
      voucher_info: product.voucher_info,
      add_on_deal_info: product.add_on_deal_info
    }
  };
}

// Generate URLs
console.log('\n🎉 Product URL Generator\n');
console.log('=' .repeat(80));

// Full data URL
const fullUrl = generateProductUrl(sampleProductData);
console.log('\n📦 Full Data URL:');
console.log(`Length: ${fullUrl.length} characters`);
console.log(`URL: ${fullUrl.substring(0, 100)}...`);

// Minimal data URL
const minimalData = extractMinimalData(sampleProductData);
const minimalUrl = generateProductUrl(minimalData);
console.log('\n✨ Minimal Data URL (Recommended):');
console.log(`Length: ${minimalUrl.length} characters`);
console.log(`URL: ${minimalUrl.substring(0, 100)}...`);

console.log('\n💡 Tips:');
console.log('- Use the minimal URL for shorter links');
console.log('- Consider using a URL shortener (bit.ly, tinyurl) for social media');
console.log('- Test the URL before using in campaigns');
console.log('- Add UTM parameters for tracking: &utm_source=facebook&utm_campaign=promo1');

console.log('\n📋 Complete URLs saved below:\n');
console.log('FULL URL:');
console.log(fullUrl);
console.log('\nMINIMAL URL:');
console.log(minimalUrl);

console.log('\n' + '='.repeat(80));
console.log('✅ URLs generated successfully!\n');

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateProductUrl, extractMinimalData, sampleProductData };
}
