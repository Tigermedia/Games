import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';

class ParentZoneScreen extends StatefulWidget {
  const ParentZoneScreen({super.key});

  @override
  State<ParentZoneScreen> createState() => _ParentZoneScreenState();
}

class _ParentZoneScreenState extends State<ParentZoneScreen> {
  bool _isUnlocked = false;
  final _pinController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    if (!_isUnlocked) {
      return _PinEntryScreen(
        onPinEntered: (pin) {
          // For demo, any 4-digit pin works
          if (pin.length == 4) {
            setState(() => _isUnlocked = true);
          }
        },
        onBack: () => context.pop(),
      );
    }

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('אזור הורים'),
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => context.pop(),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Child overview
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.cream,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                const CircleAvatar(
                  radius: 30,
                  backgroundColor: AppColors.primaryOrange,
                  child: Text('ל', style: TextStyle(fontSize: 24, color: Colors.white)),
                ),
                const SizedBox(width: 16),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('ליאור', style: AppTypography.subheadline),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Text('🔥 5 ימים', style: TextStyle(fontSize: 14)),
                        const SizedBox(width: 16),
                        const Text('⏱️ 2.5 שע', style: TextStyle(fontSize: 14)),
                        const SizedBox(width: 16),
                        const Text('⭐ 127', style: TextStyle(fontSize: 14)),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),
          Text('התקדמות לפי מודול', style: AppTypography.subheadline),
          const SizedBox(height: 12),

          _ProgressBar(title: 'אותיות', progress: 0.8, color: AppColors.purple),
          const SizedBox(height: 8),
          _ProgressBar(title: 'מילים', progress: 0.4, color: AppColors.turquoise),
          const SizedBox(height: 8),
          _ProgressBar(title: 'מספרים', progress: 0.25, color: AppColors.primaryOrange),

          const SizedBox(height: 24),
          Text('פעילות אחרונה', style: AppTypography.subheadline),
          const SizedBox(height: 12),

          _ActivityItem(text: 'למד את האות ב', time: 'היום'),
          _ActivityItem(text: 'משחק ספירה', time: 'אתמול'),
          _ActivityItem(text: 'האות א', time: 'לפני יומיים'),
        ],
      ),
    );
  }
}

class _PinEntryScreen extends StatefulWidget {
  final Function(String) onPinEntered;
  final VoidCallback onBack;

  const _PinEntryScreen({required this.onPinEntered, required this.onBack});

  @override
  State<_PinEntryScreen> createState() => _PinEntryScreenState();
}

class _PinEntryScreenState extends State<_PinEntryScreen> {
  String _pin = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.cream,
      appBar: AppBar(
        leading: IconButton(icon: const Icon(Icons.arrow_forward), onPressed: widget.onBack),
        backgroundColor: Colors.transparent,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.lock, size: 64, color: AppColors.purple),
            const SizedBox(height: 16),
            Text('אזור הורים', style: AppTypography.headline),
            const SizedBox(height: 32),

            // Pin dots
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(4, (i) => Container(
                margin: const EdgeInsets.symmetric(horizontal: 8),
                width: 20,
                height: 20,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: i < _pin.length ? AppColors.purple : AppColors.softGray,
                ),
              )),
            ),

            const SizedBox(height: 32),

            // Number pad
            SizedBox(
              width: 280,
              child: GridView.count(
                shrinkWrap: true,
                crossAxisCount: 3,
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                children: [
                  for (int i = 1; i <= 9; i++) _NumButton(
                    number: i.toString(),
                    onTap: () => _addDigit(i.toString()),
                  ),
                  const SizedBox(),
                  _NumButton(number: '0', onTap: () => _addDigit('0')),
                  IconButton(
                    icon: const Icon(Icons.backspace),
                    onPressed: _removeDigit,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _addDigit(String digit) {
    if (_pin.length < 4) {
      setState(() => _pin += digit);
      if (_pin.length == 4) {
        widget.onPinEntered(_pin);
      }
    }
  }

  void _removeDigit() {
    if (_pin.isNotEmpty) {
      setState(() => _pin = _pin.substring(0, _pin.length - 1));
    }
  }
}

class _NumButton extends StatelessWidget {
  final String number;
  final VoidCallback onTap;
  const _NumButton({required this.number, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Center(
          child: Text(number, style: AppTypography.headline),
        ),
      ),
    );
  }
}

class _ProgressBar extends StatelessWidget {
  final String title;
  final double progress;
  final Color color;
  const _ProgressBar({required this.title, required this.progress, required this.color});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        SizedBox(width: 60, child: Text(title)),
        Expanded(
          child: Container(
            height: 16,
            decoration: BoxDecoration(
              color: AppColors.softGray,
              borderRadius: BorderRadius.circular(8),
            ),
            child: FractionallySizedBox(
              alignment: Alignment.centerRight,
              widthFactor: progress,
              child: Container(
                decoration: BoxDecoration(
                  color: color,
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
          ),
        ),
        const SizedBox(width: 8),
        Text('${(progress * 100).toInt()}%'),
      ],
    );
  }
}

class _ActivityItem extends StatelessWidget {
  final String text;
  final String time;
  const _ActivityItem({required this.text, required this.time});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          const Text('•'),
          const SizedBox(width: 8),
          Expanded(child: Text(text)),
          Text(time, style: AppTypography.caption),
        ],
      ),
    );
  }
}
