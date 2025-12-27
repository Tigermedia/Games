import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/constants/hebrew_letters.dart';
import '../../../shared/widgets/leo_character.dart';

class LetterLearnScreen extends StatelessWidget {
  final String letter;

  const LetterLearnScreen({super.key, required this.letter});

  @override
  Widget build(BuildContext context) {
    final letterData = HebrewLetters.getByLetter(letter);

    return Scaffold(
      backgroundColor: AppColors.cream,
      appBar: AppBar(
        title: Text('האות $letter'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_forward),
          onPressed: () => context.pop(),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.volume_up),
            onPressed: () {
              // TODO: Play letter sound
            },
          ),
          // Stars display
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 8),
            child: Row(
              children: [
                Icon(Icons.star_border, color: AppColors.starYellow),
                Icon(Icons.star_border, color: AppColors.starYellow),
                Icon(Icons.star_border, color: AppColors.starYellow),
              ],
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          const Spacer(),

          // Large letter display
          Container(
            width: 200,
            height: 200,
            decoration: BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: AppColors.purple.withOpacity(0.2),
                  blurRadius: 24,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Center(
              child: Text(
                letter,
                style: AppTypography.letterDisplay,
              ),
            ),
          ),

          const SizedBox(height: 32),

          // Example words
          if (letterData != null)
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: letterData.examples.take(3).map((example) {
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8),
                  child: Column(
                    children: [
                      Container(
                        width: 80,
                        height: 80,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.08),
                              blurRadius: 8,
                            ),
                          ],
                        ),
                        child: const Center(
                          child: Text('🖼️', style: TextStyle(fontSize: 40)),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        example.word,
                        style: AppTypography.wordLabel,
                      ),
                    ],
                  ),
                );
              }).toList(),
            ),

          const Spacer(),

          // Action buttons
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => context.go('/letters/$letter/balloon'),
                    icon: const Text('🎈'),
                    label: const Text('משחק'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => context.go('/letters/$letter/trace'),
                    icon: const Text('✏️'),
                    label: const Text('צייר'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.turquoise,
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Leo character
          const LeoCharacter(
            speechText: '!זו האות',
            size: 80,
          ),

          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
