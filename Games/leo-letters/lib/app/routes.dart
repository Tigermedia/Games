import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../features/home/screens/home_screen.dart';
import '../features/splash/screens/splash_screen.dart';
import '../features/letters/screens/letters_menu_screen.dart';
import '../features/letters/screens/letter_learn_screen.dart';
import '../features/letters/screens/balloon_game_screen.dart';
import '../features/letters/screens/trace_letter_screen.dart';
import '../features/words/screens/words_menu_screen.dart';
import '../features/words/screens/word_build_screen.dart';
import '../features/numbers/screens/numbers_menu_screen.dart';
import '../features/numbers/screens/counting_game_screen.dart';
import '../features/rewards/screens/rewards_screen.dart';
import '../features/settings/screens/settings_screen.dart';
import '../features/settings/screens/parent_zone_screen.dart';

/// Route names for easy reference
class AppRoutes {
  static const splash = '/';
  static const home = '/home';
  static const letters = '/letters';
  static const letterLearn = '/letters/:letter';
  static const balloonGame = '/letters/:letter/balloon';
  static const traceLetter = '/letters/:letter/trace';
  static const words = '/words';
  static const wordCategory = '/words/:category';
  static const wordBuild = '/words/:category/build';
  static const numbers = '/numbers';
  static const countingGame = '/numbers/counting';
  static const rewards = '/rewards';
  static const settings = '/settings';
  static const parentZone = '/parent';
}

/// Router provider
final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: AppRoutes.splash,
    debugLogDiagnostics: true,
    routes: [
      // Splash Screen
      GoRoute(
        path: AppRoutes.splash,
        name: 'splash',
        builder: (context, state) => const SplashScreen(),
      ),

      // Home Screen
      GoRoute(
        path: AppRoutes.home,
        name: 'home',
        builder: (context, state) => const HomeScreen(),
      ),

      // Letters Module
      GoRoute(
        path: AppRoutes.letters,
        name: 'letters',
        builder: (context, state) => const LettersMenuScreen(),
        routes: [
          GoRoute(
            path: ':letter',
            name: 'letter-learn',
            builder: (context, state) {
              final letter = state.pathParameters['letter']!;
              return LetterLearnScreen(letter: letter);
            },
            routes: [
              GoRoute(
                path: 'balloon',
                name: 'balloon-game',
                builder: (context, state) {
                  final letter = state.pathParameters['letter']!;
                  return BalloonGameScreen(letter: letter);
                },
              ),
              GoRoute(
                path: 'trace',
                name: 'trace-letter',
                builder: (context, state) {
                  final letter = state.pathParameters['letter']!;
                  return TraceLetterScreen(letter: letter);
                },
              ),
            ],
          ),
        ],
      ),

      // Words Module
      GoRoute(
        path: AppRoutes.words,
        name: 'words',
        builder: (context, state) => const WordsMenuScreen(),
        routes: [
          GoRoute(
            path: ':category',
            name: 'word-category',
            builder: (context, state) {
              final category = state.pathParameters['category']!;
              return WordBuildScreen(category: category);
            },
          ),
        ],
      ),

      // Numbers Module
      GoRoute(
        path: AppRoutes.numbers,
        name: 'numbers',
        builder: (context, state) => const NumbersMenuScreen(),
        routes: [
          GoRoute(
            path: 'counting',
            name: 'counting-game',
            builder: (context, state) => const CountingGameScreen(),
          ),
        ],
      ),

      // Rewards
      GoRoute(
        path: AppRoutes.rewards,
        name: 'rewards',
        builder: (context, state) => const RewardsScreen(),
      ),

      // Settings
      GoRoute(
        path: AppRoutes.settings,
        name: 'settings',
        builder: (context, state) => const SettingsScreen(),
      ),

      // Parent Zone
      GoRoute(
        path: AppRoutes.parentZone,
        name: 'parent-zone',
        builder: (context, state) => const ParentZoneScreen(),
      ),
    ],

    // Error page
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Text('Page not found: ${state.uri}'),
      ),
    ),
  );
});

/// Extension for easy navigation
extension GoRouterExtension on BuildContext {
  void goToHome() => go(AppRoutes.home);
  void goToLetters() => go(AppRoutes.letters);
  void goToLetter(String letter) => go('/letters/$letter');
  void goToBalloonGame(String letter) => go('/letters/$letter/balloon');
  void goToTraceLetter(String letter) => go('/letters/$letter/trace');
  void goToWords() => go(AppRoutes.words);
  void goToNumbers() => go(AppRoutes.numbers);
  void goToRewards() => go(AppRoutes.rewards);
  void goToSettings() => go(AppRoutes.settings);
  void goToParentZone() => go(AppRoutes.parentZone);
}
