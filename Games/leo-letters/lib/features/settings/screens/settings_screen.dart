import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../app/routes.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _soundEnabled = true;
  bool _musicEnabled = true;
  bool _voiceEnabled = true;
  bool _dailyReminder = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('הגדרות'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_forward),
          onPressed: () => context.pop(),
        ),
      ),
      body: ListView(
        children: [
          _SectionHeader(title: 'צלילים'),
          _SettingSwitch(
            icon: Icons.volume_up,
            title: 'צלילים',
            value: _soundEnabled,
            onChanged: (v) => setState(() => _soundEnabled = v),
          ),
          _SettingSwitch(
            icon: Icons.music_note,
            title: 'מוזיקה',
            value: _musicEnabled,
            onChanged: (v) => setState(() => _musicEnabled = v),
          ),
          _SettingSwitch(
            icon: Icons.record_voice_over,
            title: 'הקראה',
            value: _voiceEnabled,
            onChanged: (v) => setState(() => _voiceEnabled = v),
          ),
          const Divider(),

          _SectionHeader(title: 'התראות'),
          _SettingSwitch(
            icon: Icons.notifications,
            title: 'תזכורת יומית',
            value: _dailyReminder,
            onChanged: (v) => setState(() => _dailyReminder = v),
          ),
          const Divider(),

          _SectionHeader(title: 'חשבון'),
          _SettingTile(
            icon: Icons.child_care,
            title: 'שם הילד/ה',
            trailing: 'ליאור',
            onTap: () {},
          ),
          _SettingTile(
            icon: Icons.person,
            title: 'אזור הורים',
            onTap: () => context.go(AppRoutes.parentZone),
          ),
          _SettingTile(
            icon: Icons.delete_outline,
            title: 'אפס התקדמות',
            titleColor: Colors.red,
            onTap: () => _showResetDialog(context),
          ),
          const Divider(),

          _SettingTile(
            icon: Icons.info_outline,
            title: 'אודות',
            onTap: () {},
          ),

          const SizedBox(height: 24),
          Center(
            child: Text('גרסה 0.1.0', style: AppTypography.caption),
          ),
          const SizedBox(height: 8),
        ],
      ),
    );
  }

  void _showResetDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('?אפס התקדמות'),
        content: const Text('כל ההתקדמות והכוכבים יימחקו. לא ניתן לבטל.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('ביטול')),
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('אפס', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
      child: Text(title, style: AppTypography.caption.copyWith(color: AppColors.textSecondary)),
    );
  }
}

class _SettingSwitch extends StatelessWidget {
  final IconData icon;
  final String title;
  final bool value;
  final ValueChanged<bool> onChanged;

  const _SettingSwitch({
    required this.icon,
    required this.title,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: AppColors.purple),
      title: Text(title),
      trailing: Switch(value: value, onChanged: onChanged, activeColor: AppColors.primaryOrange),
    );
  }
}

class _SettingTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String? trailing;
  final Color? titleColor;
  final VoidCallback? onTap;

  const _SettingTile({
    required this.icon,
    required this.title,
    this.trailing,
    this.titleColor,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: titleColor ?? AppColors.purple),
      title: Text(title, style: TextStyle(color: titleColor)),
      trailing: trailing != null ? Text(trailing!, style: AppTypography.bodySmall) : const Icon(Icons.chevron_left),
      onTap: onTap,
    );
  }
}
