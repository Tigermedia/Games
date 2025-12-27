import 'package:flutter/material.dart';

/// App color palette
class AppColors {
  AppColors._();

  // Primary Colors
  static const Color primaryOrange = Color(0xFFFF9500);
  static const Color primaryOrangeLight = Color(0xFFFFAA33);
  static const Color primaryOrangeDark = Color(0xFFE68600);

  // Secondary Colors
  static const Color turquoise = Color(0xFF4ECDC4);
  static const Color turquoiseLight = Color(0xFF6FD9D2);
  static const Color turquoiseDark = Color(0xFF3DBDB4);

  // Accent Colors
  static const Color purple = Color(0xFF5D4E8C);
  static const Color purpleLight = Color(0xFF7A6BA8);
  static const Color purpleDark = Color(0xFF4A3D70);

  // Neutral Colors
  static const Color cream = Color(0xFFFFF8E7);
  static const Color warmWhite = Color(0xFFFFFDF9);
  static const Color softGray = Color(0xFFE8E4DC);
  static const Color mediumGray = Color(0xFFCCCCCC);

  // Feedback Colors
  static const Color successGreen = Color(0xFF7ED321);
  static const Color errorSoft = Color(0xFFFFB4B4);
  static const Color warningYellow = Color(0xFFFFD93D);

  // Fun Colors
  static const Color softPink = Color(0xFFFFB6C1);
  static const Color starYellow = Color(0xFFFFD93D);
  static const Color skyBlue = Color(0xFF87CEEB);
  static const Color gold = Color(0xFFFFD700);

  // Card/Module Colors
  static const Color lettersCard = purple;
  static const Color wordsCard = turquoise;
  static const Color numbersCard = primaryOrange;
  static const Color dailyCard = softPink;

  // Text Colors
  static const Color textPrimary = purple;
  static const Color textSecondary = Color(0xFF888888);
  static const Color textOnDark = Colors.white;

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

  static const LinearGradient creamGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [cream, turquoiseLight],
  );

  static const LinearGradient goldGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [gold, starYellow],
  );
}
