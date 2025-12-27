# Numbers Menu - תפריט מספרים

## Screen Purpose
Entry point to the Numbers learning module. Shows number ranges and counting activities.

---

## Stitch Prompt

```
Design a numbers module menu screen for "Leo's Letters" - a Hebrew educational app for children ages 4-6.

Top bar: Back arrow (RTL), title "מספרים" (Numbers) in orange, overall progress "8/20 ⭐".

Main content: Colorful number range cards:

1. "1-5" card - Orange gradient with numbers 1,2,3,4,5 displayed playfully, progress 5/5 complete (gold star badge)
2. "6-10" card - Turquoise gradient with numbers 6,7,8,9,10, progress 3/5 complete
3. "11-15" card - Purple gradient with numbers displayed, progress 0/5 (locked, grayed out)
4. "16-20" card - Green gradient with numbers, locked

Each card shows: Number range prominently, cute counting icons (fingers, dots, stars), progress indicator.

At bottom: Two game mode buttons:
- "ספירה" (Counting) - with counting icons
- "חיבור" (Addition) - with + symbol

Leo at bottom holding up 5 fingers, saying "!בוא נספור ביחד" (Let's count together!)

Background: Light orange gradient.

Style: Number-focused, playful math theme, encouraging.
```

---

## Required Elements

- [ ] Back button
- [ ] Module title: "מספרים"
- [ ] Total progress indicator
- [ ] Number range cards (4 cards)
- [ ] Progress per range
- [ ] Lock state for unavailable ranges
- [ ] Game mode buttons (counting, addition)
- [ ] Leo counting pose

---

## Specifications

### Layout
```
┌─────────────────────────────────────┐
│  →         מספרים         ⭐ 8/20  │
├─────────────────────────────────────┤
│                                     │
│  ╭───────────────────────────────╮  │
│  │  ★ 1  2  3  4  5    1-5      │  │
│  │      ●●●●●          5/5 ✓    │  │
│  ╰───────────────────────────────╯  │
│                                     │
│  ╭───────────────────────────────╮  │
│  │  6  7  8  9  10     6-10     │  │
│  │      ●●●○○          3/5      │  │
│  ╰───────────────────────────────╯  │
│                                     │
│  ╭───────────────────────────────╮  │
│  │  🔒  11-15                    │  │
│  │      (locked)                 │  │
│  ╰───────────────────────────────╯  │
│                                     │
│  ╭───────────────────────────────╮  │
│  │  🔒  16-20                    │  │
│  │      (locked)                 │  │
│  ╰───────────────────────────────╯  │
│                                     │
│  ┌──────────┐    ┌──────────┐      │
│  │  ספירה  │    │  חיבור  │      │
│  │   🔢    │    │    +    │      │
│  └──────────┘    └──────────┘      │
│                                     │
│    🦁 ✋ "!בוא נספור ביחד"        │
└─────────────────────────────────────┘
```

### Range Cards
| Range | Color | Background |
|-------|-------|------------|
| 1-5 | Orange | #FF9500 gradient |
| 6-10 | Turquoise | #4ECDC4 gradient |
| 11-15 | Purple | #5D4E8C gradient |
| 16-20 | Green | #7ED321 gradient |

### Card Specifications
- Height: 90px
- Border radius: 20px
- Number display: Large, playful font
- Progress dots: 12px circles

### Game Mode Buttons
- Size: 140x60px each
- Style: Outlined with icon
- Active state: Filled with color

---

## Interaction Notes

1. **Range card tap**: Navigate to number learning for that range
2. **Game mode tap**: Navigate to game (counting or addition)
3. **Completed card**: Shows gold star, replay available
4. **Locked card**: Shows requirement to unlock

---

## Unlocking Logic

- 1-5: Unlocked by default
- 6-10: Complete 3/5 from range 1-5
- 11-15: Complete range 6-10
- 16-20: Complete range 11-15
- Addition game: Complete 1-10

---

## Number Learning Content

### Per Number Activity
1. See the number with counting objects
2. Hear the number in Hebrew
3. Trace the digit
4. Count objects (tap to count)
5. Find matching quantity

### Hebrew Number Names
| Number | Hebrew | Pronunciation |
|--------|--------|---------------|
| 1 | אחת | achat |
| 2 | שתיים | shtayim |
| 3 | שלוש | shalosh |
| 4 | ארבע | arba |
| 5 | חמש | chamesh |
| 6 | שש | shesh |
| 7 | שבע | sheva |
| 8 | שמונה | shmone |
| 9 | תשע | tesha |
| 10 | עשר | eser |
