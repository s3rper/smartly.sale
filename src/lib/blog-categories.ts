import type { BlogCategory } from '../types/blog';

/** Blog categories — extracted to its own module so client components
 *  can import it without pulling in the heavy blog-posts.json data. */
export const blogCategories: BlogCategory[] = [
  { slug: 'product-reviews', name: 'Product Reviews', description: 'In-depth reviews of trending Shopee products' },
  { slug: 'buying-guides', name: 'Buying Guides', description: 'Expert guides to help you make smart purchases' },
  { slug: 'tech-gadgets', name: 'Tech & Gadgets', description: 'Latest tech products and gadget reviews' },
  { slug: 'home-living', name: 'Home & Living', description: 'Products to enhance your home and lifestyle' },
  { slug: 'fashion-beauty', name: 'Fashion & Beauty', description: 'Trending fashion items and beauty products' },
  { slug: 'deals-steals', name: 'Deals & Steals', description: 'Best deals and discounts on Shopee' },
  { slug: 'gaming-deals', name: 'Gaming Deals', description: 'Gaming products, deals, and giveaways' },
  { slug: 'gaming-guides', name: 'Gaming Guides', description: 'Tips and strategies for gamers' },
  { slug: 'gaming-news', name: 'Gaming News', description: 'Latest gaming news and releases' },
  { slug: 'mobile-gaming', name: 'Mobile Gaming', description: 'Mobile game reviews and recommendations' },
  { slug: 'giveaways-contests', name: 'Giveaways & Contests', description: 'Active giveaways and contest opportunities' },
  { slug: 'home-organization', name: 'Home Organization', description: 'Organization tips and storage solutions' },
  { slug: 'kitchen-hacks', name: 'Kitchen Hacks', description: 'Time-saving kitchen tips and gadgets' },
  { slug: 'productivity-tips', name: 'Productivity Tips', description: 'Boost your productivity and focus' },
  { slug: 'budget-shopping', name: 'Budget Shopping', description: 'Smart shopping strategies and money-saving tips' },
  { slug: 'sustainability', name: 'Sustainability', description: 'Eco-friendly products and sustainable shopping' },
  { slug: 'smart-home', name: 'Smart Home', description: 'Smart home gadgets and automation' },
  { slug: 'shopping-tips', name: 'Shopping Tips', description: 'Expert shopping strategies and hacks' },
  { slug: 'fashion-style', name: 'Fashion & Style', description: 'Fashion trends and styling guides' },
  { slug: 'beauty-wellness', name: 'Beauty & Wellness', description: 'Beauty products and wellness essentials' },
  { slug: 'local-products', name: 'Local Products', description: 'Support Filipino artisans and local brands' },
];
