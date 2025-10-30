import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const FIGMA_TOKEN = envVars.FIGMA_TOKEN;
const FIGMA_FILE_KEY = envVars.FIGMA_FILE_KEY;

// Scene names to search for in Figma
const SCENE_NAMES = [
  "9-#2_버스정류장 2",
  "10-#2_버스정류장_과거회상 2",
  "11-#4_버스_출발 2",
  "선택지1",
  "시장 입구",
  "선택지",
  "오두막집",
  "end"
];

// Helper function to extract layer information recursively
function extractLayerInfo(node, depth = 0) {
  const info = {
    id: node.id,
    name: node.name,
    type: node.type,
    visible: node.visible !== false,
    absoluteBoundingBox: node.absoluteBoundingBox,
    constraints: node.constraints,
    opacity: node.opacity,
  };

  // Extract fills (colors, images)
  if (node.fills && node.fills.length > 0) {
    info.fills = node.fills.map(fill => ({
      type: fill.type,
      visible: fill.visible,
      opacity: fill.opacity,
      color: fill.color,
      imageRef: fill.imageRef,
      scaleMode: fill.scaleMode,
      blendMode: fill.blendMode,
    }));
  }

  // Extract strokes
  if (node.strokes && node.strokes.length > 0) {
    info.strokes = node.strokes;
    info.strokeWeight = node.strokeWeight;
    info.strokeAlign = node.strokeAlign;
  }

  // Extract effects (shadows, blurs)
  if (node.effects && node.effects.length > 0) {
    info.effects = node.effects;
  }

  // Extract text properties
  if (node.type === 'TEXT') {
    info.characters = node.characters;
    info.style = node.style;
    info.characterStyleOverrides = node.characterStyleOverrides;
    info.styleOverrideTable = node.styleOverrideTable;
  }

  // Extract vector properties
  if (node.type === 'VECTOR' || node.type === 'BOOLEAN_OPERATION') {
    info.strokeCap = node.strokeCap;
    info.strokeJoin = node.strokeJoin;
    info.strokeMiterAngle = node.strokeMiterAngle;
  }

  // Extract rectangle corner radius
  if (node.type === 'RECTANGLE') {
    info.cornerRadius = node.cornerRadius;
    info.rectangleCornerRadii = node.rectangleCornerRadii;
  }

  // Extract layout properties (auto-layout)
  if (node.layoutMode) {
    info.layoutMode = node.layoutMode;
    info.primaryAxisSizingMode = node.primaryAxisSizingMode;
    info.counterAxisSizingMode = node.counterAxisSizingMode;
    info.primaryAxisAlignItems = node.primaryAxisAlignItems;
    info.counterAxisAlignItems = node.counterAxisAlignItems;
    info.paddingLeft = node.paddingLeft;
    info.paddingRight = node.paddingRight;
    info.paddingTop = node.paddingTop;
    info.paddingBottom = node.paddingBottom;
    info.itemSpacing = node.itemSpacing;
  }

  // Extract blend mode
  if (node.blendMode) {
    info.blendMode = node.blendMode;
  }

  // Recursively extract children
  if (node.children && node.children.length > 0) {
    info.children = node.children.map(child => extractLayerInfo(child, depth + 1));
  }

  return info;
}

// Helper function to find frames by name
function findFramesByName(node, targetNames, results = []) {
  if (node.type === 'FRAME' && targetNames.includes(node.name)) {
    results.push(node);
  }

  if (node.children) {
    node.children.forEach(child => findFramesByName(child, targetNames, results));
  }

  return results;
}

