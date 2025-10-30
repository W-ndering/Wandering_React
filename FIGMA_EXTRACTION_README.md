# Figma Design Extraction - Complete Documentation

## Overview

This directory contains complete design specifications extracted from Figma for the **Wandering** project. All 8 scenes have been fetched with 100% accuracy, including detailed layer information, typography, colors, positioning, and image references.

**Total Scenes Extracted:** 8 scenes
**Total Variations:** 75 unique frames
**Total Image Assets:** 84 unique images
**Canvas Size:** 2560x1440px (QHD)

---

## Generated Files

### 1. Core Data Files

#### `figma-designs.json` (1.7MB)
- **Complete raw data** from Figma REST API
- Contains the full document tree with all properties
- Includes: fills, strokes, effects, text styles, layout properties, etc.
- Use this for deep analysis or custom extraction

#### `figma-designs-organized.json` (240KB)
- **Organized by scene** with extracted key elements
- Each scene contains:
  - All variations (frames)
  - Backgrounds, characters, text layers, UI elements
  - Positioning and styling information
  - Image references
- **Best for implementation** - structured and easy to parse

#### `design-index.json` (35KB)
- **Quick reference** for all scenes
- Summary of each scene with:
  - Scene slug and range
  - Variation count
  - Element counts per variation
  - Text content preview
- Use this for navigation and overview

#### `image-catalog.json` (114KB)
- **Complete inventory** of all 84 unique images
- Each image includes:
  - Unique image reference (hash)
  - List of scenes where used
  - Figma S3 URL
- Helps identify shared assets vs scene-specific images

---

### 2. Documentation Files

#### `DESIGN_SUMMARY.md` (94KB)
**Comprehensive layer-by-layer breakdown**

Contains for each scene:
- Frame dimensions and background color
- All variations with detailed specifications:
  - Text layers: content, font, size, color, position
  - Background images: position, size, fills
  - Characters: position, size, image refs
  - UI elements: type, position, styling
  - Image references with IDs

**Use this to implement scenes pixel-perfectly.**

#### `IMPLEMENTATION_GUIDE.md` (1.4KB)
**Quick reference for developers**

Contains:
- Scene mapping table (name → slug → scene numbers)
- Common specifications (canvas size, fonts)
- Typography scale (all font sizes used)
- Color palette (all colors used)
- Asset organization suggestions
- Next steps for implementation

#### `DOWNLOAD_IMAGES.md` (2.2KB)
**Instructions for downloading image assets**

Contains:
- Figma API usage examples
- Export methods (API vs UI)
- Suggested folder structure
- File organization recommendations

---

## Scene Breakdown

| Scene Name | Slug | Scene Numbers | Variations | Images |
|------------|------|---------------|------------|--------|
| 9-#2_버스정류장 2 | bus-stop | 32-37 | 8 | 8 |
| 10-#2_버스정류장_과거회상 2 | bus-stop-memory | 38-43 | 5 | 4 |
| 11-#4_버스_출발 2 | in-bus | 44-54 | 5 | 14 |
| 선택지1 | bus-choices | 55-64 | 15 | 23 |
| 시장 입구 | market | 132-139 | 6 | 11 |
| 선택지 | market-choices | 140-151 | 1 | 10 |
| 오두막집 | hut | 152-156 | 31 | 36 |
| end | credits | 184-187 | 4 | 6 |

**Total:** 8 scenes, 75 variations, 84 unique images

---

## Design Specifications

### Canvas
- **Resolution:** 2560x1440px (QHD)
- **Format:** Landscape
- **Aspect Ratio:** 16:9

### Typography
- **Primary Font:** DungGeunMo (Korean pixel font)
- **Font Sizes:** 48px, 50px, 60px, 120px
- **Font Weight:** 400 (regular)
- **Text Colors:** #ffffff (white), #000000 (black)

