# מפרט טכני | Technical Specification

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Presentation                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ Screens │  │ Widgets │  │  Theme  │  │  Routes │        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
│       │            │            │            │              │
├───────┴────────────┴────────────┴────────────┴──────────────┤
│                     State Management                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Riverpod   │  │  Providers  │  │   Notifiers │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
├─────────┴────────────────┴────────────────┴─────────────────┤
│                       Domain Layer                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Models    │  │   Use Cases │  │ Repositories│         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
├─────────┴────────────────┴────────────────┴─────────────────┤
│                        Data Layer                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │    Hive     │  │   Assets    │  │  Firebase   │         │
│  │  (Local DB) │  │(Audio/Img)  │  │ (Optional)  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Models

### HebrewLetter

```dart
class HebrewLetter {
  final String letter;          // 'ב'
  final String name;            // 'בֵּית'
  final String sound;           // 'בְּ'
  final String nameAudioPath;   // 'assets/audio/letters/bet_name.mp3'
  final String soundAudioPath;  // 'assets/audio/letters/bet_sound.mp3'
  final List<WordExample> examples;
  final String tracePath;       // SVG path for tracing
  final int order;              // 1-22

  // Progress (stored separately)
  bool isUnlocked;
  int starsEarned;              // 0-3
  bool isCompleted;
  int timesPlayed;
}

class WordExample {
  final String word;            // 'בַּיִת'
  final String imagePath;       // 'assets/images/words/house.png'
  final String audioPath;       // 'assets/audio/words/bayit.mp3'
}
```

### Word

```dart
class Word {
  final String word;            // 'כֶּלֶב'
  final String translation;     // 'Dog'
  final String category;        // 'animals'
  final List<String> letters;   // ['כ', 'ל', 'ב']
  final String imagePath;
  final String audioPath;
  final int difficulty;         // 1-3
}
```

### Number

```dart
class NumberModel {
  final int value;              // 5
  final String hebrew;          // 'חָמֵשׁ'
  final String pronunciation;   // 'chamesh'
  final String audioPath;
  final String digitImagePath;  // Image of digit '5'
}
```

### UserProgress

```dart
class UserProgress {
  final String odlrName;
  final String odlrAvatar;
  final int totalStars;
  final int currentStreak;
  final DateTime lastPlayDate;
  final Duration totalPlayTime;

  // Letters progress
  final Map<String, LetterProgress> lettersProgress;

  // Words progress
  final Map<String, bool> completedWords;
  final Set<String> unlockedCategories;

  // Numbers progress
  final Map<int, bool> completedNumbers;

  // Achievements
  final List<Achievement> earnedAchievements;
  final List<String> collectedStickers;
}

class LetterProgress {
  final String letter;
  final bool isUnlocked;
  final bool isCompleted;
  final int starsEarned;
  final int timesPlayed;
  final DateTime? lastPlayed;
}
```

---

## State Management (Riverpod)

### Providers Structure

```dart
// Core providers
final audioPlayerProvider = Provider<AudioManager>((ref) => AudioManager());
final storageProvider = Provider<StorageService>((ref) => HiveStorageService());

// User providers
final userProgressProvider = StateNotifierProvider<UserProgressNotifier, UserProgress>(
  (ref) => UserProgressNotifier(ref.read(storageProvider)),
);

// Letters providers
final allLettersProvider = Provider<List<HebrewLetter>>((ref) => HebrewLetters.all);
final currentLetterProvider = StateProvider<HebrewLetter?>((ref) => null);
final letterProgressProvider = Provider.family<LetterProgress, String>(
  (ref, letter) => ref.watch(userProgressProvider).lettersProgress[letter]!,
);

// Game state providers
final balloonGameStateProvider = StateNotifierProvider<BalloonGameNotifier, BalloonGameState>(
  (ref) => BalloonGameNotifier(),
);
final traceGameStateProvider = StateNotifierProvider<TraceGameNotifier, TraceGameState>(
  (ref) => TraceGameNotifier(),
);
```

---

## Navigation (GoRouter)

