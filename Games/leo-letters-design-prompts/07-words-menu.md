# Words Menu - תפריט מילים

## Screen Purpose
Entry point to the Words learning module. Shows word categories and progress through word-based activities.

---

## Stitch Prompt

```
Design a words module menu screen for "Leo's Letters" - a Hebrew educational app for children ages 4-6.

Top bar: Back arrow (RTL), title "מילים" (Words) in turquoise, overall module progress "15/50 ⭐".

Main content: Scrollable list of themed word category cards:

1. "חיות" (Animals) - Green card with cute animal icons (dog, cat, lion), progress bar showing 4/8 complete
2. "אוכל" (Food) - Orange card with food icons (apple, banana, bread), progress 3/6 complete
3. "משפחה" (Family) - Pink card with family figures (mom, dad, baby), progress 2/5 complete
4. "צבעים" (Colors) - Rainbow gradient card with color swatches, progress 0/6 (locked)
5. "בית" (Home) - Blue card with house items (bed, chair, table), progress 0/8 (locked)

Each card shows: Hebrew category name, cute icons, progress bar.
Locked cards are grayed out with lock icon.

Bottom: Leo reading a book, speech bubble "!בוא נלמד מילים חדשות" (Let's learn new words!)

Background: Light turquoise gradient.

Style: Friendly category cards, clear visual themes, inviting for exploration.
```

---

## Required Elements

- [ ] Back button
- [ ] Module title: "מילים"
- [ ] Total progress indicator
- [ ] Category cards (5 categories)
- [ ] Progress bar per category
- [ ] Theme icons per category
- [ ] Lock state for unavailable categories
- [ ] Leo with book

---

## Specifications

### Layout
```
┌─────────────────────────────────────┐
│  →          מילים         ⭐ 15/50 │
├─────────────────────────────────────┤
│                                     │
│  ╭───────────────────────────────╮  │
│  │ 🐕 🐱 🦁    חיות              │  │
│  │ ▓▓▓▓▓▓▓▓░░░░   4/8            │  │
│  ╰───────────────────────────────╯  │
│                                     │
│  ╭───────────────────────────────╮  │
│  │ 🍎 🍌 🍞    אוכל              │  │
│  │ ▓▓▓▓▓▓░░░░░░   3/6            │  │
│  ╰───────────────────────────────╯  │
│                                     │
│  ╭───────────────────────────────╮  │
│  │ 👩 👨 👶    משפחה             │  │
│  │ ▓▓▓▓░░░░░░░░   2/5            │  │
│  ╰───────────────────────────────╯  │
│                                     │
│  ╭───────────────────────────────╮  │
│  │ 🔒 🌈       צבעים             │  │
│  │ (locked)                      │  │
│  ╰───────────────────────────────╯  │
│                                     │
│     🦁📖 "!בוא נלמד מילים חדשות"  │
└─────────────────────────────────────┘
```

### Category Cards
| Category | Hebrew | Color | Icons |
|----------|--------|-------|-------|
| Animals | חיות | #7ED321 | 🐕🐱🦁🐰 |
| Food | אוכל | #FF9500 | 🍎🍌🍞🥕 |
| Family | משפחה | #FFB6C1 | 👩👨👶👵 |
| Colors | צבעים | Rainbow | 🔴🔵🟢🟡 |
| Home | בית | #4ECDC4 | 🛏️🪑🚪🪟 |

### Card Specifications
- Height: 100px
- Border radius: 20px
- Padding: 16px
- Progress bar: 8px height, rounded

### Typography
- Category name: 22px Bold
- Progress text: 16px Medium

---

## Interaction Notes

1. **Card tap (available)**: Expand animation, navigate to word list
2. **Card tap (locked)**: Shake animation, show unlock requirement
3. **Progress bar**: Animated fill on return
4. **Icons**: Gentle bounce on hover

---

## Unlocking Logic

- Animals: Unlocked by default
- Food: Complete 4 animal words
- Family: Complete 3 food words
- Colors: Complete all letter modules
- Home: Complete colors

---

## Word Count per Category

| Category | Words |
|----------|-------|
| Animals | כלב, חתול, אריה, ארנב, פרה, סוס, דג, ציפור |
| Food | תפוח, בננה, לחם, גזר, עוגה, מים, חלב |
| Family | אמא, אבא, אח, אחות, סבא, סבתא |
| Colors | אדום, כחול, ירוק, צהוב, כתום, סגול |
| Home | מיטה, כיסא, שולחן, דלת, חלון, מנורה, ספר, טלוויזיה |
