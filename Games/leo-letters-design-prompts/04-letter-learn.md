# Letter Learn Screen - מסך לימוד אות

## Screen Purpose
Main learning screen for individual letters. Introduces the letter with sound, visual, and example words.

---

## Stitch Prompt

```
Design a letter learning screen for "Leo's Letters" - a Hebrew educational app for children ages 4-6.

Top bar: Back arrow (right-pointing for RTL), letter name "האות ב" (The Letter Bet), sound button 🔊, and 3 empty star outlines for progress.

Center focus: Very large Hebrew letter "ב" (Bet) in purple (#5D4E8C) on a white circular card with soft shadow. The letter should be huge and prominent (120px+).

Below the letter: Three example images in a row, each showing an object starting with ב:
- House icon 🏠 with label "בַּיִת" (house)
- Banana 🍌 with label "בָּנָנָה" (banana)
- Balloon 🎈 with label "בָּלוֹן" (balloon)

The current example is highlighted with a colored border.

Bottom: Large orange play button "▶️ שמע" (Listen) to hear the letter sound.

Progress dots at very bottom showing step 1 of 4 active.

Leo peeking from bottom corner with encouraging expression.

Background: Soft gradient cream to light turquoise.

Style: Clean, focused on the letter, minimal distractions. Child-friendly with gentle colors.
```

---

## Required Elements

- [ ] Back button
- [ ] Title with letter name
- [ ] Sound toggle button
- [ ] 3-star progress indicator
- [ ] Large letter display (central focus)
- [ ] 3 example word images with labels
- [ ] "Listen" play button
- [ ] Progress dots (step indicator)
- [ ] Leo character

---

## Specifications

### Layout
```
┌─────────────────────────────────────┐
│  →      האות ב       🔊   ☆ ☆ ☆   │
├─────────────────────────────────────┤
│                                     │
│            ╭─────────╮              │
│            │         │              │
│            │    ב    │              │
│            │         │              │
│            ╰─────────╯              │
│                                     │
│    ╭────╮   ╭────╮   ╭────╮        │
│    │ 🏠 │   │ 🍌 │   │ 🎈 │        │
│    │בית │   │בננה│   │בלון│        │
│    ╰────╯   ╰────╯   ╰────╯        │
│                                     │
│         ┌────────────┐              │
│         │  ▶️ שמע   │              │
│         └────────────┘              │
│                                     │
│           ● ○ ○ ○                   │
│                                     │
│  🦁                                 │
└─────────────────────────────────────┘
```

### Letter Display
- Container: 160x160px white circle
- Letter size: 120px Extra Bold
- Color: #5D4E8C
- Shadow: 0 8px 24px rgba(0,0,0,0.1)

### Example Cards
- Size: 80x100px each
- Image: 48x48px centered
- Label: 18px below image
- Active: Orange border (#FF9500)

### Typography
- Letter: 120px Extra Bold
- Title: 24px Bold
- Labels: 18px Medium

---

## Interaction Flow

### Step 1: Introduction
1. Letter animates in (scale from 0)
2. Letter sound plays automatically
3. Leo says: "!זו האות ב" (This is the letter Bet!)

### Step 2: Sound Recognition
1. Hear the sound "בְּ"
2. Leo asks: "?איזו אות אומרת בְּ"
3. Show 3 letters, tap correct one

### Step 3: Word Association
1. Show example images
2. Leo asks: "?מה מתחיל באות ב"
3. Tap correct image (house, banana, balloon)

### Step 4: Tracing (leads to trace screen)
1. Leo says: "!עכשיו בוא נצייר את ב"
2. Navigate to trace-letter screen

---

## Audio Cues

| Action | Sound |
|--------|-------|
| Screen load | Letter name: "בֵּית" |
| Play button | Letter sound: "בְּ" |
| Correct tap | Cheerful ding + "!יפה מאוד" |
| Example tap | Word pronunciation |

---

## Variations

1. **Night mode**: Darker background, softer colors
2. **Celebration**: After completing all 4 steps, confetti overlay
