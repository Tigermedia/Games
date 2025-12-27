import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../../../app/routes.dart';
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
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  children: [
                    const SizedBox(height: 8),

                    // Letters module
                    ModuleCard(
                      title: 'אותיות',
                      subtitle: 'לומד את הא"ב',
                      icon: Icons.text_fields_rounded,
                      color: AppColors.purple,
                      current: 5,
                      total: 22,
                      onTap: () => context.go(AppRoutes.letters),
                    ),

                    const SizedBox(height: 12),

                    // Words module
                    ModuleCard(
                      title: 'מילים',
                      subtitle: 'אוצר מילים ראשון',
                      icon: Icons.menu_book_rounded,
                      color: AppColors.turquoise,
                      current: 12,
                      total: 40,
                      onTap: () => context.go(AppRoutes.words),
                    ),

                    const SizedBox(height: 12),

                    // Numbers module
                    ModuleCard(
                      title: 'מספרים',
                      subtitle: 'לספור עד 10',
                      icon: Icons.onetwothree_rounded,
                      color: AppColors.primaryOrange,
                      current: 3,
                      total: 15,
                      onTap: () => context.go(AppRoutes.numbers),
                    ),

                    const SizedBox(height: 16),

                    // Daily challenge
                    const DailyChallengeCard(),

                    const SizedBox(height: 24),

                    // Leo section
                    _LeoSection(),

                    const SizedBox(height: 20),
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

class _LeoSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Speech bubble
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: AppColors.shadowCard,
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(
                Icons.help_outline_rounded,
                color: AppColors.textSecondary,
                size: 20,
              ),
              const SizedBox(width: 8),
              Text(
                '?מה נלמד היום',
                style: GoogleFonts.rubik(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textDark,
                ),
                textDirection: TextDirection.rtl,
              ),
            ],
          ),
        ),

        const SizedBox(height: 8),

        // Speech bubble pointer
        CustomPaint(
          size: const Size(20, 10),
          painter: _BubblePointerPainter(),
        ),

        // Leo image
        Container(
          width: 140,
          height: 140,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                AppColors.cream,
                AppColors.turquoise.withOpacity(0.2),
              ],
            ),
          ),
          child: const Center(
            child: Text(
              '🦁',
              style: TextStyle(fontSize: 80),
            ),
          ),
        ),
      ],
    );
  }
}

class _BubblePointerPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;

    final path = Path()
      ..moveTo(0, 0)
      ..lineTo(size.width / 2, size.height)
      ..lineTo(size.width, 0)
      ..close();

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
