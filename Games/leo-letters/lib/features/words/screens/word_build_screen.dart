import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';

class WordBuildScreen extends StatelessWidget {
  final String category;

  const WordBuildScreen({super.key, required this.category});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.cream,
      appBar: AppBar(
        title: const Text('בנה מילה'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_forward),
          onPressed: () => context.pop(),
        ),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('קטגוריה: $category', style: AppTypography.subheadline),
            const SizedBox(height: 48),
            const Text('(בפיתוח)', style: TextStyle(color: AppColors.textSecondary)),
          ],
        ),
      ),
    );
  }
}
