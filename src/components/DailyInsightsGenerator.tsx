import { useState } from 'react';
import { Button } from './ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import dailyData from '../data/daily.json';

interface ToolCategory {
  id: string;
  name: string;
  icon: string;
  type: 'simple' | 'choice' | 'mood';
}

const categories: ToolCategory[] = [
  { id: 'dayPrediction', name: 'How\'s Your Day?', icon: '', type: 'simple' },
  { id: 'dailyAdvice', name: 'Random Daily Advice', icon: '', type: 'simple' },
  { id: 'mood', name: 'Your Mood Check', icon: '', type: 'mood' },
  { id: 'decision', name: 'Should I Do This?', icon: '', type: 'choice' },
  { id: 'energyLevel', name: 'Energy Level Today', icon: '', type: 'simple' },
  { id: 'compliment', name: 'Today\'s Compliment', icon: '', type: 'simple' },
  { id: 'messageInterpretation', name: 'Message Meaning', icon: '', type: 'choice' },
  { id: 'thinkingAboutYou', name: 'Are They Thinking?', icon: '', type: 'simple' },
  { id: 'relationshipPower', name: 'Relationship Power', icon: '', type: 'choice' },
  { id: 'vibeAttractiveness', name: 'Vibe Attractiveness', icon: '', type: 'simple' },
  { id: 'weekPrediction', name: 'This Week For You', icon: '', type: 'simple' },
  { id: 'personalityToday', name: 'Your Personality Today', icon: '', type: 'simple' },
  { id: 'hiddenTalent', name: 'Hidden Talent', icon: '', type: 'simple' },
  { id: 'dominantEmotion', name: 'Dominant Emotion', icon: '', type: 'simple' },
  { id: 'difficultyLevel', name: 'Life Difficulty Level', icon: '', type: 'simple' },
  { id: 'workMotivation', name: 'Work Motivation', icon: '', type: 'simple' },
  { id: 'restOrWork', name: 'Rest or Work?', icon: '', type: 'simple' },
  { id: 'taskPriority', name: 'Task Priority', icon: '', type: 'simple' },
  { id: 'selfAwarenessLevel', name: 'Self-Awareness Level', icon: '', type: 'simple' },
  { id: 'emotionalMaturity', name: 'Emotional Maturity', icon: '', type: 'simple' },
  { id: 'overthinking', name: 'Overthinking Check', icon: '', type: 'simple' },
  { id: 'stressType', name: 'Your Stress Type', icon: '', type: 'simple' },
  { id: 'lifeStatus', name: 'Life Status Card', icon: '', type: 'simple' },
  { id: 'oneWord', name: 'One-Word Summary', icon: '', type: 'simple' },
  { id: 'vibeColor', name: 'Your Vibe Color', icon: '', type: 'simple' },
  { id: 'successBlocker', name: 'Success Blocker', icon: '', type: 'simple' },
  { id: 'monthlyLesson', name: 'Monthly Lesson', icon: '', type: 'simple' },
  { id: 'becoming', name: 'Who You\'re Becoming', icon: '', type: 'simple' },
  { id: 'motivationalTap', name: 'Tap for Motivation', icon: '', type: 'simple' },
  { id: 'confidenceBooster', name: 'Confidence Booster', icon: '', type: 'simple' },
];

interface DailyInsightsGeneratorProps {
  showCTA?: boolean;
}

