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

// Load the organized designs
const organizedPath = path.join(__dirname, 'figma-designs-organized.json');
const organized = JSON.parse(fs.readFileSync(organizedPath, 'utf-8'));

async function fetchImageExports() {
  console.log('Fetching image export URLs from Figma...\n');

  // Collect all node IDs that we want to export as images
  const allNodeIds = [];
  const nodeIdToSceneMap = {};

  Object.keys(organized).forEach(sceneName => {
    const scene = organized[sceneName];
    scene.variations.forEach((variation, index) => {
      allNodeIds.push(variation.id);
      nodeIdToSceneMap[variation.id] = {
        sceneName,
        variationIndex: index + 1,
      };
    });
  });

  console.log(`Total frames to export: ${allNodeIds.length}`);

  // Fetch export URLs in batches (Figma API has limits)
  const batchSize = 50;
  const batches = [];
  for (let i = 0; i < allNodeIds.length; i += batchSize) {
    batches.push(allNodeIds.slice(i, i + batchSize));
  }

  const allExportUrls = {};

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`Fetching batch ${i + 1}/${batches.length} (${batch.length} nodes)...`);

    try {
      const nodeIdsParam = batch.join(',');
      const url = `https://api.figma.com/v1/images/${FIGMA_FILE_KEY}?ids=${nodeIdsParam}&format=png&scale=2`;

      const response = await fetch(url, {
        headers: {
          'X-Figma-Token': FIGMA_TOKEN,
        },
      });

      if (!response.ok) {
        console.error(`  Error: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error(`  Response: ${errorText}`);
        continue;
      }

      const data = await response.json();

      if (data.err) {
        console.error(`  API Error: ${data.err}`);
        continue;
      }

      if (data.images) {
        Object.assign(allExportUrls, data.images);
        console.log(`  Got ${Object.keys(data.images).length} URLs`);
      }

      // Wait a bit to avoid rate limiting
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`  Error fetching batch: ${error.message}`);
    }
  }

  console.log(`\nTotal export URLs fetched: ${Object.keys(allExportUrls).length}\n`);

  // Update the organized data with export URLs
  Object.keys(organized).forEach(sceneName => {
    const scene = organized[sceneName];
    scene.variations.forEach(variation => {
      variation.exportUrl = allExportUrls[variation.id] || null;
    });
  });

  // Save updated data
  const updatedPath = path.join(__dirname, 'figma-designs-with-exports.json');
  fs.writeFileSync(updatedPath, JSON.stringify(organized, null, 2));
  console.log(`Updated design data saved to: ${updatedPath}\n`);

  // Create a simple mapping file for easy access
  const exportMap = {};
  Object.keys(organized).forEach(sceneName => {
    exportMap[sceneName] = organized[sceneName].variations.map((v, i) => ({
      variation: i + 1,
      id: v.id,
      url: v.exportUrl,
      dimensions: organized[sceneName].dimensions,
    }));
  });

  const mapPath = path.join(__dirname, 'figma-export-urls.json');
  fs.writeFileSync(mapPath, JSON.stringify(exportMap, null, 2));
  console.log(`Export URL mapping saved to: ${mapPath}\n`);

  // Print summary
  console.log('=== EXPORT URLs BY SCENE ===\n');
  Object.keys(exportMap).forEach(sceneName => {
    console.log(`${sceneName}:`);
    console.log(`  Total variations: ${exportMap[sceneName].length}`);
    exportMap[sceneName].slice(0, 2).forEach(item => {
      console.log(`  - Variation ${item.variation}: ${item.url ? 'URL available' : 'NO URL'}`);
    });
    if (exportMap[sceneName].length > 2) {
      console.log(`  - ... and ${exportMap[sceneName].length - 2} more variations`);
    }
    console.log();
  });

  return exportMap;
}

fetchImageExports().catch(console.error);
