import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the organized designs
const organizedPath = path.join(__dirname, 'figma-designs-organized.json');
const organized = JSON.parse(fs.readFileSync(organizedPath, 'utf-8'));

// Scene descriptions mapping
const sceneDescriptions = {
  "9-#2_버스정류장 2": {
    slug: "bus-stop",
    sceneRange: "32-37",
    description: "Bus stop scene"
  },
  "10-#2_버스정류장_과거회상 2": {
    slug: "bus-stop-memory",
    sceneRange: "38-43",
    description: "Bus stop memory/flashback scene"
  },
  "11-#4_버스_출발 2": {
    slug: "in-bus",
    sceneRange: "44-54",
    description: "Inside the bus scene"
  },
  "선택지1": {
    slug: "bus-choices",
    sceneRange: "55-64",
    description: "Bus choice selection scene"
  },
  "시장 입구": {
    slug: "market",
    sceneRange: "132-139",
    description: "Market entrance scene"
  },
  "선택지": {
    slug: "market-choices",
    sceneRange: "140-151",
    description: "Market choice selection scene"
  },
  "오두막집": {
    slug: "hut",
    sceneRange: "152-156",
    description: "Hut/cabin scene"
  },
  "end": {
    slug: "credits",
    sceneRange: "184-187",
    description: "End credits scene"
  }
};

