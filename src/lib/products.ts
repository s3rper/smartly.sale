import { shopeeProducts } from './shopee-loader';
import type { CMSProduct } from '../types/product';

export async function fetchProductsFromWebflow(
  _token?: string,
  limit = 20,
  offset = 0,
  _apiBaseUrl?: string
): Promise<{ items: CMSProduct[] }> {
  return { items: shopeeProducts.slice(offset, offset + limit) };
}

export async function fetchProductBySlug(
  slug: string,
  _token?: string,
  _apiBaseUrl?: string
): Promise<CMSProduct | null> {
  return shopeeProducts.find(p => p.fieldData.slug === slug) ?? null;
}
