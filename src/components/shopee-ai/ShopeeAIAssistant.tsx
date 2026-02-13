import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Send, Loader2, ShoppingBag, Gift, Smartphone, Home, TrendingUp, Sparkles } from 'lucide-react';
import { baseUrl } from '../../lib/base-url';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  products?: Product[];
  showSuggestions?: boolean; // Flag to show suggestions after this message
}

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  shopeeLink: string;
  whyRecommend: string;
  cmsOfferLink?: string; // CMS product offer link
}

const suggestedMessages = [
  {
    emoji: '💝',
    text: 'I need a birthday gift for my 12-year-old nephew who loves robotics, budget 800 PHP',
    category: 'gifts'
  },
  {
    emoji: '👗',
    text: 'Find me a dress for a beach wedding that\'s elegant but not too formal',
    category: 'fashion'
  },
  {
    emoji: '⚡',
    text: 'Compare these 3 air fryer models and tell me which has the best value',
    category: 'home'
  },
  {
    emoji: '🔔',
    text: 'Alert me when this specific laptop drops below 15,000 PHP',
    category: 'electronics'
  },
  {
    emoji: '🎁',
    text: 'Help me find anniversary gifts for my wife under 2,000 PHP',
    category: 'gifts'
  },
  {
    emoji: '📱',
    text: 'What\'s the best budget smartphone with good camera under 10,000 PHP?',
    category: 'electronics'
  },
  {
    emoji: '🏠',
    text: 'Find home office desk ideas that fit in small spaces',
    category: 'home'
  },
];

const quickCategories = [
  { icon: <Gift className="w-5 h-5" />, label: 'Gifts', query: 'Show me popular gift ideas' },
  { icon: <Smartphone className="w-5 h-5" />, label: 'Electronics', query: 'What are trending electronics?' },
  { icon: <Home className="w-5 h-5" />, label: 'Home', query: 'Show me home essentials' },
  { icon: <TrendingUp className="w-5 h-5" />, label: 'Trending', query: 'What\'s trending now?' },
];

