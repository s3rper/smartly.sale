import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Wallet, RotateCcw, Info, Sparkles, ShoppingCart, TrendingDown, Clock } from 'lucide-react';

interface BudgetItem {
  name: string;
  estimatedPrice: number;
  priority: 'high' | 'medium' | 'low';
  tip: string;
}

interface BudgetResult {
  items: BudgetItem[];
  totalEstimate: number;
  budgetLeft: number;
  overallTip: string;
  bestTimeToShop: string;
  savingsTip: string;
}

const PRIORITY_CONFIG = {
  high: { label: 'High Priority', bg: 'bg-red-50 border-red-200', badge: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
  medium: { label: 'Medium Priority', bg: 'bg-yellow-50 border-yellow-200', badge: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  low: { label: 'Low Priority', bg: 'bg-green-50 border-green-200', badge: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
};

const AIBudgetPlanner: React.FC = () => {
  const [needs, setNeeds] = useState('');
  const [budget, setBudget] = useState('');
  const [result, setResult] = useState<BudgetResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    if (!needs.trim() || needs.trim().length < 10) {
      setError('Describe what you need to buy (at least a few words)');
      return;
    }
    const b = parseFloat(budget);
    if (!budget || isNaN(b) || b <= 0) {
      setError('Enter a valid budget amount');
      return;
    }
    setError(null);
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'budget-planner', input: needs, extra: budget }),
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      const parsed: BudgetResult = JSON.parse(data.result);
      setResult(parsed);
    } catch {
      setError('Failed to plan budget. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fmt = (n: number) =>
    n.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const budgetNum = parseFloat(budget) || 0;
  const overBudget = result && result.totalEstimate > budgetNum;

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Wallet className="w-8 h-8 text-brand" />
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">AI Budget Planner</h1>
        </div>
        <p className="text-muted-foreground">Tell Claude AI what you need and your budget — get a smart Shopee shopping plan</p>
        <div className="inline-flex items-center gap-1.5 mt-2 bg-brand/10 text-brand text-xs font-semibold px-3 py-1 rounded-full">
          <Sparkles className="w-3 h-3" />Powered by Claude AI
        </div>
      </div>

      {error && (
        <Alert className="bg-red-50 border-red-200">
          <Info className="h-4 w-4" /><AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border-2">
        <CardContent className="px-4 sm:px-6 pt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="budget-input">Your Budget (₱)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₱</span>
              <Input
                id="budget-input"
                type="number"
                min="1"
                placeholder="e.g. 3000"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                className="pl-7"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="needs-input">What do you need to buy?</Label>
            <textarea
              id="needs-input"
              value={needs}
              onChange={e => setNeeds(e.target.value)}
              placeholder={`Describe what you need — e.g.:\n"Back to school supplies: notebooks, pens, bag, and school shoes for a grade 5 student"\n\n"Home office setup: mouse, keyboard, desk lamp, and cable organizer"\n\n"Kitchen essentials: knife set, cutting board, mixing bowls"`}
              className="w-full min-h-[140px] rounded-xl border border-border bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand resize-y font-sans leading-relaxed"
            />
          </div>

          {/* Example prompts */}
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground font-medium">Quick examples:</p>
            <div className="flex flex-wrap gap-2">
              {[
                'Back to school supplies for grade school',
                'Home office setup basics',
                'Basic kitchen tools and cookware',
                'Fitness gear for beginners',
              ].map(ex => (
                <button
                  key={ex}
                  onClick={() => setNeeds(ex)}
                  className="text-xs px-3 py-1.5 border border-border rounded-full hover:border-brand hover:text-brand transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={analyze} disabled={isLoading || !needs.trim() || !budget} className="flex-1" size="lg">
              <Sparkles className="w-4 h-4 mr-2" />
              {isLoading ? 'Planning with AI...' : 'Plan My Budget'}
            </Button>
            <Button variant="outline" size="lg" onClick={() => { setNeeds(''); setBudget(''); setResult(null); }}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <Card className="border-2 border-brand/30 bg-brand/5">
          <CardContent className="px-4 sm:px-6 pt-6 pb-6 text-center space-y-3">
            <div className="flex justify-center">
              <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-sm text-muted-foreground">Claude AI is planning your shopping list...</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-4">
          {/* Budget summary */}
          <Card className={`border-2 ${overBudget ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'}`}>
            <CardContent className="px-4 sm:px-6 pt-5 pb-5">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Your Budget</p>
                  <p className="text-2xl font-bold text-foreground">₱{fmt(budgetNum)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Estimated Total</p>
                  <p className={`text-2xl font-bold ${overBudget ? 'text-red-600' : 'text-green-600'}`}>
                    ₱{fmt(result.totalEstimate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{overBudget ? 'Over Budget' : 'Left Over'}</p>
                  <p className={`text-2xl font-bold ${overBudget ? 'text-red-600' : 'text-green-600'}`}>
                    {overBudget ? '-' : '+'}₱{fmt(Math.abs(result.budgetLeft))}
                  </p>
                </div>
              </div>
              {overBudget && (
                <p className="text-center text-xs text-red-700 mt-3 font-medium">
                  ⚠ Estimated total exceeds budget — consider deprioritizing low priority items
                </p>
              )}
            </CardContent>
          </Card>

          {/* Item list */}
          <Card className="border-2 border-brand/30">
            <CardHeader className="px-4 sm:px-6 pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />Shopping List
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 space-y-3">
              {result.items.map((item, i) => {
                const cfg = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.medium;
                return (
                  <div key={i} className={`rounded-xl border p-3 space-y-1.5 ${cfg.bg}`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                        <span className="font-semibold text-sm text-foreground">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>
                          {item.priority}
                        </span>
                        <span className="text-sm font-bold text-foreground">₱{fmt(item.estimatedPrice)}</span>
                      </div>
                    </div>
                    {item.tip && (
                      <p className="text-xs text-muted-foreground pl-4 leading-relaxed">{item.tip}</p>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Tips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border border-blue-200 bg-blue-50">
              <CardContent className="px-4 pt-4 pb-4 space-y-1.5">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />Strategy
                </p>
                <p className="text-sm text-blue-800 leading-relaxed">{result.overallTip}</p>
              </CardContent>
            </Card>
            <Card className="border border-purple-200 bg-purple-50">
              <CardContent className="px-4 pt-4 pb-4 space-y-1.5">
                <p className="text-xs font-bold text-purple-700 uppercase tracking-wide flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />Best Time to Shop
                </p>
                <p className="text-sm text-purple-800 leading-relaxed">{result.bestTimeToShop}</p>
              </CardContent>
            </Card>
            <Card className="border border-green-200 bg-green-50">
              <CardContent className="px-4 pt-4 pb-4 space-y-1.5">
                <p className="text-xs font-bold text-green-700 uppercase tracking-wide flex items-center gap-1.5">
                  <TrendingDown className="w-3 h-3" />Savings Tip
                </p>
                <p className="text-sm text-green-800 leading-relaxed">{result.savingsTip}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Card className="bg-muted/30 border-border">
        <CardContent className="px-4 sm:px-6 pt-4 pb-4">
          <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2"><Info className="w-4 h-4" />How it works</p>
          <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Enter your total budget in Philippine Pesos</li>
            <li>Describe what you need to buy (the more detail, the better)</li>
            <li>Claude AI suggests items with Shopee prices and priority levels</li>
            <li>Get a shopping strategy, best time to buy, and savings tips</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIBudgetPlanner;
