import { WebflowClient } from 'webflow-api';
import type { CMSProduct } from '../types/product';

const COLLECTION_ID = '69158c209e29b59a86d4b534';

export async function fetchProductsFromWebflow(
  token: string,
  limit = 20,
  offset = 0,
  apiBaseUrl?: string
): Promise<{ items: CMSProduct[] }> {
  const client = new WebflowClient({
    accessToken: token,
    ...(apiBaseUrl && { baseUrl: apiBaseUrl })
  });

  const res = await client.collections.items.listItemsLive(COLLECTION_ID, {
    limit,
    offset
  });

  return res as unknown as { items: CMSProduct[] };
}

export async function fetchProductBySlug(
  slug: string,
  token: string,
  apiBaseUrl?: string
): Promise<CMSProduct | null> {
  const client = new WebflowClient({
    accessToken: token,
    ...(apiBaseUrl && { baseUrl: apiBaseUrl })
  });

  const res = await client.collections.items.listItemsLive(COLLECTION_ID, { limit: 100, offset: 0 });
  const data = res as unknown as { items: CMSProduct[] };
  return data.items?.find(item => item.fieldData.slug === slug) ?? null;
}
