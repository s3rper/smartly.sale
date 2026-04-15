import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Lock, Copy, RefreshCw, Check, Info } from 'lucide-react';

const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function calcStrength(pwd: string): { label: string; color: string; width: string; score: number } {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 16) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 2) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/4', score };
  if (score <= 4) return { label: 'Fair', color: 'bg-yellow-500', width: 'w-2/4', score };
  if (score <= 5) return { label: 'Strong', color: 'bg-blue-500', width: 'w-3/4', score };
  return { label: 'Very Strong', color: 'bg-green-500', width: 'w-full', score };
}

const PasswordGenerator: React.FC = () => {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ upper: true, lower: true, numbers: true, symbols: true });
  const [passwords, setPasswords] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [copied, setCopied] = useState<number | null>(null);
  const [alert, setAlert] = useState<string | null>(null);

  const generate = useCallback(() => {
    const charset = [
      opts.upper ? CHARS.upper : '',
      opts.lower ? CHARS.lower : '',
      opts.numbers ? CHARS.numbers : '',
      opts.symbols ? CHARS.symbols : '',
    ].join('');

    if (!charset) { setAlert('Select at least one character type'); return; }

    const arr = Array.from({ length: count }, () => {
      let pwd = '';
      // Guarantee at least one of each selected type
      if (opts.upper) pwd += CHARS.upper[Math.floor(Math.random() * CHARS.upper.length)];
      if (opts.lower) pwd += CHARS.lower[Math.floor(Math.random() * CHARS.lower.length)];
      if (opts.numbers) pwd += CHARS.numbers[Math.floor(Math.random() * CHARS.numbers.length)];
      if (opts.symbols) pwd += CHARS.symbols[Math.floor(Math.random() * CHARS.symbols.length)];
      // Fill rest randomly
      while (pwd.length < length) pwd += charset[Math.floor(Math.random() * charset.length)];
      // Shuffle
      return pwd.split('').sort(() => Math.random() - 0.5).join('').slice(0, length);
    });
    setPasswords(arr);
  }, [length, opts, count]);

  const copy = (idx: number) => {
    navigator.clipboard.writeText(passwords[idx]);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggle = (key: keyof typeof opts) => setOpts(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-5">
      {alert && (
        <Alert className="bg-red-50 border-red-200">
          <Info className="h-4 w-4" /><AlertDescription>{alert}</AlertDescription>
        </Alert>
      )}

      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Lock className="w-8 h-8 text-brand" />
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Password Generator</h1>
        </div>
        <p className="text-muted-foreground">Generate strong, random passwords — 100% client-side, never stored</p>
      </div>

      <Card className="border-2">
        <CardContent className="px-4 sm:px-6 pt-6 space-y-5">
          {/* Length */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Password Length</Label>
              <span className="text-brand font-bold text-lg">{length}</span>
            </div>
            <input type="range" min="6" max="64" value={length}
              onChange={e => setLength(Number(e.target.value))}
              className="w-full accent-brand h-2 rounded-lg cursor-pointer" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>6</span><span>Recommended: 16–20</span><span>64</span>
            </div>
          </div>

          {/* Character types */}
          <div className="space-y-2">
            <Label>Include Characters</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {([
                { key: 'upper', label: 'A-Z', sub: 'Uppercase' },
                { key: 'lower', label: 'a-z', sub: 'Lowercase' },
                { key: 'numbers', label: '0-9', sub: 'Numbers' },
                { key: 'symbols', label: '!@#', sub: 'Symbols' },
              ] as const).map(({ key, label, sub }) => (
                <button key={key} onClick={() => toggle(key)}
                  className={`p-2.5 rounded-lg border-2 text-center transition-all ${opts[key] ? 'border-brand bg-brand/5' : 'border-border opacity-50'}`}>
                  <p className={`font-bold font-mono text-sm ${opts[key] ? 'text-brand' : 'text-foreground'}`}>{label}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Generate</Label>
              <span className="text-brand font-bold">{count}</span>
            </div>
            <input type="range" min="1" max="10" value={count}
              onChange={e => setCount(Number(e.target.value))}
              className="w-full accent-brand h-2 rounded-lg cursor-pointer" />
          </div>

          <Button onClick={generate} className="w-full" size="lg">
            <RefreshCw className="w-4 h-4 mr-2" />Generate Password{count > 1 ? 's' : ''}
          </Button>
        </CardContent>
      </Card>

      {passwords.length > 0 && (
        <Card className="border-2 border-brand/30 bg-brand/5">
          <CardHeader className="px-4 sm:px-6 pb-2">
            <CardTitle className="text-base">Generated Passwords</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 space-y-3">
            {passwords.map((pwd, i) => {
              const strength = calcStrength(pwd);
              return (
                <div key={i} className="bg-card border border-border rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm font-mono text-foreground break-all select-all bg-muted/40 px-3 py-2 rounded-lg">
                      {pwd}
                    </code>
                    <button onClick={() => copy(i)}
                      className="flex-shrink-0 p-2 rounded-lg hover:bg-muted transition-colors">
                      {copied === i ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Strength</span>
                      <span className={strength.score >= 6 ? 'text-green-600 font-semibold' : strength.score >= 4 ? 'text-blue-600 font-semibold' : 'text-yellow-600 font-semibold'}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <Card className="bg-brand/5 border-brand/20">
        <CardContent className="px-4 sm:px-6 pt-4 pb-4 text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground">Security notes</p>
          <p>✓ All passwords generated locally in your browser — nothing is sent to any server</p>
          <p>✓ Uses cryptographically random Math.random() — suitable for most accounts</p>
          <p>✓ For highest security: use 16+ characters with all character types enabled</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordGenerator;