function createMarkdownSummary() {
  let markdown = `# Figma Design Summary - Wandering Project

Generated: ${new Date().toISOString()}

## Overview

This document contains detailed design specifications for 8 scenes extracted from Figma.
All scenes are designed at **2560x1440px (QHD resolution)**.

---

`;

  Object.keys(organized).forEach(sceneName => {
    const scene = organized[sceneName];
    const sceneInfo = sceneDescriptions[sceneName] || { slug: sceneName, sceneRange: "N/A", description: "Scene" };

    markdown += `## ${sceneName}\n\n`;
    markdown += `**Slug:** ${sceneInfo.slug}  \n`;
    markdown += `**Scene Range:** ${sceneInfo.sceneRange}  \n`;
    markdown += `**Description:** ${sceneInfo.description}  \n`;
    markdown += `**Dimensions:** ${scene.dimensions.width}x${scene.dimensions.height}px  \n`;
    markdown += `**Total Variations:** ${scene.totalVariations}  \n\n`;

    if (scene.backgroundColor) {
      const bg = scene.backgroundColor;
      markdown += `**Background Color:** rgba(${Math.round(bg.r * 255)}, ${Math.round(bg.g * 255)}, ${Math.round(bg.b * 255)}, ${bg.a})  \n\n`;
    }

    // List all variations
    scene.variations.forEach((variation, index) => {
      markdown += `### Variation ${variation.index}\n\n`;
      markdown += `**Node ID:** ${variation.id}  \n\n`;

      // Summary
      markdown += `**Element Summary:**\n`;
      markdown += `- Total Elements: ${variation.summary.totalElements}\n`;
      markdown += `- Backgrounds: ${variation.summary.backgrounds}\n`;
      markdown += `- Characters: ${variation.summary.characters}\n`;
      markdown += `- Text Layers: ${variation.summary.texts}\n`;
      markdown += `- UI Elements: ${variation.summary.uiElements}\n`;
      markdown += `- Images: ${variation.summary.images}\n\n`;

      // Backgrounds
      if (variation.elements.backgrounds.length > 0) {
        markdown += `#### Backgrounds\n\n`;
        variation.elements.backgrounds.forEach(bg => {
          markdown += `**${bg.name}**\n`;
          markdown += `- Position: x=${bg.position.x}, y=${bg.position.y}\n`;
          markdown += `- Size: ${bg.position.width}x${bg.position.height}px\n`;
          if (bg.fills) {
            bg.fills.forEach(fill => {
              if (fill.type === 'IMAGE') {
                markdown += `- Type: Image (ref: ${fill.imageRef})\n`;
                markdown += `- Scale Mode: ${fill.scaleMode}\n`;
              } else if (fill.type === 'SOLID') {
                markdown += `- Type: Solid Color (${fill.hex})\n`;
              }
            });
          }
          markdown += `\n`;
        });
      }

      // Characters
      if (variation.elements.characters.length > 0) {
        markdown += `#### Characters\n\n`;
        variation.elements.characters.forEach(char => {
          markdown += `**${char.name}**\n`;
          markdown += `- Position: x=${char.position.x}, y=${char.position.y}\n`;
          markdown += `- Size: ${char.position.width}x${char.position.height}px\n`;
          if (char.fills) {
            char.fills.forEach(fill => {
              if (fill.type === 'IMAGE') {
                markdown += `- Type: Image (ref: ${fill.imageRef})\n`;
              }
            });
          }
          markdown += `\n`;
        });
      }

      // Text Layers
      if (variation.elements.texts.length > 0) {
        markdown += `#### Text Layers\n\n`;
        variation.elements.texts.forEach(text => {
          markdown += `**${text.name || 'Unnamed Text'}**\n`;
          if (text.content) {
            markdown += `- Content: "${text.content}"\n`;
          }
          markdown += `- Font: ${text.fontFamily} ${text.fontWeight}\n`;
          markdown += `- Size: ${text.fontSize}px\n`;
          markdown += `- Position: x=${text.position.x}, y=${text.position.y}\n`;
          markdown += `- Dimensions: ${text.position.width}x${text.position.height}px\n`;
          if (text.fills && text.fills.length > 0) {
            const fill = text.fills[0];
            if (fill.type === 'SOLID') {
              markdown += `- Color: ${fill.hex}\n`;
            }
          }
          markdown += `\n`;
        });
      }

      // UI Elements
      if (variation.elements.uiElements.length > 0) {
        markdown += `#### UI Elements\n\n`;
        variation.elements.uiElements.forEach(ui => {
          markdown += `**${ui.name}** (${ui.type})\n`;
          markdown += `- Position: x=${ui.position.x}, y=${ui.position.y}\n`;
          markdown += `- Size: ${ui.position.width}x${ui.position.height}px\n`;
          markdown += `\n`;
        });
      }

      // Image References
      if (variation.imageUrls && variation.imageUrls.length > 0) {
        markdown += `#### Image References\n\n`;
        variation.imageUrls.forEach((img, idx) => {
          markdown += `${idx + 1}. Image Ref: \`${img.imageRef}\`\n`;
        });
        markdown += `\n`;
      }

      markdown += `---\n\n`;
    });

    markdown += `\n`;
  });

  return markdown;
}

