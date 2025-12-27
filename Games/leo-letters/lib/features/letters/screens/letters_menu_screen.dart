import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/constants/hebrew_letters.dart';
import '../../../shared/widgets/leo_character.dart';

class LettersMenuScreen extends ConsumerWidget {
  const LettersMenuScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppColors.cream,
      appBar: AppBar(
        title: const Text('אותיות'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_forward),
          onPressed: () => context.pop(),
        ),
      ),
      body: Column(
        children: [
          // Letters grid
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 5,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
              ),
              itemCount: HebrewLetters.all.length,
              itemBuilder: (context, index) {
                final letter = HebrewLetters.all[index];
                final isUnlocked = index < 5; // First 5 unlocked for demo

                return GestureDetector(
                  onTap: isUnlocked
                      ? () => context.go('/letters/${letter.letter}')
                      : null,
                  child: Container(
                    decoration: BoxDecoration(
                      color: isUnlocked ? Colors.white : AppColors.softGray,
                      borderRadius: BorderRadius.circular(12),
                      border: index < 3
                          ? Border.all(color: AppColors.gold, width: 2)
                          : null,
                      boxShadow: isUnlocked
                          ? [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.08),
                                blurRadius: 8,
                                offset: const Offset(0, 2),
                              ),
                            ]
                          : null,
                    ),
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        Text(
                          letter.letter,
                          style: AppTypography.letterLarge.copyWith(
                            color: isUnlocked
                                ? AppColors.purple
                                : AppColors.mediumGray,
                          ),
                        ),
                        if (!isUnlocked)
                          const Icon(
                            Icons.lock,
                            color: AppColors.mediumGray,
                            size: 20,
                          ),
                        if (index < 3)
                          const Positioned(
                            top: 4,
                            left: 4,
                            child: Text('⭐', style: TextStyle(fontSize: 12)),
                          ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),

          // Leo character
          const Padding(
            padding: EdgeInsets.all(16),
            child: LeoCharacter(
              speechText: '!בחר אות ללמוד',
              size: 100,
            ),
          ),
        ],
      ),
    );
  }
}
