import 'package:flutter/material.dart';
import 'app_colors.dart';
import 'app_typography.dart';

/// Main app theme configuration
class AppTheme {
  AppTheme._();

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,

      // Colors
      colorScheme: ColorScheme.light(
        primary: AppColors.primaryOrange,
        onPrimary: Colors.white,
        secondary: AppColors.turquoise,
        onSecondary: Colors.white,
        tertiary: AppColors.purple,
        surface: AppColors.cream,
        onSurface: AppColors.purple,
        error: AppColors.errorSoft,
        onError: Colors.white,
      ),

      // Scaffold
      scaffoldBackgroundColor: AppColors.cream,

      // AppBar
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        iconTheme: const IconThemeData(
          color: AppColors.purple,
          size: 28,
        ),
        titleTextStyle: AppTypography.headline.copyWith(
          color: AppColors.purple,
        ),
      ),

      // Buttons
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primaryOrange,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          elevation: 4,
          shadowColor: AppColors.primaryOrange.withOpacity(0.4),
          textStyle: AppTypography.button,
        ),
      ),

      // Text Buttons
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.purple,
          textStyle: AppTypography.body,
        ),
      ),

      // Cards
      cardTheme: CardTheme(
        color: Colors.white,
        elevation: 4,
        shadowColor: Colors.black.withOpacity(0.08),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
      ),

      // Icons
      iconTheme: const IconThemeData(
        color: AppColors.purple,
        size: 24,
      ),

      // Text
      textTheme: TextTheme(
        displayLarge: AppTypography.letterDisplay,
        headlineLarge: AppTypography.headline,
        headlineMedium: AppTypography.subheadline,
        bodyLarge: AppTypography.body,
        bodyMedium: AppTypography.bodySmall,
        labelLarge: AppTypography.button,
      ),

      // Input Decoration
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      ),

      // Divider
      dividerTheme: DividerThemeData(
        color: AppColors.softGray,
        thickness: 1,
      ),

      // Progress Indicator
      progressIndicatorTheme: const ProgressIndicatorThemeData(
        color: AppColors.primaryOrange,
        linearTrackColor: AppColors.softGray,
      ),

      // Fonts
      fontFamily: 'Heebo',
    );
  }
}
