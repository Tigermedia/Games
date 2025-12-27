import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';

class CountingGameScreen extends StatelessWidget {
  const CountingGameScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.skyBlue,
      appBar: AppBar(
        title: const Text('?כמה יש'),
        backgroundColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.arrow_forward),
          onPressed: () => context.pop(),
        ),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('משחק ספירה', style: AppTypography.headline.copyWith(color: Colors.white)),
            const SizedBox(height: 48),
            const Text('(בפיתוח)', style: TextStyle(color: Colors.white70)),
          ],
        ),
      ),
    );
  }
}
