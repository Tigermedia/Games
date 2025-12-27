# Counting Game - משחק ספירה

## Screen Purpose
Fun counting activity where children count objects on screen and select the correct number.

---

## Stitch Prompt

```
Design a counting game screen for "Leo's Letters" - a Hebrew educational app for children ages 4-6.

Top bar: Back arrow (RTL), title "כמה יש?" (How many?), progress "⭐ 3/5".

Main area: A cheerful scene with objects to count - show 4 red apples 🍎 scattered playfully on a light background with a subtle grass/outdoor theme.

Each apple should be large, colorful, and tappable. As child taps each apple, it bounces and shows a small number badge.

Below the scene: Question text "?כמה תפוחים יש" (How many apples are there?)

Answer buttons: Row of 4 number buttons:
- "3" in blue circle
- "4" in green circle (correct answer)
- "5" in orange circle
- "6" in purple circle

Numbers are large and clear in white on colored backgrounds.

Bottom: Leo scratching his head thinking, with speech bubble "?נספור ביחד" (Shall we count together?)

Speaker button to hear the question read aloud.

Background: Soft sky blue with clouds, grassy bottom.

Style: Colorful, game-like, objects are large and easy to count.
```

---

## Required Elements

- [ ] Back button
- [ ] Game title: "?כמה יש"
- [ ] Progress indicator
- [ ] Counting scene with objects
- [ ] Tappable objects with count feedback
- [ ] Question text
- [ ] Number answer buttons (4 options)
- [ ] Audio play button
- [ ] Leo thinking pose

---

## Specifications

### Layout
```
┌─────────────────────────────────────┐
│  →        ?כמה יש         ⭐ 3/5   │
├─────────────────────────────────────┤
│  ☁️                          ☁️    │
│                                     │
│     🍎①      🍎②                   │
│                                     │
│          🍎③      🍎④             │
│                                     │
│  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│
│                                     │
│       ?כמה תפוחים יש    🔊         │
│                                     │
│   ╭───╮  ╭───╮  ╭───╮  ╭───╮      │
│   │ 3 │  │ 4 │  │ 5 │  │ 6 │      │
│   ╰───╯  ╰───╯  ╰───╯  ╰───╯      │
│                                     │
│     🦁🤔 "?נספור ביחד"              │
└─────────────────────────────────────┘
```

### Object Display
- Object size: 60x60px
- Scattered naturally (not in grid)
- Tap feedback: Bounce + number badge
- Badge: Small circle with count (1, 2, 3...)

### Answer Buttons
- Size: 64x64px circles
- Colors: Blue, Green, Orange, Purple
- Number: 32px Bold white
- Shadow: Subtle 3D effect

### Scene Theme Options
| Scene | Objects | Background |
|-------|---------|------------|
| Orchard | 🍎 Apples | Grass + sky |
| Ocean | 🐟 Fish | Underwater blue |
| Sky | ⭐ Stars | Night sky |
| Garden | 🌸 Flowers | Garden green |
| Farm | 🐑 Sheep | Farm field |

---

## Interaction Flow

1. **Scene appears**: Objects scattered
2. **Audio plays**: "?כמה תפוחים יש"
3. **Count mode** (optional): Child taps each object
   - Tapped object bounces, shows number
   - Helps kids count one-by-one
4. **Answer**: Child selects number button
5. **Correct**: Objects celebrate, stars awarded
6. **Wrong**: Gentle shake, "...נספור שוב" (Let's count again)

---

## Animations

| Action | Animation |
|--------|-----------|
| Objects appear | Float/bounce in |
| Object tap | Bounce + number popup |
| Correct answer | Objects dance/jump |
| Wrong answer | Buttons shake |
| Next round | Objects float away, new appear |

---

## Audio

| Event | Sound |
|-------|-------|
| Round start | Question read aloud |
| Object tap | Counting voice: "אחת", "שתיים"... |
| Correct | Celebration + "!נכון" |
| Wrong | Gentle tone + "...נספור עוד פעם" |

---

## Difficulty Scaling

| Level | Count Range | Distractors |
|-------|-------------|-------------|
| Easy | 1-5 | Few options (3) |
| Medium | 1-10 | 4 options |
| Hard | 5-15 | Close numbers |

---

## Object Sets

| Category | Objects |
|----------|---------|
| Fruits | 🍎🍌🍊🍇🍓 |
| Animals | 🐕🐱🐟🦋🐝 |
| Nature | ⭐🌸🌳☁️🌈 |
| Food | 🍪🧁🍩🍕🍦 |
| Transport | 🚗🚌✈️🚢🚲 |
