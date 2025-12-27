# Changelog

All notable changes to **האותיות של ליאו** (Leo's Letters) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Audio integration
- Remaining letter screens
- Words and Numbers modules

---

## [0.3.0] - 2024-12-27

### Added
- **Implemented Google Stitch Designs**
  - Integrated 15 screen designs from Google Stitch
  - Updated theme colors to match style guide (#FF9500, #40E0D0, #800080)
  - Updated typography to use Lexend (English) and Rubik (Hebrew) fonts

- **Splash Screen**
  - Animated Leo mascot with bounce effect
  - Sky-blue to turquoise gradient background
  - "!בוא נשחק" play button with shadow

- **Home Screen**
  - Module cards with progress bars (אותיות, מילים, מספרים)
  - Stats bar with stars and trophies counters
  - Daily challenge card
  - Leo speech bubble asking "?מה נלמד היום"

- **Balloon Game**
  - Interactive floating balloons with Hebrew letters
  - Leo asking "?איפה X" at bottom
  - Correct/incorrect feedback animations
  - Score tracking across 5 rounds
  - Cloud decorations and sky gradient

- **Celebration Overlay**
  - Confetti particle effects
  - Animated stars (1-3 based on performance)
  - "!כל הכבוד" headline with gradient
  - Leo celebration pose
  - Continue and Play Again buttons

- **New Shared Widgets**
  - CelebrationOverlay with confetti and star animations
  - DailyChallengeCard component
  - Updated ModuleCard with progress bars

### Changed
- AppColors updated with exact hex values from Stitch style guide
- AppTypography now uses Google Fonts (Lexend, Rubik)
- StatsBar redesigned with circular settings button

### Dependencies
- Added google_fonts package for Lexend and Rubik fonts
- Added confetti package for celebration effects

---

## [0.2.0] - 2024-12-27

### Added
- **Flutter Project Structure**
  - Complete project setup with pubspec.yaml
  - Organized lib/ folder structure by features
  - Asset directories for images, audio, animations, fonts

- **Core Theme System**
  - AppColors with primary (Orange #FF9500), secondary (Turquoise #4ECDC4), accent (Purple #5D4E8C)
  - AppTypography with child-friendly Heebo font family
  - AppTheme with complete ThemeData configuration

- **Navigation**
  - GoRouter setup with all app routes
  - RTL Hebrew support with MaterialApp.router
  - Named routes for all 14 screens

- **Data Layer**
  - HiveService for local storage (progress & settings)
  - UserProgress model with Hive type adapters
  - LetterProgress tracking per letter

- **Hebrew Content**
  - All 22 Hebrew letters (א-ת) with metadata
  - Word examples for each letter
  - HebrewLetter and WordExample models

- **Feature Screens (Placeholders)**
  - SplashScreen with Leo animation
  - HomeScreen with module navigation
  - LettersMenuScreen with letter grid
  - LetterLearnScreen for letter introduction
  - BalloonGameScreen for letter recognition
  - TraceLetterScreen for letter writing
  - WordsMenuScreen for word selection
  - WordBuildScreen for word construction
  - NumbersMenuScreen for number learning
  - CountingGameScreen for counting practice
  - RewardsScreen for achievement tracking
  - SettingsScreen with sound/display options
  - ParentZoneScreen with PIN protection

- **Shared Widgets**
  - LeoCharacter with mood states and speech bubbles
  - ModuleCard for home screen navigation
  - StatsBar for progress display

### Technical
- Flutter 3.x with Dart
- Riverpod for state management
- Hive for local NoSQL storage
- GoRouter for declarative navigation
- Full RTL (Right-to-Left) Hebrew support

---

## [0.1.0] - 2024-12-27

### Added
- **Project Planning**
  - Created comprehensive game design document
  - Defined character "Leo" (ליאו) - friendly lion cub mascot
  - Established color palette and typography system
  - Designed all 14 app screens

- **Design Prompts**
  - Created design prompts directory for Google Stitch
  - Style guide with complete design system
  - 14 screen-specific prompts:
    - Splash Screen (01)
    - Home Screen (02)
    - Letters Menu (03)
    - Letter Learn (04)
    - Balloon Game (05)
    - Trace Letter (06)
    - Words Menu (07)
    - Word Build (08)
    - Numbers Menu (09)
    - Counting Game (10)
    - Rewards Screen (11)
    - Settings Screen (12)
    - Parent Zone (13)
    - Celebration Overlay (14)

- **Documentation**
  - Project README with full specifications
  - This CHANGELOG file
  - Design system documentation

### Technical Decisions
- **Framework**: Flutter (cross-platform iOS/Android)
- **State Management**: Riverpod
- **Local Storage**: Hive
- **Animations**: Rive/Lottie

---

## Version History Summary

| Version | Date | Highlights |
|---------|------|------------|
| 0.2.0 | 2024-12-27 | Flutter project setup, theme, navigation, models |
| 0.1.0 | 2024-12-27 | Project planning & design prompts |

---

## Upcoming Versions

### 0.2.0 - Project Setup
- Flutter project initialization
- Theme configuration
- Basic navigation structure
- Asset directories

### 0.3.0 - Letters MVP
- Letters menu screen
- First 5 letters (א-ה)
- Letter introduction flow
- Basic audio playback

### 0.4.0 - Games
- Balloon game implementation
- Letter tracing game
- Touch/gesture handling

### 0.5.0 - Rewards
- Star collection system
- Achievement tracking
- Celebration overlays
- Local progress storage

### 1.0.0 - Full Release
- All 22 Hebrew letters
- Complete words module
- Numbers 1-20
- Parent zone
- App store ready

---

## Legend

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Vulnerability fixes
