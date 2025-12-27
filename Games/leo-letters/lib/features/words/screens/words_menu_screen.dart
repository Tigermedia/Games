import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';

class WordsMenuScreen extends StatelessWidget {
  const WordsMenuScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.cream,
      appBar: AppBar(
        title: const Text('מילים'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_forward),
          onPressed: () => context.pop(),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _CategoryCard(
            title: 'חיות',
            icon: '🐕',
            color: AppColors.successGreen,
            progress: '4/8',
            onTap: () => context.go('/words/animals'),
          ),
          const SizedBox(height: 12),
          _CategoryCard(
            title: 'אוכל',
            icon: '🍎',
            color: AppColors.primaryOrange,
            progress: '3/6',
            onTap: () => context.go('/words/food'),
          ),
          const SizedBox(height: 12),
          _CategoryCard(
            title: 'משפחה',
            icon: '👨‍👩‍👧',
            color: AppColors.softPink,
            progress: '2/5',
            onTap: () => context.go('/words/family'),
          ),
          const SizedBox(height: 12),
          _CategoryCard(
            title: 'צבעים',
            icon: '🌈',
            color: AppColors.purple,
            progress: '0/6',
            isLocked: true,
          ),
        ],
      ),
    );
  }
}

class _CategoryCard extends StatelessWidget {
  final String title;
  final String icon;
  final Color color;
  final String progress;
  final bool isLocked;
  final VoidCallback? onTap;

  const _CategoryCard({
    required this.title,
    required this.icon,
    required this.color,
    required this.progress,
    this.isLocked = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: isLocked ? null : onTap,
      child: Container(
        height: 100,
        decoration: BoxDecoration(
          color: isLocked ? AppColors.softGray : color,
          borderRadius: BorderRadius.circular(20),
        ),
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Text(isLocked ? '🔒' : icon, style: const TextStyle(fontSize: 40)),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                title,
                style: AppTypography.subheadline.copyWith(color: Colors.white),
              ),
            ),
            Text(
              progress,
              style: AppTypography.body.copyWith(color: Colors.white70),
            ),
          ],
        ),
      ),
    );
  }
}
