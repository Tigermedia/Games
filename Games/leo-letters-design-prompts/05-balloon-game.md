# Balloon Game - משחק בלונים

## Screen Purpose
Fun mini-game for letter recognition. Children pop the balloon with the correct letter based on audio cue.

---

## Stitch Prompt

```
Design a balloon popping game screen for "Leo's Letters" - a Hebrew educational app for children ages 4-6.

Top bar: Back arrow, game title "בלון האותיות" (Letter Balloons), and score display "⭐ 3/5".

Main game area: 4 colorful balloons floating against a bright sky blue background with fluffy white clouds. Each balloon has a different Hebrew letter on it:
- Pink balloon with "א"
- Yellow balloon with "ב" (this is the correct answer, slightly glowing)
- Green balloon with "ג"
- Purple balloon with "ד"

Balloons should look 3D, shiny, with strings hanging down. They float gently.

Center-bottom: Sound wave icon with Hebrew text showing what letter to find - "?איפה בְּ" (Where is Bet?)

Large speaker button to replay the sound.

Bottom: Leo the lion cub looking up at balloons excitedly, pointing.

Add floating confetti and one or two popped balloon remnants to show previous correct answers.

Style: Bright, playful, game-like atmosphere. Rounded balloon shapes, cheerful colors.
```

---

## Required Elements

- [ ] Back button
- [ ] Game title: "בלון האותיות"
- [ ] Score indicator (stars or points)
- [ ] 4 floating balloons with letters
- [ ] Audio prompt: "?איפה [letter sound]"
- [ ] Sound replay button
- [ ] Sky background with clouds
- [ ] Leo character (excited pose)
- [ ] Confetti/pop effects

---

## Specifications

### Layout
```
┌─────────────────────────────────────┐
│  →     בלון האותיות      ⭐ 3/5   │
├─────────────────────────────────────┤
│  ☁️                          ☁️    │
│                                     │
│      🎈א        🎈ב               │
│                                     │
│           🎈ג        🎈ד          │
│                                     │
│                                     │
│  ☁️              ☁️                │
│                                     │
│         ┌─────────────┐             │
│         │ ?איפה בְּ   🔊│             │
│         └─────────────┘             │
│                                     │
│              🦁 ☝️                  │
└─────────────────────────────────────┘
```

### Balloon Specifications
- Size: 80x100px
- Style: Glossy, 3D appearance
- String: Thin curved line below
- Float animation: Gentle up/down bob

### Balloon Colors
| Balloon | Background | Glow (correct) |
|---------|------------|----------------|
| 1 | #FFB6C1 (pink) | - |
| 2 | #FFD93D (yellow) | subtle pulse |
| 3 | #7ED321 (green) | - |
| 4 | #B19CD9 (purple) | - |

### Typography
- Letter on balloon: 48px Extra Bold, white with shadow
- Question: 24px Bold
- Score: 20px Bold

---

## Interaction Flow

### Game Loop
1. 4 balloons appear with random letters
2. Audio plays: "?איפה [sound]" (Where is [sound]?)
3. Child taps a balloon
4. **Correct**: Balloon pops with confetti, cheerful sound
5. **Wrong**: Balloon wiggles, gentle "try again" sound
6. Repeat 5 rounds

### Animations
| Action | Animation | Duration |
|--------|-----------|----------|
| Balloon float | Gentle sine wave up/down | Continuous |
| Correct tap | Pop explosion + confetti | 500ms |
| Wrong tap | Horizontal shake | 300ms |
| New round | Balloons float in from bottom | 400ms |

---

## Audio Cues

| Event | Sound |
|-------|-------|
| Round start | Letter sound: "בְּ" |
| Replay button | Letter sound repeats |
| Correct | Pop! + "!כל הכבוד" (Great job!) |
| Wrong | Soft buzz + "...נסה שוב" (Try again...) |
| Game complete | Celebration music |

---

## Difficulty Scaling

| Level | Letters | Similarity |
|-------|---------|------------|
| Easy | 2 balloons | Very different (א, מ) |
| Medium | 3 balloons | Some similar (ב, כ, פ) |
| Hard | 4 balloons | Similar sounds (ס, שׂ) |

---

## Reward System

- 1 star: Complete 3/5 rounds
- 2 stars: Complete 4/5 rounds
- 3 stars: Complete 5/5 rounds (perfect)
