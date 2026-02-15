import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Copy, Download, Info, Code2, ArrowRightLeft } from 'lucide-react';

const HtmlEntityEncoder: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const htmlEntities: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '©': '&copy;',
    '®': '&reg;',
    '™': '&trade;',
    '€': '&euro;',
    '£': '&pound;',
    '¥': '&yen;',
    '§': '&sect;',
    '¶': '&para;',
    '†': '&dagger;',
    '‡': '&Dagger;',
    '•': '&bull;',
    '…': '&hellip;',
    '′': '&prime;',
    '″': '&Prime;',
    '‹': '&lsaquo;',
    '›': '&rsaquo;',
    '«': '&laquo;',
    '»': '&raquo;',
    '\u2018': '&lsquo;',
    '\u2019': '&rsquo;',
    '\u201C': '&ldquo;',
    '\u201D': '&rdquo;',
    '–': '&ndash;',
    '—': '&mdash;',
    '\u00A0': '&nbsp;',
  };

  const handleEncode = () => {
    if (!inputText.trim()) {
      showAlert('error', 'Please enter some text');
      return;
    }

    let encoded = inputText;
    for (const [char, entity] of Object.entries(htmlEntities)) {
      encoded = encoded.replace(new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), entity);
    }

    setOutputText(encoded);
    showAlert('success', 'Text encoded successfully!');
  };

  const handleDecode = () => {
    if (!inputText.trim()) {
      showAlert('error', 'Please enter some text');
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.innerHTML = inputText;
    const decoded = textarea.value;

    setOutputText(decoded);
    showAlert('success', 'Text decoded successfully!');
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    showAlert('success', 'Copied to clipboard!');
  };

  const handleDownload = () => {
    if (!outputText) return;

    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `html-entity-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showAlert('success', 'Downloaded!');
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    showAlert('success', 'Cleared!');
  };

  const commonEntities = [
    { char: '<', entity: '&lt;', name: 'Less than' },
    { char: '>', entity: '&gt;', name: 'Greater than' },
    { char: '&', entity: '&amp;', name: 'Ampersand' },
    { char: '"', entity: '&quot;', name: 'Double quote' },
    { char: "'", entity: '&#39;', name: 'Single quote' },
    { char: ' ', entity: '&nbsp;', name: 'Non-breaking space' },
    { char: '©', entity: '&copy;', name: 'Copyright' },
    { char: '®', entity: '&reg;', name: 'Registered' },
    { char: '™', entity: '&trade;', name: 'Trademark' },
    { char: '€', entity: '&euro;', name: 'Euro' },
    { char: '£', entity: '&pound;', name: 'Pound' },
    { char: '¥', entity: '&yen;', name: 'Yen' },
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
          <Code2 className="w-10 h-10 text-brand" />
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            HTML Entity Encoder/Decoder
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Convert HTML entities to characters and back
        </p>
      </div>

      <Card className="border-2">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-xl">Input Text</CardTitle>
          <CardDescription>Enter your text or HTML entities below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <div className="space-y-2">
            <Label htmlFor="input">Text Input</Label>
            <Textarea
              id="input"
              placeholder="Enter text with special characters or HTML entities..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Characters: {inputText.length}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleEncode}
              disabled={!inputText.trim()}
              className="flex-1"
              size="lg"
            >
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Encode to Entities
            </Button>
            <Button
              onClick={handleDecode}
              disabled={!inputText.trim()}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Decode from Entities
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

      {outputText && (
        <Card className="border-2 border-brand/20 bg-brand/5">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-xl">Output</CardTitle>
            <CardDescription>Your converted result</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            <div className="space-y-2">
              <Label htmlFor="output">Result</Label>
              <Textarea
                id="output"
                value={outputText}
                readOnly
                rows={8}
                className="font-mono text-sm bg-card"
              />
              <p className="text-xs text-muted-foreground">
                Characters: {outputText.length}
              </p>
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

      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg">Common HTML Entities Reference</CardTitle>
          <CardDescription>Quick reference for frequently used entities</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2">Character</th>
                  <th className="text-left py-2 px-2">Entity</th>
                  <th className="text-left py-2 px-2">Name</th>
                </tr>
              </thead>
              <tbody>
                {commonEntities.map((item, index) => (
                  <tr key={index} className="border-b border-border/50">
                    <td className="py-2 px-2 font-mono font-semibold">{item.char}</td>
                    <td className="py-2 px-2 font-mono text-brand">{item.entity}</td>
                    <td className="py-2 px-2 text-muted-foreground">{item.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

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
              <strong className="text-foreground">Encode:</strong>
              <p className="mt-1">Convert special characters (like &lt; &gt; &amp;) to HTML entities (&amp;lt; &amp;gt; &amp;amp;)</p>
            </div>
            <div>
              <strong className="text-foreground">Decode:</strong>
              <p className="mt-1">Convert HTML entities back to their character representations</p>
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
              <span>Encode special characters to HTML entities</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>Decode HTML entities back to characters</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>Supports named entities (&amp;copy;) and numeric entities (&amp;#39;)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>Quick reference table for common entities</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>100% client-side processing</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default HtmlEntityEncoder;
