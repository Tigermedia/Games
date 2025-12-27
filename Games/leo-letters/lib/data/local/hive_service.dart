import 'package:hive_flutter/hive_flutter.dart';
import '../../shared/models/user_progress.dart';

/// Hive local storage service
class HiveService {
  static const String _progressBoxName = 'user_progress';
  static const String _settingsBoxName = 'settings';
  static const String _currentUserKey = 'current';

  static late Box<UserProgress> _progressBox;
  static late Box<dynamic> _settingsBox;

  /// Initialize Hive and open boxes
  static Future<void> init() async {
    // Register adapters
    Hive.registerAdapter(UserProgressAdapter());
    Hive.registerAdapter(LetterProgressAdapter());

    // Open boxes
    _progressBox = await Hive.openBox<UserProgress>(_progressBoxName);
    _settingsBox = await Hive.openBox(_settingsBoxName);
  }

  // ============ Progress Methods ============

  /// Get current user progress
  static UserProgress getProgress() {
    return _progressBox.get(_currentUserKey) ?? UserProgress.initial();
  }

  /// Save user progress
  static Future<void> saveProgress(UserProgress progress) async {
    await _progressBox.put(_currentUserKey, progress);
  }

  /// Reset all progress
  static Future<void> resetProgress() async {
    await _progressBox.put(_currentUserKey, UserProgress.initial());
  }

  // ============ Settings Methods ============

  /// Get a setting value
  static T? getSetting<T>(String key, {T? defaultValue}) {
    return _settingsBox.get(key, defaultValue: defaultValue) as T?;
  }

  /// Save a setting
  static Future<void> saveSetting(String key, dynamic value) async {
    await _settingsBox.put(key, value);
  }

  /// Get sound enabled setting
  static bool get soundEnabled => getSetting<bool>('soundEnabled', defaultValue: true) ?? true;

  /// Set sound enabled
  static Future<void> setSoundEnabled(bool value) async {
    await saveSetting('soundEnabled', value);
  }

  /// Get music enabled setting
  static bool get musicEnabled => getSetting<bool>('musicEnabled', defaultValue: true) ?? true;

  /// Set music enabled
  static Future<void> setMusicEnabled(bool value) async {
    await saveSetting('musicEnabled', value);
  }

  /// Get voice enabled setting
  static bool get voiceEnabled => getSetting<bool>('voiceEnabled', defaultValue: true) ?? true;

  /// Set voice enabled
  static Future<void> setVoiceEnabled(bool value) async {
    await saveSetting('voiceEnabled', value);
  }

  /// Get parent PIN
  static String? get parentPin => getSetting<String>('parentPin');

  /// Set parent PIN
  static Future<void> setParentPin(String pin) async {
    await saveSetting('parentPin', pin);
  }

  /// Verify parent PIN
  static bool verifyParentPin(String pin) {
    final savedPin = parentPin;
    if (savedPin == null) return true; // No PIN set
    return savedPin == pin;
  }

  // ============ Cleanup ============

  /// Close all boxes
  static Future<void> close() async {
    await _progressBox.close();
    await _settingsBox.close();
  }
}
