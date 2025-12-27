# Settings Screen - מסך הגדרות

## Screen Purpose
App settings accessible to parents/caregivers. Controls sound, notifications, and account options.

---

## Stitch Prompt

```
Design a settings screen for "Leo's Letters" - a Hebrew educational app for children ages 4-6.

Top bar: Back arrow (RTL), title "הגדרות" (Settings).

Settings list with toggle switches and icons:

1. Sound section:
   - 🔊 "צלילים" (Sounds) - Toggle ON (orange)
   - 🎵 "מוזיקה" (Music) - Toggle ON
   - 🗣️ "הקראה" (Voice/Narration) - Toggle ON

2. Notifications section:
   - 🔔 "תזכורת יומית" (Daily reminder) - Toggle OFF
   - ⏰ Time picker showing "16:00"

3. Learning section:
   - 📊 "רמת קושי" (Difficulty) - Dropdown showing "רגיל" (Normal)
   - 🔄 "אפס התקדמות" (Reset Progress) - Red text button

4. Account section:
   - 👶 "שם הילד/ה" (Child's name) - Text field showing "ליאור"
   - 👤 "אזור הורים" (Parent Zone) - Arrow to navigate
   - ℹ️ "אודות" (About) - Arrow to navigate

Bottom: App version "גרסה 1.0.0", privacy policy and terms links.

Background: Clean white/cream, clear sections with dividers.

Style: Clean, organized, easy to use. Adult-oriented UI unlike playful child screens. Hebrew RTL layout.
```

---

## Required Elements

- [ ] Back button
- [ ] Title: "הגדרות"
- [ ] Sound toggles (3)
- [ ] Notification settings
- [ ] Time picker
- [ ] Difficulty selector
- [ ] Reset progress button
- [ ] Child name field
- [ ] Parent zone navigation
- [ ] About/legal links
- [ ] Version number

---

## Specifications

### Layout
```
┌─────────────────────────────────────┐
│  →           הגדרות                 │
├─────────────────────────────────────┤
│                                     │
│  צלילים ────────────────────────   │
│  🔊 צלילים                   [ON]  │
│  🎵 מוזיקה                   [ON]  │
│  🗣️ הקראה                   [ON]  │
│                                     │
│  התראות ────────────────────────   │
│  🔔 תזכורת יומית            [OFF] │
│  ⏰ שעה                    [16:00] │
│                                     │
│  למידה ─────────────────────────   │
│  📊 רמת קושי                [רגיל] │
│  🔄 אפס התקדמות                 →  │
│                                     │
│  חשבון ─────────────────────────   │
│  👶 שם הילד/ה              [ליאור] │
│  👤 אזור הורים                  →  │
│  ℹ️ אודות                       →  │
│                                     │
│  ─────────────────────────────────  │
│  גרסה 1.0.0                         │
│  מדיניות פרטיות | תנאי שימוש       │
└─────────────────────────────────────┘
```

### Toggle Switch
- Size: 50x28px
- ON: Orange (#FF9500) with white circle
- OFF: Gray (#E8E4DC) with white circle
- Animation: Smooth slide

### Section Headers
- Font: 14px Medium
- Color: #888888
- Divider: 1px light gray line

### Row Items
- Height: 56px
- Icon: 24px, left aligned
- Label: 18px Medium
- Padding: 16px horizontal

---

## Settings Details

### Sound Settings
| Setting | Default | Description |
|---------|---------|-------------|
| צלילים | ON | Game sound effects |
| מוזיקה | ON | Background music |
| הקראה | ON | Voice narration/instructions |

### Difficulty Levels
| Level | Hebrew | Description |
|-------|--------|-------------|
| Easy | קל | More hints, slower pace |
| Normal | רגיל | Standard difficulty |
| Hard | מאתגר | Less hints, faster |

### Reset Progress
- Requires confirmation dialog
- PIN verification recommended
- Cannot be undone warning

---

## Interaction Notes

1. **Toggle tap**: Immediate switch with subtle haptic
2. **Time picker**: Opens native time picker
3. **Difficulty**: Dropdown or segmented control
4. **Reset progress**: Confirmation dialog with PIN
5. **Text fields**: Keyboard opens on tap
6. **Navigation arrows**: Navigate to sub-screens

---

## Confirmation Dialogs

### Reset Progress Dialog
```
╭─────────────────────────────────╮
│        אפס התקדמות?            │
│                                 │
│  כל ההתקדמות והכוכבים יימחקו.  │
│       לא ניתן לבטל.            │
│                                 │
│  ┌─────────┐    ┌─────────┐    │
│  │  ביטול  │    │  אפס   │    │
│  └─────────┘    └─────────┘    │
╰─────────────────────────────────╯
```

---

## Privacy Considerations

- No personal data collected without consent
- Local storage only for progress
- Parent zone requires PIN
- No ads or in-app purchases
- COPPA compliant