export default function DailyInsightsGenerator({ showCTA = false }: DailyInsightsGeneratorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsModalOpen(true);
    const categoryData = categories.find(c => c.id === categoryId);
    
    if (categoryData?.type === 'simple') {
      generateResult(categoryId);
    } else {
      setResult(null);
      setShowResult(false);
    }
  };

  const handleRandomInsight = () => {
    // Pick a random category that's type 'simple' (no choice needed)
    const simpleCategories = categories.filter(c => c.type === 'simple');
    const randomCategory = simpleCategories[Math.floor(Math.random() * simpleCategories.length)];
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
    
    const newCategory = categories[newIndex];
    setSelectedCategory(newCategory.id);
    
    // Auto-generate if it's a simple type
    if (newCategory.type === 'simple') {
      generateResult(newCategory.id);
    } else {
      setResult(null);
      setShowResult(false);
    }
  };

  const generateResult = (categoryId: string, choice?: string) => {
    setIsGenerating(true);
    setShowResult(false);
    
    setTimeout(() => {
      let resultData: any = {};

      switch (categoryId) {
        case 'dayPrediction':
          resultData = {
            emotional: dailyData.dayPrediction.emotional[Math.floor(Math.random() * dailyData.dayPrediction.emotional.length)],
            energy: dailyData.dayPrediction.energy[Math.floor(Math.random() * dailyData.dayPrediction.energy.length)],
            luckyVibe: dailyData.dayPrediction.luckyVibe[Math.floor(Math.random() * dailyData.dayPrediction.luckyVibe.length)]
          };
          break;
        
        case 'dailyAdvice':
          resultData = {
            life: dailyData.dailyAdvice.life[Math.floor(Math.random() * dailyData.dailyAdvice.life.length)],
            work: dailyData.dailyAdvice.work[Math.floor(Math.random() * dailyData.dailyAdvice.work.length)],
            love: dailyData.dailyAdvice.love[Math.floor(Math.random() * dailyData.dailyAdvice.love.length)]
          };
          break;
        
        case 'mood':
          if (choice) {
            const moodData = dailyData.moodInsights[choice as keyof typeof dailyData.moodInsights];
            resultData = {
              insight: moodData.insight[Math.floor(Math.random() * moodData.insight.length)],
              quote: moodData.quote[Math.floor(Math.random() * moodData.quote.length)],
              action: moodData.action[Math.floor(Math.random() * moodData.action.length)]
            };
          }
          break;
        
        case 'decision':
          if (choice) {
            const decisions = dailyData.decision[choice as keyof typeof dailyData.decision];
            resultData = { message: decisions[Math.floor(Math.random() * decisions.length)] };
          }
          break;
        
        case 'energyLevel':
          resultData = dailyData.energyLevel[Math.floor(Math.random() * dailyData.energyLevel.length)];
          break;
        
        case 'compliment':
          resultData = { message: dailyData.compliments[Math.floor(Math.random() * dailyData.compliments.length)] };
          break;
        
        case 'messageInterpretation':
          if (choice) {
            const messages = dailyData.messageInterpretation[choice as keyof typeof dailyData.messageInterpretation];
            resultData = { message: messages[Math.floor(Math.random() * messages.length)] };
          }
          break;
        
        case 'thinkingAboutYou':
          resultData = { message: dailyData.thinkingAboutYou[Math.floor(Math.random() * dailyData.thinkingAboutYou.length)] };
          break;
        
        case 'relationshipPower':
          if (choice) {
            const powers = dailyData.relationshipPower[choice as keyof typeof dailyData.relationshipPower];
            resultData = { message: powers[Math.floor(Math.random() * powers.length)] };
          }
          break;
        
        case 'vibeAttractiveness':
          resultData = dailyData.vibeAttractiveness[Math.floor(Math.random() * dailyData.vibeAttractiveness.length)];
          break;
        
        case 'weekPrediction':
          resultData = {
            luck: dailyData.weekPrediction.luck[Math.floor(Math.random() * dailyData.weekPrediction.luck.length)],
            conflict: dailyData.weekPrediction.conflict[Math.floor(Math.random() * dailyData.weekPrediction.conflict.length)],
            career: dailyData.weekPrediction.career[Math.floor(Math.random() * dailyData.weekPrediction.career.length)],
            love: dailyData.weekPrediction.love[Math.floor(Math.random() * dailyData.weekPrediction.love.length)]
          };
          break;
        
        case 'personalityToday':
          resultData = { message: dailyData.personalityToday[Math.floor(Math.random() * dailyData.personalityToday.length)] };
          break;
        
        case 'hiddenTalent':
          resultData = { message: dailyData.hiddenTalent[Math.floor(Math.random() * dailyData.hiddenTalent.length)] };
          break;
        
        case 'dominantEmotion':
          resultData = { message: dailyData.dominantEmotion[Math.floor(Math.random() * dailyData.dominantEmotion.length)] };
          break;
        
        case 'difficultyLevel':
          resultData = dailyData.difficultyLevel[Math.floor(Math.random() * dailyData.difficultyLevel.length)];
          break;
        
        case 'workMotivation':
          resultData = { message: dailyData.workMotivation[Math.floor(Math.random() * dailyData.workMotivation.length)] };
          break;
        
        case 'restOrWork':
          resultData = dailyData.restOrWork[Math.floor(Math.random() * dailyData.restOrWork.length)];
          break;
        
        case 'taskPriority':
          resultData = { message: dailyData.taskPriority[Math.floor(Math.random() * dailyData.taskPriority.length)] };
          break;
        
        case 'selfAwarenessLevel':
          resultData = dailyData.selfAwarenessLevel[Math.floor(Math.random() * dailyData.selfAwarenessLevel.length)];
          break;
        
        case 'emotionalMaturity':
          resultData = { message: dailyData.emotionalMaturity[Math.floor(Math.random() * dailyData.emotionalMaturity.length)] };
          break;
        
        case 'overthinking':
          resultData = { message: dailyData.overthinking[Math.floor(Math.random() * dailyData.overthinking.length)] };
          break;
        
        case 'stressType':
          resultData = dailyData.stressType[Math.floor(Math.random() * dailyData.stressType.length)];
          break;
        
        case 'lifeStatus':
          resultData = {
            feeling: dailyData.lifeStatus.feeling[Math.floor(Math.random() * dailyData.lifeStatus.feeling.length)],
            need: dailyData.lifeStatus.need[Math.floor(Math.random() * dailyData.lifeStatus.need.length)],
            focusedOn: dailyData.lifeStatus.focusedOn[Math.floor(Math.random() * dailyData.lifeStatus.focusedOn.length)]
          };
          break;
        
        case 'oneWord':
          resultData = { message: dailyData.oneWord[Math.floor(Math.random() * dailyData.oneWord.length)] };
          break;
        
        case 'vibeColor':
          resultData = dailyData.vibeColor[Math.floor(Math.random() * dailyData.vibeColor.length)];
          break;
        
        case 'successBlocker':
          resultData = dailyData.successBlocker[Math.floor(Math.random() * dailyData.successBlocker.length)];
          break;
        
        case 'monthlyLesson':
          resultData = { message: dailyData.monthlyLesson[Math.floor(Math.random() * dailyData.monthlyLesson.length)] };
          break;
        
        case 'becoming':
          resultData = { message: dailyData.becoming[Math.floor(Math.random() * dailyData.becoming.length)] };
          break;
        
        case 'motivationalTap':
          resultData = { message: dailyData.motivationalTap[Math.floor(Math.random() * dailyData.motivationalTap.length)] };
          break;
        
        case 'confidenceBooster':
          resultData = { message: dailyData.confidenceBooster[Math.floor(Math.random() * dailyData.confidenceBooster.length)] };
          break;
      }

      setResult(resultData);
      setIsGenerating(false);
      setTimeout(() => setShowResult(true), 100);
    }, 500);
  };

  const handleChoice = (choice: string) => {
    generateResult(selectedCategory, choice);
  };

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  const renderChoices = () => {
    if (selectedCategory === 'mood') {
      return (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Button onClick={() => handleChoice('happy')} className="h-20 font-bold">Happy</Button>
          <Button onClick={() => handleChoice('neutral')} className="h-20 font-bold">Neutral</Button>
          <Button onClick={() => handleChoice('sad')} className="h-20 font-bold">Sad</Button>
        </div>
      );
    }

    if (selectedCategory === 'decision') {
      return (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Button onClick={() => handleChoice('yes')} className="h-20 bg-green-500 hover:bg-green-600 font-bold">YES</Button>
          <Button onClick={() => handleChoice('no')} className="h-20 bg-red-500 hover:bg-red-600 font-bold">NO</Button>
          <Button onClick={() => handleChoice('maybe')} className="h-20 bg-yellow-500 hover:bg-yellow-600 font-bold">MAYBE</Button>
        </div>
      );
    }

    if (selectedCategory === 'messageInterpretation') {
      return (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Button onClick={() => handleChoice('cold')} className="h-20 font-bold">Cold</Button>
          <Button onClick={() => handleChoice('neutral')} className="h-20 font-bold">Neutral</Button>
          <Button onClick={() => handleChoice('warm')} className="h-20 font-bold">Warm</Button>
        </div>
      );
    }

    if (selectedCategory === 'relationshipPower') {
      return (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button onClick={() => handleChoice('me')} className="h-20 font-bold">Me</Button>
          <Button onClick={() => handleChoice('them')} className="h-20 font-bold">Them</Button>
        </div>
      );
    }

    return null;
  };

  const renderResult = () => {
    if (!result) return null;

    // Handle different result types
    if (result.message) {
      return (
        <div className="text-center">
          <p className="text-xl md:text-2xl font-medium leading-relaxed">{result.message}</p>
        </div>
      );
    }

    if (result.emotional) {
      return (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-brand mb-2">Emotional State</h4>
            <p>{result.emotional}</p>
          </div>
          <div>
            <h4 className="font-bold text-brand mb-2">Energy Level</h4>
            <p>{result.energy}</p>
          </div>
          <div>
            <h4 className="font-bold text-brand mb-2">Lucky Vibe</h4>
            <p>{result.luckyVibe}</p>
          </div>
        </div>
      );
    }

    if (result.life) {
      return (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-brand mb-2">Life Advice</h4>
            <p>{result.life}</p>
          </div>
          <div>
            <h4 className="font-bold text-brand mb-2">Work Tip</h4>
            <p>{result.work}</p>
          </div>
          <div>
            <h4 className="font-bold text-brand mb-2">Love Reminder</h4>
            <p>{result.love}</p>
          </div>
        </div>
      );
    }

    if (result.insight) {
      return (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-brand mb-2">Insight</h4>
            <p>{result.insight}</p>
          </div>
          <div>
            <h4 className="font-bold text-brand mb-2">Quote</h4>
            <p className="italic">{result.quote}</p>
          </div>
          <div>
            <h4 className="font-bold text-brand mb-2">Action</h4>
            <p>{result.action}</p>
          </div>
        </div>
      );
    }

    if (result.score !== undefined) {
      return (
        <div className="text-center space-y-4">
          <div className="text-5xl font-bold text-brand">{result.score}%</div>
          <p className="text-xl font-medium">{result.message}</p>
          {result.advice && <p className="text-muted-foreground">{result.advice}</p>}
          {result.tip && <p className="text-sm text-muted-foreground mt-2">Tip: {result.tip}</p>}
          {result.insight && <p className="text-muted-foreground">{result.insight}</p>}
        </div>
      );
    }

    if (result.luck) {
      return (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-brand mb-2">Luck</h4>
            <p>{result.luck}</p>
          </div>
          <div>
            <h4 className="font-bold text-brand mb-2">Conflict</h4>
            <p>{result.conflict}</p>
          </div>
          <div>
            <h4 className="font-bold text-brand mb-2">Career</h4>
            <p>{result.career}</p>
          </div>
          <div>
            <h4 className="font-bold text-brand mb-2">Love</h4>
            <p>{result.love}</p>
          </div>
        </div>
      );
    }

    if (result.level) {
      return (
        <div className="text-center space-y-4">
          <div className="text-4xl font-bold text-brand">{result.level}</div>
          <p className="text-xl font-medium">{result.message}</p>
          <p className="text-muted-foreground">{result.explanation}</p>
        </div>
      );
    }

    if (result.decision) {
      return (
        <div className="text-center space-y-4">
          <div className="text-4xl font-bold text-brand">{result.decision}</div>
          <p className="text-xl font-medium">{result.reason}</p>
          <p className="text-muted-foreground">{result.action}</p>
        </div>
      );
    }

    if (result.type) {
      return (
        <div className="space-y-4">
          <div className="text-3xl font-bold text-brand text-center">{result.type}</div>
          <p className="text-xl font-medium">{result.description}</p>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm"><strong>Tip:</strong> {result.tip}</p>
          </div>
        </div>
      );
    }

    if (result.feeling) {
      return (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-brand mb-2">Today I'm feeling:</h4>
            <p>{result.feeling}</p>
          </div>
          <div>
            <h4 className="font-bold text-brand mb-2">Today I need:</h4>
            <p>{result.need}</p>
          </div>
          <div>
            <h4 className="font-bold text-brand mb-2">Today I'm focused on:</h4>
            <p>{result.focusedOn}</p>
          </div>
        </div>
      );
    }

    if (result.color) {
      return (
        <div className="text-center space-y-4">
          <div className="text-4xl font-bold text-brand">{result.color}</div>
          <p className="text-xl font-medium">{result.mood}</p>
          <p className="text-muted-foreground">{result.meaning}</p>
        </div>
      );
    }

    if (result.blocker) {
      return (
        <div className="space-y-4">
          <div className="text-3xl font-bold text-brand text-center">{result.blocker}</div>
          <div className="bg-muted p-4 rounded-lg">
            <p><strong>Advice:</strong> {result.advice}</p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* CTA Button - Only shown if showCTA prop is true */}
      {showCTA && (
        <div className="mb-8 text-center">
          <Button
            onClick={handleRandomInsight}
            className="bg-brand hover:bg-brand/90 text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            style={{ color: '#FFFFFF' }}
          >
            What's My Daily Insights?
          </Button>
        </div>
      )}

      {/* Category Selection - Only shown if showCTA is false */}
      {!showCTA && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-center animate-fade-in">Choose Your Daily Insight</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="group relative p-4 rounded-2xl bg-gradient-to-br from-brand/10 via-brand/5 to-transparent border-2 border-brand/20 hover:border-brand hover:shadow-xl hover:shadow-brand/20 transition-all duration-300 hover:scale-105 active:scale-95 animate-slide-up"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                
                <div className="text-sm font-bold text-foreground group-hover:text-brand transition-colors duration-300 leading-tight">
                  {category.name}
                </div>
                
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-brand font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Tap
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Results */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Desktop: Left Arrow - Outside modal on the left */}
          <button
            onClick={() => navigateCategory('prev')}
            className="hidden lg:block fixed left-[calc(50vw-450px)] top-1/2 -translate-y-1/2 z-[60] p-4 rounded-full bg-background/95 backdrop-blur-sm border-2 border-border hover:border-brand hover:bg-brand hover:text-primary-foreground shadow-2xl transition-all duration-300 hover:scale-110"
            aria-label="Previous insight"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Desktop: Right Arrow - Outside modal on the right */}
          <button
            onClick={() => navigateCategory('next')}
            className="hidden lg:block fixed right-[calc(50vw-450px)] top-1/2 -translate-y-1/2 z-[60] p-4 rounded-full bg-background/95 backdrop-blur-sm border-2 border-border hover:border-brand hover:bg-brand hover:text-primary-foreground shadow-2xl transition-all duration-300 hover:scale-110"
            aria-label="Next insight"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="relative z-[55] bg-background rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 pb-20 lg:pb-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-[70] p-2 rounded-full bg-background/80 hover:bg-muted border-2 border-border hover:border-brand transition-all duration-300 hover:scale-110"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-center">{selectedCategoryData?.name}</h2>
              </div>

              {selectedCategoryData?.type === 'choice' || selectedCategoryData?.type === 'mood' ? (
                <>
                  {!result && renderChoices()}
                </>
              ) : null}

              <div className="space-y-6 py-4">
                {result && showResult && (
                  <div className="transition-all duration-500 animate-slide-up opacity-100">
                    {renderResult()}
                    
                    <div className="mt-6 flex justify-center gap-3">
                      <Button
                        onClick={() => generateResult(selectedCategory)}
                        variant="outline"
                        className="border-2 border-border hover:bg-muted transition-all duration-300"
                      >
                        Generate Another
                      </Button>
                    </div>
                  </div>
                )}

                {isGenerating && (
                  <div className="text-center py-12">
                    <div className="inline-block w-12 h-12 border-4 border-t-brand border-border rounded-full animate-spin mb-4"></div>
                    <p className="text-lg text-muted-foreground">Generating your insight...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile/Tablet: Navigation Arrows at Bottom Center */}
            <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] flex gap-4">
              <button
                onClick={() => navigateCategory('prev')}
                className="p-4 rounded-full bg-background/95 backdrop-blur-sm border-2 border-border hover:border-brand hover:bg-brand hover:text-primary-foreground shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Previous insight"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button
                onClick={() => navigateCategory('next')}
                className="p-4 rounded-full bg-background/95 backdrop-blur-sm border-2 border-border hover:border-brand hover:bg-brand hover:text-primary-foreground shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Next insight"
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