```dart
final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/home',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/letters',
        builder: (context, state) => const LettersMenuScreen(),
        routes: [
          GoRoute(
            path: ':letter',
            builder: (context, state) {
              final letter = state.pathParameters['letter']!;
              return LetterLearnScreen(letter: letter);
            },
            routes: [
              GoRoute(
                path: 'balloon',
                builder: (context, state) => const BalloonGameScreen(),
              ),
              GoRoute(
                path: 'trace',
                builder: (context, state) => const TraceLetterScreen(),
              ),
            ],
          ),
        ],
      ),
      GoRoute(
        path: '/words',
        builder: (context, state) => const WordsMenuScreen(),
        routes: [
          GoRoute(
            path: ':category',
            builder: (context, state) => WordCategoryScreen(
              category: state.pathParameters['category']!,
            ),
          ),
        ],
      ),
      GoRoute(
        path: '/numbers',
        builder: (context, state) => const NumbersMenuScreen(),
      ),
      GoRoute(
        path: '/rewards',
        builder: (context, state) => const RewardsScreen(),
      ),
      GoRoute(
        path: '/settings',
        builder: (context, state) => const SettingsScreen(),
      ),
      GoRoute(
        path: '/parent',
        builder: (context, state) => const ParentZoneScreen(),
      ),
    ],
  );
});
```

---

## Theme Configuration

```dart
class AppTheme {
  // Colors
  static const primaryOrange = Color(0xFFFF9500);
  static const turquoise = Color(0xFF4ECDC4);
  static const purple = Color(0xFF5D4E8C);
  static const cream = Color(0xFFFFF8E7);
  static const successGreen = Color(0xFF7ED321);
  static const softPink = Color(0xFFFFB6C1);
  static const starYellow = Color(0xFFFFD93D);

  // Typography
  static const hebrewFontFamily = 'Heebo';

  static TextStyle letterDisplay = TextStyle(
    fontFamily: hebrewFontFamily,
    fontSize: 120,
    fontWeight: FontWeight.w800,
    color: purple,
  );

  static TextStyle headline = TextStyle(
    fontFamily: hebrewFontFamily,
    fontSize: 32,
    fontWeight: FontWeight.w700,
    color: purple,
  );

  static TextStyle body = TextStyle(
    fontFamily: hebrewFontFamily,
    fontSize: 20,
    fontWeight: FontWeight.w500,
    color: Colors.black87,
  );

  // Button styles
  static ButtonStyle primaryButton = ElevatedButton.styleFrom(
    backgroundColor: primaryOrange,
    foregroundColor: Colors.white,
    padding: EdgeInsets.symmetric(horizontal: 32, vertical: 16),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(16),
    ),
    elevation: 4,
  );

  // Card styles
  static BoxDecoration cardDecoration = BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(20),
    boxShadow: [
      BoxShadow(
        color: Colors.black.withOpacity(0.08),
        blurRadius: 12,
        offset: Offset(0, 4),
      ),
    ],
  );
}
```

---

## Audio Management

```dart
class AudioManager {
  final AudioPlayer _effectsPlayer = AudioPlayer();
  final AudioPlayer _musicPlayer = AudioPlayer();
  final AudioPlayer _voicePlayer = AudioPlayer();

  bool soundEnabled = true;
  bool musicEnabled = true;
  bool voiceEnabled = true;

  // Play letter sound
  Future<void> playLetterSound(String letter) async {
    if (!voiceEnabled) return;
    await _voicePlayer.play(AssetSource('audio/letters/${letter}_sound.mp3'));
  }

  // Play letter name
  Future<void> playLetterName(String letter) async {
    if (!voiceEnabled) return;
    await _voicePlayer.play(AssetSource('audio/letters/${letter}_name.mp3'));
  }

  // Play word
  Future<void> playWord(String word) async {
    if (!voiceEnabled) return;
    await _voicePlayer.play(AssetSource('audio/words/$word.mp3'));
  }

  // Play effect
  Future<void> playEffect(SoundEffect effect) async {
    if (!soundEnabled) return;
    await _effectsPlayer.play(AssetSource('audio/effects/${effect.name}.mp3'));
  }

  // Leo voice
  Future<void> playLeoPhrase(LeoPhrase phrase) async {
    if (!voiceEnabled) return;
    await _voicePlayer.play(AssetSource('audio/leo/${phrase.name}.mp3'));
  }
}

enum SoundEffect {
  correct,
  wrong,
  starCollect,
  balloonPop,
  celebration,
  buttonClick,
}

enum LeoPhrase {
  welcome,
  greatJob,
  tryAgain,
  excellent,
  champion,
  letsPlay,
}
```

