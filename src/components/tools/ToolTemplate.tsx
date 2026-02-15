/**
 * Reusable Tool Template
 *
 * This is a template for creating new tools. Copy this file and customize it.
 *
 * How to use:
 * 1. Copy this file to a new component (e.g., CharacterFrequency.tsx)
 * 2. Update the component name and title
 * 3. Add your tool-specific state and logic
 * 4. Customize the input/output sections
 * 5. Create a new .astro page that uses this component
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Copy, Download, RefreshCw, Info } from 'lucide-react';

interface ToolTemplateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

const ToolTemplate: React.FC<ToolTemplateProps> = ({
  title = "Tool Name",
  description = "Tool description goes here",
  icon = null
}) => {
  // State management
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Show alert temporarily
  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  // Main processing function - customize this for your tool
  const handleProcess = () => {
    if (!inputText.trim()) {
      showAlert('error', 'Please enter some text');
      return;
    }

    setIsProcessing(true);

    try {
      // TODO: Replace this with your tool's logic
      const result = inputText; // Placeholder

      setOutputText(result);
      showAlert('success', 'Processing complete!');
    } catch (error) {
      showAlert('error', 'An error occurred during processing');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Copy to clipboard
  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    showAlert('success', 'Copied to clipboard!');
  };

  // Download as text file
  const handleDownload = () => {
    if (!outputText) return;

    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showAlert('success', 'Downloaded!');
  };

  // Clear all
  const handleClear = () => {
    setInputText('');
    setOutputText('');
    showAlert('success', 'Cleared!');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Alert */}
      {alert && (
        <Alert className={alert.type === 'success' ? 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700'}>
          <Info className="h-4 w-4" />
          <AlertDescription className="font-medium">{alert.message}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          {icon}
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            {title}
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          {description}
        </p>
      </div>

      {/* Main Tool Card */}
      <Card className="border-2">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-xl">Input</CardTitle>
          <CardDescription>Enter your text below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          {/* Input Area */}
          <div className="space-y-2">
            <Label htmlFor="input">Text Input</Label>
            <Textarea
              id="input"
              placeholder="Enter or paste your text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Characters: {inputText.length}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleProcess}
              disabled={isProcessing || !inputText.trim()}
              className="flex-1"
              size="lg"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
              {isProcessing ? 'Processing...' : 'Process'}
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Output Card */}
      {outputText && (
        <Card className="border-2 border-brand/20 bg-brand/5">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-xl">Output</CardTitle>
            <CardDescription>Your processed result</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            {/* Output Area */}
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

            {/* Output Actions */}
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

      {/* How to Use */}
      <Card className="bg-brand/5 border-brand/20">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="w-5 h-5" />
            How to Use
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Enter or paste your text in the input area</li>
            <li>Click the "Process" button</li>
            <li>View your results in the output area</li>
            <li>Copy or download the result</li>
          </ol>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg">Features</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>100% client-side - your data never leaves your browser</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>No signup or account required</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>Fast and instant processing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>Works offline after initial load</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ToolTemplate;
