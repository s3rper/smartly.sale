import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Copy, Download, Info, Minimize2, Code, TrendingDown } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';

const CssMinifier: React.FC = () => {
  const [inputCss, setInputCss] = useState('');
  const [outputCss, setOutputCss] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [preserveComments, setPreserveComments] = useState(false);
  const [indentSize, setIndentSize] = useState(2);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const minifyCss = (css: string, keepComments: boolean = false): string => {
    let minified = css;

    // Remove comments (unless preserveComments is true)
    if (!keepComments) {
      minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
    }

    // Remove unnecessary whitespace
    minified = minified
      .replace(/\s+/g, ' ') // Multiple spaces to single space
      .replace(/\s*{\s*/g, '{') // Spaces around {
      .replace(/\s*}\s*/g, '}') // Spaces around }
      .replace(/\s*;\s*/g, ';') // Spaces around ;
      .replace(/\s*:\s*/g, ':') // Spaces around :
      .replace(/\s*,\s*/g, ',') // Spaces around ,
      .replace(/;\s*}/g, '}') // Remove last semicolon before }
      .trim();

    return minified;
  };

  const beautifyCss = (css: string, indent: number = 2): string => {
    const indentStr = ' '.repeat(indent);
    let beautified = css;
    let level = 0;

    // Remove existing formatting
    beautified = beautified.replace(/\s+/g, ' ').trim();

    // Add newlines and indentation
    beautified = beautified
      .replace(/{/g, () => {
        level++;
        return ' {\n' + indentStr.repeat(level);
      })
      .replace(/}/g, () => {
        level = Math.max(0, level - 1);
        return '\n' + indentStr.repeat(level) + '}\n' + indentStr.repeat(level);
      })
      .replace(/;/g, ';\n' + indentStr.repeat(level))
      .replace(/,/g, ',\n' + indentStr.repeat(level));

    // Clean up extra newlines
    beautified = beautified
      .replace(/\n\s*\n/g, '\n')
      .trim();

    return beautified;
  };

  const handleMinify = () => {
    if (!inputCss.trim()) {
      showAlert('error', 'Please enter some CSS');
      return;
    }

    setIsProcessing(true);

    try {
      const minified = minifyCss(inputCss, preserveComments);
      setOutputCss(minified);

      const originalSize = new Blob([inputCss]).size;
      const minifiedSize = new Blob([minified]).size;
      const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);

      showAlert('success', `Minified! Size reduced by ${savings}%`);
    } catch (error) {
      showAlert('error', 'Error minifying CSS');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBeautify = () => {
    if (!inputCss.trim()) {
      showAlert('error', 'Please enter some CSS');
      return;
    }

    setIsProcessing(true);

    try {
      const beautified = beautifyCss(inputCss, indentSize);
      setOutputCss(beautified);
      showAlert('success', 'CSS beautified successfully!');
    } catch (error) {
      showAlert('error', 'Error beautifying CSS');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!outputCss) return;
    navigator.clipboard.writeText(outputCss);
    showAlert('success', 'Copied to clipboard!');
  };

  const handleDownload = () => {
    if (!outputCss) return;

    const blob = new Blob([outputCss], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `styles-${Date.now()}.css`;
    a.click();
    URL.revokeObjectURL(url);
    showAlert('success', 'Downloaded!');
  };

  const handleClear = () => {
    setInputCss('');
    setOutputCss('');
    showAlert('success', 'Cleared!');
  };

  const getFileSize = (text: string) => {
    return (new Blob([text]).size / 1024).toFixed(2);
  };

  const getSavings = () => {
    if (!inputCss || !outputCss) return '0';
    const originalSize = new Blob([inputCss]).size;
    const outputSize = new Blob([outputCss]).size;
    return ((1 - outputSize / originalSize) * 100).toFixed(1);
  };

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
          <Code className="w-10 h-10 text-brand" />
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            CSS Minifier & Beautifier
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Compress or format your CSS code instantly
        </p>
      </div>

      <Card className="border-2">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-xl">Input CSS</CardTitle>
          <CardDescription>Paste your CSS code below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <div className="space-y-2">
            <Label htmlFor="input">CSS Code</Label>
            <Textarea
              id="input"
              placeholder=".button { color: red; background: blue; }"
              value={inputCss}
              onChange={(e) => setInputCss(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Size: {getFileSize(inputCss)} KB
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="comments"
                checked={preserveComments}
                onCheckedChange={(checked) => setPreserveComments(checked as boolean)}
              />
              <Label htmlFor="comments" className="text-sm cursor-pointer">
                Preserve comments (minify only)
              </Label>
            </div>

            <div className="space-y-2">
              <Label>Indent Size (beautify only)</Label>
              <div className="flex gap-2">
                {[2, 3, 4].map((size) => (
                  <Button
                    key={size}
                    onClick={() => setIndentSize(size)}
                    variant={indentSize === size ? 'default' : 'outline'}
                    size="sm"
                  >
                    {size} spaces
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleMinify}
              disabled={isProcessing || !inputCss.trim()}
              className="flex-1"
              size="lg"
            >
              <Minimize2 className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
              Minify
            </Button>
            <Button
              onClick={handleBeautify}
              disabled={isProcessing || !inputCss.trim()}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <Code className="w-4 h-4 mr-2" />
              Beautify
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              size="lg"
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {outputCss && (
        <Card className="border-2 border-brand/20 bg-brand/5">
          <CardHeader className="px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Output</CardTitle>
                <CardDescription>Your processed CSS</CardDescription>
              </div>
              {parseFloat(getSavings()) > 0 && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium">
                  <TrendingDown className="w-4 h-4" />
                  {getSavings()}% smaller
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            <div className="space-y-2">
              <Label htmlFor="output">Result</Label>
              <Textarea
                id="output"
                value={outputCss}
                readOnly
                rows={12}
                className="font-mono text-sm bg-card"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Size: {getFileSize(outputCss)} KB</span>
                {inputCss && (
                  <span>Original: {getFileSize(inputCss)} KB</span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleCopy}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-brand/5 border-brand/20">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="w-5 h-5" />
            How to Use
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-3 text-sm text-muted-foreground">
            <div>
              <strong className="text-foreground">Minify:</strong>
              <p className="mt-1">Compress your CSS by removing unnecessary whitespace and comments. Reduces file size for faster loading.</p>
            </div>
            <div>
              <strong className="text-foreground">Beautify:</strong>
              <p className="mt-1">Format your CSS with proper indentation and line breaks. Makes code more readable.</p>
            </div>
          </div>
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
              <span>Minify CSS to reduce file size</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>Beautify CSS with customizable indentation (2, 3, or 4 spaces)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>Option to preserve comments while minifying</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>Shows file size and savings percentage</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>100% client-side - your code never leaves your browser</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>Download processed CSS as a file</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CssMinifier;
