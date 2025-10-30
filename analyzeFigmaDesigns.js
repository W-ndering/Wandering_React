import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the Figma designs
const designsPath = path.join(__dirname, 'figma-designs.json');
const designs = JSON.parse(fs.readFileSync(designsPath, 'utf-8'));

// Group scenes by base name
function groupScenesByName(scenes) {
  const groups = {};

  scenes.forEach(scene => {
    const baseName = scene.name;
    if (!groups[baseName]) {
      groups[baseName] = [];
    }
    groups[baseName].push(scene);
  });

  return groups;
}

// Extract key visual elements from a layer tree
function extractKeyElements(layer, parentPath = '') {
  const elements = [];
  const currentPath = parentPath ? `${parentPath} > ${layer.name}` : layer.name;

  // Check if this is a key element (image, text, or important container)
  const isKeyElement =
    (layer.fills && layer.fills.some(f => f.type === 'IMAGE')) ||
    layer.type === 'TEXT' ||
    (layer.name && (
      layer.name.includes('background') ||
      layer.name.includes('Background') ||
      layer.name.includes('배경') ||
      layer.name.includes('character') ||
      layer.name.includes('Character') ||
      layer.name.includes('캐릭터') ||
      layer.name.includes('button') ||
      layer.name.includes('Button') ||
      layer.name.includes('버튼') ||
      layer.name.includes('text') ||
      layer.name.includes('Text') ||
      layer.name.includes('텍스트') ||
      layer.name.includes('UI') ||
      layer.name.includes('ui')
    ));

  if (isKeyElement) {
    const element = {
      path: currentPath,
      name: layer.name,
      type: layer.type,
      visible: layer.visible,
      position: layer.absoluteBoundingBox,
      opacity: layer.opacity,
    };

    // Add fill information
    if (layer.fills && layer.fills.length > 0) {
      element.fills = layer.fills.map(fill => {
        const fillInfo = {
          type: fill.type,
          visible: fill.visible,
          opacity: fill.opacity,
        };

        if (fill.type === 'SOLID' && fill.color) {
          fillInfo.color = {
            r: Math.round(fill.color.r * 255),
            g: Math.round(fill.color.g * 255),
            b: Math.round(fill.color.b * 255),
            a: fill.color.a || 1,
          };
          fillInfo.hex = `#${fillInfo.color.r.toString(16).padStart(2, '0')}${fillInfo.color.g.toString(16).padStart(2, '0')}${fillInfo.color.b.toString(16).padStart(2, '0')}`;
        }

        if (fill.type === 'IMAGE') {
          fillInfo.imageRef = fill.imageRef;
          fillInfo.scaleMode = fill.scaleMode;
        }

        return fillInfo;
      });
    }

    // Add text information
    if (layer.type === 'TEXT') {
      element.text = {
        content: layer.characters,
        style: layer.style,
      };

      if (layer.style) {
        element.text.fontSize = layer.style.fontSize;
        element.text.fontFamily = layer.style.fontFamily;
        element.text.fontWeight = layer.style.fontWeight;
        element.text.lineHeight = layer.style.lineHeightPx || layer.style.lineHeightPercentFontSize;
        element.text.letterSpacing = layer.style.letterSpacing;
        element.text.textAlignHorizontal = layer.style.textAlignHorizontal;
        element.text.textAlignVertical = layer.style.textAlignVertical;
      }
    }

    // Add effects (shadows, blurs)
    if (layer.effects && layer.effects.length > 0) {
      element.effects = layer.effects;
    }

    elements.push(element);
  }

  // Recursively process children
  if (layer.children) {
    layer.children.forEach(child => {
      elements.push(...extractKeyElements(child, currentPath));
    });
  }

  return elements;
}

