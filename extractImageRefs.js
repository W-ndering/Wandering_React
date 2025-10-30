import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the raw Figma designs
const designsPath = path.join(__dirname, 'figma-designs.json');
const designs = JSON.parse(fs.readFileSync(designsPath, 'utf-8'));

// Load the organized designs
const organizedPath = path.join(__dirname, 'figma-designs-organized.json');
const organized = JSON.parse(fs.readFileSync(organizedPath, 'utf-8'));

// Extract all unique image references
function extractAllImageRefs(node, refs = new Set()) {
  if (node.fills) {
    node.fills.forEach(fill => {
      if (fill.type === 'IMAGE' && fill.imageRef) {
        refs.add(fill.imageRef);
      }
    });
  }

  if (node.children) {
    node.children.forEach(child => extractAllImageRefs(child, refs));
  }

  return refs;
}

// Collect all image refs from all scenes
const allImageRefs = new Set();
designs.scenes.forEach(scene => {
  extractAllImageRefs(scene.layers, allImageRefs);
});

console.log(`Total unique image references: ${allImageRefs.size}\n`);

// Create a mapping of image refs to scenes
const imageRefToScenes = {};
Object.keys(organized).forEach(sceneName => {
  const scene = organized[sceneName];
  scene.variations.forEach((variation, vIndex) => {
    if (variation.imageUrls) {
      variation.imageUrls.forEach(img => {
        if (!imageRefToScenes[img.imageRef]) {
          imageRefToScenes[img.imageRef] = [];
        }
        imageRefToScenes[img.imageRef].push({
          sceneName,
          variation: vIndex + 1,
          variationId: variation.id,
        });
      });
    }
  });
});

// Create image catalog
const imageCatalog = {
  metadata: {
    totalImages: allImageRefs.size,
    generated: new Date().toISOString(),
  },
  images: Array.from(allImageRefs).map((ref, index) => ({
    index: index + 1,
    imageRef: ref,
    usedInScenes: imageRefToScenes[ref] || [],
    figmaUrl: `https://s3-alpha.figma.com/img/${ref.substring(0, 4)}/${ref}`,
  })),
};

// Save catalog
const catalogPath = path.join(__dirname, 'image-catalog.json');
fs.writeFileSync(catalogPath, JSON.stringify(imageCatalog, null, 2));
console.log(`Image catalog saved to: ${catalogPath}\n`);

// Print summary
console.log('=== IMAGE CATALOG SUMMARY ===\n');
console.log(`Total unique images: ${imageCatalog.images.length}\n`);

// Group by scene usage
const sceneUsage = {};
imageCatalog.images.forEach(img => {
  img.usedInScenes.forEach(usage => {
    if (!sceneUsage[usage.sceneName]) {
      sceneUsage[usage.sceneName] = new Set();
    }
    sceneUsage[usage.sceneName].add(img.imageRef);
  });
});

console.log('Images per scene:');
Object.keys(sceneUsage).forEach(sceneName => {
  console.log(`  ${sceneName}: ${sceneUsage[sceneName].size} unique images`);
});

// Find shared images
const sharedImages = imageCatalog.images.filter(img => img.usedInScenes.length > 1);
console.log(`\nShared images (used in multiple scenes): ${sharedImages.length}`);

if (sharedImages.length > 0) {
  console.log('\nTop 5 most reused images:');
  sharedImages
    .sort((a, b) => b.usedInScenes.length - a.usedInScenes.length)
    .slice(0, 5)
    .forEach(img => {
      console.log(`  - ${img.imageRef.substring(0, 12)}... used in ${img.usedInScenes.length} scenes`);
    });
}

// Create a download instruction file
const downloadInstructions = `# Downloading Figma Images

## Using Figma API

To download all images from Figma, you can use the following approach:

### Method 1: Using the Figma Images API

\`\`\`bash
# Set your token
export FIGMA_TOKEN="${process.env.FIGMA_TOKEN || 'your-token-here'}"
export FIGMA_FILE_KEY="${process.env.FIGMA_FILE_KEY || 'axR6PYBmVYAfQK3aKJQl7e'}"

# The Figma Images API endpoint
# GET https://api.figma.com/v1/images/:file_key?ids=:node_ids&format=png&scale=2

# You can batch download up to 100 images at a time
\`\`\`

### Method 2: Export Individual Nodes

Each variation in your design can be exported as a PNG:

Total variations to export: ${designs.scenes.length}
Total image assets: ${allImageRefs.size}

### Image References

All ${allImageRefs.size} unique image references have been cataloged in \`image-catalog.json\`.

Each image entry includes:
- imageRef: Unique Figma image reference
- usedInScenes: List of scenes where this image appears
- figmaUrl: Direct S3 URL (may require authentication)

### Recommended Approach

1. Export full frames (variations) as PNG using the Figma Images API
2. For individual assets, you can:
   - Export them from Figma UI directly
   - Use the Images API with specific node IDs
   - Download from the generated export URLs (when available)

### Image Organization

Suggested folder structure:
\`\`\`
/public/assets/
  /scenes/
    /bus-stop/          # 9-#2_버스정류장 2
    /bus-stop-memory/   # 10-#2_버스정류장_과거회상 2
    /in-bus/            # 11-#4_버스_출발 2
    /bus-choices/       # 선택지1
    /market/            # 시장 입구
    /market-choices/    # 선택지
    /hut/               # 오두막집
    /credits/           # end
  /shared/              # Images used across multiple scenes
\`\`\`

## Files Generated

- \`figma-designs.json\` - Complete raw Figma data
- \`figma-designs-organized.json\` - Organized scene data with elements
- \`design-index.json\` - Quick reference index
- \`image-catalog.json\` - Complete image reference catalog
- \`DESIGN_SUMMARY.md\` - Human-readable design specifications
- \`IMPLEMENTATION_GUIDE.md\` - Implementation reference

## Next Steps

1. Review the design specifications in DESIGN_SUMMARY.md
2. Check image-catalog.json for all image references
3. Export images from Figma (either via API or UI)
4. Organize images according to the suggested structure
5. Update image paths in your React components
`;

const instructionsPath = path.join(__dirname, 'DOWNLOAD_IMAGES.md');
fs.writeFileSync(instructionsPath, downloadInstructions);
console.log(`\nDownload instructions saved to: ${instructionsPath}`);

console.log('\n=== COMPLETE ===\n');
console.log('All design data has been extracted and documented!');
console.log('\nGenerated files:');
console.log('1. figma-designs.json - Raw Figma API response');
console.log('2. figma-designs-organized.json - Structured scene data');
console.log('3. design-index.json - Quick reference');
console.log('4. image-catalog.json - Complete image inventory');
console.log('5. DESIGN_SUMMARY.md - Detailed specifications');
console.log('6. IMPLEMENTATION_GUIDE.md - Quick reference guide');
console.log('7. DOWNLOAD_IMAGES.md - Image download instructions');
