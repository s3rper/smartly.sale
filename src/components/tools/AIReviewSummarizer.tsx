import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Star, RotateCcw, Info, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';

interface ReviewResult {
  pros: string[];
  cons: string[];
  verdict: string;
  rating: number;
  whoShouldBuy: string;
  whoShouldAvoid: string;
  summary: string;
}

const PLACEHOLDER = `Example reviews — paste real ones here:

"Great product! Fast delivery, exactly as described. The build quality is solid. Only issue is the battery drains a bit faster than expected."

"Seller is very responsive. Product arrived in 3 days. A bit smaller than the photos suggest but works perfectly for my needs."

"Not bad for the price. I've used it for 2 weeks and so far so good. The color is slightly different from the listing photo."`;

const AIReviewSummarizer: React.FC = () => {
  const [reviews, setReviews] = useState('');
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    if (!reviews.trim() || reviews.trim().length < 50) {
      setError('Paste at least a few product reviews (50+ characters)');
      return;
    }
    setError(null);
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'review-summarizer', input: reviews }),
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();

      // Parse JSON response from AI
      const parsed: ReviewResult = JSON.parse(data.result);
      setResult(parsed);
    } catch {
      setError('Failed to analyze reviews. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const ratingColor = (r: number) =>
    r >= 8 ? 'text-green-600' : r >= 6 ? 'text-yellow-600' : 'text-red-600';

  const ratingLabel = (r: number) =>
    r >= 9 ? 'Excellent' : r >= 8 ? 'Great' : r >= 7 ? 'Good' : r >= 6 ? 'Fair' : 'Poor';

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-brand" />
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">AI Review Summarizer</h1>
        </div>
        <p className="text-muted-foreground">Paste Shopee product reviews — AI extracts the pros, cons, and a clear verdict instantly</p>
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
        <CardContent className="px-4 sm:px-6 pt-6 space-y-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="reviews">Paste Product Reviews</Label>
            {reviews && <Button variant="outline" size="sm" onClick={() => { setReviews(''); setResult(null); }}>
              <RotateCcw className="w-3 h-3 mr-1" />Clear
            </Button>}
          </div>
          <textarea
            id="reviews"
            value={reviews}
            onChange={e => setReviews(e.target.value)}
            placeholder={PLACEHOLDER}
            className="w-full min-h-[220px] rounded-xl border border-border bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand resize-y font-sans leading-relaxed"
          />
          <p className="text-xs text-muted-foreground">
            Works best with 3–20 reviews. Copy reviews directly from the Shopee product page.
          </p>
          <Button onClick={analyze} disabled={isLoading || !reviews.trim()} className="w-full" size="lg">
            <Sparkles className="w-4 h-4 mr-2" />
            {isLoading ? 'Analyzing with AI...' : 'Summarize Reviews'}
          </Button>
        </CardContent>
      </Card>

      {isLoading && (
        <Card className="border-2 border-brand/30 bg-brand/5">
          <CardContent className="px-4 sm:px-6 pt-6 pb-6 text-center space-y-3">
            <div className="flex justify-center">
              <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-sm text-muted-foreground">Claude AI is reading the reviews...</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-4">
          {/* Verdict header */}
          <Card className="border-2 border-brand/30 bg-brand/5">
            <CardContent className="px-4 sm:px-6 pt-5 pb-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">Overall Verdict</p>
                  <p className="text-base font-semibold text-foreground leading-snug">{result.verdict}</p>
                </div>
                <div className="text-center flex-shrink-0">
                  <div className={`text-4xl font-bold ${ratingColor(result.rating)}`}>{result.rating}<span className="text-lg text-muted-foreground">/10</span></div>
                  <div className={`text-xs font-semibold ${ratingColor(result.rating)}`}>{ratingLabel(result.rating)}</div>
                  <div className="flex gap-0.5 justify-center mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.round(result.rating / 2) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">{result.summary}</p>
            </CardContent>
          </Card>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border border-green-200 bg-green-50">
              <CardHeader className="px-4 pb-2 pt-4">
                <CardTitle className="text-sm text-green-700 flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4" />Pros
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-2">
                {result.pros.map((pro, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-green-800">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    <span>{pro}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-red-200 bg-red-50">
              <CardHeader className="px-4 pb-2 pt-4">
                <CardTitle className="text-sm text-red-700 flex items-center gap-2">
                  <ThumbsDown className="w-4 h-4" />Cons
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-2">
                {result.cons.map((con, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-red-800">
                    <span className="text-red-400 font-bold mt-0.5">✗</span>
                    <span>{con}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Who should buy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border border-blue-200 bg-blue-50">
              <CardContent className="px-4 pt-4 pb-4">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1.5">Buy this if you are...</p>
                <p className="text-sm text-blue-800 leading-relaxed">{result.whoShouldBuy}</p>
              </CardContent>
            </Card>
            <Card className="border border-orange-200 bg-orange-50">
              <CardContent className="px-4 pt-4 pb-4">
                <p className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-1.5">Skip this if you are...</p>
                <p className="text-sm text-orange-800 leading-relaxed">{result.whoShouldAvoid}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Card className="bg-muted/30 border-border">
        <CardContent className="px-4 sm:px-6 pt-4 pb-4">
          <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2"><Info className="w-4 h-4" />How to use</p>
          <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Open any Shopee product and scroll to the Reviews section</li>
            <li>Copy the reviews text and paste it into the box above</li>
            <li>Click "Summarize Reviews" — Claude AI reads all reviews at once</li>
            <li>Get a structured pros/cons breakdown, rating, and buy recommendation</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIReviewSummarizer;
