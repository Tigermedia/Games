import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../app/routes.dart';
import '../../../shared/widgets/leo_character.dart';
import '../widgets/module_card.dart';
import '../widgets/stats_bar.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppColors.cream,
      body: SafeArea(
        child: Column(
          children: [
            // Stats bar
            const StatsBar(
              stars: 127,
              trophies: 12,
            ),

            // Module cards
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    // Letters module
                    ModuleCard(
                      title: 'אותיות',
                      icon: '🔤',
                      color: AppColors.purple,
                      progress: '15/22',
                      onTap: () => context.go(AppRoutes.letters),
                    ),

                    const SizedBox(height: 12),

                    // Words module
                    ModuleCard(
                      title: 'מילים',
                      icon: '📖',
                      color: AppColors.turquoise,
                      progress: '8/50',
                      onTap: () => context.go(AppRoutes.words),
                    ),

                    const SizedBox(height: 12),

                    // Numbers module
                    ModuleCard(
                      title: 'מספרים',
                      icon: '🔢',
                      color: AppColors.primaryOrange,
                      progress: '5/20',
                      onTap: () => context.go(AppRoutes.numbers),
                    ),

                    const SizedBox(height: 12),

                    // Daily challenge
                    ModuleCard(
                      title: '!אתגר יומי',
                      icon: '🎁',
                      color: AppColors.softPink,
                      isSmall: true,
                      onTap: () {
                        // TODO: Show daily challenge
                      },
                    ),

                    const Spacer(),

                    // Leo character
                    const LeoCharacter(
                      speechText: '?מה נלמד היום',
                      size: 120,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