---

## Local Storage (Hive)

```dart
class HiveStorageService implements StorageService {
  static const String userProgressBox = 'user_progress';
  static const String settingsBox = 'settings';

  late Box<UserProgress> _progressBox;
  late Box<AppSettings> _settingsBox;

  Future<void> init() async {
    await Hive.initFlutter();

    Hive.registerAdapter(UserProgressAdapter());
    Hive.registerAdapter(LetterProgressAdapter());
    Hive.registerAdapter(AchievementAdapter());
    Hive.registerAdapter(AppSettingsAdapter());

    _progressBox = await Hive.openBox<UserProgress>(userProgressBox);
    _settingsBox = await Hive.openBox<AppSettings>(settingsBox);
  }

  // Progress methods
  Future<UserProgress> loadProgress() async {
    return _progressBox.get('current') ?? UserProgress.initial();
  }

  Future<void> saveProgress(UserProgress progress) async {
    await _progressBox.put('current', progress);
  }

  // Settings methods
  Future<AppSettings> loadSettings() async {
    return _settingsBox.get('current') ?? AppSettings.defaults();
  }

  Future<void> saveSettings(AppSettings settings) async {
    await _settingsBox.put('current', settings);
  }
}
```

---

## Animation System

### Leo Character

```dart
class LeoCharacter extends StatelessWidget {
  final LeoMood mood;
  final LeoAction? action;
  final String? speechText;

  const LeoCharacter({
    this.mood = LeoMood.happy,
    this.action,
    this.speechText,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Leo animation (Rive or Lottie)
        RiveAnimation.asset(
          'assets/animations/leo.riv',
          stateMachines: [mood.name],
          onInit: (artboard) {
            if (action != null) {
              _triggerAction(artboard, action!);
            }
          },
        ),

        // Speech bubble
        if (speechText != null)
          Positioned(
            top: 0,
            child: SpeechBubble(text: speechText!),
          ),
      ],
    );
  }
}

enum LeoMood { happy, thinking, celebrating, encouraging, sleeping }
enum LeoAction { wave, jump, clap, point, nod }
```

### Celebration Overlay

```dart
class CelebrationOverlay extends StatefulWidget {
  final int stars;
  final String achievementText;
  final VoidCallback onContinue;

  @override
  State<CelebrationOverlay> createState() => _CelebrationOverlayState();
}

class _CelebrationOverlayState extends State<CelebrationOverlay>
    with TickerProviderStateMixin {
  late AnimationController _confettiController;
  late AnimationController _starsController;

  @override
  void initState() {
    super.initState();
    _startAnimationSequence();
  }

  void _startAnimationSequence() async {
    // 1. Overlay fade in
    await Future.delayed(Duration(milliseconds: 100));

    // 2. Card bounce in
    await Future.delayed(Duration(milliseconds: 200));

    // 3. Stars pop in sequentially
    for (int i = 0; i < widget.stars; i++) {
      await Future.delayed(Duration(milliseconds: 150));
      // Animate star i
    }

    // 4. Confetti burst
    _confettiController.forward();

    // 5. Play celebration sound
    context.read(audioProvider).playEffect(SoundEffect.celebration);
  }
}
```

---

## Performance Considerations

### Image Optimization
- Use WebP format for images
- Provide 1x, 2x, 3x assets
- Lazy load images in grids
- Cache frequently used images

### Audio Optimization
- Preload common sounds on app start
- Use audio pools for effects
- Compress audio files (MP3 64-128kbps for voice)

### Animation Optimization
- Use Rive/Lottie for complex animations
- Avoid heavy animations on low-end devices
- Reduce particle count on performance mode

### Memory Management
- Dispose controllers properly
- Use const widgets where possible
- Monitor memory with DevTools
