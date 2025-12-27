# Trace Letter Screen - מסך ציור אות

## Screen Purpose
Interactive tracing activity where children practice writing Hebrew letters by following a guided path.

---

## Stitch Prompt

```
Design a letter tracing screen for "Leo's Letters" - a Hebrew educational app for children ages 4-6.

Top bar: Back arrow (RTL), title "צייר את ב" (Draw the letter Bet), and 3 star rating (1 filled, 2 empty).

Main area: Large white canvas/card in center with the Hebrew letter "ב" displayed as a light gray dotted outline guide. Numbered starting points (1, 2) show where to begin each stroke.

A colorful trail (rainbow or orange gradient) shows the path the child has already traced. An animated hand cursor or sparkle shows where to draw next.

Below canvas:
- Eraser button (🧽) to start over
- Color palette with 4 fun colors to choose from (orange, pink, purple, green)

Bottom: Leo holding a pencil, looking encouraging. Speech bubble: "!עקוב אחרי הנקודות" (Follow the dots!)

Small "demo" play button to show animation of correct stroke order.

Background: Soft cream with subtle pattern.

Style: Clean, focused workspace. The letter should be very large and clear. Touch-friendly interface.
```

---

## Required Elements

- [ ] Back button
- [ ] Title with letter name
- [ ] Star rating display
- [ ] Large tracing canvas
- [ ] Dotted letter outline guide
- [ ] Numbered stroke starting points
- [ ] Trail/path visualization
- [ ] Eraser button
- [ ] Color selection
- [ ] Demo/help button
- [ ] Leo with pencil

---

## Specifications

### Layout
```
┌─────────────────────────────────────┐
│  →        צייר את ב       ★ ☆ ☆   │
├─────────────────────────────────────┤
│                                     │
│    ╭───────────────────────────╮    │
│    │                           │    │
│    │      ①                    │    │
│    │     ┌ · · · · ·           │    │
│    │     │         :           │    │
│    │     │    ב    :           │    │
│    │     │         :           │    │
│    │     └ · · · · ·②          │    │
│    │                           │    │
│    ╰───────────────────────────╯    │
│                                     │
│    🧽      🟠 🟣 💗 💚      ▶️    │
│                                     │
│         🦁 ✏️                       │
│    "!עקוב אחרי הנקודות"             │
└─────────────────────────────────────┘
```

### Canvas Specifications
- Size: Full width - 32px padding, ~300px height
- Background: White
- Border radius: 24px
- Shadow: Soft shadow

### Letter Guide
- Style: Dotted gray outline (#CCCCCC)
- Dots: 8px diameter, 12px spacing
- Size: Fill most of canvas (~200px)
- Stroke numbers: Small circles with number

### Trail/Ink
- Width: 12px
- Style: Smooth bezier curves
- Color: User-selected or default orange
- Effect: Slight glow, sparkle particles

---

## Stroke Order Data

Example for letter ב (Bet):
```
Stroke 1: Top horizontal (right to left)
  Start: top-right corner
  End: top-left corner

Stroke 2: Vertical + bottom
  Start: top-left
  Down to bottom-left
  Right to bottom-right
```

---

## Interaction Flow

1. **Demo first**: Show animated correct stroke order
2. **Guided trace**: Finger follows dotted path
3. **Accuracy check**: Validate if trace is close enough
4. **Feedback**:
   - Great (90%+): 3 stars, confetti
   - Good (70-89%): 2 stars, encouraging
   - Try again (<70%): 1 star, gentle retry prompt

### Touch Gestures
- **Draw**: Touch and drag on canvas
- **Eraser**: Tap to clear canvas
- **Color tap**: Change trail color
- **Demo tap**: Play stroke animation

---

## Animations

| Element | Animation |
|---------|-----------|
| Starting point | Pulsing glow |
| Next segment | Animated arrow/sparkle |
| Correct stroke | Brief sparkle trail |
| Complete letter | Letter "comes alive" - bounces |
| Wrong path | Gentle vibration + fade |

---

## Audio

| Event | Sound |
|-------|-------|
| Stroke start | Soft pencil sound |
| Correct path | Gentle positive chime |
| Off path | Subtle nudge sound |
| Complete | Celebration + letter name |
| Eraser | Whoosh/erase sound |

---

## Evaluation Criteria

- **Path accuracy**: How close to guide dots
- **Stroke order**: Correct sequence
- **Completion**: All strokes done
- **Smoothness**: Not too jagged (gentle tolerance for kids)
