# האותיות של ליאו | Leo's Letters

> משחק חינוכי לילדים בני 5 בדרך לכיתה א'

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](CHANGELOG.md)
[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey.svg)]()
[![Flutter](https://img.shields.io/badge/flutter-3.x-02569B.svg?logo=flutter)]()

---

## About

**האותיות של ליאו** הוא משחק חינוכי לילדים ישראלים בגיל 5, המיועד להכנה לכיתה א'. המשחק מלמד אותיות, מילים ומספרים בעברית דרך משחקים אינטראקטיביים ומהנים.

### Features

- **אותיות א-ת** - לימוד 22 אותיות העברית
- **מילים** - בניית אוצר מילים בסיסי (50+ מילים)
- **מספרים 1-20** - ספירה וחשבון בסיסי
- **משחקים** - בלונים, ציור, בניית מילים, ספירה
- **מערכת תגמול** - כוכבים, מדבקות והישגים
- **אזור הורים** - מעקב התקדמות ושליטה

### Character

**ליאו** - גור אריות חמוד וידידותי שמלווה את הילד לאורך כל המשחק.

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Flutter 3.x |
| Language | Dart |
| State | Riverpod |
| Local DB | Hive |
| Animations | Rive / Lottie |
| Audio | audioplayers |
| Backend | Firebase (optional) |

---

## Project Structure

```
leo-letters/
├── lib/
│   ├── main.dart
│   ├── app/
│   │   ├── app.dart
│   │   └── routes.dart
│   ├── core/
│   │   ├── theme/
│   │   ├── constants/
│   │   └── utils/
│   ├── features/
│   │   ├── home/
│   │   ├── letters/
│   │   ├── words/
│   │   ├── numbers/
│   │   └── rewards/
│   ├── shared/
│   │   ├── widgets/
│   │   └── models/
│   └── data/
│       ├── repositories/
│       └── local/
├── assets/
│   ├── images/
│   │   ├── leo/
│   │   ├── letters/
│   │   ├── words/
│   │   └── numbers/
│   ├── audio/
│   │   ├── letters/
│   │   ├── words/
│   │   ├── numbers/
│   │   ├── leo/
│   │   └── effects/
│   └── animations/
├── test/
├── pubspec.yaml
└── README.md
```

---

## Design System

### Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary Orange | `#FF9500` | Leo, buttons, highlights |
| Turquoise | `#4ECDC4` | Backgrounds, words module |
| Purple | `#5D4E8C` | Letters, text |
| Cream | `#FFF8E7` | Light backgrounds |
| Success Green | `#7ED321` | Correct answers |
| Soft Pink | `#FFB6C1` | Rewards, celebrations |

### Typography

- **Hebrew Font**: Heebo (Google Fonts)
- **Letters for learning**: Extra Bold, 96-120px
- **UI Text**: Medium/Bold, 20-28px

---

## Screens

| # | Screen | Description |
|---|--------|-------------|
| 1 | Splash | App intro with Leo |
| 2 | Home | Module selection hub |
| 3 | Letters Menu | א-ת grid selection |
| 4 | Letter Learn | Individual letter learning |
| 5 | Balloon Game | Letter recognition game |
| 6 | Trace Letter | Writing practice |
| 7 | Words Menu | Word categories |
| 8 | Word Build | Drag letters to build words |
| 9 | Numbers Menu | Number ranges |
| 10 | Counting Game | Count objects |
| 11 | Rewards | Achievements & stickers |
| 12 | Settings | App configuration |
| 13 | Parent Zone | Progress dashboard (PIN) |

---

## Getting Started

### Prerequisites

- Flutter SDK 3.x
- Dart SDK
- Android Studio / Xcode
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/[username]/leo-letters.git

# Navigate to project
cd leo-letters

# Install dependencies
flutter pub get

# Run the app
flutter run
```

### Build

```bash
# Android APK
flutter build apk --release

# iOS
flutter build ios --release

# Web (optional)
flutter build web
```

---

## Development Roadmap

### Phase 1: MVP (Current)
- [ ] Project setup
- [ ] Core navigation
- [ ] Letters module (5 letters)
- [ ] Basic rewards system
- [ ] Local storage

### Phase 2: Full Letters
- [ ] All 22 letters
- [ ] Balloon game
- [ ] Trace letter game
- [ ] Audio narration

### Phase 3: Words & Numbers
- [ ] Words module
- [ ] Numbers module
- [ ] Additional games

### Phase 4: Polish
- [ ] Parent zone
- [ ] Analytics
- [ ] Performance optimization
- [ ] Store submission

---

## Content

### Hebrew Letters (22)

```
א ב ג ד ה ו ז ח ט י כ ל מ נ ס ע פ צ ק ר ש ת
```

### Final Forms (5)

```
ך ם ן ף ץ
```

### Word Categories

- **חיות** (Animals): כלב, חתול, אריה, ארנב...
- **אוכל** (Food): תפוח, בננה, לחם...
- **משפחה** (Family): אמא, אבא, אח, אחות...
- **צבעים** (Colors): אדום, כחול, ירוק...
- **בית** (Home): מיטה, כיסא, שולחן...

### Numbers (1-20)

```
1 אחת | 2 שתיים | 3 שלוש | 4 ארבע | 5 חמש
6 שש | 7 שבע | 8 שמונה | 9 תשע | 10 עשר
11-20 ...
```

---

## Contributing

This is a private project. Contact the owner for collaboration.

---

## License

All rights reserved. This project and its contents are proprietary.

---

## Contact

**Developer**: [Your Name]
**Email**: [your@email.com]

---

Made with ❤️ for Israeli children
