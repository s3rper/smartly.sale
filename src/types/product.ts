// CMS Product Type based on Webflow Affiliate Products collection
export interface CMSProduct {
  id: string;
  fieldData: {
    name: string;
    slug: string;
    // Images (up to 10)
    'image-1'?: { url: string; alt?: string; fileId?: string };
    'image-2'?: { url: string; alt?: string; fileId?: string };
    'image-3'?: { url: string; alt?: string; fileId?: string };
    'image-4'?: { url: string; alt?: string; fileId?: string };
    'image-5'?: { url: string; alt?: string; fileId?: string };
    'image-6'?: { url: string; alt?: string; fileId?: string };
    'image-7'?: { url: string; alt?: string; fileId?: string };
    'image-8'?: { url: string; alt?: string; fileId?: string };
    'image-9'?: { url: string; alt?: string; fileId?: string };
    'image-10'?: { url: string; alt?: string; fileId?: string };
    // Videos (up to 11)
    'video-1-url'?: string;
    'video-2-url'?: string;
    'video-3-url'?: string;
    'video-4-url'?: string;
    'video-5-url'?: string;
    'video-6-url'?: string;
    'video-7-url'?: string;
    'video-8-url'?: string;
    'video-9-url'?: string;
    'video-10-url'?: string;
    'video-11-url'?: string;
    // Pricing & Stock
    currency?: string;
    price?: string;
    discount?: string;
    stock?: string;
    'sold-text'?: string;
    // Shop Details
    'shop-name'?: string;
    'shop-location'?: string;
    'shop-rating'?: number;
    'shop-rating-count'?: number;
    // Affiliate Link - can be string or object with url property
    'product-offer-link'?: string | { url: string };
    // Meta
    _archived?: boolean;
    _draft?: boolean;
    'created-on'?: string;
    'updated-on'?: string;
    'published-on'?: string;
  };
}

// Product type for UI components
export interface Product {
  id: string;
  name: string;
  slug: string;
  images: string[];
  videos: string[];
  price: string;
  currency: string;
  discount?: string;
  stock?: string;
  soldText?: string;
  shopName?: string;
  shopLocation?: string;
  shopRating?: number;
  shopRatingCount?: number;
  affiliateLink?: string;
  createdOn?: string;
  updatedOn?: string;
  publishedOn?: string;
}

// Helper function to transform CMS product to UI product
export function transformCMSProduct(cmsProduct: CMSProduct): Product {
  const images: string[] = [];
  const videos: string[] = [];

  // Collect all images and remove duplicates
  const seenImages = new Set<string>();
  for (let i = 1; i <= 10; i++) {
    const imageKey = `image-${i}` as keyof typeof cmsProduct.fieldData;
    const image = cmsProduct.fieldData[imageKey];
    if (image && typeof image === 'object' && 'url' in image) {
      // Only add if we haven't seen this URL before
      if (!seenImages.has(image.url)) {
        images.push(image.url);
        seenImages.add(image.url);
      }
    }
  }

  // Collect all videos and remove duplicates
  const seenVideos = new Set<string>();
  for (let i = 1; i <= 11; i++) {
    const videoKey = `video-${i}-url` as keyof typeof cmsProduct.fieldData;
    const video = cmsProduct.fieldData[videoKey];
    if (video && typeof video === 'string') {
      // Only add if we haven't seen this URL before
      if (!seenVideos.has(video)) {
        videos.push(video);
        seenVideos.add(video);
      }
    }
  }

  // Handle affiliate link - can be string or object with url property
  let affiliateLink: string | undefined;
  const linkField = cmsProduct.fieldData['product-offer-link'];
  if (linkField) {
    if (typeof linkField === 'string') {
      affiliateLink = linkField;
    } else if (typeof linkField === 'object' && 'url' in linkField) {
      affiliateLink = linkField.url;
    }
  }

  return {
    id: cmsProduct.id,
    name: cmsProduct.fieldData.name,
    slug: cmsProduct.fieldData.slug,
    images,
    videos,
    price: cmsProduct.fieldData.price || '₱0',
    currency: cmsProduct.fieldData.currency || '₱',
    discount: cmsProduct.fieldData.discount,
    stock: cmsProduct.fieldData.stock,
    soldText: cmsProduct.fieldData['sold-text'],
    shopName: cmsProduct.fieldData['shop-name'],
    shopLocation: cmsProduct.fieldData['shop-location'],
    shopRating: cmsProduct.fieldData['shop-rating'],
    shopRatingCount: cmsProduct.fieldData['shop-rating-count'],
    affiliateLink,
    createdOn: cmsProduct.fieldData['created-on'],
    updatedOn: cmsProduct.fieldData['updated-on'],
    publishedOn: cmsProduct.fieldData['published-on']
  };
}

// Helper to get all images as array (with deduplication)
export function getAllImages(product: CMSProduct): string[] {
  const images: string[] = [];
  const seen = new Set<string>();
  
  for (let i = 1; i <= 10; i++) {
    const key = `image-${i}` as keyof typeof product.fieldData;
    const img = product.fieldData[key];
    if (img && typeof img === 'object' && 'url' in img) {
      if (!seen.has(img.url)) {
        images.push(img.url);
        seen.add(img.url);
      }
    }
  }
  return images;
}

// Helper to get all videos as array (with deduplication)
export function getAllVideos(product: CMSProduct): string[] {
  const videos: string[] = [];
  const seen = new Set<string>();
  
  for (let i = 1; i <= 11; i++) {
    const key = `video-${i}-url` as keyof typeof product.fieldData;
    const video = product.fieldData[key];
    if (video && typeof video === 'string') {
      if (!seen.has(video)) {
        videos.push(video);
        seen.add(video);
      }
    }
  }
  return videos;
}
