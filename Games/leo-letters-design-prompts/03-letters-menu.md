# Letters Menu - תפריט אותיות

## Screen Purpose
Grid display of all 22 Hebrew letters. Children select a letter to learn. Shows progress per letter.

---

## Stitch Prompt

```
Design a Hebrew alphabet selection screen for "Leo's Letters" - an educational app for children ages 4-6.

Top: Back arrow (pointing right for RTL), screen title "אותיות" (Letters) in purple, and a sound toggle icon.

Main content: Grid of Hebrew letter cards (5 columns, scrollable). Each card is a rounded square showing one Hebrew letter in large purple font.

Letter cards have 3 states:
- Completed: White card with gold border, small star badge in corner, letter in purple
- Available: White card with subtle shadow, letter in purple, slight glow effect
- Locked: Gray card with lock icon overlay, letter faded

Show letters: א ב ג ד ה ו ז ח ט י כ ל מ נ ס ע פ צ ק ר ש ת
First 5 letters (א-ה) are completed with stars, next 3 (ו-ח) available, rest locked.

Bottom: Leo the lion cub saying "!בחר אות ללמוד" (Choose a letter to learn!)

Background: Soft cream (#FFF8E7).

Style: Clean grid layout, large touch targets, playful but organized. RTL Hebrew layout.
```

---

## Required Elements

- [ ] Back button (RTL arrow)
- [ ] Title: "אותיות"
- [ ] Sound toggle icon
- [ ] 22 Hebrew letter cards in grid
- [ ] Card states: completed/available/locked
- [ ] Star badges on completed letters
- [ ] Leo with instruction text

---

## Specifications

### Layout
```
┌─────────────────────────────────────┐
│  →            אותיות          🔊   │
├─────────────────────────────────────┤
│                                     │
│  ╭───╮ ╭───╮ ╭───╮ ╭───╮ ╭───╮    │
│  │ א │ │ ב │ │ ג │ │ ד │ │ ה │    │
│  │ ⭐ │ │ ⭐ │ │ ⭐ │ │ ⭐ │ │ ⭐ │    │
│  ╰───╯ ╰───╯ ╰───╯ ╰───╯ ╰───╯    │
│                                     │
│  ╭───╮ ╭───╮ ╭───╮ ╭───╮ ╭───╮    │
│  │ ו │ │ ז │ │ ח │ │ ט │ │ י │    │
│  │   │ │   │ │   │ │ 🔒 │ │ 🔒 │    │
│  ╰───╯ ╰───╯ ╰───╯ ╰───╯ ╰───╯    │
│                                     │
│  ╭───╮ ╭───╮ ╭───╮ ╭───╮ ╭───╮    │
│  │ כ │ │ ל │ │ מ │ │ נ │ │ ס │    │
│  │ 🔒 │ │ 🔒 │ │ 🔒 │ │ 🔒 │ │ 🔒 │    │
│  ╰───╯ ╰───╯ ╰───╯ ╰───╯ ╰───╯    │
│                                     │
│          ... (scrollable) ...       │
│                                     │
│     🦁 "!בחר אות ללמוד"             │
└─────────────────────────────────────┘
```

### Card States
| State | Background | Border | Letter Color | Badge |
|-------|------------|--------|--------------|-------|
| Completed | White | 2px gold (#FFD700) | #5D4E8C | ⭐ top-right |
| Available | White | none | #5D4E8C | none |
| Locked | #E8E4DC | none | #CCCCCC | 🔒 center |

### Grid Specifications
- Card size: 64x64px
- Gap between cards: 12px
- Padding: 16px
- 5 columns (responsive to screen width)

### Typography
- Letters: 40px Extra Bold
- Title: 24px Bold

---

## Interaction Notes

1. **Available card tap**: Wiggle animation, navigate to letter learn
2. **Locked card tap**: Shake animation, Leo says "!קודם נלמד את..."
3. **Completed card tap**: Can replay, shows best score
4. **Scroll**: Smooth scroll, letter cards have subtle parallax
5. **Sound icon**: Toggles all audio

---

## Unlocking Logic

- Start with א (alef) unlocked
- Complete a letter (earn 1+ star) to unlock next
- Final letters (sofit forms) unlock after base letter
