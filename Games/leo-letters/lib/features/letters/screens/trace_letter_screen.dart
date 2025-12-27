import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';

class TraceLetterScreen extends StatelessWidget {
  final String letter;

  const TraceLetterScreen({super.key, required this.letter});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.cream,
      appBar: AppBar(
        title: Text('צייר את $letter'),
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
              '✏️ ציור אות ✏️',
              style: TextStyle(fontSize: 32),
            ),
            const SizedBox(height: 24),
            Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 16,
                  ),
                ],
              ),
              child: Center(
                child: Text(
                  letter,
                  style: AppTypography.letterDisplay.copyWith(
                    color: AppColors.softGray,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 48),
            const Text(
              '(בפיתוח)',
              style: TextStyle(color: AppColors.textSecondary, fontSize: 18),
            ),
          ],
        ),
      ),
    );
  }
}
