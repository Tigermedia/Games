# Rewards Screen - מסך הישגים

## Screen Purpose
Showcase of all achievements, collected stickers, and progress milestones. Motivates continued learning.

---

## Stitch Prompt

```
Design an achievements/rewards screen for "Leo's Letters" - a Hebrew educational app for children ages 4-6.

Top bar: Back arrow (RTL), title "ההישגים שלי" (My Achievements), total stars count "⭐ 127".

Section 1 - Trophies: Row of 3D trophy icons showing major achievements:
- Gold trophy "🏆 אלופ/ת האותיות" (Letter Champion) - unlocked, glowing
- Silver trophy "מלך/ת המילים" (Word King/Queen) - locked, grayed
- Bronze trophy "גאון מספרים" (Number Genius) - locked, grayed

Section 2 - Sticker Collection: Grid of colorful stickers (4x3):
- Collected stickers: Full color, slight sparkle (lion, star, crown, heart, rainbow)
- Locked stickers: Gray silhouette with "?" mark

Progress text: "אספת 8/20 מדבקות" (You collected 8/20 stickers)

Section 3 - Streaks: Daily streak flame icon with number "🔥 5 ימים רצופים!" (5 days streak!)

Bottom: Leo wearing a medal, celebrating pose, speech bubble "!איזה כיף, כל הכבוד" (How fun, great job!)

Background: Festive cream/gold gradient with subtle confetti pattern.

Style: Celebratory, motivating, treasure collection feel, shiny effects on achievements.
```

---

## Required Elements

- [ ] Back button
- [ ] Title: "ההישגים שלי"
- [ ] Total stars display
- [ ] Trophy section (3 major achievements)
- [ ] Sticker collection grid
- [ ] Sticker progress counter
- [ ] Daily streak display
- [ ] Leo celebration pose

---

## Specifications

### Layout
```
┌─────────────────────────────────────┐
│  →      ההישגים שלי       ⭐ 127   │
├─────────────────────────────────────┤
│                                     │
│  ── גביעים ──                       │
│  ╭─────╮  ╭─────╮  ╭─────╮         │
│  │ 🏆  │  │ 🏆  │  │ 🏆  │         │
│  │gold │  │gray │  │gray │         │
│  ╰─────╯  ╰─────╯  ╰─────╯         │
│  אותיות   מילים    מספרים          │
│                                     │
│  ── מדבקות (8/20) ──                │
│  ╭───╮╭───╮╭───╮╭───╮              │
│  │🦁 ││⭐ ││👑 ││❤️ │              │
│  ╰───╯╰───╯╰───╯╰───╯              │
│  ╭───╮╭───╮╭───╮╭───╮              │
│  │🌈 ││ ? ││ ? ││ ? │              │
│  ╰───╯╰───╯╰───╯╰───╯              │
│                                     │
│     🔥 5 ימים רצופים!              │
│                                     │
│     🦁🏅 "!איזה כיף"               │
└─────────────────────────────────────┘
```

### Trophy Cards
| Trophy | Title | Requirement | State |
|--------|-------|-------------|-------|
| Gold | אלופ/ת האותיות | Complete all letters | Unlocked/Locked |
| Silver | מלך/ת המילים | Complete all words | Unlocked/Locked |
| Bronze | גאון מספרים | Complete all numbers | Unlocked/Locked |

### Trophy Specifications
- Size: 80x100px
- Unlocked: Full color, glow effect, slight animation
- Locked: Grayscale, "?" or lock icon

### Sticker Grid
- Grid: 4 columns
- Sticker size: 56x56px
- Unlocked: Full color, sparkle
- Locked: Gray silhouette, "?" in center

### Streak Display
- Fire icon: 32px
- Number: 24px Bold
- Background: Orange gradient pill shape

---

## Sticker Collection

### Achievement Stickers
| Sticker | Requirement |
|---------|-------------|
| 🦁 Leo Basic | Complete first activity |
| ⭐ Star | Earn 10 stars |
| 👑 Crown | Earn 50 stars |
| ❤️ Heart | 3-day streak |
| 🌈 Rainbow | Complete first module |
| 🚀 Rocket | Complete 10 activities |
| 🎨 Palette | Learn all colors |
| 🏠 House | Learn family words |
| 🐕 Dog | Learn animal words |
| 🔢 123 | Complete numbers 1-10 |
| ✏️ Pencil | Trace 10 letters |
| 🎈 Balloon | Play balloon game 5x |
| 🍎 Apple | Count 50 objects |
| 🎁 Gift | Login 7 days |
| 🌟 Super Star | Earn 100 stars |
| 🏆 Champion | Complete all modules |

---

## Animations

| Element | Animation |
|---------|-----------|
| Trophy unlock | Glow pulse, slight bounce |
| Sticker unlock | Spin in, sparkle burst |
| Streak fire | Flame flicker |
| Tap sticker | Enlarge popup with name |
| New achievement | Celebration overlay |

---

## Interaction Notes

1. **Tap trophy**: Shows full-screen achievement card with details
2. **Tap sticker**: Enlarges with name, shows how earned
3. **Tap locked item**: Shows requirement to unlock
4. **Streak area**: Shows calendar of recent days
5. **Share button** (optional): Parents can share to social media