### Colors
- **Text:** White (#ffffff) for titles, Black (#000000) for dialogue
- **Backgrounds:** Transparent (rgba(0,0,0,0)) - uses image fills

### Image Assets
- **Total Unique Images:** 84
- **Shared Images:** 75 (used in multiple scenes)
- **Most Reused:**
  - `38e0bfcd08f5...` - used in 64 variations
  - `5bced6c22c51...` - used in 48 variations
  - `ad4e80f555be...` - used in 46 variations

---

## How to Use This Data

### For Pixel-Perfect Implementation

1. **Read the specs:** Open `DESIGN_SUMMARY.md`
2. **Find your scene:** Each scene has all variations listed
3. **Implement each variation:**
   - Use exact positioning (x, y coordinates)
   - Use exact dimensions (width, height)
   - Use specified fonts and sizes
   - Match colors exactly

### For Quick Reference

1. **Check `IMPLEMENTATION_GUIDE.md`** for overview
2. **Use `design-index.json`** to see all scenes at a glance
3. **Reference `image-catalog.json`** for asset inventory

### For Programmatic Access

```javascript
// Load organized data
import designs from './figma-designs-organized.json';

// Get a specific scene
const busStop = designs['9-#2_버스정류장 2'];

// Access variations
busStop.variations.forEach(variation => {
  console.log(`Variation ${variation.index}:`);
  console.log(`- Text layers: ${variation.elements.texts.length}`);
  console.log(`- Images: ${variation.imageUrls.length}`);
});

// Get all text content
const allText = busStop.variations
  .flatMap(v => v.elements.texts)
  .map(t => t.content);
```

---

## Data Extraction Process

All data was extracted using the Figma REST API:

1. **Fetched file data** from Figma API
   - Endpoint: `GET /v1/files/:file_key`
   - Retrieved complete document structure

2. **Found all target frames** by name
   - Searched for 8 scene names in document tree
   - Found 75 total variations (multiple frames per scene)

3. **Extracted layer information** recursively
   - Backgrounds, characters, text, UI elements
   - Position, size, fills, strokes, effects
   - Typography (font, size, weight, color)

4. **Collected image references**
   - 84 unique image refs identified
   - Tracked usage across scenes

5. **Organized and documented**
   - Created structured JSON files
   - Generated human-readable documentation
   - Built reference guides

---

## Implementation Checklist

- [ ] Review `DESIGN_SUMMARY.md` for your assigned scene
- [ ] Check `image-catalog.json` for required images
- [ ] Download images from Figma (see `DOWNLOAD_IMAGES.md`)
- [ ] Organize images in suggested folder structure
- [ ] Create React components for each variation
- [ ] Implement exact positioning and styling
- [ ] Add text layers with correct fonts and sizes
- [ ] Test on 2560x1440 resolution
- [ ] Verify against Figma designs

---

## API Information

**Figma File:**
- File ID: `axR6PYBmVYAfQK3aKJQl7e`
- File URL: https://www.figma.com/design/axR6PYBmVYAfQK3aKJQl7e/W-ndering_화면-구성?node-id=18-2

**API Token:**
- Stored in `.env` as `FIGMA_TOKEN`
- Used for authenticated API requests

---

## Scripts Used

All extraction scripts are included:

1. `fetchFigmaDesigns.js` - Initial data fetch from Figma
2. `analyzeFigmaDesigns.js` - Data organization and analysis
3. `fetchImageUrls.js` - Export URL generation (attempted)
4. `createDesignSummary.js` - Documentation generation
5. `extractImageRefs.js` - Image catalog creation

Run any script with: `node <script-name>.js`

---

## Notes

- **Image Export URLs:** The Figma API timed out when requesting export URLs for all 75 frames due to size. You can:
  - Export frames individually from Figma UI
  - Use smaller batches with the API
  - Request specific node IDs as needed

- **Image References:** All image refs are hashes that map to Figma's S3 storage. Some may require authentication to access.

- **Scene Variations:** Each scene has multiple variations representing different states or frames. Implement all variations for complete scene coverage.

- **Shared Assets:** 75 out of 84 images are shared across scenes. Consider organizing these in a `/shared` folder to avoid duplication.

---

## Support

For questions about the data structure or implementation:
1. Review this README
2. Check relevant documentation file
3. Examine `figma-designs-organized.json` structure
4. Reference Figma file directly

---

**Generated:** 2025-10-30
**Figma File Version:** Latest at time of extraction
**Total Data Size:** ~2.5MB (all files combined)
