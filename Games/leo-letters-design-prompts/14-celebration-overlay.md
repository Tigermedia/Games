# Celebration Overlay - אוברליי חגיגה

## Screen Purpose
Fullscreen celebration that appears when child completes a level, earns achievement, or reaches milestone. Maximum positive reinforcement!

---

## Stitch Prompt

```
Design a celebration overlay screen for "Leo's Letters" - a Hebrew educational app for children ages 4-6.

Fullscreen overlay with semi-transparent dark background (60% opacity).

Center: Celebration card with:
- Burst of colorful confetti and stars exploding outward
- Large "!כל הכבוד" (Great Job!) text in gold with sparkle effect
- Three golden stars ⭐⭐⭐ with glow animation
- Below: Achievement badge showing what was completed "!סיימת את האות ב" (You completed letter Bet!)

Leo the lion cub in celebration pose - jumping with arms up, huge smile, maybe wearing a party hat or crown.

Floating elements: Balloons, confetti, sparkles, small fireworks bursts.

Bottom buttons:
- "המשך" (Continue) - Large orange primary button
- "שחק שוב" (Play Again) - Smaller secondary button

Add subtle particle effects continuously falling like gentle confetti.

Style: Maximum celebration, joyful, rewarding. Bright colors against the dark overlay. Child should feel amazing!
```

---

## Required Elements

- [ ] Dark semi-transparent background overlay
- [ ] Celebration card (white/gold)
- [ ] "!כל הכבוד" headline
- [ ] Star rating display (1-3 stars)
- [ ] Achievement description
- [ ] Leo celebration pose
- [ ] Confetti/particles
- [ ] Continue button
- [ ] Play again button (optional)

---

## Specifications

### Layout
```
┌─────────────────────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓     🎊  ✨  🎉  ✨  🎊      ▓▓▓│
│▓▓▓                             ▓▓▓│
│▓▓▓   ╭─────────────────────╮   ▓▓▓│
│▓▓▓   │                     │   ▓▓▓│
│▓▓▓   │   ✨ כל הכבוד! ✨   │   ▓▓▓│
│▓▓▓   │                     │   ▓▓▓│
│▓▓▓   │     ⭐ ⭐ ⭐        │   ▓▓▓│
│▓▓▓   │                     │   ▓▓▓│
│▓▓▓   │  !סיימת את האות ב  │   ▓▓▓│
│▓▓▓   │                     │   ▓▓▓│
│▓▓▓   │        🦁🎉         │   ▓▓▓│
│▓▓▓   │                     │   ▓▓▓│
│▓▓▓   ╰─────────────────────╯   ▓▓▓│
│▓▓▓                             ▓▓▓│
│▓▓▓   ┌─────────────────────┐   ▓▓▓│
│▓▓▓   │       המשך         │   ▓▓▓│
│▓▓▓   └─────────────────────┘   ▓▓▓│
│▓▓▓                             ▓▓▓│
│▓▓▓        שחק שוב             ▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
└─────────────────────────────────────┘
```

### Overlay
- Background: #000000 at 60% opacity
- Animation: Fade in 300ms

### Celebration Card
- Background: White with gold gradient border
- Border radius: 32px
- Shadow: Large, warm glow
- Width: 85% of screen
- Padding: 32px

### Stars
- Size: 48px each
- Color: Gold #FFD700 with glow
- Animation: Sequential pop-in with sparkle

### Typography
- Headline: 40px Extra Bold, gold gradient
- Achievement: 20px Medium, purple

### Buttons
- Continue: Full width, orange, 56px height
- Play again: Text link style, smaller

---

## Animation Sequence

| Time | Animation |
|------|-----------|
| 0ms | Overlay fades in |
| 100ms | Card scales up with bounce |
| 200ms | Headline appears with sparkle |
| 400ms | Star 1 pops in |
| 500ms | Star 2 pops in |
| 600ms | Star 3 pops in (if earned) |
| 700ms | Achievement text fades in |
| 800ms | Leo bounces in |
| 1000ms | Confetti burst |
| 1500ms | Buttons appear |
| Continuous | Gentle confetti falling |

---

## Celebration Variations

### By Star Count
| Stars | Headline | Leo Pose |
|-------|----------|----------|
| 1 ⭐ | !טוב מאוד | Thumbs up |
| 2 ⭐⭐ | !יפה מאוד | Clapping |
| 3 ⭐⭐⭐ | !מושלם | Jumping with crown |

### By Achievement Type
| Type | Badge | Extras |
|------|-------|--------|
| Letter complete | Letter in circle | Letter floats |
| Word learned | Word card | Word spelled out |
| Number mastered | Number badge | Counting animation |
| Streak | Flame icon | Fire particles |
| Sticker earned | Sticker reveal | Sticker spins in |
| Trophy unlocked | Trophy 3D | Extra confetti |

---

## Audio

| Element | Sound |
|---------|-------|
| Overlay appear | Triumphant fanfare |
| Stars pop | Chime per star |
| Confetti | Soft celebration sounds |
| Leo voice | "!כל הכבוד, עשית את זה" |
| Button tap | Positive click |

---

## Special Celebrations

### First Letter Complete
- Extra long celebration
- Leo says special message
- Unlock notification for next letter

### Module Complete (all letters/words/numbers)
- Trophy reveal animation
- Major celebration sound
- Screen filled with confetti
- Leo wearing crown/medal

### Perfect Week
- Special weekly badge
- Leo in superhero costume
- Rainbow effect
