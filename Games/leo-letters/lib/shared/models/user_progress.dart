import 'package:hive/hive.dart';

part 'user_progress.g.dart';

/// User's overall progress in the app
@HiveType(typeId: 0)
class UserProgress extends HiveObject {
  @HiveField(0)
  String childName;

  @HiveField(1)
  int totalStars;

  @HiveField(2)
  int currentStreak;

  @HiveField(3)
  DateTime? lastPlayDate;

  @HiveField(4)
  int totalPlayTimeMinutes;

  @HiveField(5)
  Map<String, LetterProgress> lettersProgress;

  @HiveField(6)
  Set<String> completedWords;

  @HiveField(7)
  Set<String> unlockedCategories;

  @HiveField(8)
  Map<int, bool> completedNumbers;

  @HiveField(9)
  List<String> earnedAchievements;

  @HiveField(10)
  List<String> collectedStickers;

  UserProgress({
    this.childName = 'ילד/ה',
    this.totalStars = 0,
    this.currentStreak = 0,
    this.lastPlayDate,
    this.totalPlayTimeMinutes = 0,
    Map<String, LetterProgress>? lettersProgress,
    Set<String>? completedWords,
    Set<String>? unlockedCategories,
    Map<int, bool>? completedNumbers,
    List<String>? earnedAchievements,
    List<String>? collectedStickers,
  })  : lettersProgress = lettersProgress ?? {},
        completedWords = completedWords ?? {},
        unlockedCategories = unlockedCategories ?? {'animals'},
        completedNumbers = completedNumbers ?? {},
        earnedAchievements = earnedAchievements ?? [],
        collectedStickers = collectedStickers ?? [];

  /// Create initial progress for new user
  factory UserProgress.initial() {
    final progress = UserProgress();
    // Unlock first letter (א)
    progress.lettersProgress['א'] = LetterProgress(
      letter: 'א',
      isUnlocked: true,
    );
    return progress;
  }

  /// Check if a letter is unlocked
  bool isLetterUnlocked(String letter) {
    return lettersProgress[letter]?.isUnlocked ?? false;
  }

  /// Check if a letter is completed
  bool isLetterCompleted(String letter) {
    return lettersProgress[letter]?.isCompleted ?? false;
  }

  /// Get stars for a specific letter
  int getLetterStars(String letter) {
    return lettersProgress[letter]?.starsEarned ?? 0;
  }

  /// Unlock the next letter
  void unlockNextLetter(String currentLetter, String nextLetter) {
    if (!lettersProgress.containsKey(nextLetter)) {
      lettersProgress[nextLetter] = LetterProgress(
        letter: nextLetter,
        isUnlocked: true,
      );
    } else {
      lettersProgress[nextLetter]!.isUnlocked = true;
    }
  }

  /// Complete a letter and add stars
  void completeLetter(String letter, int stars) {
    if (!lettersProgress.containsKey(letter)) {
      lettersProgress[letter] = LetterProgress(
        letter: letter,
        isUnlocked: true,
      );
    }

    final progress = lettersProgress[letter]!;
    progress.isCompleted = true;
    progress.timesPlayed++;
    progress.lastPlayed = DateTime.now();

    // Only update stars if new score is higher
    if (stars > progress.starsEarned) {
      final diff = stars - progress.starsEarned;
      progress.starsEarned = stars;
      totalStars += diff;
    }
  }

  /// Update streak
  void updateStreak() {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);

    if (lastPlayDate == null) {
      currentStreak = 1;
    } else {
      final lastPlay = DateTime(
        lastPlayDate!.year,
        lastPlayDate!.month,
        lastPlayDate!.day,
      );
      final difference = today.difference(lastPlay).inDays;

      if (difference == 0) {
        // Same day, streak unchanged
      } else if (difference == 1) {
        // Consecutive day
        currentStreak++;
      } else {
        // Streak broken
        currentStreak = 1;
      }
    }

    lastPlayDate = now;
  }

  /// Add play time
  void addPlayTime(int minutes) {
    totalPlayTimeMinutes += minutes;
  }

  /// Get formatted play time
  String get formattedPlayTime {
    final hours = totalPlayTimeMinutes ~/ 60;
    final minutes = totalPlayTimeMinutes % 60;
    if (hours > 0) {
      return '$hours:${minutes.toString().padLeft(2, '0')} שעות';
    }
    return '$minutes דקות';
  }
}

/// Progress for a single letter
@HiveType(typeId: 1)
class LetterProgress extends HiveObject {
  @HiveField(0)
  String letter;

  @HiveField(1)
  bool isUnlocked;

  @HiveField(2)
  bool isCompleted;

  @HiveField(3)
  int starsEarned;

  @HiveField(4)
  int timesPlayed;

  @HiveField(5)
  DateTime? lastPlayed;

  LetterProgress({
    required this.letter,
    this.isUnlocked = false,
    this.isCompleted = false,
    this.starsEarned = 0,
    this.timesPlayed = 0,
    this.lastPlayed,
  });
}