// Main function to fetch Figma data
async function fetchFigmaDesigns() {
  console.log('Fetching Figma file data...');

  try {
    // Fetch the file data
    const fileResponse = await fetch(
      `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}`,
      {
        headers: {
          'X-Figma-Token': FIGMA_TOKEN,
        },
      }
    );

    if (!fileResponse.ok) {
      throw new Error(`Figma API error: ${fileResponse.status} ${fileResponse.statusText}`);
    }

    const fileData = await fileResponse.json();
    console.log('File data fetched successfully');

    // Find all target frames
    const foundFrames = findFramesByName(fileData.document, SCENE_NAMES);
    console.log(`Found ${foundFrames.length} frames out of ${SCENE_NAMES.length} requested`);

    // Extract detailed information for each frame
    const sceneDesigns = [];
    const imageRefs = new Set();

    for (const frame of foundFrames) {
      console.log(`Processing frame: ${frame.name}`);

      const sceneInfo = {
        name: frame.name,
        id: frame.id,
        dimensions: {
          width: frame.absoluteBoundingBox?.width,
          height: frame.absoluteBoundingBox?.height,
        },
        backgroundColor: frame.backgroundColor,
        layers: extractLayerInfo(frame),
      };

      // Collect all image references
      function collectImageRefs(node) {
        if (node.fills) {
          node.fills.forEach(fill => {
            if (fill.type === 'IMAGE' && fill.imageRef) {
              imageRefs.add(fill.imageRef);
            }
          });
        }
        if (node.children) {
          node.children.forEach(child => collectImageRefs(child));
        }
      }
      collectImageRefs(frame);

      sceneDesigns.push(sceneInfo);
    }

    // Fetch image URLs
    console.log(`Fetching URLs for ${imageRefs.size} images...`);
    const imageUrlsMap = {};

    if (imageRefs.size > 0) {
      const imageRefsArray = Array.from(imageRefs);
      const imageUrlsResponse = await fetch(
        `https://api.figma.com/v1/images/${FIGMA_FILE_KEY}?ids=${imageRefsArray.join(',')}`,
        {
          headers: {
            'X-Figma-Token': FIGMA_TOKEN,
          },
        }
      );

      if (imageUrlsResponse.ok) {
        const imageUrlsData = await imageUrlsResponse.json();
        Object.assign(imageUrlsMap, imageUrlsData.images);
        console.log('Image URLs fetched successfully');
      } else {
        console.warn('Failed to fetch image URLs');
      }
    }

    // Fetch export URLs for all frames
    console.log('Fetching export URLs for frames...');
    const frameIds = foundFrames.map(f => f.id).join(',');
    const exportResponse = await fetch(
      `https://api.figma.com/v1/images/${FIGMA_FILE_KEY}?ids=${frameIds}&format=png&scale=2`,
      {
        headers: {
          'X-Figma-Token': FIGMA_TOKEN,
        },
      }
    );

    const exportUrls = {};
    if (exportResponse.ok) {
      const exportData = await exportResponse.json();
      Object.assign(exportUrls, exportData.images);
      console.log('Export URLs fetched successfully');
    }

    // Compile final result
    const result = {
      fileInfo: {
        name: fileData.name,
        lastModified: fileData.lastModified,
        version: fileData.version,
      },
      scenes: sceneDesigns.map(scene => ({
        ...scene,
        exportUrl: exportUrls[scene.id] || null,
      })),
      imageUrls: imageUrlsMap,
      metadata: {
        totalScenesRequested: SCENE_NAMES.length,
        totalScenesFound: foundFrames.length,
        missingScenes: SCENE_NAMES.filter(
          name => !foundFrames.find(f => f.name === name)
        ),
        fetchedAt: new Date().toISOString(),
      },
    };

    // Save to file
    const outputPath = path.join(__dirname, 'figma-designs.json');
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log(`\nDesign data saved to: ${outputPath}`);

    // Print summary
    console.log('\n=== SUMMARY ===');
    console.log(`Total scenes requested: ${result.metadata.totalScenesRequested}`);
    console.log(`Total scenes found: ${result.metadata.totalScenesFound}`);
    if (result.metadata.missingScenes.length > 0) {
      console.log(`Missing scenes: ${result.metadata.missingScenes.join(', ')}`);
    }
    console.log(`Total image references: ${imageRefs.size}`);
    console.log(`\nScene details:`);
    result.scenes.forEach(scene => {
      console.log(`  - ${scene.name}: ${scene.dimensions.width}x${scene.dimensions.height}px`);
    });

    return result;
  } catch (error) {
    console.error('Error fetching Figma designs:', error);
    throw error;
  }
}

// Run the script
fetchFigmaDesigns().catch(console.error);
