# Style Guide - Leo's Letters Design System

## Stitch Prompt

```
Create a comprehensive mobile app style guide for "Leo's Letters" - a Hebrew educational app for children ages 4-6.

Design system includes:
- Mascot: Cute lion cub named Leo with orange fluffy mane, big round eyes, friendly smile
- Color palette: Primary orange (#FF9500), turquoise (#4ECDC4), purple (#5D4E8C), cream (#FFF8E7), success green (#7ED321)
- Typography samples for Hebrew letters (large, bold, rounded) and UI text
- Button styles: Primary (orange), Secondary (turquoise), with rounded corners and playful shadows
- Card components with soft shadows and rounded corners
- Icon set: Stars, trophies, locks, sound icons, back arrows
- Progress indicators: Star ratings (1-3), progress bars with cute styling
- Touch target sizing for small fingers (large buttons)

Style: Playful, colorful, child-friendly, modern flat design with subtle depth. Safe and encouraging feel.
Show all components on a cream background.
```

---

## Design Tokens

### Colors
```
Primary:
  orange-500: #FF9500  (Leo, primary buttons)
  orange-400: #FFAA33  (hover states)
  orange-600: #E68600  (pressed states)

Secondary:
  turquoise-500: #4ECDC4  (backgrounds, secondary)
  turquoise-400: #6FD9D2  (light variant)
  turquoise-600: #3DBDB4  (dark variant)

Accent:
  purple-500: #5D4E8C  (text, letters)
  purple-400: #7A6BA8  (light text)

Neutral:
  cream: #FFF8E7  (light background)
  warm-white: #FFFDF9
  soft-gray: #E8E4DC

Feedback:
  success: #7ED321  (correct, achievements)
  error-soft: #FFB4B4  (gentle error, no harsh red)

Fun:
  pink: #FFB6C1  (rewards, celebrations)
  yellow: #FFD93D  (stars, highlights)
  sky-blue: #87CEEB  (variety)
```

### Typography
```
Hebrew Letters (Learning):
  font-family: "Heebo", "Arial Hebrew", sans-serif
  font-weight: 800 (Extra Bold)
  font-size: 96-120px
  line-height: 1.2

Headlines:
  font-weight: 700 (Bold)
  font-size: 28-32px

Body/Instructions:
  font-weight: 500 (Medium)
  font-size: 20-24px

Buttons:
  font-weight: 700 (Bold)
  font-size: 22-26px
```

### Spacing
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
xxl: 48px
```

### Border Radius
```
small: 8px  (small elements)
medium: 16px  (cards, buttons)
large: 24px  (large cards)
round: 50%  (circles, avatars)
pill: 999px  (pills, tags)
```

### Shadows
```
soft: 0 4px 12px rgba(0,0,0,0.08)
medium: 0 6px 20px rgba(0,0,0,0.12)
button: 0 4px 0 darken(color, 15%)  (playful 3D effect)
```

---

## Component Specifications

### Leo Character States
| State | Description | Usage |
|-------|-------------|-------|
| Happy | Big smile, eyes curved | Success, welcome |
| Thinking | Paw on chin, curious eyes | Waiting for answer |
| Celebrating | Arms up, confetti | Level complete |
| Encouraging | Gentle smile, soft eyes | After mistake |
| Sleeping | Closed eyes, zzz | Idle state |

### Buttons
```
Primary Button:
  background: #FF9500
  text: white
  padding: 16px 32px
  border-radius: 16px
  shadow: 0 4px 0 #CC7700
  min-height: 56px
  min-width: 120px

Secondary Button:
  background: #4ECDC4
  text: white
  shadow: 0 4px 0 #3DBDB4

Icon Button:
  size: 56x56px
  border-radius: 50%
  background: white
  shadow: soft
```

### Cards
```
Letter Card:
  size: 80x80px
  background: white
  border-radius: 16px
  shadow: soft

  States:
    - Locked: grayscale, lock icon overlay
    - Available: full color, slight glow
    - Completed: gold border, star badge

Game Card:
  size: full-width, 120px height
  background: gradient or themed
  border-radius: 24px
```

### Progress Indicators
```
Star Rating:
  3 stars layout
  size: 32px each
  filled: #FFD93D
  empty: #E8E4DC

Progress Bar:
  height: 16px
  background: #E8E4DC
  fill: gradient(#FF9500, #FFAA33)
  border-radius: pill

Step Indicator:
  circles connected by line
  active: #FF9500
  completed: #7ED321
  upcoming: #E8E4DC
```

---

## Animation Guidelines

### Principles
- **Bouncy**: Use spring animations for playfulness
- **Quick**: 200-300ms for UI, 400-600ms for celebrations
- **Rewarding**: Every success gets visual feedback

### Key Animations
| Element | Animation | Duration |
|---------|-----------|----------|
| Button press | Scale down + shadow reduce | 100ms |
| Correct answer | Bounce + sparkle | 400ms |
| Star collect | Float up + spin | 500ms |
| Leo appears | Bounce in from bottom | 300ms |
| Screen transition | Slide + fade | 250ms |

---

## Iconography

### Style
- Rounded, friendly style
- 2-3px stroke weight
- Filled versions for active states
- Consistent 24x24 or 32x32 base size

### Required Icons
- Back arrow (RTL - points right)
- Home
- Settings (gear)
- Sound on/off
- Star (filled/empty)
- Lock
- Trophy
- Play button
- Pause
- Repeat/retry
- Check mark
- Heart
