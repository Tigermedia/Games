import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';

class RewardsScreen extends StatelessWidget {
  const RewardsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.cream,
      appBar: AppBar(
        title: const Text('ההישגים שלי'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_forward),
          onPressed: () => context.pop(),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Stats
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _StatBox(icon: '⭐', value: '127', label: 'כוכבים'),
              _StatBox(icon: '🔥', value: '5', label: 'ימים'),
              _StatBox(icon: '🏆', value: '12', label: 'הישגים'),
            ],
          ),
          const SizedBox(height: 24),

          // Trophies section
          Text('גביעים', style: AppTypography.subheadline),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _Trophy(title: 'אותיות', icon: '🏆', isUnlocked: true),
              _Trophy(title: 'מילים', icon: '🏆', isUnlocked: false),
              _Trophy(title: 'מספרים', icon: '🏆', isUnlocked: false),
            ],
          ),
          const SizedBox(height: 24),

          // Stickers section
          Text('מדבקות (8/20)', style: AppTypography.subheadline),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _Sticker(emoji: '🦁', isUnlocked: true),
              _Sticker(emoji: '⭐', isUnlocked: true),
              _Sticker(emoji: '👑', isUnlocked: true),
              _Sticker(emoji: '❤️', isUnlocked: true),
              _Sticker(emoji: '🌈', isUnlocked: true),
              _Sticker(emoji: '🚀', isUnlocked: true),
              _Sticker(emoji: '🎨', isUnlocked: true),
              _Sticker(emoji: '🏠', isUnlocked: true),
              _Sticker(emoji: '?', isUnlocked: false),
              _Sticker(emoji: '?', isUnlocked: false),
              _Sticker(emoji: '?', isUnlocked: false),
              _Sticker(emoji: '?', isUnlocked: false),
            ],
          ),
        ],
      ),
    );
  }
}

class _StatBox extends StatelessWidget {
  final String icon;
  final String value;
  final String label;
  const _StatBox({required this.icon, required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Text(icon, style: const TextStyle(fontSize: 32)),
          Text(value, style: AppTypography.headline),
          Text(label, style: AppTypography.caption),
        ],
      ),
    );
  }
}

class _Trophy extends StatelessWidget {
  final String title;
  final String icon;
  final bool isUnlocked;
  const _Trophy({required this.title, required this.icon, required this.isUnlocked});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: 80,
          height: 80,
          decoration: BoxDecoration(
            color: isUnlocked ? AppColors.gold : AppColors.softGray,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Center(
            child: Text(isUnlocked ? icon : '🔒', style: const TextStyle(fontSize: 40)),
          ),
        ),
        const SizedBox(height: 4),
        Text(title, style: AppTypography.caption),
      ],
    );
  }
}

class _Sticker extends StatelessWidget {
  final String emoji;
  final bool isUnlocked;
  const _Sticker({required this.emoji, required this.isUnlocked});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 56,
      height: 56,
      decoration: BoxDecoration(
        color: isUnlocked ? Colors.white : AppColors.softGray,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Center(
        child: Text(
          isUnlocked ? emoji : '?',
          style: TextStyle(
            fontSize: 28,
            color: isUnlocked ? null : AppColors.mediumGray,
          ),
        ),
      ),
    );
  }
}
