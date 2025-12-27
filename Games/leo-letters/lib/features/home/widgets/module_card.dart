import 'package:flutter/material.dart';

import '../../../core/theme/app_typography.dart';

class ModuleCard extends StatelessWidget {
  final String title;
  final String icon;
  final Color color;
  final String? progress;
  final bool isSmall;
  final bool isLocked;
  final VoidCallback? onTap;

  const ModuleCard({
    super.key,
    required this.title,
    required this.icon,
    required this.color,
    this.progress,
    this.isSmall = false,
    this.isLocked = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: isLocked ? null : onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        height: isSmall ? 60 : 100,
        decoration: BoxDecoration(
          color: isLocked ? Colors.grey.shade300 : color,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: (isLocked ? Colors.grey : color).withOpacity(0.3),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(
            children: [
              // Icon
              Text(
                isLocked ? '🔒' : icon,
                style: TextStyle(fontSize: isSmall ? 28 : 40),
              ),

              const SizedBox(width: 16),

              // Title
              Expanded(
                child: Text(
                  title,
                  style: AppTypography.subheadline.copyWith(
                    color: Colors.white,
                    fontSize: isSmall ? 20 : 24,
                  ),
                  textAlign: TextAlign.right,
                ),
              ),

              // Progress
              if (progress != null && !isLocked)
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      const Text('⭐', style: TextStyle(fontSize: 16)),
                      const SizedBox(width: 4),
                      Text(
                        progress!,
                        style: AppTypography.bodySmall.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
