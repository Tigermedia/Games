import 'package:flutter/material.dart';
import 'app_colors.dart';

/// App typography styles
class AppTypography {
  AppTypography._();

  static const String fontFamily = 'Heebo';

  // Letter Display (for learning Hebrew letters)
  static const TextStyle letterDisplay = TextStyle(
    fontFamily: fontFamily,
    fontSize: 120,
    fontWeight: FontWeight.w800,
    color: AppColors.purple,
    height: 1.2,
  );

  // Large Letter (medium size for grids)
  static const TextStyle letterLarge = TextStyle(
    fontFamily: fontFamily,
    fontSize: 48,
    fontWeight: FontWeight.w800,
    color: AppColors.purple,
  );

  // Headline
  static const TextStyle headline = TextStyle(
    fontFamily: fontFamily,
    fontSize: 32,
    fontWeight: FontWeight.w700,
    color: AppColors.purple,
  );

  // Subheadline
  static const TextStyle subheadline = TextStyle(
    fontFamily: fontFamily,
    fontSize: 24,
    fontWeight: FontWeight.w700,
    color: AppColors.purple,
  );

  // Body
  static const TextStyle body = TextStyle(
    fontFamily: fontFamily,
    fontSize: 20,
    fontWeight: FontWeight.w500,
    color: AppColors.textPrimary,
  );

  // Body Small
  static const TextStyle bodySmall = TextStyle(
    fontFamily: fontFamily,
    fontSize: 16,
    fontWeight: FontWeight.w500,
    color: AppColors.textSecondary,
  );

  // Button
  static const TextStyle button = TextStyle(
    fontFamily: fontFamily,
    fontSize: 22,
    fontWeight: FontWeight.w700,
    color: Colors.white,
  );

  // Caption
  static const TextStyle caption = TextStyle(
    fontFamily: fontFamily,
    fontSize: 14,
    fontWeight: FontWeight.w400,
    color: AppColors.textSecondary,
  );

  // Speech Bubble (Leo's speech)
  static const TextStyle speech = TextStyle(
    fontFamily: fontFamily,
    fontSize: 20,
    fontWeight: FontWeight.w500,
    color: AppColors.purple,
    fontStyle: FontStyle.normal,
  );

  // Progress/Score
  static const TextStyle score = TextStyle(
    fontFamily: fontFamily,
    fontSize: 18,
    fontWeight: FontWeight.w700,
    color: AppColors.starYellow,
  );

  // Word Label (under images)
  static const TextStyle wordLabel = TextStyle(
    fontFamily: fontFamily,
    fontSize: 18,
    fontWeight: FontWeight.w600,
    color: AppColors.purple,
  );

  // Number Display (for counting)
  static const TextStyle numberDisplay = TextStyle(
    fontFamily: fontFamily,
    fontSize: 64,
    fontWeight: FontWeight.w800,
    color: AppColors.primaryOrange,
  );
}
