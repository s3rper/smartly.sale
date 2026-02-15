import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Copy, Info, Palette, RefreshCw } from 'lucide-react';

interface ColorValues {
  hex: string;
  rgb: string;
  hsl: string;
  cmyk: string;
}

const ColorConverter: React.FC = () => {
  const [pickerColor, setPickerColor] = useState('#FF5733');
  const [colorValues, setColorValues] = useState<ColorValues>({
    hex: '#FF5733',
    rgb: 'rgb(255, 87, 51)',
    hsl: 'hsl(11, 100%, 60%)',
    cmyk: 'cmyk(0%, 66%, 80%, 0%)'
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 2000);
  };

  // Color conversion functions
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const rgbToCmyk = (r: number, g: number, b: number): { c: number; m: number; y: number; k: number } => {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const k = 1 - Math.max(rNorm, gNorm, bNorm);
    const c = k === 1 ? 0 : (1 - rNorm - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - gNorm - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - bNorm - k) / (1 - k);

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  };

  const updateFromHex = (hex: string) => {
    try {
      const rgb = hexToRgb(hex);
      if (!rgb) throw new Error('Invalid hex color');

      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

      setColorValues({
        hex: hex.toUpperCase(),
        rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
        cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`
      });
    } catch (error) {
      // Invalid color, ignore
    }
  };

  useEffect(() => {
    updateFromHex(pickerColor);
  }, [pickerColor]);

  const handleCopy = (value: string, format: string) => {
    navigator.clipboard.writeText(value);
    showAlert('success', `${format} copied!`);
  };

  const handleRandomColor = () => {
    const randomHex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setPickerColor(randomHex);
  };

  const presetColors = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#000000', '#FFFFFF', '#808080', '#FFA500', '#800080', '#008000'
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {alert && (
        <Alert className={alert.type === 'success' ? 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700'}>
          <Info className="h-4 w-4" />
          <AlertDescription className="font-medium">{alert.message}</AlertDescription>
        </Alert>
      )}

      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Palette className="w-10 h-10 text-brand" />
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Color Converter
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Convert between HEX, RGB, HSL, and CMYK color formats
        </p>
      </div>

      {/* Color Preview */}
      <Card className="border-2">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-xl">Color Preview</CardTitle>
          <CardDescription>Pick a color or enter values below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-full h-48 rounded-lg border-4 border-border shadow-lg"
              style={{ backgroundColor: pickerColor }}
            />

            <div className="w-full space-y-2">
              <Label htmlFor="colorPicker">Pick a Color</Label>
              <div className="flex gap-2">
                <input
                  id="colorPicker"
                  type="color"
                  value={pickerColor}
                  onChange={(e) => setPickerColor(e.target.value)}
                  className="h-12 w-24 cursor-pointer rounded border-2 border-border"
                />
                <Button
                  onClick={handleRandomColor}
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Random Color
                </Button>
              </div>
            </div>

            <div className="w-full">
              <Label className="mb-2 block">Quick Presets</Label>
              <div className="grid grid-cols-6 gap-2">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setPickerColor(color)}
                    className="w-full aspect-square rounded border-2 border-border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* HEX */}
        <Card className="border-2 border-brand/20 bg-brand/5">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg">HEX</CardTitle>
            <CardDescription>Hexadecimal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 px-4 sm:px-6">
            <div className="flex gap-2">
              <Input
                value={colorValues.hex}
                readOnly
                className="font-mono text-lg font-semibold"
              />
              <Button
                onClick={() => handleCopy(colorValues.hex, 'HEX')}
                variant="outline"
                size="icon"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Used in CSS, HTML, design tools
            </p>
          </CardContent>
        </Card>

        {/* RGB */}
        <Card className="border-2 border-brand/20 bg-brand/5">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg">RGB</CardTitle>
            <CardDescription>Red, Green, Blue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 px-4 sm:px-6">
            <div className="flex gap-2">
              <Input
                value={colorValues.rgb}
                readOnly
                className="font-mono text-lg font-semibold"
              />
              <Button
                onClick={() => handleCopy(colorValues.rgb, 'RGB')}
                variant="outline"
                size="icon"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Used in CSS, programming, displays
            </p>
          </CardContent>
        </Card>

        {/* HSL */}
        <Card className="border-2 border-brand/20 bg-brand/5">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg">HSL</CardTitle>
            <CardDescription>Hue, Saturation, Lightness</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 px-4 sm:px-6">
            <div className="flex gap-2">
              <Input
                value={colorValues.hsl}
                readOnly
                className="font-mono text-lg font-semibold"
              />
              <Button
                onClick={() => handleCopy(colorValues.hsl, 'HSL')}
                variant="outline"
                size="icon"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Used in CSS, easier color manipulation
            </p>
          </CardContent>
        </Card>

        {/* CMYK */}
        <Card className="border-2 border-brand/20 bg-brand/5">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg">CMYK</CardTitle>
            <CardDescription>Cyan, Magenta, Yellow, Black</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 px-4 sm:px-6">
            <div className="flex gap-2">
              <Input
                value={colorValues.cmyk}
                readOnly
                className="font-mono text-lg font-semibold"
              />
              <Button
                onClick={() => handleCopy(colorValues.cmyk, 'CMYK')}
                variant="outline"
                size="icon"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Used in printing and graphic design
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-brand/5 border-brand/20">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="w-5 h-5" />
            How to Use
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Use the color picker or click a preset color</li>
            <li>Try the "Random Color" button for inspiration</li>
            <li>View all color format conversions instantly</li>
            <li>Click the copy button next to any format to copy it</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg">Features</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>Convert between HEX, RGB, HSL, and CMYK formats</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>Visual color picker for easy selection</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>12 quick preset colors</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>Random color generator for inspiration</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>One-click copy for any color format</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>100% client-side - instant conversions</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorConverter;