export default function ShopeeAIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string; content: string}>>([]);
  const [isIdle, setIsIdle] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false); // Track if user has started chatting
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-scroll only after user has interacted (sent a message)
  useEffect(() => {
    if (hasUserInteracted) {
      scrollToBottom();
    }
  }, [messages, isTyping, typingText, hasUserInteracted]);

  // Initial greeting message with typing animation
  useEffect(() => {
    const greetingText = 'Hi! I\'m your Shopee Shopping Assistant 🛍️\n\nI can help you find the perfect products on Shopee through conversation. Just tell me what you\'re looking for, your budget, or click one of the suggestions below!';
    
    if (messages.length === 0) {
      let currentText = '';
      let charIndex = 0;

      const typingInterval = setInterval(() => {
        if (charIndex < greetingText.length) {
          currentText += greetingText[charIndex];
          setTypingText(currentText);
          charIndex++;
        } else {
          clearInterval(typingInterval);
          const greeting: Message = {
            id: '1',
            text: greetingText,
            sender: 'ai',
            timestamp: new Date(),
          };
          setMessages([greeting]);
          setTypingText('');
          setIsTyping(false);
        }
      }, 20);

      return () => clearInterval(typingInterval);
    }
  }, [messages.length]);

  // Idle animation
  useEffect(() => {
    if (messages.length <= 1 && !isTyping) {
      setIsIdle(true);
    } else {
      setIsIdle(false);
    }
  }, [messages, isTyping]);

  const handleSuggestedClick = (text: string) => {
    setInputValue(text);
    setShowSuggestions(false);
    setHasUserInteracted(true); // Enable auto-scroll when user clicks a suggestion
    handleSendMessage(text);
  };

  const handleQuickCategory = (query: string) => {
    setInputValue(query);
    setShowSuggestions(false);
    setHasUserInteracted(true); // Enable auto-scroll when user clicks a category
    handleSendMessage(query);
  };

  const simulateTyping = (text: string, callback: () => void) => {
    let currentText = '';
    let charIndex = 0;
    setTypingText('');

    const typingInterval = setInterval(() => {
      if (charIndex < text.length) {
        currentText += text[charIndex];
        setTypingText(currentText);
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setTypingText('');
        callback();
      }
    }, 30);
  };

  const callAIAPI = async (userMessage: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/shopee-ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.message || 'API request failed');
      }

      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
      console.error('Error calling AI API:', error);
      return {
        response: 'Sorry, I encountered an error. Please try again!',
        products: [],
      };
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    // Enable auto-scroll when user sends a message
    setHasUserInteracted(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setShowSuggestions(false);
    setIsTyping(true);

    // Update conversation history
    setConversationHistory(prev => [
      ...prev,
      { role: 'user', content: text }
    ]);

    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Call AI API
    const aiData = await callAIAPI(text);

    console.log('Received AI Data:', aiData);

    // Update conversation history with AI response
    setConversationHistory(prev => [
      ...prev,
      { role: 'assistant', content: aiData.response }
    ]);

    // Check if response is the fallback message (no products found)
    const isFallbackMessage = aiData.response.includes("I understand you're looking for that!") || 
                               aiData.response.includes("Let me show you some great options from our curated collection");
    
    // Type out the response
    simulateTyping(aiData.response, () => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiData.response,
        sender: 'ai',
        timestamp: new Date(),
        products: aiData.products || [],
        showSuggestions: isFallbackMessage, // Show suggestions if it's a fallback message
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      
      // Re-enable suggestions display if it's a fallback message
      if (isFallbackMessage) {
        setShowSuggestions(true);
      }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleProductClick = (product: Product) => {
    // Prefer CMS offer link over regular shopee link
    const linkToOpen = product.cmsOfferLink || product.shopeeLink;
    console.log('Opening link:', linkToOpen);
    console.log('Product CMS link:', product.cmsOfferLink);
    console.log('Product Shopee link:', product.shopeeLink);
    window.open(linkToOpen, '_blank');
  };

  // Check if we should show suggestions (initial or after fallback message)
  const shouldShowSuggestions = () => {
    if (messages.length === 1 && !isTyping && !typingText) {
      return true; // Initial greeting
    }
    
    // Check if the last AI message has showSuggestions flag
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.sender === 'ai' && lastMessage?.showSuggestions && !isTyping && !typingText) {
      return true;
    }
    
    return false;
  };

  return (
    <div className="flex flex-col h-full relative bg-background">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#EE4D2D]/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#EE4D2D]/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
      </div>

      {/* Minimal Compact Header */}
      <div className="bg-gradient-to-r from-[#EE4D2D] to-[#FF6B45] text-white px-4 py-2 shadow relative z-10">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          <h1 className="font-semibold text-sm truncate">Shopee AI Assistant</h1>
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 relative z-10"
      >
        <div className="max-w-5xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
            >
              <div
                className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-lg ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-br from-[#EE4D2D] to-[#FF6B45] text-white'
                    : 'bg-gradient-to-br from-muted to-muted/50 text-foreground border border-border'
                }`}
              >
                {message.sender === 'ai' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-[#EE4D2D]/20 flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-[#EE4D2D]" />
                    </div>
                    <span className="text-xs font-semibold text-[#EE4D2D]">AI Assistant</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{message.text}</p>
                
                {/* Product Cards */}
                {message.products && message.products.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {message.products.map((product, pIndex) => (
                      <div
                        key={product.id}
                        className="bg-background rounded-xl p-4 border border-border shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-fade-in"
                        style={{ animationDelay: `${pIndex * 150}ms` }}
                      >
                        <div className="flex gap-4">
                          <div className="relative">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-24 h-24 rounded-lg object-cover"
                            />
                            {product.originalPrice && (
                              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">
                              {product.title}
                            </h4>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[#EE4D2D] font-bold text-lg">
                                ₱{product.price.toLocaleString()}
                              </span>
                              {product.originalPrice && (
                                <span className="text-muted-foreground line-through text-sm">
                                  ₱{product.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                              <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                                ⭐ {product.rating}
                              </span>
                              {product.reviews > 0 && (
                                <span className="bg-muted px-2 py-0.5 rounded-full">
                                  {product.reviews.toLocaleString()} sold
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 p-3 bg-gradient-to-br from-[#EE4D2D]/5 to-transparent rounded-lg border-l-4 border-[#EE4D2D]">
                          <p className="text-xs text-foreground">
                            <span className="font-semibold text-[#EE4D2D]">💡 Why we recommend: </span>
                            {product.whyRecommend}
                          </p>
                        </div>
                        
                        <Button
                          onClick={() => handleProductClick(product)}
                          className="w-full mt-3 bg-gradient-to-r from-[#EE4D2D] to-[#FF6B45] hover:from-[#FF6B45] hover:to-[#EE4D2D] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          {product.cmsOfferLink ? 'View Affiliate Offer' : 'View on Shopee'}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Animation */}
          {(isTyping || typingText) && (
            <div className="flex justify-start animate-slide-up">
              <div className="max-w-[85%] md:max-w-[70%] rounded-2xl p-4 bg-gradient-to-br from-muted to-muted/50 border border-border shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#EE4D2D]/20 flex items-center justify-center animate-pulse">
                    <Sparkles className="w-3 h-3 text-[#EE4D2D]" />
                  </div>
                  <span className="text-xs font-semibold text-[#EE4D2D]">AI Assistant</span>
                </div>
                
                {typingText ? (
                  <div>
                    <p className="whitespace-pre-wrap">{typingText}</p>
                    <span className="inline-block w-2 h-4 bg-[#EE4D2D] ml-1 animate-pulse"></span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#EE4D2D] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-[#EE4D2D] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-[#EE4D2D] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-sm text-muted-foreground">AI is thinking...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Suggested Messages - Show initially or after fallback message */}
          {shouldShowSuggestions() && (
            <div className="animate-fade-in" style={{ animationDelay: '500ms' }}>
              <p className="text-center text-muted-foreground text-sm mb-4 font-medium flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-[#EE4D2D]" />
                Try one of these popular searches:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestedMessages.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedClick(suggestion.text)}
                    className="group relative p-4 rounded-xl bg-gradient-to-br from-[#EE4D2D]/10 to-transparent border-2 border-[#EE4D2D]/20 hover:border-[#EE4D2D] hover:shadow-lg hover:shadow-[#EE4D2D]/20 transition-all duration-300 hover:scale-105 active:scale-95 text-left animate-slide-up overflow-hidden"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#EE4D2D]/0 to-[#EE4D2D]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0 animate-bounce-subtle">{suggestion.emoji}</span>
                      <p className="text-sm text-foreground group-hover:text-[#EE4D2D] transition-colors">
                        {suggestion.text}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Quick Categories */}
              <div className="mt-6 animate-fade-in" style={{ animationDelay: '800ms' }}>
                <p className="text-center text-muted-foreground text-sm mb-3 font-medium">
                  Or browse by category:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {quickCategories.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickCategory(category.query)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-gradient-to-r hover:from-[#EE4D2D] hover:to-[#FF6B45] hover:text-white border border-border hover:border-transparent transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      {category.icon}
                      <span className="text-sm font-medium">{category.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Idle Animation */}
          {isIdle && messages.length > 0 && !isTyping && !typingText && !shouldShowSuggestions() && (
            <div className="text-center py-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 text-muted-foreground text-sm">
                <div className="w-2 h-2 bg-[#EE4D2D]/50 rounded-full animate-pulse"></div>
                <span>Ready to help you find amazing deals on Shopee!</span>
                <div className="w-2 h-2 bg-[#EE4D2D]/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div className="border-t border-border bg-background/95 backdrop-blur-sm p-4 relative z-10 shadow-lg">
        <div className="max-w-5xl mx-auto">
          {/* Disclaimer */}
          <div className="mb-2 text-center">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <span className="text-[#EE4D2D]">💡</span>
              We use Shopee affiliate links - you support us at no extra cost!
            </p>
          </div>

          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about Shopee products..."
              className="flex-1 border-2 border-border focus:border-[#EE4D2D] transition-colors shadow-sm h-11 text-base"
              disabled={isTyping}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-to-r from-[#EE4D2D] to-[#FF6B45] hover:from-[#FF6B45] hover:to-[#EE4D2D] text-white px-6 h-11 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
