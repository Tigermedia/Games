import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';

class BalloonGameScreen extends StatelessWidget {
  final String letter;

  const BalloonGameScreen({super.key, required this.letter});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.skyBlue,
      appBar: AppBar(
        title: const Text('בלון האותיות'),
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
            const Text(
              '🎈 משחק הבלונים 🎈',
              style: TextStyle(fontSize: 32),
            ),
            const SizedBox(height: 24),
            Text(
              'מצא את האות $letter',
              style: AppTypography.headline.copyWith(color: Colors.white),
            ),
            const SizedBox(height: 48),
            const Text(
              '(בפיתוח)',
              style: TextStyle(color: Colors.white70, fontSize: 18),
            ),
          ],
        ),
      ),
    );
  }
}
