import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import jokesData from '../data/pinoy-jokes.json';

interface JokeCategory {
  id: string;
  name: string;
  icon: string;
}

const categories: JokeCategory[] = [
  { id: 'hugot', name: 'Love & Hugot', icon: '💔' },
  { id: 'barkada', name: 'Barkada & Friendship', icon: '👥' },
  { id: 'office', name: 'Office & Workmates', icon: '💼' },
  { id: 'student', name: 'Student Life', icon: '📚' },
  { id: 'asaran', name: 'Asaran & Banat', icon: '🔥' },
  { id: 'family', name: 'Family & Everyday', icon: '👨‍👩‍👧‍👦' },
  { id: 'trending', name: 'Trending & Pop Culture', icon: '📱' },
  { id: 'politika', name: 'Politika & Election', icon: '🗳️' },
  { id: 'nanay', name: 'Nanay Moments', icon: '👩' },
  { id: 'commute', name: 'Commute & Travel', icon: '🚌' },
  { id: 'traffic', name: 'Traffic sa Pinas', icon: '🚗' },
  { id: 'food', name: 'Food & Kain', icon: '🍽️' },
  { id: 'lovelife', name: 'Love Life & Dating', icon: '💕' },
  { id: 'teknolohiya', name: 'Tech & Gadgets', icon: '💻' },
  { id: 'fitness', name: 'Fitness & Gym', icon: '💪' },
  { id: 'shopping', name: 'Shopping & Online', icon: '🛒' },
  { id: 'pera', name: 'Pera & Money', icon: '💰' },
  { id: 'petsa', name: 'Petsa & Dates', icon: '🌹' },
];

const jokes: Record<string, string[]> = jokesData;

// Random Unsplash images for backgrounds
const backgroundImages = [
  'https://images.unsplash.com/photo-1557683316-973673baf926?w=1080&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1080&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1080&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1080&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1080&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1080&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=1080&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?w=1080&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=1080&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1080&h=1080&fit=crop',
];

