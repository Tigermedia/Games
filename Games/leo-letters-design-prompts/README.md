# Leo's Letters - Design Prompts for Google Stitch

## About This Project
"האותיות של ליאו" (Leo's Letters) is an educational game for 5-year-old Israeli children preparing for first grade. These prompts are designed to generate UI screens using Google Stitch AI design tool.

## How to Use with Google Stitch

1. Open [Google Stitch](https://stitch.withgoogle.com/)
2. Copy the **Stitch Prompt** section from any screen file
3. Paste into Stitch and generate
4. Adjust as needed based on the **Required Elements** checklist

## Design System

### Character: Leo the Lion
- Cute lion cub with orange mane
- Big expressive eyes
- Friendly, encouraging personality
- Appears on most screens as guide/mascot

### Color Palette
| Color | HEX | Usage |
|-------|-----|-------|
| Primary Orange | `#FF9500` | Leo, buttons, highlights |
| Turquoise | `#4ECDC4` | Backgrounds, secondary elements |
| Purple | `#5D4E8C` | Hebrew letters, text |
| Cream | `#FFF8E7` | Light backgrounds |
| Success Green | `#7ED321` | Correct answers, achievements |
| Soft Pink | `#FFB6C1` | Accents, rewards |

### Typography
- Hebrew letters for learning: **Large, bold, rounded**
- UI text: Child-friendly Hebrew font (like Heebo Rounded)
- All text should be large and readable

### Layout
- **RTL (Right-to-Left)** - Hebrew language
- Large touch targets (minimum 48x48dp)
- Generous spacing between elements
- Bottom navigation for main sections

## Screen Files

| # | File | Description |
|---|------|-------------|
| 00 | style-guide.md | Complete design system reference |
| 01 | splash-screen.md | App loading/intro screen |
| 02 | home-screen.md | Main hub with learning modules |
| 03 | letters-menu.md | Hebrew alphabet selection grid |
| 04 | letter-learn.md | Individual letter learning screen |
| 05 | balloon-game.md | Letter recognition mini-game |
| 06 | trace-letter.md | Letter tracing/writing practice |
| 07 | words-menu.md | Word learning module menu |
| 08 | word-build.md | Word building game |
| 09 | numbers-menu.md | Numbers module menu |
| 10 | counting-game.md | Counting practice game |
| 11 | rewards-screen.md | Achievements and stickers |
| 12 | settings-screen.md | App settings |
| 13 | parent-zone.md | Parent dashboard (PIN protected) |
| 14 | celebration-overlay.md | Success celebration animation |

## Tips for Best Results

1. **Generate at mobile resolution** (390x844 for iPhone, 360x800 for Android)
2. **Add "for children ages 4-6"** to prompts for age-appropriate styling
3. **Request RTL layout** explicitly for Hebrew support
4. **Iterate** - generate multiple versions and pick best elements
5. **Combine** - use elements from different generations

## Target Platforms
- iOS (iPhone/iPad)
- Android (Phones/Tablets)
- Design for portrait mode primarily
