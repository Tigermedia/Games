import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../app/routes.dart';

class StatsBar extends StatelessWidget {
  final int stars;
  final int trophies;

  const StatsBar({
    super.key,
    required this.stars,
    required this.trophies,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          // Settings button
          IconButton(
            onPressed: () => context.go(AppRoutes.settings),
            icon: const Icon(
              Icons.settings,
              color: AppColors.purple,
              size: 28,
            ),
          ),

          const Spacer(),

          // Stars counter
          _StatItem(
            icon: '⭐',
            value: stars,
            onTap: () => context.go(AppRoutes.rewards),
          ),

          const SizedBox(width: 16),

          // Trophies counter
          _StatItem(
            icon: '🏆',
            value: trophies,
            onTap: () => context.go(AppRoutes.rewards),
          ),
        ],
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final String icon;
  final int value;
  final VoidCallback? onTap;

  const _StatItem({
    required this.icon,
    required this.value,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          children: [
            Text(icon, style: const TextStyle(fontSize: 20)),
            const SizedBox(width: 6),
            Text(
              value.toString(),
              style: AppTypography.body.copyWith(
                fontWeight: FontWeight.bold,
                color: AppColors.purple,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
