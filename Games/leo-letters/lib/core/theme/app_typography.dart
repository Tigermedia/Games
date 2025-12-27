import 'package:flutter/material.dart';
import 'app_colors.dart';

/// App typography - based on Stitch design style guide
/// Uses Lexend for English display and Rubik for Hebrew
class AppTypography {
  AppTypography._();

  // Font families
  static const String fontFamilyDisplay = 'Lexend';
  static const String fontFamilyHebrew = 'Rubik';

  // Hebrew Letter Display (large single letters)
  static const TextStyle letterDisplay = TextStyle(
    fontFamily: fontFamilyHebrew,
    fontSize: 120,
    fontWeight: FontWeight.w900,
    color: AppColors.primaryOrange,
    height: 1.0,
  );

  // Hebrew Letter Medium (in cards, balloons)
  static const TextStyle letterMedium = TextStyle(
    fontFamily: fontFamilyHebrew,
    fontSize: 72,
    fontWeight: FontWeight.w900,
    color: AppColors.textOnDark,
    height: 1.0,
  );

  // Hebrew Letter Small (in grids)
  static const TextStyle letterSmall = TextStyle(
    fontFamily: fontFamilyHebrew,
    fontSize: 48,
    fontWeight: FontWeight.w900,
    color: AppColors.purple,
    height: 1.0,
  );

  // Hebrew Headlines
  static const TextStyle headline = TextStyle(
    fontFamily: fontFamilyHebrew,
    fontSize: 28,
    fontWeight: FontWeight.w700,
    color: AppColors.textDark,
    height: 1.2,
  );

  // Hebrew Body Text
  static const TextStyle body = TextStyle(
    fontFamily: fontFamilyHebrew,
    fontSize: 18,
    fontWeight: FontWeight.w500,
    color: AppColors.textDark,
    height: 1.4,
  );

  // Hebrew Body Small
  static const TextStyle bodySmall = TextStyle(
    fontFamily: fontFamilyHebrew,
    fontSize: 14,
    fontWeight: FontWeight.w500,
    color: AppColors.textSecondary,
    height: 1.4,
  );

  // English Display Headlines
  static const TextStyle headlineEnglish = TextStyle(
    fontFamily: fontFamilyDisplay,
    fontSize: 28,
    fontWeight: FontWeight.w700,
    color: AppColors.textDark,
    height: 1.2,
  );

  // Button Text
  static const TextStyle button = TextStyle(
    fontFamily: fontFamilyHebrew,
    fontSize: 20,
    fontWeight: FontWeight.w700,
    color: AppColors.textOnDark,
    height: 1.0,
  );

  // Card Title Hebrew
  static const TextStyle cardTitle = TextStyle(
    fontFamily: fontFamilyHebrew,
    fontSize: 24,
    fontWeight: FontWeight.w700,
    color: AppColors.textOnDark,
    height: 1.2,
  );

  // Card Subtitle Hebrew
  static const TextStyle cardSubtitle = TextStyle(
    fontFamily: fontFamilyHebrew,
    fontSize: 14,
    fontWeight: FontWeight.w400,
    color: AppColors.textOnDark,
    height: 1.3,
  );

  // Stats Number
  static const TextStyle statsNumber = TextStyle(
    fontFamily: fontFamilyDisplay,
    fontSize: 20,
    fontWeight: FontWeight.w700,
    color: AppColors.textDark,
    height: 1.0,
  );

  // Stats Label
  static const TextStyle statsLabel = TextStyle(
    fontFamily: fontFamilyHebrew,
    fontSize: 12,
    fontWeight: FontWeight.w500,
    color: AppColors.textSecondary,
    height: 1.2,
  );

  // Progress Text
  static const TextStyle progress = TextStyle(
    fontFamily: fontFamilyDisplay,
    fontSize: 14,
    fontWeight: FontWeight.w600,
    color: AppColors.primaryOrange,
    height: 1.0,
  );

  // Celebration Headline
  static const TextStyle celebrationHeadline = TextStyle(
    fontFamily: fontFamilyHebrew,
    fontSize: 40,
    fontWeight: FontWeight.w900,
    color: AppColors.primaryOrange,
    height: 1.1,
  );

  // Word Example
  static const TextStyle wordLabel = TextStyle(
    fontFamily: fontFamilyHebrew,
    fontSize: 20,
    fontWeight: FontWeight.w600,
    color: AppColors.textDark,
    height: 1.3,
  );

  // Word Example Small (under images)
  static const TextStyle wordLabelSmall = TextStyle(
    fontFamily: fontFamilyHebrew,
    fontSize: 14,
    fontWeight: FontWeight.w500,
    color: AppColors.textDark,
    height: 1.2,
  );

  // Screen Title
  static const TextStyle screenTitle = TextStyle(
    fontFamily: fontFamilyHebrew,
    fontSize: 22,
    fontWeight: FontWeight.w700,
    color: AppColors.textDark,
    height: 1.2,
  );

  // Version Text
  static const TextStyle version = TextStyle(
    fontFamily: fontFamilyDisplay,
    fontSize: 12,
    fontWeight: FontWeight.w600,
    color: AppColors.primaryOrange,
    height: 1.0,
  );

  // Hint Text (Leo's speech bubble)
  static const TextStyle speech = TextStyle(
    fontFamily: fontFamilyHebrew,
    fontSize: 16,
    fontWeight: FontWeight.w500,
    color: AppColors.textDark,
    height: 1.3,
  );

  // Score Display
  static const TextStyle score = TextStyle(
    fontFamily: fontFamilyDisplay,
    fontSize: 18,
    fontWeight: FontWeight.w700,
    color: AppColors.starYellow,
    height: 1.0,
  );

  // Number Display (for counting)
  static const TextStyle numberDisplay = TextStyle(
    fontFamily: fontFamilyHebrew,
    fontSize: 64,
    fontWeight: FontWeight.w900,
    color: AppColors.primaryOrange,
  );

  // Caption
  static const TextStyle caption = TextStyle(
    fontFamily: fontFamilyHebrew,
    fontSize: 12,
    fontWeight: FontWeight.w400,
    color: AppColors.textSecondary,
    height: 1.2,
  );
}
