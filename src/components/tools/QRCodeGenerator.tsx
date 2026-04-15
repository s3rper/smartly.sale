import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { QrCode, Download, Copy, RotateCcw, Info } from 'lucide-react';

const SIZES = [128, 200, 300, 400] as const;

const QRCodeGenerator: React.FC = () => {
  const [text, setText] = useState('');
  const [size, setSize] = useState<typeof SIZES[number]>(200);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = async () => {
    if (!text.trim()) { setError('Enter some text or a URL'); return; }
    setError(null);
    setIsLoading(true);
    try {
      // Dynamically import qrcode to keep bundle small
      const QRCode = (await import('qrcode')).default;
      const canvas = canvasRef.current;
      if (!canvas) return;
      await QRCode.toCanvas(canvas, text, {
        width: size,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: 'M',
        margin: 2,
      });
      setQrDataUrl(canvas.toDataURL('image/png'));
    } catch (e) {
      setError('Failed to generate QR code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const download = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qr-${Date.now()}.png`;
    a.click();
  };

  const copyImage = async () => {
    if (!qrDataUrl) return;
    try {
      const blob = await (await fetch(qrDataUrl)).blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* some browsers don't support image copy */ }
  };

  const presets = [
    { label: 'Website URL', placeholder: 'https://smartly.sale', example: 'https://smartly.sale' },
    { label: 'GCash Number', placeholder: '09171234567', example: '09171234567' },
    { label: 'Facebook', placeholder: 'https://facebook.com/yourpage', example: 'https://facebook.com/yourpage' },
    { label: 'Wi-Fi', placeholder: 'WIFI:S:MyNetwork;T:WPA;P:password;;', example: 'WIFI:S:MyNetwork;T:WPA;P:password;;' },
  ];

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <QrCode className="w-8 h-8 text-brand" />
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">QR Code Generator</h1>
        </div>
        <p className="text-muted-foreground">Generate QR codes for URLs, text, GCash numbers, Wi-Fi, and more</p>
      </div>

      <Card className="border-2">
        <CardContent className="px-4 sm:px-6 pt-6 space-y-4">
          {/* Quick presets */}
          <div className="space-y-1.5">
            <Label>Quick Presets</Label>
            <div className="flex flex-wrap gap-2">
              {presets.map(p => (
                <button key={p.label} onClick={() => setText(p.example)}
                  className="text-xs px-3 py-1.5 border border-border rounded-full hover:border-brand hover:text-brand transition-colors">
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="qr-input">Text or URL</Label>
            <div className="flex gap-2">
              <Input id="qr-input" value={text} onChange={e => setText(e.target.value)}
                placeholder="Enter URL, text, phone number..."
                onKeyDown={e => e.key === 'Enter' && generate()} />
              <Button variant="outline" onClick={() => { setText(''); setQrDataUrl(null); }}><RotateCcw className="w-4 h-4" /></Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <Label>Size (px)</Label>
              <select value={size} onChange={e => setSize(Number(e.target.value) as typeof SIZES[number])}
                className="w-full h-9 rounded-lg border border-border bg-card px-2 text-sm text-foreground">
                {SIZES.map(s => <option key={s} value={s}>{s}×{s}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>QR Color</Label>
              <div className="flex items-center gap-2 h-9">
                <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)}
                  className="w-9 h-9 rounded cursor-pointer border border-border" />
                <span className="text-xs text-muted-foreground font-mono">{fgColor}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Background</Label>
              <div className="flex items-center gap-2 h-9">
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                  className="w-9 h-9 rounded cursor-pointer border border-border" />
                <span className="text-xs text-muted-foreground font-mono">{bgColor}</span>
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button onClick={generate} disabled={isLoading || !text.trim()} className="w-full" size="lg">
            <QrCode className="w-4 h-4 mr-2" />
            {isLoading ? 'Generating...' : 'Generate QR Code'}
          </Button>
        </CardContent>
      </Card>

      {/* Hidden canvas for generation */}
      <canvas ref={canvasRef} className="hidden" />

      {qrDataUrl && (
        <Card className="border-2 border-brand/30 bg-brand/5">
          <CardContent className="px-4 sm:px-6 pt-6 pb-6 space-y-4">
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-xl shadow-md inline-block">
                <img src={qrDataUrl} alt="Generated QR code" className="block" width={size} height={size} />
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground break-all px-4">{text}</p>
            <div className="flex gap-2">
              <Button onClick={download} className="flex-1" size="lg">
                <Download className="w-4 h-4 mr-2" />Download PNG
              </Button>
              <Button onClick={copyImage} variant="outline" className="flex-1" size="lg">
                <Copy className="w-4 h-4 mr-2" />{copied ? 'Copied!' : 'Copy Image'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-brand/5 border-brand/20">
        <CardContent className="px-4 sm:px-6 pt-4 pb-4">
          <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2"><Info className="w-4 h-4" />Common uses</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>✓ Share your Shopee store link</span>
            <span>✓ GCash payment QR codes</span>
            <span>✓ Business card links</span>
            <span>✓ Wi-Fi network sharing</span>
            <span>✓ Event ticket links</span>
            <span>✓ Social media profiles</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeGenerator;
