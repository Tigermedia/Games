import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:confetti/confetti.dart';

import '../../core/theme/app_colors.dart';

/// Celebration overlay shown when completing a level or achievement
class CelebrationOverlay extends StatefulWidget {
  final String headline;
  final String achievementText;
  final int stars;
  final VoidCallback onContinue;
  final VoidCallback? onPlayAgain;

  const CelebrationOverlay({
    super.key,
    this.headline = '!כל הכבוד',
    required this.achievementText,
    this.stars = 3,
    required this.onContinue,
    this.onPlayAgain,
  });

  @override
  State<CelebrationOverlay> createState() => _CelebrationOverlayState();
}

class _CelebrationOverlayState extends State<CelebrationOverlay>
    with TickerProviderStateMixin {
  late AnimationController _scaleController;
  late AnimationController _starsController;
  late Animation<double> _scaleAnimation;
  late ConfettiController _confettiController;

  @override
  void initState() {
    super.initState();

    _scaleController = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    );

    _starsController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );

    _scaleAnimation = Tween<double>(begin: 0.5, end: 1.0).animate(
      CurvedAnimation(parent: _scaleController, curve: Curves.elasticOut),
    );

    _confettiController = ConfettiController(
      duration: const Duration(seconds: 3),
    );

    // Start animations
    _scaleController.forward();
    Future.delayed(const Duration(milliseconds: 300), () {
      _starsController.forward();
    });
    Future.delayed(const Duration(milliseconds: 800), () {
      _confettiController.play();
    });
  }

  @override
  void dispose() {
    _scaleController.dispose();
    _starsController.dispose();
    _confettiController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: Stack(
        children: [
          // Dark overlay background
          Container(color: AppColors.overlayDark),

          // Confetti
          Align(
            alignment: Alignment.topCenter,
            child: ConfettiWidget(
              confettiController: _confettiController,
              blastDirectionality: BlastDirectionality.explosive,
              shouldLoop: false,
              colors: const [
                AppColors.primaryOrange,
                AppColors.turquoise,
                AppColors.purple,
                AppColors.starYellow,
                AppColors.softPink,
              ],
              numberOfParticles: 30,
              maxBlastForce: 20,
              minBlastForce: 5,
              emissionFrequency: 0.05,
              gravity: 0.2,
            ),
          ),

          // Main content
          Center(
            child: AnimatedBuilder(
              animation: _scaleController,
              builder: (context, child) {
                return Transform.scale(
                  scale: _scaleAnimation.value,
                  child: child,
                );
              },
              child: Container(
                width: MediaQuery.of(context).size.width * 0.85,
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: AppColors.celebrationGradient,
                  borderRadius: BorderRadius.circular(32),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primaryOrange.withOpacity(0.3),
                      blurRadius: 30,
                      spreadRadius: 5,
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Headline
                    ShaderMask(
                      shaderCallback: (bounds) => LinearGradient(
                        colors: [
                          AppColors.primaryOrange,
                          AppColors.starYellow,
                        ],
                      ).createShader(bounds),
                      child: Text(
                        widget.headline,
                        style: GoogleFonts.rubik(
                          fontSize: 40,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                        ),
                        textDirection: TextDirection.rtl,
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Stars
                    _buildStars(),

                    const SizedBox(height: 20),

                    // Achievement text
                    Text(
                      widget.achievementText,
                      style: GoogleFonts.rubik(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: AppColors.purple,
                      ),
                      textDirection: TextDirection.rtl,
                      textAlign: TextAlign.center,
                    ),

                    const SizedBox(height: 20),

                    // Leo celebration
                    Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppColors.cream,
                        border: Border.all(
                          color: AppColors.primaryOrange,
                          width: 3,
                        ),
                      ),
                      child: const Stack(
                        alignment: Alignment.center,
                        children: [
                          Text('🦁', style: TextStyle(fontSize: 60)),
                          Positioned(
                            top: 0,
                            child: Text('🎉', style: TextStyle(fontSize: 24)),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Continue button
                    GestureDetector(
                      onTap: widget.onContinue,
                      child: Container(
                        width: double.infinity,
                        height: 56,
                        decoration: BoxDecoration(
                          color: AppColors.primaryOrange,
                          borderRadius: BorderRadius.circular(28),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.primaryOrangeDark,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'המשך',
                              style: GoogleFonts.rubik(
                                fontSize: 20,
                                fontWeight: FontWeight.w700,
                                color: Colors.white,
                              ),
                              textDirection: TextDirection.rtl,
                            ),
                            const SizedBox(width: 8),
                            const Icon(
                              Icons.arrow_back_rounded,
                              color: Colors.white,
                              size: 24,
                            ),
                          ],
                        ),
                      ),
                    ),

                    // Play again link
                    if (widget.onPlayAgain != null) ...[
                      const SizedBox(height: 16),
                      GestureDetector(
                        onTap: widget.onPlayAgain,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(
                              Icons.refresh_rounded,
                              color: AppColors.purple,
                              size: 20,
                            ),
                            const SizedBox(width: 6),
                            Text(
                              'שחק שוב',
                              style: GoogleFonts.rubik(
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                                color: AppColors.purple,
                              ),
                              textDirection: TextDirection.rtl,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStars() {
    return AnimatedBuilder(
      animation: _starsController,
      builder: (context, child) {
        return Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(3, (index) {
            final delay = index * 0.2;
            final progress = ((_starsController.value - delay) / 0.3).clamp(0.0, 1.0);
            final scale = Curves.elasticOut.transform(progress);
            final isEarned = index < widget.stars;

            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4),
              child: Transform.scale(
                scale: scale,
                child: Icon(
                  Icons.star_rounded,
                  size: 48,
                  color: isEarned
                      ? AppColors.starYellow
                      : AppColors.mediumGray.withOpacity(0.5),
                  shadows: isEarned
                      ? [
                          Shadow(
                            color: AppColors.starYellow.withOpacity(0.5),
                            blurRadius: 10,
                          ),
                        ]
                      : null,
                ),
              ),
            );
          }),
        );
      },
    );
  }
}

/// Show the celebration overlay as a dialog
Future<void> showCelebrationOverlay(
  BuildContext context, {
  String headline = '!כל הכבוד',
  required String achievementText,
  int stars = 3,
  required VoidCallback onContinue,
  VoidCallback? onPlayAgain,
}) {
  return showDialog(
    context: context,
    barrierDismissible: false,
    barrierColor: Colors.transparent,
    builder: (context) => CelebrationOverlay(
      headline: headline,
      achievementText: achievementText,
      stars: stars,
      onContinue: () {
        Navigator.of(context).pop();
        onContinue();
      },
      onPlayAgain: onPlayAgain != null
          ? () {
              Navigator.of(context).pop();
              onPlayAgain();
            }
          : null,
    ),
  );
}
