# Splash Screen - מסך פתיחה

## Screen Purpose
The first screen users see when opening the app. Creates excitement and establishes the brand/character.

---

## Stitch Prompt

```
Design a splash screen for "Leo's Letters" - a Hebrew educational app for children ages 4-6.

Center of screen: Cute cartoon lion cub mascot named "Leo" (ליאו) with fluffy orange mane, big friendly eyes, and a warm smile. Leo is waving hello.

Above Leo: App title in Hebrew "האותיות של ליאו" in playful, rounded purple font (#5D4E8C) with subtle shadow.

Background: Soft gradient from cream (#FFF8E7) at top to light turquoise (#4ECDC4) at bottom.

Floating around Leo: Colorful Hebrew letters (א, ב, ג) and numbers (1, 2, 3) in playful positions, slightly transparent.

Bottom: Large rounded orange button (#FF9500) with Hebrew text "!בוא נשחק" (Let's Play!) in white.

Small decorative elements: Stars, sparkles, and soft clouds scattered around.

Style: Cheerful, welcoming, child-friendly, modern illustration style. Portrait mobile layout.
```

---

## Required Elements

- [ ] Leo character (waving/welcoming pose)
- [ ] App title in Hebrew: "האותיות של ליאו"
- [ ] Gradient background (cream to turquoise)
- [ ] Floating letters and numbers (decorative)
- [ ] "Let's Play" button: "!בוא נשחק"
- [ ] Decorative stars/sparkles

---

## Specifications

### Layout
```
┌─────────────────────────────────────┐
│         ✨    ⭐    ✨              │
│                                     │
│     ╭─────────────────────╮         │
│     │ האותיות של ליאו    │         │
│     ╰─────────────────────╯         │
│                                     │
│         א    ג                      │
│              🦁                     │
│         ב         ד                 │
│                                     │
│      1     2     3                  │
│                                     │
│     ┌─────────────────────┐         │
│     │    !בוא נשחק       │         │
│     └─────────────────────┘         │
│                                     │
└─────────────────────────────────────┘
```

### Colors Used
| Element | Color |
|---------|-------|
| Background top | #FFF8E7 |
| Background bottom | #4ECDC4 |
| Title text | #5D4E8C |
| Button | #FF9500 |
| Button text | #FFFFFF |
| Floating letters | Various, 60% opacity |

### Typography
- Title: 36px, Extra Bold, centered
- Button: 28px, Bold

---

## Interaction Notes

1. **On load**: Leo bounces in from below
2. **Letters**: Float gently up and down (parallax)
3. **Stars**: Twinkle animation
4. **Button tap**: Scale down slightly, navigate to Home Screen
5. **Optional**: Cheerful sound effect on app open

---

## Variations to Try

1. Leo peeking from behind the title
2. Leo surrounded by a circle of letters
3. Night-time version with stars (for evening use)
