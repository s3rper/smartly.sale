# Favicon Files

The main favicon is `favicon.svg` which features an orange (#FF6600) shopping bag icon matching the navbar.

## Files Needed

For full browser compatibility, you should generate these PNG versions from the SVG:

1. **favicon.png** (32x32) - Main fallback favicon
2. **favicon-16x16.png** - Small size favicon
3. **favicon-32x32.png** - Standard size favicon
4. **apple-touch-icon.png** (180x180) - iOS home screen icon

## How to Generate PNG Files

You can use online tools or command-line tools to convert the SVG:

### Option 1: Online Tools
- Visit https://realfavicongenerator.net/
- Upload `favicon.svg`
- Download the generated package

### Option 2: Using ImageMagick (if installed)
```bash
# Install ImageMagick first if needed
# Then run:
convert public/favicon.svg -resize 16x16 public/favicon-16x16.png
convert public/favicon.svg -resize 32x32 public/favicon-32x32.png
convert public/favicon.svg -resize 180x180 public/apple-touch-icon.png
convert public/favicon.svg -resize 32x32 public/favicon.png
```

### Option 3: Using Node.js (sharp)
```bash
npm install sharp-cli -g
sharp -i public/favicon.svg -o public/favicon-16x16.png resize 16 16
sharp -i public/favicon.svg -o public/favicon-32x32.png resize 32 32
sharp -i public/favicon.svg -o public/favicon.png resize 32 32
sharp -i public/favicon.svg -o public/apple-touch-icon.png resize 180 180
```

## Current Status

✅ favicon.svg - Created (orange shopping bag icon)
⏳ PNG versions - Need to be generated from SVG

The SVG will work in most modern browsers, but PNG fallbacks ensure compatibility with older browsers and iOS devices.
