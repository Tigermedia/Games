import 'package:flutter/material.dart';

/// App color palette - based on Stitch design style guide
class AppColors {
  AppColors._();

  // Primary Colors (Lion Orange)
  static const Color primaryOrange = Color(0xFFFF9500);
  static const Color primaryOrangeDark = Color(0xFFD67D00);
  static const Color primaryOrangeLight = Color(0xFFFFAA33);

  // Secondary Colors (Turquoise)
  static const Color turquoise = Color(0xFF40E0D0);
  static const Color turquoiseDark = Color(0xFF2EBDB0);
  static const Color turquoiseLight = Color(0xFF6FE8DC);

  // Tertiary Colors (Purple)
  static const Color purple = Color(0xFF800080);
  static const Color purpleDark = Color(0xFF5A005A);
  static const Color purpleLight = Color(0xFF9A339A);

  // Success Colors (Green)
  static const Color successGreen = Color(0xFF4CAF50);
  static const Color successGreenDark = Color(0xFF388E3C);
  static const Color successGreenLight = Color(0xFF66BB6A);

  // Background Colors
  static const Color cream = Color(0xFFFFF8F0);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color softGray = Color(0xFFE8E4DC);
  static const Color mediumGray = Color(0xFFCCCCCC);

  // Text Colors
  static const Color textDark = Color(0xFF2D2418);
  static const Color textSecondary = Color(0xFF888888);
  static const Color textOnDark = Colors.white;
  static const Color textOnPrimary = Colors.white;

  // Feedback Colors
  static const Color errorRed = Color(0xFFE53935);
  static const Color errorSoft = Color(0xFFFFB4B4);
  static const Color warningYellow = Color(0xFFFFD93D);

  // Fun Colors
  static const Color softPink = Color(0xFFFFB6C1);
  static const Color starYellow = Color(0xFFFFD93D);
  static const Color skyBlue = Color(0xFF87CEEB);
  static const Color gold = Color(0xFFFFD700);
  static const Color balloonYellow = Color(0xFFFFC107);
  static const Color balloonPink = Color(0xFFE91E63);
  static const Color balloonGreen = Color(0xFF4CAF50);

  // Card/Module Colors
  static const Color lettersCard = purple;
  static const Color wordsCard = turquoise;
  static const Color numbersCard = primaryOrange;
  static const Color dailyCard = softPink;

  // Overlay Colors
  static const Color overlayDark = Color(0x99000000); // 60% black
  static const Color overlayLight = Color(0x33FFFFFF); // 20% white

  // Border Colors
  static const Color borderOrange = Color(0xFFFFE4C4);
  static const Color borderLight = Color(0xFFF5F5F5);

  // Gradients
  static const LinearGradient orangeGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primaryOrange, primaryOrangeLight],
  );

  static const LinearGradient turquoiseGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [turquoise, turquoiseLight],
  );

  static const LinearGradient purpleGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [purple, purpleLight],
  );

  static const LinearGradient creamToMint = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [cream, Color(0xFFE0F7F4)],
  );

  static const LinearGradient goldGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [gold, starYellow],
  );

  static const LinearGradient celebrationGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [Color(0xFFFFF9E6), Color(0xFFFFFFFF)],
  );

  // Shadow Colors
  static const Color shadowPrimary = Color(0xFFD67D00);
  static const Color shadowSecondary = Color(0xFF2EBDB0);
  static const Color shadowTertiary = Color(0xFF5A005A);
  static const Color shadowCard = Color(0x0D000000); // 5% black
  static const Color shadowToy = Color(0x1A000000); // 10% black
}
