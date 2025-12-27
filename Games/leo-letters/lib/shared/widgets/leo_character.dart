import 'package:flutter/material.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';

/// Leo the lion cub mascot widget
class LeoCharacter extends StatelessWidget {
  final String? speechText;
  final LeoMood mood;
  final double size;

  const LeoCharacter({
    super.key,
    this.speechText,
    this.mood = LeoMood.happy,
    this.size = 150,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Speech bubble
        if (speechText != null)
          Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.08),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Text(
              speechText!,
              style: AppTypography.speech,
              textAlign: TextAlign.center,
            ),
          ),

        // Leo character (placeholder - will be replaced with Rive animation)
        Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            color: AppColors.primaryOrange.withOpacity(0.15),
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(
              _getMoodEmoji(),
              style: TextStyle(fontSize: size * 0.6),
            ),
          ),
        ),
      ],
    );
  }

  String _getMoodEmoji() {
    switch (mood) {
      case LeoMood.happy:
        return '🦁';
      case LeoMood.thinking:
        return '🤔';
      case LeoMood.celebrating:
        return '🎉';
      case LeoMood.encouraging:
        return '💪';
      case LeoMood.sleeping:
        return '😴';
    }
  }
}

enum LeoMood {
  happy,
  thinking,
  celebrating,
  encouraging,
  sleeping,
}
