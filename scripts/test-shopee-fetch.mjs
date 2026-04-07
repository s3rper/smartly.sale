// Put your token here if required. Otherwise leave as null.
const AUTH_TOKEN = null;

const listUrl = "https://affiliate.shopee.ph/api/v3/offer/product/list?list_type=0&sort_type=1&page_offset=0&page_limit=50&client_type=1";
const gqlUrl = "https://affiliate.shopee.ph/api/v3/gql?q=productOfferLinks";

const commonHeaders = {
  "Accept": "application/json",
  "Content-Type": "application/json",
  ...(AUTH_TOKEN ? { "Authorization": AUTH_TOKEN } : {})
};

function chunkArray(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const gqlQuery = `
query batchGetProductOfferLink (
  $sourceCaller: SourceCaller!
  $productOfferLinkParams: [ProductOfferLinkParam!]!
  $advancedLinkParams: AdvancedLinkParams
){
  productOfferLinks(
    productOfferLinkParams: $productOfferLinkParams,
    sourceCaller: $sourceCaller,
    advancedLinkParams: $advancedLinkParams
  ) {
    itemId
    shopId
    productOfferLink
  }
}
`;

async function fetchShopeeOffersWithPromoLinks() {
  try {
    console.log('Fetching product list from Shopee affiliate API...');
    const listResp = await fetch(listUrl, { method: "GET", headers: commonHeaders });

    console.log(`List response status: ${listResp.status}`);
    if (!listResp.ok) throw new Error(`List request failed: ${listResp.status} ${listResp.statusText}`);

    const listJson = await listResp.json();
    console.log('List response keys:', Object.keys(listJson));
    if (listJson.data) console.log('data keys:', Object.keys(listJson.data));

    const products = (listJson?.data?.list) ? Array.from(listJson.data.list) : [];
    console.log(`Found ${products.length} products`);

    if (!products.length) {
      console.log('Full response:', JSON.stringify(listJson, null, 2).slice(0, 1000));
      return [];
    }

    // Show first product structure
    console.log('\nFirst product keys:', Object.keys(products[0]));
    const first = products[0];
    console.log('item_id:', first.item_id);
    console.log('name:', first.batch_item_for_item_card_full?.name);
    console.log('price:', first.batch_item_for_item_card_full?.price);
    console.log('images:', first.batch_item_for_item_card_full?.images?.slice(0, 1));

    const productParams = products.map(p => {
      const shopId = p?.batch_item_for_item_card_full?.shopid ?? p?.shopid ?? p?.shop_id ?? null;
      return { itemId: Number(p.item_id), shopId: Number(shopId), trace: p.trace ?? "" };
    }).filter(x => Number.isFinite(x.itemId) && Number.isFinite(x.shopId));

    console.log(`\nFetching promo links for ${productParams.length} products in batches of 10...`);

    const batches = chunkArray(productParams, 10);
    const linkMap = new Map();

    for (const [i, batch] of batches.entries()) {
      const body = {
        operationName: "batchGetProductOfferLink",
        query: gqlQuery,
        variables: {
          productOfferLinkParams: batch,
          sourceCaller: "WEB_SITE_CALLER",
          advancedLinkParams: { subId1: "", subId2: "", subId3: "", subId4: "", subId5: "" }
        }
      };

      const resp = await fetch(gqlUrl, { method: "POST", headers: commonHeaders, body: JSON.stringify(body) });
      console.log(`  Batch ${i + 1}/${batches.length} status: ${resp.status}`);

      if (!resp.ok) { console.warn(`  Batch failed, skipping`); continue; }

      const json = await resp.json();
      const returned = json?.data?.productOfferLinks ?? [];
      returned.forEach(r => linkMap.set(`${r.itemId}:${r.shopId}`, r.productOfferLink));

      await new Promise(resolve => setTimeout(resolve, 150));
    }

    const productsWithLinks = products.map(p => {
      const shopId = p?.batch_item_for_item_card_full?.shopid ?? p?.shopid ?? p?.shop_id ?? null;
      const key = `${Number(p.item_id)}:${Number(shopId)}`;
      return { ...p, productOfferLink: linkMap.get(key) ?? null };
    });

    console.log('\n=== RESULTS ===');
    productsWithLinks.slice(0, 5).forEach((p, i) => {
      const card = p.batch_item_for_item_card_full;
      console.log(`\n${i + 1}. ${card?.name}`);
      console.log(`   item_id=${p.item_id} shop_id=${card?.shopid}`);
      console.log(`   price=₱${((card?.price ?? 0) / 100000).toFixed(2)}`);
      console.log(`   sold=${card?.historical_sold}`);
      console.log(`   rating=${card?.item_rating?.rating_star?.toFixed(1)}`);
      console.log(`   link=${p.productOfferLink}`);
    });

    return productsWithLinks;
  } catch (err) {
    console.error("Error:", err.message);
    throw err;
  }
}

fetchShopeeOffersWithPromoLinks().then(list => {
  console.log(`\n✅ Successfully fetched ${list.length} products with ${list.filter(p => p.productOfferLink).length} promo links`);
}).catch(e => {
  console.error('❌ Failed:', e.message);
  process.exit(1);
});
