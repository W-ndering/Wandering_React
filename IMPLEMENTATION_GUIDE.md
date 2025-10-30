# Implementation Guide

## Scene Structure

Each scene contains multiple variations representing different states or frames of the scene.

### Scene Mapping

| Scene Name | Slug | Scene Numbers | Variations |
|------------|------|---------------|------------|
| 9-#2_버스정류장 2 | bus-stop | 32-37 | 8 |
| 10-#2_버스정류장_과거회상 2 | bus-stop-memory | 38-43 | 5 |
| 11-#4_버스_출발 2 | in-bus | 44-54 | 5 |
| 선택지1 | bus-choices | 55-64 | 15 |
| 선택지 | market-choices | 140-151 | 1 |
| 오두막집 | hut | 152-156 | 31 |
| 시장 입구 | market | 132-139 | 6 |
| end | credits | 184-187 | 4 |

## Common Specifications

- **Canvas Size:** 2560x1440px (QHD)
- **Primary Font:** DungGeunMo (Korean pixel font)
- **Text Rendering:** Pixel-perfect positioning required

## Asset Organization

All image assets are referenced by their image refs. You'll need to:

1. Download images using the Figma API
2. Organize them by scene
3. Name them based on their layer names in Figma

## Typography Scale

Font sizes used across all scenes:
- 48px
- 50px
- 60px
- 120px

## Color Palette

Text colors used:
- #ffffff
- #000000

## Next Steps

1. Review the detailed design specifications in DESIGN_SUMMARY.md
2. Download image assets from Figma
3. Create React components for each scene
4. Implement transitions between variations
5. Test on 2560x1440 resolution