function createImplementationGuide() {
  let guide = `# Implementation Guide

## Scene Structure

Each scene contains multiple variations representing different states or frames of the scene.

### Scene Mapping

| Scene Name | Slug | Scene Numbers | Variations |
|------------|------|---------------|------------|
`;

  Object.keys(organized).forEach(sceneName => {
    const scene = organized[sceneName];
    const sceneInfo = sceneDescriptions[sceneName] || { slug: sceneName, sceneRange: "N/A" };
    guide += `| ${sceneName} | ${sceneInfo.slug} | ${sceneInfo.sceneRange} | ${scene.totalVariations} |\n`;
  });

  guide += `\n## Common Specifications\n\n`;
  guide += `- **Canvas Size:** 2560x1440px (QHD)\n`;
  guide += `- **Primary Font:** DungGeunMo (Korean pixel font)\n`;
  guide += `- **Text Rendering:** Pixel-perfect positioning required\n\n`;

  guide += `## Asset Organization\n\n`;
  guide += `All image assets are referenced by their image refs. You'll need to:\n\n`;
  guide += `1. Download images using the Figma API\n`;
  guide += `2. Organize them by scene\n`;
  guide += `3. Name them based on their layer names in Figma\n\n`;

  guide += `## Typography Scale\n\n`;

  const fontSizes = new Set();
  Object.keys(organized).forEach(sceneName => {
    const scene = organized[sceneName];
    scene.variations.forEach(variation => {
      variation.elements.texts.forEach(text => {
        if (text.fontSize) {
          fontSizes.add(text.fontSize);
        }
      });
    });
  });

  guide += `Font sizes used across all scenes:\n`;
  Array.from(fontSizes).sort((a, b) => a - b).forEach(size => {
    guide += `- ${size}px\n`;
  });

  guide += `\n## Color Palette\n\n`;

  const colors = new Set();
  Object.keys(organized).forEach(sceneName => {
    const scene = organized[sceneName];
    scene.variations.forEach(variation => {
      variation.elements.texts.forEach(text => {
        if (text.fills) {
          text.fills.forEach(fill => {
            if (fill.type === 'SOLID' && fill.hex) {
              colors.add(fill.hex);
            }
          });
        }
      });
    });
  });

  guide += `Text colors used:\n`;
  Array.from(colors).forEach(color => {
    guide += `- ${color}\n`;
  });

  guide += `\n## Next Steps\n\n`;
  guide += `1. Review the detailed design specifications in DESIGN_SUMMARY.md\n`;
  guide += `2. Download image assets from Figma\n`;
  guide += `3. Create React components for each scene\n`;
  guide += `4. Implement transitions between variations\n`;
  guide += `5. Test on 2560x1440 resolution\n`;

  return guide;
}

function createJsonIndex() {
  const index = {
    metadata: {
      generated: new Date().toISOString(),
      totalScenes: Object.keys(organized).length,
      totalVariations: Object.values(organized).reduce((sum, scene) => sum + scene.totalVariations, 0),
      canvasSize: {
        width: 2560,
        height: 1440
      }
    },
    scenes: {}
  };

  Object.keys(organized).forEach(sceneName => {
    const scene = organized[sceneName];
    const sceneInfo = sceneDescriptions[sceneName] || { slug: sceneName, sceneRange: "N/A" };

    index.scenes[sceneName] = {
      slug: sceneInfo.slug,
      sceneRange: sceneInfo.sceneRange,
      dimensions: scene.dimensions,
      variationCount: scene.totalVariations,
      variations: scene.variations.map(v => ({
        index: v.index,
        id: v.id,
        elementCounts: v.summary,
        hasText: v.elements.texts.length > 0,
        hasImages: v.imageUrls.length > 0,
        textPreview: v.elements.texts.slice(0, 2).map(t => t.content).filter(Boolean)
      }))
    };
  });

  return index;
}

// Generate all files
console.log('Creating design documentation...\n');

const summaryMd = createMarkdownSummary();
const summaryPath = path.join(__dirname, 'DESIGN_SUMMARY.md');
fs.writeFileSync(summaryPath, summaryMd);
console.log(`✓ Detailed design summary: ${summaryPath}`);

const guideMd = createImplementationGuide();
const guidePath = path.join(__dirname, 'IMPLEMENTATION_GUIDE.md');
fs.writeFileSync(guidePath, guideMd);
console.log(`✓ Implementation guide: ${guidePath}`);

const index = createJsonIndex();
const indexPath = path.join(__dirname, 'design-index.json');
fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
console.log(`✓ Design index: ${indexPath}`);

console.log('\n=== Documentation Complete ===\n');
console.log('Files created:');
console.log('1. DESIGN_SUMMARY.md - Complete layer-by-layer breakdown');
console.log('2. IMPLEMENTATION_GUIDE.md - Quick reference for developers');
console.log('3. design-index.json - Searchable JSON index');
console.log('\nYou also have:');
console.log('- figma-designs-organized.json - Full structured data');
console.log('- figma-designs.json - Raw Figma API response');
