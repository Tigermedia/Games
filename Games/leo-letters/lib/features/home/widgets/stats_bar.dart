import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
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
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
      child: Row(
        children: [
          // Stars counter (left side in RTL)
          _StatBadge(
            icon: Icons.star_rounded,
            iconColor: AppColors.starYellow,
            value: stars,
            onTap: () => context.go(AppRoutes.rewards),
          ),

          const SizedBox(width: 12),

          // Trophies counter
          _StatBadge(
            icon: Icons.emoji_events_rounded,
            iconColor: AppColors.primaryOrange,
            value: trophies,
            onTap: () => context.go(AppRoutes.rewards),
          ),

          const Spacer(),

          // Settings button (right side in RTL)
          GestureDetector(
            onTap: () => context.go(AppRoutes.settings),
            child: Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                border: Border.all(
                  color: AppColors.borderOrange,
                  width: 2,
                ),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.shadowCard,
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: const Icon(
                Icons.settings_outlined,
                color: AppColors.primaryOrange,
                size: 24,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _StatBadge extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final int value;
  final VoidCallback? onTap;

  const _StatBadge({
    required this.icon,
    required this.iconColor,
    required this.value,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: AppColors.borderOrange.withOpacity(0.5),
            width: 1,
          ),
          boxShadow: [
            BoxShadow(
              color: AppColors.shadowCard,
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: iconColor, size: 22),
            const SizedBox(width: 6),
            Text(
              value.toString(),
              style: GoogleFonts.lexend(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: AppColors.textDark,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