// Analyze each scene group
function analyzeSceneGroups(groups, imageUrls) {
  const analysis = {};

  Object.keys(groups).forEach(sceneName => {
    const scenes = groups[sceneName];

    analysis[sceneName] = {
      totalVariations: scenes.length,
      dimensions: scenes[0].dimensions,
      backgroundColor: scenes[0].backgroundColor,
      variations: scenes.map((scene, index) => {
        const keyElements = extractKeyElements(scene.layers);

        // Organize elements by type
        const backgrounds = keyElements.filter(el =>
          el.name.toLowerCase().includes('background') ||
          el.name.toLowerCase().includes('배경') ||
          (el.fills && el.fills.some(f => f.type === 'IMAGE' && el.position.x === 0 && el.position.y === 0))
        );

        const characters = keyElements.filter(el =>
          el.name.toLowerCase().includes('character') ||
          el.name.toLowerCase().includes('캐릭터') ||
          el.name.toLowerCase().includes('sprite')
        );

        const texts = keyElements.filter(el => el.type === 'TEXT');

        const uiElements = keyElements.filter(el =>
          (el.name.toLowerCase().includes('button') ||
           el.name.toLowerCase().includes('버튼') ||
           el.name.toLowerCase().includes('ui')) &&
          el.type !== 'TEXT'
        );

        const images = keyElements.filter(el =>
          el.fills && el.fills.some(f => f.type === 'IMAGE')
        );

        // Get image URLs for this variation
        const imageRefsInScene = images
          .flatMap(img => img.fills.filter(f => f.type === 'IMAGE' && f.imageRef))
          .map(fill => ({
            imageRef: fill.imageRef,
            url: imageUrls[fill.imageRef] || null,
          }));

        return {
          index: index + 1,
          id: scene.id,
          exportUrl: scene.exportUrl,
          summary: {
            totalElements: keyElements.length,
            backgrounds: backgrounds.length,
            characters: characters.length,
            texts: texts.length,
            uiElements: uiElements.length,
            images: images.length,
          },
          elements: {
            backgrounds: backgrounds.map(bg => ({
              name: bg.name,
              position: bg.position,
              fills: bg.fills,
            })),
            characters: characters.map(char => ({
              name: char.name,
              position: char.position,
              fills: char.fills,
            })),
            texts: texts.map(text => ({
              name: text.name,
              content: text.text?.content,
              fontSize: text.text?.fontSize,
              fontFamily: text.text?.fontFamily,
              fontWeight: text.text?.fontWeight,
              position: text.position,
              fills: text.fills,
            })),
            uiElements: uiElements.map(ui => ({
              name: ui.name,
              type: ui.type,
              position: ui.position,
              fills: ui.fills,
            })),
          },
          imageUrls: imageRefsInScene,
        };
      }),
    };
  });

  return analysis;
}

// Main analysis
console.log('Analyzing Figma designs...\n');

const sceneGroups = groupScenesByName(designs.scenes);
const analysis = analyzeSceneGroups(sceneGroups, designs.imageUrls);

// Save organized analysis
const outputPath = path.join(__dirname, 'figma-designs-organized.json');
fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));
console.log(`Organized design data saved to: ${outputPath}\n`);

// Print summary
console.log('=== SCENE ANALYSIS SUMMARY ===\n');

Object.keys(analysis).forEach(sceneName => {
  const scene = analysis[sceneName];
  console.log(`\n${sceneName}:`);
  console.log(`  Dimensions: ${scene.dimensions.width}x${scene.dimensions.height}px`);
  console.log(`  Variations: ${scene.totalVariations}`);

  if (scene.variations.length > 0) {
    const firstVar = scene.variations[0];
    console.log(`  Elements in first variation:`);
    console.log(`    - Backgrounds: ${firstVar.summary.backgrounds}`);
    console.log(`    - Characters: ${firstVar.summary.characters}`);
    console.log(`    - Text layers: ${firstVar.summary.texts}`);
    console.log(`    - UI elements: ${firstVar.summary.uiElements}`);
    console.log(`    - Images: ${firstVar.summary.images}`);

    if (firstVar.elements.texts.length > 0) {
      console.log(`  Sample text content:`);
      firstVar.elements.texts.slice(0, 3).forEach(text => {
        const preview = text.content?.substring(0, 50) || '';
        console.log(`    - "${preview}${text.content?.length > 50 ? '...' : ''}"`);
      });
    }
  }
});

console.log('\n\n=== IMAGE URLS ===');
console.log(`Total unique images: ${Object.keys(designs.imageUrls).length}`);

// Create a detailed breakdown by scene
const sceneBreakdown = {};
Object.keys(analysis).forEach(sceneName => {
  const scene = analysis[sceneName];
  sceneBreakdown[sceneName] = {
    dimensions: scene.dimensions,
    backgroundColor: scene.backgroundColor,
    variationCount: scene.totalVariations,
    // Get the most common elements across all variations
    commonElements: scene.variations[0]?.elements || {},
    exportUrls: scene.variations.map(v => v.exportUrl),
  };
});

const breakdownPath = path.join(__dirname, 'figma-scenes-breakdown.json');
fs.writeFileSync(breakdownPath, JSON.stringify(sceneBreakdown, null, 2));
console.log(`\nScene breakdown saved to: ${breakdownPath}`);

console.log('\n=== FILES GENERATED ===');
console.log('1. figma-designs.json - Complete raw data from Figma');
console.log('2. figma-designs-organized.json - Organized by scene with key elements extracted');
console.log('3. figma-scenes-breakdown.json - Quick reference for implementation');
