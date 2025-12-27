# Parent Zone - אזור הורים

## Screen Purpose
PIN-protected area for parents/caregivers to view child's progress, manage settings, and access parental controls.

---

## Stitch Prompt

```
Design a parent dashboard screen for "Leo's Letters" - a Hebrew educational app for children ages 4-6.

Entry: PIN pad screen with 4 digit entry, title "אזור הורים" (Parent Zone), cute lock icon.

Main Dashboard (after PIN):
Top bar: Close X button, title "אזור הורים".

Section 1 - Child Overview Card:
- Child avatar/name "ליאור"
- Learning streak "🔥 5 ימים"
- Total time this week "⏱️ 2.5 שעות"
- Stars earned "⭐ 127"

Section 2 - Progress Charts:
- Bar chart showing progress per module (Letters 80%, Words 40%, Numbers 25%)
- Circular progress ring for overall completion

Section 3 - Recent Activity:
- List showing last 5 activities with dates
- "למד את האות ב - היום" (Learned letter Bet - Today)
- "סיים משחק ספירה - אתמול" (Completed counting game - Yesterday)

Section 4 - Quick Actions:
- "הגדר תזכורת" (Set reminder) button
- "הורד דוח" (Download report) button
- "צור אתגר" (Create challenge) button

Footer: Support link, Privacy policy

Background: Clean white with subtle purple accents (adult-oriented design).

Style: Professional dashboard, data visualization, clean and minimal. Hebrew RTL.
```

---

## Required Elements

### PIN Entry Screen
- [ ] Title: "אזור הורים"
- [ ] Lock icon
- [ ] 4-digit PIN pad
- [ ] PIN dots display
- [ ] "Forgot PIN" option

### Dashboard
- [ ] Close button
- [ ] Child overview card
- [ ] Progress charts
- [ ] Recent activity list
- [ ] Quick action buttons
- [ ] Support/legal links

---

## Specifications

### PIN Entry Layout
```
┌─────────────────────────────────────┐
│                                     │
│              🔒                     │
│         אזור הורים                 │
│                                     │
│         ● ● ○ ○                    │
│                                     │
│    ┌───┐  ┌───┐  ┌───┐            │
│    │ 1 │  │ 2 │  │ 3 │            │
│    └───┘  └───┘  └───┘            │
│    ┌───┐  ┌───┐  ┌───┐            │
│    │ 4 │  │ 5 │  │ 6 │            │
│    └───┘  └───┘  └───┘            │
│    ┌───┐  ┌───┐  ┌───┐            │
│    │ 7 │  │ 8 │  │ 9 │            │
│    └───┘  └───┘  └───┘            │
│           ┌───┐                    │
│           │ 0 │                    │
│           └───┘                    │
│                                     │
│        ?שכחת קוד                   │
└─────────────────────────────────────┘
```

### Dashboard Layout
```
┌─────────────────────────────────────┐
│  ✕           אזור הורים            │
├─────────────────────────────────────┤
│  ╭───────────────────────────────╮  │
│  │  👦 ליאור                     │  │
│  │  🔥 5 ימים  ⏱️ 2.5שע  ⭐ 127  │  │
│  ╰───────────────────────────────╯  │
│                                     │
│  התקדמות לפי מודול                 │
│  ╭───────────────────────────────╮  │
│  │ אותיות  ████████░░   80%     │  │
│  │ מילים   ████░░░░░░   40%     │  │
│  │ מספרים  ███░░░░░░░   25%     │  │
│  ╰───────────────────────────────╯  │
│                                     │
│  פעילות אחרונה                      │
│  • למד את האות ב - היום            │
│  • משחק ספירה - אתמול              │
│  • האות א - לפני יומיים            │
│                                     │
│  ┌─────────┐ ┌─────────┐           │
│  │ תזכורת │ │  דוח   │           │
│  └─────────┘ └─────────┘           │
│                                     │
│       תמיכה | פרטיות               │
└─────────────────────────────────────┘
```

### Design Tokens
- Background: #FFFFFF
- Accent: #5D4E8C (purple)
- Cards: White with subtle shadow
- Text: Dark gray #333333
- Secondary text: #888888

---

## Data Displayed

### Overview Stats
| Stat | Icon | Description |
|------|------|-------------|
| Streak | 🔥 | Consecutive days played |
| Time | ⏱️ | Total learning time this week |
| Stars | ⭐ | Total stars earned |

### Progress by Module
- Letters: X/22 letters learned (percentage)
- Words: X/50 words learned
- Numbers: X/20 numbers learned

### Activity Log
- Last 10 activities
- Date/time stamp
- Activity type (learned, practiced, completed)
- Result (stars earned)

---

## Features

### Time Limits
- Set daily screen time limit
- Gentle reminder when limit approached
- Pause learning option

### Learning Goals
- Set weekly goals (e.g., 5 letters)
- Track goal progress
- Celebration when goal met

### Reports
- Weekly email summary (opt-in)
- Download PDF progress report
- Share progress with family

---

## Security

- 4-digit PIN (set on first access)
- Reset PIN via email
- Auto-lock after 30 seconds of inactivity
- No sensitive data stored locally
