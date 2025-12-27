# Home Screen - מסך בית

## Screen Purpose
Main hub where children choose which learning module to explore. Shows progress and daily activities.

---

## Stitch Prompt

```
Design a home screen for "Leo's Letters" - a Hebrew educational app for children ages 4-6.

Top bar: Left side shows star count "127 ⭐" and trophy count "12 🏆". Right side has settings gear icon.

Center: Three large, colorful module cards arranged vertically:
1. "אותיות" (Letters) - Purple card with floating Hebrew letters א-ב-ג, icon of letter blocks
2. "מילים" (Words) - Turquoise card with open book icon and small illustrations
3. "מספרים" (Numbers) - Orange card with numbers 1-2-3 and counting objects

Each card has: Hebrew title, cute icon, and a small progress indicator (e.g., "5/22 ⭐")

Bottom: Cute lion cub mascot "Leo" peeking from bottom of screen with speech bubble saying "?מה נלמד היום" (What shall we learn today?)

Background: Soft cream color (#FFF8E7) with subtle pattern of light shapes.

Below the modules: "Daily Challenge" banner in pink with gift icon.

Style: Playful, colorful cards with rounded corners and soft shadows. Child-friendly, modern design. RTL layout (Hebrew).
```

---

## Required Elements

- [ ] Status bar with stars (⭐) and trophies (🏆)
- [ ] Settings icon (gear)
- [ ] Letters module card: "אותיות"
- [ ] Words module card: "מילים"
- [ ] Numbers module card: "מספרים"
- [ ] Progress indicator on each card
- [ ] Leo character with speech bubble
- [ ] Daily challenge banner

---

## Specifications

### Layout
```
┌─────────────────────────────────────┐
│  ⚙️          ⭐ 127    🏆 12       │
├─────────────────────────────────────┤
│                                     │
│  ╭───────────────────────────────╮  │
│  │  🔤  אותיות                   │  │
│  │      א ב ג        ⭐ 15/22    │  │
│  ╰───────────────────────────────╯  │
│                                     │
│  ╭───────────────────────────────╮  │
│  │  📖  מילים                    │  │
│  │      dog cat      ⭐ 8/30     │  │
│  ╰───────────────────────────────╯  │
│                                     │
│  ╭───────────────────────────────╮  │
│  │  🔢  מספרים                   │  │
│  │      1 2 3        ⭐ 5/20     │  │
│  ╰───────────────────────────────╯  │
│                                     │
│  ╭───────────────────────────────╮  │
│  │  🎁  אתגר יומי!              │  │
│  ╰───────────────────────────────╯  │
│                                     │
│     🦁 "?מה נלמד היום"             │
└─────────────────────────────────────┘
```

### Card Specifications
| Card | Background | Icon |
|------|------------|------|
| Letters | #5D4E8C (purple) | Letter blocks |
| Words | #4ECDC4 (turquoise) | Open book |
| Numbers | #FF9500 (orange) | Numbers |
| Daily | #FFB6C1 (pink) | Gift box |

### Typography
- Module title: 24px Bold
- Progress: 16px Medium
- Leo speech: 20px Medium

---

## Interaction Notes

1. **Card tap**: Scale up slightly, navigate to module
2. **Leo**: Blinks occasionally, bounces when tapped
3. **Daily Challenge**: Pulses gently to attract attention
4. **Stars counter**: Animates when new stars earned
5. **Settings**: Opens parent zone (requires PIN)

---

## States

### First-time User
- Words and Numbers cards show lock icon
- Only Letters available
- Leo says: "!בוא נתחיל עם האותיות" (Let's start with letters!)

### Returning User
- Show personalized greeting based on time of day
- Highlight module with most recent activity
