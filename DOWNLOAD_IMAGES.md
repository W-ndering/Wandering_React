# Downloading Figma Images

## Using Figma API

To download all images from Figma, you can use the following approach:

### Method 1: Using the Figma Images API

```bash
# Set your token
export FIGMA_TOKEN="your-token-here"
export FIGMA_FILE_KEY="axR6PYBmVYAfQK3aKJQl7e"

# The Figma Images API endpoint
# GET https://api.figma.com/v1/images/:file_key?ids=:node_ids&format=png&scale=2

# You can batch download up to 100 images at a time
```

### Method 2: Export Individual Nodes

Each variation in your design can be exported as a PNG:

Total variations to export: 75
Total image assets: 84

### Image References

All 84 unique image references have been cataloged in `image-catalog.json`.

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
```
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
```

## Files Generated

- `figma-designs.json` - Complete raw Figma data
- `figma-designs-organized.json` - Organized scene data with elements
- `design-index.json` - Quick reference index
- `image-catalog.json` - Complete image reference catalog
- `DESIGN_SUMMARY.md` - Human-readable design specifications
- `IMPLEMENTATION_GUIDE.md` - Implementation reference

## Next Steps

1. Review the design specifications in DESIGN_SUMMARY.md
2. Check image-catalog.json for all image references
3. Export images from Figma (either via API or UI)
4. Organize images according to the suggested structure
5. Update image paths in your React components
