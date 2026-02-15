import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Copy, Download, Info, Upload, Image as ImageIcon, RefreshCw } from 'lucide-react';

const Base64ImageEncoder: React.FC = () => {
  const [base64String, setBase64String] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageInfo, setImageInfo] = useState<{ size: string; type: string } | null>(null);
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      showAlert('error', 'Please upload an image file');
      return;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showAlert('error', 'Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setBase64String(result);
      setImagePreview(result);
      setImageInfo({
        size: (file.size / 1024).toFixed(2) + ' KB',
        type: file.type
      });
      showAlert('success', 'Image encoded successfully!');
    };
    reader.onerror = () => {
      showAlert('error', 'Failed to read image');
    };
    reader.readAsDataURL(file);
  };

  const handleDecode = () => {
    try {
      // Validate base64 string
      if (!base64String.trim()) {
        showAlert('error', 'Please enter a base64 string');
        return;
      }

      // Check if it's a data URL or raw base64
      let dataUrl = base64String;
      if (!base64String.startsWith('data:')) {
        // Assume it's a raw base64 string, add image/png prefix
        dataUrl = `data:image/png;base64,${base64String}`;
      }

      // Try to create an image to validate
      const img = new Image();
      img.onload = () => {
        setImagePreview(dataUrl);
        showAlert('success', 'Base64 decoded successfully!');
      };
      img.onerror = () => {
        showAlert('error', 'Invalid base64 image string');
      };
      img.src = dataUrl;
    } catch (error) {
      showAlert('error', 'Invalid base64 format');
    }
  };

  const handleCopy = () => {
    if (!base64String) return;
    navigator.clipboard.writeText(base64String);
    showAlert('success', 'Copied to clipboard!');
  };

  const handleDownloadBase64 = () => {
    if (!base64String) return;

    const blob = new Blob([base64String], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `base64-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showAlert('success', 'Base64 text downloaded!');
  };

  const handleDownloadImage = () => {
    if (!imagePreview) return;

    const a = document.createElement('a');
    a.href = imagePreview;
    a.download = `image-${Date.now()}.png`;
    a.click();
    showAlert('success', 'Image downloaded!');
  };

  const handleClear = () => {
    setBase64String('');
    setImagePreview('');
    setImageInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showAlert('success', 'Cleared!');
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
          <ImageIcon className="w-10 h-10 text-brand" />
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Base64 Image Encoder
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Convert images to Base64 strings and back
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex gap-2 justify-center">
        <Button
          onClick={() => setMode('encode')}
          variant={mode === 'encode' ? 'default' : 'outline'}
          size="lg"
        >
          <Upload className="w-4 h-4 mr-2" />
          Encode Image
        </Button>
        <Button
          onClick={() => setMode('decode')}
          variant={mode === 'decode' ? 'default' : 'outline'}
          size="lg"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Decode Base64
        </Button>
      </div>

      {/* Encode Mode */}
      {mode === 'encode' && (
        <Card className="border-2">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-xl">Upload Image</CardTitle>
            <CardDescription>Select an image file to convert to Base64</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            <div className="space-y-2">
              <Label htmlFor="fileUpload">Choose Image</Label>
              <input
                ref={fileInputRef}
                id="fileUpload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand file:text-white hover:file:bg-brand/90 cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Supported: JPG, PNG, GIF, SVG, WEBP (max 5MB)
              </p>
            </div>

            {imageInfo && (
              <div className="bg-muted rounded-lg p-3 text-sm">
                <p><strong>Type:</strong> {imageInfo.type}</p>
                <p><strong>Size:</strong> {imageInfo.size}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Decode Mode */}
      {mode === 'decode' && (
        <Card className="border-2">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-xl">Base64 Input</CardTitle>
            <CardDescription>Paste your Base64 string to decode</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            <div className="space-y-2">
              <Label htmlFor="base64Input">Base64 String</Label>
              <Textarea
                id="base64Input"
                placeholder="data:image/png;base64,iVBORw0KGgo..."
                value={base64String}
                onChange={(e) => setBase64String(e.target.value)}
                rows={6}
                className="font-mono text-xs"
              />
            </div>

            <Button
              onClick={handleDecode}
              disabled={!base64String.trim()}
              className="w-full"
              size="lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Decode to Image
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Image Preview */}
      {imagePreview && (
        <Card className="border-2 border-brand/20 bg-brand/5">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-xl">Image Preview</CardTitle>
            <CardDescription>Your converted image</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            <div className="bg-checkerboard rounded-lg p-4 flex items-center justify-center min-h-[200px]">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-full max-h-96 object-contain rounded"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleDownloadImage}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Image
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Base64 Output */}
      {base64String && mode === 'encode' && (
        <Card className="border-2 border-brand/20 bg-brand/5">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-xl">Base64 Output</CardTitle>
            <CardDescription>Your encoded Base64 string</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            <div className="space-y-2">
              <Label htmlFor="output">Base64 String</Label>
              <Textarea
                id="output"
                value={base64String}
                readOnly
                rows={8}
                className="font-mono text-xs bg-card"
              />
              <p className="text-xs text-muted-foreground">
                Length: {base64String.length.toLocaleString()} characters
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
                onClick={handleDownloadBase64}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Text
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clear Button */}
      {(imagePreview || base64String) && (
        <Button
          onClick={handleClear}
          variant="outline"
          className="w-full"
          size="lg"
        >
          Clear All
        </Button>
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
              <strong className="text-foreground">Encode Mode:</strong>
              <ol className="list-decimal list-inside space-y-1 mt-1 ml-2">
                <li>Click "Encode Image" tab</li>
                <li>Upload an image file (max 5MB)</li>
                <li>Copy or download the Base64 string</li>
              </ol>
            </div>
            <div>
              <strong className="text-foreground">Decode Mode:</strong>
              <ol className="list-decimal list-inside space-y-1 mt-1 ml-2">
                <li>Click "Decode Base64" tab</li>
                <li>Paste a Base64 string</li>
                <li>Click "Decode to Image"</li>
                <li>Download the converted image</li>
              </ol>
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
              <span>Convert images to Base64 strings for embedding in HTML/CSS</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>Decode Base64 back to viewable images</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>Supports all image formats (JPG, PNG, GIF, SVG, WEBP)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>Live preview of uploaded/decoded images</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              <span>100% client-side - images never uploaded to server</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Base64ImageEncoder;
