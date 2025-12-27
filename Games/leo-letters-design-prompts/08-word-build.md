# Word Build Game - משחק בניית מילה

## Screen Purpose
Interactive game where children build Hebrew words by dragging letters into the correct order.

---

## Stitch Prompt

```
Design a word building game screen for "Leo's Letters" - a Hebrew educational app for children ages 4-6.

Top bar: Back arrow (RTL), game title "בנה מילה" (Build a Word), score "⭐ 2/5".

Center-top: Large image of a dog 🐕 with the word "כֶּלֶב" (dog) written below in small gray text as a hint.

Middle: Empty letter slots - 3 rounded square outlines in a row where letters will go. Show dashed borders indicating drop zones. RTL order (right to left).

Below: Scrambled letter tiles in a row or scattered arrangement:
- "ל" in orange tile
- "ב" in turquoise tile
- "כ" in purple tile

Letters are in large, friendly font on colorful rounded square tiles with subtle shadow.

Speaker button near the image to hear "כֶּלֶב" pronunciation.

Bottom: Leo with paws up, encouraging. Speech bubble: "!גרור את האותיות למקום" (Drag the letters to place!)

Background: Soft cream with playful elements.

Style: Clear drag-and-drop interface, large touch targets, colorful letters.
```

---

## Required Elements

- [ ] Back button
- [ ] Game title: "בנה מילה"
- [ ] Progress indicator
- [ ] Target word image (large)
- [ ] Audio play button
- [ ] Empty letter slots (drop zones)
- [ ] Draggable letter tiles
- [ ] Leo with instructions

---

## Specifications

### Layout
```
┌─────────────────────────────────────┐
│  →        בנה מילה        ⭐ 2/5   │
├─────────────────────────────────────┤
│                                     │
│            ╭───────╮                │
│            │  🐕   │   🔊          │
│            │       │                │
│            ╰───────╯                │
│             (כלב)                   │
│                                     │
│    ╭─ ─ ─╮  ╭─ ─ ─╮  ╭─ ─ ─╮      │
│    │  ?  │  │  ?  │  │  ?  │      │
│    ╰─ ─ ─╯  ╰─ ─ ─╯  ╰─ ─ ─╯      │
│     slot3    slot2    slot1        │
│              (RTL)                  │
│                                     │
│    ╭─────╮  ╭─────╮  ╭─────╮       │
│    │  ל  │  │  ב  │  │  כ  │       │
│    ╰─────╯  ╰─────╯  ╰─────╯       │
│                                     │
│     🦁 "!גרור את האותיות למקום"    │
└─────────────────────────────────────┘
```

### Drop Zones (Slots)
- Size: 64x64px
- Border: 3px dashed #CCCCCC
- Border radius: 12px
- Active (dragging over): Glow effect, solid border

### Letter Tiles
- Size: 64x64px
- Background: Colored (orange, turquoise, purple)
- Border radius: 12px
- Shadow: 0 4px 0 darker shade
- Font: 40px Extra Bold, white

### Image Card
- Size: 120x120px
- Border radius: 20px
- Background: White
- Shadow: Soft

---

## Interaction Flow

1. **Start**: Image appears, word is spoken
2. **Drag**: Child drags letter tile to slot
3. **Drop on correct slot**: Letter snaps in, sparkle effect
4. **Drop on wrong slot**: Letter bounces back
5. **Complete**: All letters placed correctly
6. **Celebrate**: Word highlights, spoken again, stars awarded

### Drag Behavior
- Tile lifts up (scale 1.1) when grabbed
- Shadow increases during drag
- Ghost outline shows original position
- Snaps to slot if within 20px

---

## Animations

| Action | Animation |
|--------|-----------|
| Tile pickup | Scale up 1.1, raise shadow |
| Correct drop | Bounce, sparkle, checkmark |
| Wrong drop | Shake, float back to origin |
| Word complete | All tiles glow, word spoken |
| New word | Tiles shuffle in from bottom |

---

## Audio

| Event | Sound |
|-------|-------|
| Word shown | Full word pronunciation |
| Speaker tap | Word pronunciation |
| Tile pickup | Soft pop |
| Correct drop | Happy chime |
| Wrong drop | Gentle buzz |
| Complete | Celebration + word |

---

## Difficulty Levels

| Level | Word Length | Hints |
|-------|-------------|-------|
| Easy | 2 letters | Word visible below image |
| Medium | 3 letters | Word hint fades after 3 sec |
| Hard | 4+ letters | No text hint, audio only |

---

## Word Examples

| Word | Letters | Image |
|------|---------|-------|
| אמא | א-מ-א | 👩 |
| כלב | כ-ל-ב | 🐕 |
| בית | ב-י-ת | 🏠 |
| שמש | ש-מ-ש | ☀️ |
| אריה | א-ר-י-ה | 🦁 |
