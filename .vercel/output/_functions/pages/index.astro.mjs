import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, aj as Fragment, u as unescapeHTML } from '../chunks/astro/server_QTRnay6T.mjs';
import 'kleur/colors';
import { $ as $$Main } from '../chunks/main_U5mpiJ65.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { ShoppingBag, Package, Eye, Store, MapPin, Star, ExternalLink, CheckCircle, Shield, Zap, ThumbsUp, Search, ShoppingCart, Users, TrendingUp, Mail, ArrowRight, Check } from 'lucide-react';
import { b as baseUrl } from '../chunks/base-url_Cwqyomll.mjs';
import { useState, useEffect, useRef } from 'react';
import { t as transformCMSProduct } from '../chunks/product_DJYQ59Q4.mjs';
import { f as fetchProductsFromWebflow } from '../chunks/products_BcPmpf2E.mjs';
export { renderers } from '../renderers.mjs';

const Hero = () => {
  return /* @__PURE__ */ jsxs(
    "section",
    {
      className: "relative bg-gradient-to-br from-brand/10 via-background to-background py-20 md:py-32 overflow-hidden",
      style: { minHeight: "560px", contain: "layout style paint" },
      children: [
        /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "text-center space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center space-x-2 bg-brand/10 text-brand px-4 py-2 rounded-full text-sm font-semibold border border-brand/20", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xl", role: "img", "aria-label": "fire", children: "🔥" }),
            /* @__PURE__ */ jsx("span", { children: "Trending Now in the Philippines" })
          ] }),
          /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-6xl font-bold text-foreground leading-tight", children: [
            "Discover Viral ",
            /* @__PURE__ */ jsx("span", { className: "text-brand", children: "Shopee Finds" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed", children: "From budget gadgets to must-have fashion items, we curate the best trending products that Filipinos are loving right now. Shop smart, save more!" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-center items-center gap-3 pt-4 mb-4", children: [
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: `${baseUrl}/products`,
                className: "inline-flex items-center justify-center px-10 py-4 bg-brand text-white font-bold rounded-full hover:bg-[#B34700] transition-all text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5",
                children: [
                  /* @__PURE__ */ jsx(ShoppingBag, { className: "w-5 h-5 mr-2" }),
                  "Shop Now"
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: `${baseUrl}/blog`,
                className: "inline-flex items-center justify-center px-8 py-4 bg-background text-foreground font-semibold rounded-full border border-border hover:border-brand hover:text-brand transition-all text-lg",
                children: "Browse Guides"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto pt-10", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl md:text-4xl font-bold text-brand", children: "500+" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm md:text-base text-muted-foreground mt-1", children: "Products Reviewed" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl md:text-4xl font-bold text-brand", children: "50K+" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm md:text-base text-muted-foreground mt-1", children: "Happy Shoppers" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl md:text-4xl font-bold text-brand", children: "100%" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm md:text-base text-muted-foreground mt-1", children: "Verified Finds" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pt-4 text-sm text-muted-foreground flex flex-wrap justify-center items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { children: "🎵 As seen on TikTok" }),
            /* @__PURE__ */ jsx("span", { className: "text-border", children: "•" }),
            /* @__PURE__ */ jsx("span", { children: "📱 Shopee PH Affiliate Partner" }),
            /* @__PURE__ */ jsx("span", { className: "text-border", children: "•" }),
            /* @__PURE__ */ jsx("span", { children: "🇵🇭 Made for Filipinos" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl -z-10", "aria-hidden": "true" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl -z-10", "aria-hidden": "true" }),
        /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/3 rounded-full blur-3xl -z-10", "aria-hidden": "true" })
      ]
    }
  );
};

const FeaturedProducts = ({ initialProducts }) => {
  const [products, setProducts] = useState(() => {
    if (initialProducts && initialProducts.length > 0) {
      return initialProducts.filter((item) => !item.fieldData._draft && !item.fieldData._archived).map((item) => transformCMSProduct(item));
    }
    return [];
  });
  const [loading, setLoading] = useState(() => !initialProducts || initialProducts.length === 0);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts((prev) => [...prev].sort(() => Math.random() - 0.5));
      return;
    }
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${baseUrl}/api/cms/products?limit=20`);
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (!data.items || !Array.isArray(data.items)) {
          throw new Error("Invalid data structure received from API");
        }
        const transformedProducts = data.items.filter((item) => !item.fieldData._draft && !item.fieldData._archived).map((item) => transformCMSProduct(item));
        setProducts(transformedProducts.sort(() => Math.random() - 0.5));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  if (loading) {
    return /* @__PURE__ */ jsx(
      "section",
      {
        id: "products",
        className: "py-16 bg-background",
        style: { minHeight: "800px", contain: "layout style" },
        children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
            /* @__PURE__ */ jsx("div", { className: "h-10 bg-muted rounded w-64 mx-auto mb-4 animate-pulse" }),
            /* @__PURE__ */ jsx("div", { className: "h-6 bg-muted rounded w-96 mx-auto animate-pulse" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: [...Array(8)].map((_, i) => /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl shadow-lg overflow-hidden border border-border", children: [
            /* @__PURE__ */ jsx("div", { className: "aspect-square bg-muted animate-pulse" }),
            /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-3", children: [
              /* @__PURE__ */ jsx("div", { className: "h-4 bg-muted rounded w-3/4 animate-pulse" }),
              /* @__PURE__ */ jsx("div", { className: "h-4 bg-muted rounded w-full animate-pulse" }),
              /* @__PURE__ */ jsx("div", { className: "h-4 bg-muted rounded w-1/2 animate-pulse" }),
              /* @__PURE__ */ jsx("div", { className: "h-10 bg-muted rounded-full animate-pulse" })
            ] })
          ] }, i)) })
        ] })
      }
    );
  }
  if (error) {
    return /* @__PURE__ */ jsx("section", { id: "products", className: "py-16 bg-background", style: { minHeight: "400px" }, children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold text-foreground mb-6", children: [
        "Featured ",
        /* @__PURE__ */ jsx("span", { className: "text-brand", children: "Viral Products" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-2xl mx-auto", children: [
        /* @__PURE__ */ jsx("p", { className: "text-destructive text-lg mb-4", children: error }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm mb-4", children: "Please make sure:" }),
        /* @__PURE__ */ jsxs("ul", { className: "text-left text-muted-foreground text-sm space-y-2 max-w-md mx-auto", children: [
          /* @__PURE__ */ jsx("li", { children: "• Products are added to the Affiliate Products CMS collection" }),
          /* @__PURE__ */ jsx("li", { children: "• Products are published (not in draft mode)" }),
          /* @__PURE__ */ jsx("li", { children: "• API credentials are properly configured" })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => window.location.reload(),
            className: "mt-6 px-6 py-3 bg-brand text-white font-bold rounded-full hover:bg-brand/90 transition-all",
            children: "Try Again"
          }
        )
      ] })
    ] }) }) });
  }
  if (products.length === 0) {
    return /* @__PURE__ */ jsx("section", { id: "products", className: "py-16 bg-background", style: { minHeight: "400px" }, children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold text-foreground mb-6", children: [
        "Featured ",
        /* @__PURE__ */ jsx("span", { className: "text-brand", children: "Viral Products" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-muted/50 rounded-lg p-12 mb-6", children: [
          /* @__PURE__ */ jsx(Package, { className: "w-16 h-16 text-muted-foreground mx-auto mb-4" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground mb-2", children: "No products available yet!" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Products will appear here once they're added to the Affiliate Products CMS collection and published." })
        ] }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: `${baseUrl}/about`,
            className: "inline-flex items-center justify-center px-8 py-4 bg-brand text-white font-bold rounded-full hover:bg-brand/90 transition-all",
            children: "Learn More About Us"
          }
        )
      ] })
    ] }) }) });
  }
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "products",
      className: "py-16 bg-background",
      style: { minHeight: "800px", contain: "layout style" },
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold text-foreground mb-6", children: [
            "Featured ",
            /* @__PURE__ */ jsx("span", { className: "text-brand", children: "Viral Products" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg max-w-2xl mx-auto", children: "Handpicked trending items that are flying off the shelves. Don't miss out!" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12", children: products.slice(0, 8).map((product) => {
          const mainImage = product.images[0] || "https://cdn.prod.website-files.com/662c296bd4d3a8028c713c69/691e8c7794ae6bf5912f6ad7_11329060.png";
          const hasDiscount = product.discount && product.discount.trim() !== "";
          const hasShopInfo = product.shopName || product.shopLocation;
          const imageCount = product.images.length;
          const videoCount = product.videos.length;
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: "bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-border group",
              style: { willChange: "transform" },
              children: [
                /* @__PURE__ */ jsxs("div", { className: "relative aspect-square overflow-hidden", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: mainImage,
                      alt: product.name,
                      className: "product-image w-full h-full object-cover group-hover:scale-110 transition-transform duration-300",
                      loading: "lazy",
                      width: "400",
                      height: "400",
                      decoding: "async"
                    }
                  ),
                  hasDiscount && /* @__PURE__ */ jsx("div", { className: "absolute top-3 right-3 bg-brand text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg", children: product.discount }),
                  product.stock && /* @__PURE__ */ jsxs("div", { className: "absolute top-3 left-3 bg-background/90 text-foreground text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(Package, { className: "w-3 h-3" }),
                    product.stock
                  ] }),
                  (imageCount > 1 || videoCount > 0) && /* @__PURE__ */ jsxs("div", { className: "absolute bottom-3 left-3 flex gap-2", children: [
                    imageCount > 1 && /* @__PURE__ */ jsxs("div", { className: "bg-background/90 text-foreground text-xs px-2 py-1 rounded flex items-center gap-1", children: [
                      "📷 ",
                      imageCount
                    ] }),
                    videoCount > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-background/90 text-foreground text-xs px-2 py-1 rounded flex items-center gap-1", children: [
                      "🎥 ",
                      videoCount
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-white font-bold flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Eye, { className: "w-5 h-5" }),
                    "View Details"
                  ] }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-3", children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground line-clamp-2 product-card-title", children: product.name }),
                  hasShopInfo && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 text-xs text-muted-foreground", children: [
                    product.shopName && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsx(Store, { className: "w-3 h-3" }),
                      /* @__PURE__ */ jsx("span", { className: "truncate", children: product.shopName })
                    ] }),
                    product.shopLocation && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3" }),
                      /* @__PURE__ */ jsx("span", { className: "truncate", children: product.shopLocation })
                    ] })
                  ] }),
                  product.shopRating && product.shopRating > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1", children: [
                    /* @__PURE__ */ jsx(Star, { className: "w-4 h-4 fill-brand text-brand" }),
                    /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-foreground", children: product.shopRating.toFixed(1) }),
                    product.soldText && /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
                      "(",
                      product.soldText,
                      ")"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-2", children: /* @__PURE__ */ jsxs("span", { className: "text-2xl font-bold text-brand", children: [
                    product.currency,
                    product.price
                  ] }) }),
                  product.soldText && (!product.shopRating || product.shopRating === 0) && /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(Package, { className: "w-3 h-3" }),
                    product.soldText
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "a",
                      {
                        href: `${baseUrl}/product/${product.slug}`,
                        className: "flex-1 bg-background text-foreground text-center font-bold py-3 rounded-full border-2 border-brand hover:bg-brand/10 transition-colors text-sm",
                        children: "View Details"
                      }
                    ),
                    product.affiliateLink && /* @__PURE__ */ jsxs(
                      "a",
                      {
                        href: product.affiliateLink,
                        target: "_blank",
                        rel: "noopener noreferrer nofollow",
                        className: "flex-1 bg-brand text-white text-center font-bold py-3 rounded-full hover:bg-brand/90 transition-colors flex items-center justify-center gap-1 text-sm",
                        onClick: (e) => e.stopPropagation(),
                        children: [
                          "Buy Now",
                          /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3" })
                        ]
                      }
                    )
                  ] })
                ] })
              ]
            },
            product.id
          );
        }) }),
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-4", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `${baseUrl}/products`,
              className: "inline-flex items-center justify-center px-12 py-4 bg-background text-foreground font-bold rounded-full border-2 border-brand hover:bg-brand/10 transition-all shadow-md hover:shadow-lg text-lg margin-bottom-16",
              children: "View All Products"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm mt-4", children: "Discover more amazing deals and trending products" })
        ] })
      ] })
    }
  );
};

const useScrollAnimation = (threshold = 0.1) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, isVisible };
};

const WhyChooseUs = () => {
  const { ref, isVisible } = useScrollAnimation();
  const features = [
    {
      icon: /* @__PURE__ */ jsx(CheckCircle, { className: "w-12 h-12 text-brand" }),
      title: "Curated Selection",
      description: "We handpick only the best and most viral products from Shopee Philippines, saving you time from endless scrolling."
    },
    {
      icon: /* @__PURE__ */ jsx(Shield, { className: "w-12 h-12 text-brand" }),
      title: "Verified Reviews",
      description: "Every product is backed by real customer reviews and ratings. Shop with confidence knowing others loved it first."
    },
    {
      icon: /* @__PURE__ */ jsx(Zap, { className: "w-12 h-12 text-brand" }),
      title: "Daily Updates",
      description: "Stay ahead of the trends with daily product recommendations and flash deals you won't find anywhere else."
    },
    {
      icon: /* @__PURE__ */ jsx(ThumbsUp, { className: "w-12 h-12 text-brand" }),
      title: "Best Price Guarantee",
      description: "We track prices and alert you to the best deals, ensuring you always get the most value for your money."
    }
  ];
  return /* @__PURE__ */ jsx("section", { className: "py-16 bg-muted", ref, children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: `text-center mb-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`, children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-foreground mb-6", children: "Why Choose smartly.sale?" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: "Your trusted partner in discovering the best Shopee deals and trending products" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8", children: features.map((feature, index) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: `bg-background p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center ${isVisible ? `animate-fade-in-up animate-delay-${(index + 1) * 100}` : "opacity-0"}`,
        children: [
          /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-4", children: feature.icon }),
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-foreground mb-4", children: feature.title }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: feature.description })
        ]
      },
      index
    )) })
  ] }) });
};

const HowItWorks = () => {
  const { ref, isVisible } = useScrollAnimation();
  const steps = [
    {
      icon: /* @__PURE__ */ jsx(Search, { className: "w-12 h-12", strokeWidth: 2.5 }),
      step: "01",
      title: "Browse Products",
      description: "Explore our curated collection of trending and viral products"
    },
    {
      icon: /* @__PURE__ */ jsx(Eye, { className: "w-12 h-12", strokeWidth: 2.5 }),
      step: "02",
      title: "Check Details",
      description: "View product images, prices, ratings, and shop information"
    },
    {
      icon: /* @__PURE__ */ jsx(ShoppingCart, { className: "w-12 h-12", strokeWidth: 2.5 }),
      step: "03",
      title: "Buy on Shopee",
      description: "Click 'Buy Now' to purchase directly from trusted Shopee sellers"
    },
    {
      icon: /* @__PURE__ */ jsx(ThumbsUp, { className: "w-12 h-12", strokeWidth: 2.5 }),
      step: "04",
      title: "Enjoy Your Find",
      description: "Receive your product and share your experience with others"
    }
  ];
  return /* @__PURE__ */ jsx("section", { className: "py-16 bg-background", ref, children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: `text-center mb-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`, children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold text-foreground mb-6", children: [
        "How ",
        /* @__PURE__ */ jsx("span", { className: "text-brand", children: "It Works" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg max-w-2xl mx-auto", children: "Finding and buying viral products has never been easier" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative", children: steps.map((item, index) => /* @__PURE__ */ jsxs("div", { className: `relative ${isVisible ? `animate-fade-in-up animate-delay-${(index + 1) * 100}` : "opacity-0"}`, children: [
      index < steps.length - 1 && /* @__PURE__ */ jsx("div", { className: "hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-brand to-brand/20 -z-10" }),
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative inline-flex items-center justify-center w-28 h-28 bg-brand rounded-full text-white mb-6 shadow-xl hover:shadow-2xl transition-shadow duration-300", children: [
          /* @__PURE__ */ jsx("div", { className: "relative z-10", children: item.icon }),
          /* @__PURE__ */ jsx("div", { className: "absolute -top-2 -right-2 w-12 h-12 bg-foreground rounded-full flex items-center justify-center text-white font-bold text-base shadow-lg border-4 border-background z-20", children: item.step })
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-foreground mb-4", children: item.title }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: item.description })
      ] })
    ] }, index)) })
  ] }) });
};

const TrustIndicators = () => {
  const { ref, isVisible } = useScrollAnimation();
  const stats = [
    {
      icon: /* @__PURE__ */ jsx(Users, { className: "w-8 h-8" }),
      value: "50K+",
      label: "Happy Shoppers",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: /* @__PURE__ */ jsx(ShoppingBag, { className: "w-8 h-8" }),
      value: "500+",
      label: "Products Reviewed",
      color: "from-brand to-orange-600"
    },
    {
      icon: /* @__PURE__ */ jsx(Star, { className: "w-8 h-8" }),
      value: "4.9/5",
      label: "Average Rating",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: /* @__PURE__ */ jsx(TrendingUp, { className: "w-8 h-8" }),
      value: "100%",
      label: "Verified Finds",
      color: "from-green-500 to-green-600"
    }
  ];
  return /* @__PURE__ */ jsxs("section", { className: "py-16 bg-gradient-to-br from-brand/5 to-background relative overflow-hidden", ref, children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl -z-10", "aria-hidden": "true" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl -z-10", "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: `text-center mb-12 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`, children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold text-foreground mb-6", children: [
          "Trusted by ",
          /* @__PURE__ */ jsx("span", { className: "text-brand", children: "Thousands" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg max-w-2xl mx-auto", children: "Join our growing community of smart shoppers across the Philippines" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-6", children: stats.map((stat, index) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: `bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-border text-center group hover:scale-105 ${isVisible ? `animate-fade-in-up animate-delay-${(index + 1) * 100}` : "opacity-0"}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: `w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-white mb-4 mx-auto group-hover:rotate-6 transition-transform duration-300`, children: stat.icon }),
            /* @__PURE__ */ jsx("div", { className: "text-3xl md:text-4xl font-bold text-foreground mb-3", children: stat.value }),
            /* @__PURE__ */ jsx("div", { className: "text-sm md:text-base text-muted-foreground", children: stat.label })
          ]
        },
        index
      )) }),
      /* @__PURE__ */ jsx("div", { className: "mt-12 text-center", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center space-x-2 bg-card rounded-full px-6 py-3 shadow-lg border border-border", children: [
        /* @__PURE__ */ jsx("div", { className: "flex -space-x-2", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsx(
          "div",
          {
            className: "w-8 h-8 rounded-full bg-gradient-to-br from-brand to-orange-600 border-2 border-background flex items-center justify-center text-white text-xs font-bold",
            children: String.fromCharCode(64 + i)
          },
          i
        )) }),
        /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold text-foreground", children: "2,500+" }),
          " joined this week"
        ] })
      ] }) })
    ] })
  ] });
};

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
    }, 3e3);
  };
  return /* @__PURE__ */ jsxs("section", { className: "py-16 bg-brand relative overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl", "aria-hidden": "true" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl", "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6", children: /* @__PURE__ */ jsx(Mail, { className: "w-8 h-8 text-white" }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-white mb-6", children: "Never Miss a Viral Deal!" }),
        /* @__PURE__ */ jsx("p", { className: "text-white text-lg max-w-2xl mx-auto", children: "Get the hottest Shopee finds and exclusive deals delivered straight to your inbox. Join 10,000+ smart shoppers today!" })
      ] }),
      !submitted ? /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "max-w-2xl mx-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              placeholder: "Enter your email address",
              required: true,
              className: "flex-1 px-6 py-4 rounded-full bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg mb-4 sm:mb-0"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              style: { backgroundColor: "var(--brand-orange)", color: "#ffffff" },
              className: "px-8 py-4 font-bold rounded-full hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl group",
              children: [
                "Subscribe",
                /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5 group-hover:translate-x-1 transition-transform" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-white text-sm text-center", style: { marginTop: "16px" }, children: "🔒 We respect your privacy. Unsubscribe anytime." })
      ] }) : /* @__PURE__ */ jsx("div", { className: "max-w-2xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4", children: /* @__PURE__ */ jsx(Check, { className: "w-8 h-8 text-brand" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-white mb-4", children: "You're All Set! 🎉" }),
        /* @__PURE__ */ jsx("p", { className: "text-white", children: "Check your email to confirm your subscription and start receiving exclusive deals." })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mt-12", children: [
        { emoji: "⚡", text: "Flash Deals First" },
        { emoji: "🎁", text: "Exclusive Discounts" },
        { emoji: "📱", text: "Weekly Roundups" }
      ].map((benefit, index) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-black/30 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20",
          children: [
            /* @__PURE__ */ jsx("div", { className: "text-3xl mb-4", children: benefit.emoji }),
            /* @__PURE__ */ jsx("div", { className: "text-white font-semibold", children: benefit.text })
          ]
        },
        index
      )) })
    ] })
  ] });
};

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a, _b;
const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const pageTitle = "smartly.sale - Best Shopee Deals & Viral Products Philippines 2025";
  const pageDescription = "Discover trending Shopee products, viral finds, budget gadgets, and exclusive deals in the Philippines. Smart shopping made easy with curated reviews and affiliate links.";
  let initialProducts = [];
  try {
    const runtime = Astro2.locals?.runtime;
    const token = runtime?.env?.WEBFLOW_CMS_SITE_API_TOKEN || "4ef8f1b1fec9c33d3c8dd01de18ae1e5aaa91fbedd605fdd5dd8a0fe99ba43b7";
    if (token) {
      const apiBaseUrl = runtime?.env?.WEBFLOW_API_HOST || "https://api-cdn.webflow.com/v2";
      const data = await fetchProductsFromWebflow(token, 20, 0, apiBaseUrl);
      initialProducts = data.items || [];
    }
  } catch (_e) {
  }
  const featuredForSchema = initialProducts.filter((item) => !item.fieldData._draft && !item.fieldData._archived).slice(0, 8).map((item, idx) => {
    const p = transformCMSProduct(item);
    return {
      "@type": "ListItem",
      "position": idx + 1,
      "url": `https://smartly.sale/product/${p.slug}`,
      "name": p.name
    };
  });
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "smartly.sale",
    "url": "https://smartly.sale",
    "description": pageDescription,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://smartly.sale/products?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };
  const itemListSchema = featuredForSchema.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Featured Viral Products",
    "description": "Handpicked trending Shopee products in the Philippines",
    "url": "https://smartly.sale/#products",
    "numberOfItems": featuredForSchema.length,
    "itemListElement": featuredForSchema
  } : null;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, { "title": pageTitle, "description": pageDescription, "ogImage": "/og-image.jpg" }, { "default": async ($$result2) => renderTemplate`   ${renderComponent($$result2, "Hero", Hero, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/kirbydimsontompong/smartly.sale/src/components/Hero", "client:component-export": "default" })}  ${renderComponent($$result2, "FeaturedProducts", FeaturedProducts, { "initialProducts": initialProducts, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/kirbydimsontompong/smartly.sale/src/components/FeaturedProducts", "client:component-export": "default" })}  ${renderComponent($$result2, "WhyChooseUs", WhyChooseUs, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/kirbydimsontompong/smartly.sale/src/components/WhyChooseUs", "client:component-export": "default" })}  ${renderComponent($$result2, "HowItWorks", HowItWorks, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/kirbydimsontompong/smartly.sale/src/components/HowItWorks", "client:component-export": "default" })}  ${renderComponent($$result2, "TrustIndicators", TrustIndicators, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/kirbydimsontompong/smartly.sale/src/components/TrustIndicators", "client:component-export": "default" })}  ${renderComponent($$result2, "Newsletter", Newsletter, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/kirbydimsontompong/smartly.sale/src/components/Newsletter", "client:component-export": "default" })} `, "head": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head" }, { "default": async ($$result3) => renderTemplate(_b || (_b = __template([' <script type="application/ld+json">', "</script> ", ""])), unescapeHTML(JSON.stringify(websiteSchema)), itemListSchema && renderTemplate(_a || (_a = __template(['<script type="application/ld+json">', "</script>"])), unescapeHTML(JSON.stringify(itemListSchema)))) })}` })}`;
}, "/Users/kirbydimsontompong/smartly.sale/src/pages/index.astro", void 0);
const $$file = "/Users/kirbydimsontompong/smartly.sale/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
