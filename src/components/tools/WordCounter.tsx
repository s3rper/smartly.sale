import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { FileText, RotateCcw, Info } from 'lucide-react';

function analyzeText(text: string) {
  if (!text.trim()) return null;

  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, '').length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  const lines = text.split('\n').length;
  const readingTime = Math.ceil(words.length / 238); // avg 238 wpm
  const speakingTime = Math.ceil(words.length / 130); // avg 130 wpm speaking

  // Unique words
  const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, ''))).size;

  // Keyword density (top 5 words, ignoring stop words)
  const stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','is','are','was','were','be','been','have','has','had','do','does','did','will','would','could','should','may','might','shall','can','this','that','these','those','it','its','i','you','he','she','we','they','me','him','her','us','them','my','your','his','our','their']);
  const wordFreq: Record<string, number> = {};
  words.forEach(w => {
    const clean = w.toLowerCase().replace(/[^a-z]/g, '');
    if (clean.length > 2 && !stopWords.has(clean)) {
      wordFreq[clean] = (wordFreq[clean] || 0) + 1;
    }
  });
  const topKeywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count, pct: ((count / words.length) * 100).toFixed(1) }));

  // Flesch Reading Ease (approximation)
  const syllables = words.reduce((acc, w) => {
    const v = w.toLowerCase().replace(/[^aeiou]/g, '').length;
    return acc + Math.max(1, v);
  }, 0);
  const avgWordsPerSentence = sentences > 0 ? words.length / sentences : words.length;
  const avgSyllablesPerWord = words.length > 0 ? syllables / words.length : 0;
  const fleschScore = Math.max(0, Math.min(100, 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord));
  const readabilityLabel =
    fleschScore >= 80 ? 'Very Easy' :
    fleschScore >= 70 ? 'Easy' :
    fleschScore >= 60 ? 'Standard' :
    fleschScore >= 50 ? 'Fairly Difficult' :
    fleschScore >= 30 ? 'Difficult' : 'Very Difficult';

  return { words: words.length, chars, charsNoSpace, sentences, paragraphs, lines, readingTime, speakingTime, uniqueWords, topKeywords, fleschScore, readabilityLabel, avgWordsPerSentence };
}

const WordCounter: React.FC = () => {
  const [text, setText] = useState('');

  const stats = useMemo(() => analyzeText(text), [text]);

  const statCards = stats ? [
    { label: 'Words', value: stats.words.toLocaleString(), icon: '📝' },
    { label: 'Characters', value: stats.chars.toLocaleString(), icon: '🔤' },
    { label: 'No Spaces', value: stats.charsNoSpace.toLocaleString(), icon: '🔡' },
    { label: 'Sentences', value: stats.sentences.toLocaleString(), icon: '📄' },
    { label: 'Paragraphs', value: stats.paragraphs.toLocaleString(), icon: '📋' },
    { label: 'Unique Words', value: stats.uniqueWords.toLocaleString(), icon: '🔠' },
  ] : [];

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <FileText className="w-8 h-8 text-brand" />
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Word Counter</h1>
        </div>
        <p className="text-muted-foreground">Real-time word count, reading time, readability score, and keyword density</p>
      </div>

      <Card className="border-2">
        <CardContent className="px-4 sm:px-6 pt-6 space-y-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="text-input">Paste or type your text</Label>
            {text && (
              <Button variant="outline" size="sm" onClick={() => setText('')}>
                <RotateCcw className="w-3 h-3 mr-1" />Clear
              </Button>
            )}
          </div>
          <textarea
            id="text-input"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste your article, essay, product description, or any text here..."
            className="w-full min-h-[180px] rounded-xl border border-border bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand resize-y font-sans leading-relaxed"
          />
          {/* Live mini stats */}
          {stats && (
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span><strong className="text-foreground">{stats.words}</strong> words</span>
              <span><strong className="text-foreground">{stats.chars}</strong> chars</span>
              <span><strong className="text-foreground">~{stats.readingTime} min</strong> read</span>
            </div>
          )}
        </CardContent>
      </Card>

      {stats && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {statCards.map(({ label, value, icon }) => (
              <Card key={label} className="border border-border text-center">
                <CardContent className="px-2 pt-3 pb-3">
                  <div className="text-xl mb-1">{icon}</div>
                  <div className="text-lg font-bold text-foreground">{value}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Time estimates */}
          <Card className="border-2 border-brand/30 bg-brand/5">
            <CardHeader className="px-4 sm:px-6 pb-2">
              <CardTitle className="text-base">Time Estimates</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-card rounded-xl border border-border">
                  <p className="text-2xl font-bold text-brand">{stats.readingTime} min</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Reading time<br/>(238 wpm average)</p>
                </div>
                <div className="text-center p-3 bg-card rounded-xl border border-border">
                  <p className="text-2xl font-bold text-foreground">{stats.speakingTime} min</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Speaking time<br/>(130 wpm average)</p>
                </div>
                <div className="text-center p-3 bg-card rounded-xl border border-border">
                  <p className="text-2xl font-bold text-foreground">{stats.avgWordsPerSentence.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Avg words<br/>per sentence</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Readability */}
          <Card className="border border-border">
            <CardHeader className="px-4 sm:px-6 pb-2">
              <CardTitle className="text-base">Readability — Flesch Score</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Score: {stats.fleschScore.toFixed(0)}/100</span>
                <span className={`text-sm font-semibold ${stats.fleschScore >= 70 ? 'text-green-600' : stats.fleschScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {stats.readabilityLabel}
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${stats.fleschScore >= 70 ? 'bg-green-500' : stats.fleschScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${stats.fleschScore}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Very Hard (0)</span><span>Standard (60)</span><span>Very Easy (100)</span>
              </div>
            </CardContent>
          </Card>

          {/* Top keywords */}
          {stats.topKeywords.length > 0 && (
            <Card className="border border-border">
              <CardHeader className="px-4 sm:px-6 pb-2">
                <CardTitle className="text-base">Top Keywords</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 space-y-2">
                {stats.topKeywords.map(({ word, count, pct }) => (
                  <div key={word} className="flex items-center gap-3">
                    <span className="text-sm font-mono font-semibold text-foreground w-28 truncate">{word}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-brand rounded-full" style={{ width: `${Math.min(100, parseFloat(pct) * 10)}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-16 text-right">{count}× ({pct}%)</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!text && (
        <Card className="bg-brand/5 border-brand/20">
          <CardContent className="px-4 sm:px-6 pt-4 pb-4">
            <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2"><Info className="w-4 h-4" />What this tool analyzes</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>✓ Word, character, sentence, and paragraph counts</li>
              <li>✓ Estimated reading and speaking time</li>
              <li>✓ Flesch Reading Ease score (readability)</li>
              <li>✓ Top keyword frequency and density</li>
              <li>✓ All processing happens instantly in your browser</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WordCounter;
