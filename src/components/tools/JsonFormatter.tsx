import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Copy, Download, RefreshCw, Info, CheckCircle, XCircle, Code, Minimize2 } from 'lucide-react';

const JsonFormatter: React.FC = () => {
  const [inputJson, setInputJson] = useState('');
  const [outputJson, setOutputJson] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [indentSize, setIndentSize] = useState(2);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleBeautify = () => {
    if (!inputJson.trim()) {
      showAlert('error', 'Please enter some JSON');
      return;
    }

    setIsProcessing(true);
    setValidationError(null);

    try {
      const parsed = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutputJson(formatted);
      setIsValid(true);
      showAlert('success', 'JSON formatted successfully!');
    } catch (error) {
      setIsValid(false);
      const errorMessage = error instanceof Error ? error.message : 'Invalid JSON';
      setValidationError(errorMessage);
      setOutputJson('');
      showAlert('error', 'Invalid JSON format');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMinify = () => {
    if (!inputJson.trim()) {
      showAlert('error', 'Please enter some JSON');
      return;
    }

    setIsProcessing(true);
    setValidationError(null);

    try {
      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);
      setOutputJson(minified);
      setIsValid(true);
      showAlert('success', 'JSON minified successfully!');
    } catch (error) {
      setIsValid(false);
      const errorMessage = error instanceof Error ? error.message : 'Invalid JSON';
      setValidationError(errorMessage);
      setOutputJson('');
      showAlert('error', 'Invalid JSON format');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleValidate = () => {
    if (!inputJson.trim()) {
      showAlert('error', 'Please enter some JSON');
      return;
    }

    setValidationError(null);

    try {
      JSON.parse(inputJson);
      setIsValid(true);
      showAlert('success', 'Valid JSON!');
    } catch (error) {
      setIsValid(false);
      const errorMessage = error instanceof Error ? error.message : 'Invalid JSON';
      setValidationError(errorMessage);
      showAlert('error', 'Invalid JSON');
    }
  };

  const handleCopy = () => {
    if (!outputJson) return;
    navigator.clipboard.writeText(outputJson);
    showAlert('success', 'Copied to clipboard!');
  };

  const handleDownload = () => {
    if (!outputJson) return;

    const blob = new Blob([outputJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showAlert('success', 'Downloaded!');
  };

  const handleClear = () => {
    setInputJson('');
    setOutputJson('');
    setValidationError(null);
    setIsValid(false);
    showAlert('success', 'Cleared!');
  };

  const getLineCount = (text: string) => {
    return text ? text.split('\n').length : 0;
  };

  const getSizeInKB = (text: string) => {
    return (new Blob([text]).size / 1024).toFixed(2);
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
            JSON Formatter & Validator
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Format, minify, and validate JSON data instantly
        </p>
      </div>

      <Card className="border-2">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-xl">Input JSON</CardTitle>
          <CardDescription>Paste your JSON data below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <div className="space-y-2">
            <Label htmlFor="input">JSON Input</Label>
            <Textarea
              id="input"
              placeholder='{"name": "example", "value": 123}'
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Lines: {getLineCount(inputJson)}</span>
              <span>Size: {getSizeInKB(inputJson)} KB</span>
            </div>
          </div>

          {validationError && (
            <Alert className="bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700">
              <XCircle className="h-4 w-4" />
              <AlertDescription className="font-medium text-sm">
                <strong>Error:</strong> {validationError}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="indent">Indent Size (for beautify)</Label>
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

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleBeautify}
              disabled={isProcessing || !inputJson.trim()}
              className="flex-1"
              size="lg"
            >
              <Code className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
              Beautify
            </Button>
            <Button
              onClick={handleMinify}
              disabled={isProcessing || !inputJson.trim()}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <Minimize2 className="w-4 h-4 mr-2" />
              Minify
            </Button>
            <Button
              onClick={handleValidate}
              disabled={!inputJson.trim()}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Validate
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

      {outputJson && (
        <Card className="border-2 border-brand/20 bg-brand/5">
          <CardHeader className="px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Output</CardTitle>
                <CardDescription>Formatted JSON result</CardDescription>
              </div>
              {isValid && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Valid JSON
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            <div className="space-y-2">
              <Label htmlFor="output">Result</Label>
              <Textarea
                id="output"
                value={outputJson}
                readOnly
                rows={12}
                className="font-mono text-sm bg-card"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Lines: {getLineCount(outputJson)}</span>
                <span>Size: {getSizeInKB(outputJson)} KB</span>
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
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Paste your JSON data in the input area</li>
            <li>Choose an action: Beautify (format), Minify (compress), or Validate</li>
            <li>View the result in the output area</li>
            <li>Copy to clipboard or download as a file</li>
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
              <span>Beautify JSON with customizable indentation (2, 3, or 4 spaces)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>Minify JSON to reduce file size</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>Validate JSON syntax with detailed error messages</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>Shows line count and file size</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>100% client-side - your data never leaves your browser</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>No signup required</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default JsonFormatter;