// Fisher-Yates shuffle algorithm for true randomization
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function PinoyJokeGenerator() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentJoke, setCurrentJoke] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showJoke, setShowJoke] = useState(false);
  const [shuffledJokes, setShuffledJokes] = useState<Record<string, string[]>>({});
  const [jokeIndex, setJokeIndex] = useState<Record<string, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsModalOpen(true);
    
    // Initialize shuffled jokes for this category if not already done
    if (!shuffledJokes[categoryId]) {
      const shuffled = shuffleArray(jokes[categoryId]);
      setShuffledJokes(prev => ({ ...prev, [categoryId]: shuffled }));
      setJokeIndex(prev => ({ ...prev, [categoryId]: 0 }));
    }
    
    // Auto-generate joke when category is selected
    generateJokeForCategory(categoryId);
  };

  const handleRandomJoke = () => {
    // Pick a random category
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    handleCategorySelect(randomCategory.id);
  };

  const navigateCategory = (direction: 'prev' | 'next') => {
    const currentIndex = categories.findIndex(c => c.id === selectedCategory);
    let newIndex: number;
    
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? categories.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === categories.length - 1 ? 0 : currentIndex + 1;
    }
    
    const newCategoryId = categories[newIndex].id;
    setSelectedCategory(newCategoryId);
    
    // Initialize shuffled jokes for new category if needed
    if (!shuffledJokes[newCategoryId]) {
      const shuffled = shuffleArray(jokes[newCategoryId]);
      setShuffledJokes(prev => ({ ...prev, [newCategoryId]: shuffled }));
      setJokeIndex(prev => ({ ...prev, [newCategoryId]: 0 }));
    }
    
    // Auto-generate joke when navigating
    generateJokeForCategory(newCategoryId);
  };

  const generateJokeForCategory = (categoryId: string) => {
    setIsGenerating(true);
    setShowJoke(false);
    
    setTimeout(() => {
      // Get or initialize shuffled jokes for this category
      let categoryJokesArray = shuffledJokes[categoryId];
      let currentIndex = jokeIndex[categoryId] || 0;
      
      if (!categoryJokesArray) {
        categoryJokesArray = shuffleArray(jokes[categoryId]);
        setShuffledJokes(prev => ({ ...prev, [categoryId]: categoryJokesArray }));
        currentIndex = 0;
      }
      
      // Get the next joke
      const nextJoke = categoryJokesArray[currentIndex];
      
      // Update index, reshuffle if we've gone through all jokes
      const nextIndex = currentIndex + 1;
      if (nextIndex >= categoryJokesArray.length) {
        // Reshuffle when we've gone through all jokes
        const reshuffled = shuffleArray(jokes[categoryId]);
        setShuffledJokes(prev => ({ ...prev, [categoryId]: reshuffled }));
        setJokeIndex(prev => ({ ...prev, [categoryId]: 0 }));
      } else {
        setJokeIndex(prev => ({ ...prev, [categoryId]: nextIndex }));
      }
      
      setCurrentJoke(nextJoke);
      setIsGenerating(false);
      setCopied(false);
      
      setTimeout(() => setShowJoke(true), 100);
    }, 500);
  };

  const generateJoke = () => {
    // Keep same category, just get the next joke in sequence
    generateJokeForCategory(selectedCategory);
  };

  const copyToClipboard = () => {
    if (currentJoke) {
      navigator.clipboard.writeText(currentJoke);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadAsImage = async () => {
    if (!currentJoke || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Instagram Post dimensions (1:1 square)
    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    // Get random background image
    const randomBgUrl = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    
    try {
      // Load background image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = randomBgUrl;
      });

      // Draw background image
      ctx.drawImage(img, 0, 0, width, height);

      // Add semi-transparent overlay for better text readability
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, width, height);

      // Calculate text area
      const padding = width * 0.08;
      const textBoxWidth = width - (padding * 2);
      const textBoxHeight = height * 0.6;
      const textBoxX = padding;
      const textBoxY = (height - textBoxHeight) / 2;

      // Draw text box background with rounded corners
      const borderRadius = 30;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.beginPath();
      ctx.moveTo(textBoxX + borderRadius, textBoxY);
      ctx.lineTo(textBoxX + textBoxWidth - borderRadius, textBoxY);
      ctx.quadraticCurveTo(textBoxX + textBoxWidth, textBoxY, textBoxX + textBoxWidth, textBoxY + borderRadius);
      ctx.lineTo(textBoxX + textBoxWidth, textBoxY + textBoxHeight - borderRadius);
      ctx.quadraticCurveTo(textBoxX + textBoxWidth, textBoxY + textBoxHeight, textBoxX + textBoxWidth - borderRadius, textBoxY + textBoxHeight);
      ctx.lineTo(textBoxX + borderRadius, textBoxY + textBoxHeight);
      ctx.quadraticCurveTo(textBoxX, textBoxY + textBoxHeight, textBoxX, textBoxY + textBoxHeight - borderRadius);
      ctx.lineTo(textBoxX, textBoxY + borderRadius);
      ctx.quadraticCurveTo(textBoxX, textBoxY, textBoxX + borderRadius, textBoxY);
      ctx.closePath();
      ctx.fill();

      // Add shadow to text box
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 10;
      ctx.fill();
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Add emoji at top of text box
      const emoji = '😂';
      const emojiSize = width * 0.12;
      ctx.font = `${emojiSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(emoji, width / 2, textBoxY + emojiSize + 20);

      // Add joke text with word wrapping
      ctx.fillStyle = '#1a1a1a';
      ctx.font = `bold ${width * 0.042}px Arial`;
      ctx.textAlign = 'center';
      
      const maxWidth = textBoxWidth - (padding * 0.8);
      const lineHeight = width * 0.065;
      const words = currentJoke.split(' ');
      let line = '';
      let y = textBoxY + emojiSize + 80;

      // Calculate total text height to center properly
      const lines: string[] = [];
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          lines.push(line);
          line = words[i] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      const totalTextHeight = lines.length * lineHeight;
      y = textBoxY + (textBoxHeight - totalTextHeight) / 2 + lineHeight / 2;

      // Draw each line
      lines.forEach((textLine) => {
        ctx.fillText(textLine.trim(), width / 2, y);
        y += lineHeight;
      });

      // Add branding at bottom
      ctx.font = `bold ${width * 0.028}px Arial`;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('www.smartly.sale/jokes', width / 2, height - 50);

      // Add category badge
      const categoryName = categories.find(c => c.id === selectedCategory)?.name || '';
      ctx.font = `${width * 0.022}px Arial`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillText(categoryName, width / 2, height - 25);

      // Download the image
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `pinoy-joke-instagram-${Date.now()}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (error) {
      console.error('Error loading background image:', error);
      // Fallback to gradient if image fails
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      // Continue with text rendering...
    }
  };

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Hidden canvas for image generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* CTA Button */}
      <div className="mb-6 text-center">
        <Button
          onClick={handleRandomJoke}
          className="bg-brand hover:bg-brand/90 text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          style={{ color: '#FFFFFF' }}
        >
          Generate Pinoy Jokes
        </Button>
      </div>

      {/* Category Selection */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 text-center animate-fade-in">Choose Your Joke Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className="group relative p-5 rounded-2xl bg-gradient-to-br from-brand/10 via-brand/5 to-transparent border-2 border-brand/20 hover:border-brand hover:shadow-xl hover:shadow-brand/20 transition-all duration-300 hover:scale-105 active:scale-95 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
              
              {/* Icon with pulse animation on hover */}
              <div className="text-4xl mb-3 transition-all duration-300 group-hover:scale-125 group-hover:animate-bounce-subtle">
                {category.icon}
              </div>
              
              {/* Category name */}
              <div className="text-sm font-bold text-foreground group-hover:text-brand transition-colors duration-300">
                {category.name}
              </div>
              
              {/* Click me hint - appears on hover */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-brand font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Click me! 👆
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal for Joke Generation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Desktop: Left Arrow - Outside modal on the left */}
          <button
            onClick={() => navigateCategory('prev')}
            className="hidden lg:block fixed left-[calc(50vw-450px)] top-1/2 -translate-y-1/2 z-[60] p-4 rounded-full bg-background/95 backdrop-blur-sm border-2 border-border hover:border-brand hover:bg-brand hover:text-primary-foreground shadow-2xl transition-all duration-300 hover:scale-110"
            aria-label="Previous category"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Desktop: Right Arrow - Outside modal on the right */}
          <button
            onClick={() => navigateCategory('next')}
            className="hidden lg:block fixed right-[calc(50vw-450px)] top-1/2 -translate-y-1/2 z-[60] p-4 rounded-full bg-background/95 backdrop-blur-sm border-2 border-border hover:border-brand hover:bg-brand hover:text-primary-foreground shadow-2xl transition-all duration-300 hover:scale-110"
            aria-label="Next category"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Modal Content */}
          <div className="relative z-[55] bg-background rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-4 pb-20 lg:pb-6">
            {/* Close Button - Top Right */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-[70] p-2 rounded-full bg-background/80 hover:bg-muted border-2 border-border hover:border-brand transition-all duration-300 hover:scale-110"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6">
              {/* Header - Center Aligned with Icon Hidden on Mobile */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="hidden md:inline text-3xl md:text-4xl">{selectedCategoryData?.icon}</span>
                <h2 className="text-2xl md:text-2xl font-bold text-center">{selectedCategoryData?.name}</h2>
              </div>

              {/* Content */}
              <div className="space-y-6 py-4">
                {/* Joke Display */}
                {currentJoke && (
                  <div className={`transition-all duration-500 ${showJoke ? 'animate-slide-up opacity-100' : 'opacity-0'}`}>
                    <div className="text-center mb-6">
                      <div className="text-5xl mb-4 animate-bounce-slow">😂</div>
                      <p className={`text-xl md:text-2xl font-medium leading-relaxed text-foreground transition-all duration-700 ${
                        showJoke ? 'animate-fade-in' : 'opacity-0'
                      }`}>
                        {currentJoke}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className={`flex flex-wrap justify-center gap-3 transition-all duration-500 ${
                      showJoke ? 'animate-slide-up opacity-100' : 'opacity-0'
                    }`} style={{ animationDelay: '300ms' }}>
                      <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        className={`border-2 border-border hover:bg-muted transition-all duration-300 transform hover:scale-110 ${
                          copied ? 'animate-bounce bg-brand text-white border-brand' : ''
                        }`}
                      >
                        {copied ? '✓ Copied!' : '📋 Copy Text'}
                      </Button>
                      <Button
                        onClick={downloadAsImage}
                        className="bg-brand hover:bg-brand/90 transition-all duration-300 transform hover:scale-110"
                        style={{ color: '#FFFFFF' }}
                      >
                        ⬇️ Download Image
                      </Button>
                      <Button
                        onClick={generateJoke}
                        variant="outline"
                        className="border-2 border-border hover:bg-muted transition-all duration-300 transform hover:scale-110"
                      >
                        🔄 Generate Another
                      </Button>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {isGenerating && (
                  <div className="text-center py-12">
                    <div className="inline-block w-12 h-12 border-4 border-t-brand border-border rounded-full animate-spin mb-4"></div>
                    <p className="text-lg text-muted-foreground">Generating joke...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile/Tablet: Navigation Arrows at Bottom Center */}
            <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] flex gap-4">
              <button
                onClick={() => navigateCategory('prev')}
                className="p-4 rounded-full bg-background/95 backdrop-blur-sm border-2 border-border hover:border-brand hover:bg-brand hover:text-primary-foreground shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Previous category"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button
                onClick={() => navigateCategory('next')}
                className="p-4 rounded-full bg-background/95 backdrop-blur-sm border-2 border-border hover:border-brand hover:bg-brand hover:text-primary-foreground shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Next category"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
