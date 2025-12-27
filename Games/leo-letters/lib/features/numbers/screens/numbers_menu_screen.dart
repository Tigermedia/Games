import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';

class NumbersMenuScreen extends StatelessWidget {
  const NumbersMenuScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.cream,
      appBar: AppBar(
        title: const Text('מספרים'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_forward),
          onPressed: () => context.pop(),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _RangeCard(title: '1-5', color: AppColors.primaryOrange, progress: '5/5', hasGold: true),
          const SizedBox(height: 12),
          _RangeCard(title: '6-10', color: AppColors.turquoise, progress: '3/5'),
          const SizedBox(height: 12),
          _RangeCard(title: '11-15', color: AppColors.purple, progress: '0/5', isLocked: true),
          const SizedBox(height: 12),
          _RangeCard(title: '16-20', color: AppColors.successGreen, progress: '0/5', isLocked: true),
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => context.go('/numbers/counting'),
                  icon: const Text('🔢'),
                  label: const Text('ספירה'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: null, // Locked
                  icon: const Text('➕'),
                  label: const Text('חיבור'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.softGray,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _RangeCard extends StatelessWidget {
  final String title;
  final Color color;
  final String progress;
  final bool isLocked;
  final bool hasGold;

  const _RangeCard({
    required this.title,
    required this.color,
    required this.progress,
    this.isLocked = false,
    this.hasGold = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 90,
      decoration: BoxDecoration(
        gradient: isLocked ? null : LinearGradient(colors: [color, color.withOpacity(0.8)]),
        color: isLocked ? AppColors.softGray : null,
        borderRadius: BorderRadius.circular(20),
      ),
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          if (hasGold) const Text('⭐', style: TextStyle(fontSize: 24)),
          if (isLocked) const Text('🔒', style: TextStyle(fontSize: 24)),
          const SizedBox(width: 16),
          Text(title, style: AppTypography.headline.copyWith(color: Colors.white)),
          const Spacer(),
          Text(progress, style: AppTypography.body.copyWith(color: Colors.white70)),
        ],
      ),
    );
  }
}
