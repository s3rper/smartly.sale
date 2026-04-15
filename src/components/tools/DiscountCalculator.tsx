import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Tag, RotateCcw, Info } from 'lucide-react';

type Mode = 'final' | 'original' | 'percent';

const DiscountCalculator: React.FC = () => {
  const [mode, setMode] = useState<Mode>('final');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [result, setResult] = useState<{
    savings: number; finalPrice: number; originalPrice: number; percent: number; dealScore: string; dealColor: string;
  } | null>(null);
  const [alert, setAlert] = useState<string | null>(null);

  const showAlert = (msg: string) => { setAlert(msg); setTimeout(() => setAlert(null), 3000); };

  const dealRating = (pct: number) => {
    if (pct >= 50) return { score: 'Amazing Deal!', color: 'text-green-600', bg: 'bg-green-50 border-green-200' };
    if (pct >= 30) return { score: 'Great Deal!', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' };
    if (pct >= 15) return { score: 'Good Deal', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' };
    return { score: 'Modest Saving', color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200' };
  };

  const calculate = () => {
    try {
      if (mode === 'final') {
        const orig = parseFloat(originalPrice);
        const pct = parseFloat(discountPercent);
        if (!orig || !pct || orig <= 0 || pct <= 0 || pct >= 100) { showAlert('Enter a valid original price and discount %'); return; }
        const final = orig * (1 - pct / 100);
        const { score, color } = dealRating(pct);
        setResult({ savings: orig - final, finalPrice: final, originalPrice: orig, percent: pct, dealScore: score, dealColor: color });
      } else if (mode === 'original') {
        const final = parseFloat(finalPrice);
        const pct = parseFloat(discountPercent);
        if (!final || !pct || final <= 0 || pct <= 0 || pct >= 100) { showAlert('Enter a valid final price and discount %'); return; }
        const orig = final / (1 - pct / 100);
        const { score, color } = dealRating(pct);
        setResult({ savings: orig - final, finalPrice: final, originalPrice: orig, percent: pct, dealScore: score, dealColor: color });
      } else {
        const orig = parseFloat(originalPrice);
        const final = parseFloat(finalPrice);
        if (!orig || !final || orig <= 0 || final <= 0 || final >= orig) { showAlert('Final price must be less than original price'); return; }
        const pct = ((orig - final) / orig) * 100;
        const { score, color } = dealRating(pct);
        setResult({ savings: orig - final, finalPrice: final, originalPrice: orig, percent: pct, dealScore: score, dealColor: color });
      }
    } catch { showAlert('Invalid input values'); }
  };

  const reset = () => { setOriginalPrice(''); setDiscountPercent(''); setFinalPrice(''); setResult(null); };

  const fmt = (n: number) => n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const modes: { id: Mode; label: string; desc: string }[] = [
    { id: 'final', label: 'Final Price', desc: 'Original price + discount % → final price' },
    { id: 'original', label: 'Original Price', desc: 'Final price + discount % → original price' },
    { id: 'percent', label: 'Discount %', desc: 'Original + final price → discount %' },
  ];

  return (
    <div className="space-y-5">
      {alert && (
        <Alert className="bg-red-50 border-red-200">
          <Info className="h-4 w-4" />
          <AlertDescription>{alert}</AlertDescription>
        </Alert>
      )}

      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Tag className="w-8 h-8 text-brand" />
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Discount Calculator</h1>
        </div>
        <p className="text-muted-foreground">Calculate Shopee sale prices, savings, and real discount percentages instantly</p>
      </div>

      {/* Mode tabs */}
      <Card className="border-2">
        <CardHeader className="px-4 sm:px-6 pb-2">
          <CardTitle className="text-base">What do you want to calculate?</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {modes.map(m => (
              <button
                key={m.id}
                onClick={() => { setMode(m.id); setResult(null); }}
                className={`p-3 rounded-lg border-2 text-left transition-all ${mode === m.id ? 'border-brand bg-brand/5' : 'border-border hover:border-brand/50'}`}
              >
                <p className={`font-semibold text-sm ${mode === m.id ? 'text-brand' : 'text-foreground'}`}>{m.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(mode === 'final' || mode === 'percent') && (
              <div className="space-y-1.5">
                <Label htmlFor="orig">Original Price (₱)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₱</span>
                  <Input id="orig" type="number" min="0" placeholder="e.g. 1299" value={originalPrice}
                    onChange={e => setOriginalPrice(e.target.value)} className="pl-7" />
                </div>
              </div>
            )}
            {(mode === 'final' || mode === 'original') && (
              <div className="space-y-1.5">
                <Label htmlFor="pct">Discount Percentage (%)</Label>
                <div className="relative">
                  <Input id="pct" type="number" min="0" max="99" placeholder="e.g. 30" value={discountPercent}
                    onChange={e => setDiscountPercent(e.target.value)} className="pr-7" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                </div>
              </div>
            )}
            {(mode === 'original' || mode === 'percent') && (
              <div className="space-y-1.5">
                <Label htmlFor="fin">Final / Sale Price (₱)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₱</span>
                  <Input id="fin" type="number" min="0" placeholder="e.g. 909" value={finalPrice}
                    onChange={e => setFinalPrice(e.target.value)} className="pl-7" />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={calculate} className="flex-1" size="lg">Calculate</Button>
            <Button onClick={reset} variant="outline" size="lg"><RotateCcw className="w-4 h-4" /></Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-2 border-brand/30 bg-brand/5">
          <CardContent className="px-4 sm:px-6 pt-6 space-y-4">
            <div className={`rounded-xl border-2 p-4 text-center ${
              result.percent >= 50 ? 'bg-green-50 border-green-200' :
              result.percent >= 30 ? 'bg-blue-50 border-blue-200' :
              result.percent >= 15 ? 'bg-yellow-50 border-yellow-200' :
              'bg-gray-50 border-gray-200'
            }`}>
              <p className={`text-2xl font-bold ${result.dealColor}`}>{result.dealScore}</p>
              <p className="text-sm text-muted-foreground mt-1">{result.percent.toFixed(1)}% off</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-card border border-border rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground">Original</p>
                <p className="text-lg font-bold text-foreground">₱{fmt(result.originalPrice)}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground">Final Price</p>
                <p className="text-lg font-bold text-brand">₱{fmt(result.finalPrice)}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground">You Save</p>
                <p className="text-lg font-bold text-green-600">₱{fmt(result.savings)}</p>
              </div>
            </div>

            {/* Shopee sale context */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-xs text-orange-800">
              <span className="font-semibold">Shopee tip:</span> Discounts of 30%+ are generally solid deals.
              Wait for 11.11 or 12.12 for 50%+ off on most categories.
              Always check if the "original" price was recently inflated before the sale.
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-brand/5 border-brand/20">
        <CardContent className="px-4 sm:px-6 pt-4 pb-4">
          <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2"><Info className="w-4 h-4" /> How to use</p>
          <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Choose what you want to calculate (final price, original price, or discount %)</li>
            <li>Fill in the known values</li>
            <li>Click Calculate to see your savings and deal rating</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscountCalculator;
