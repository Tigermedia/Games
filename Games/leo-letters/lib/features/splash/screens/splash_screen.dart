import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../../../app/routes.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {
  late AnimationController _fadeController;
  late AnimationController _bounceController;
  late Animation<double> _fadeAnimation;
  late Animation<double> _scaleAnimation;
  late Animation<double> _buttonAnimation;

  @override
  void initState() {
    super.initState();

    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    _bounceController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _fadeController, curve: Curves.easeIn),
    );

    _scaleAnimation = Tween<double>(begin: 0.5, end: 1).animate(
      CurvedAnimation(parent: _bounceController, curve: Curves.elasticOut),
    );

    _buttonAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(
        parent: _fadeController,
        curve: const Interval(0.5, 1.0, curve: Curves.easeOut),
      ),
    );

    _fadeController.forward();
    _bounceController.forward();
  }

  @override
  void dispose() {
    _fadeController.dispose();
    _bounceController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF87CEEB), // Sky blue
              Color(0xFF40E0D0), // Turquoise
            ],
          ),
        ),
        child: SafeArea(
          child: Stack(
            children: [
              // Background decorations
              const _BackgroundDecorations(),

              // Main content
              Center(
                child: AnimatedBuilder(
                  animation: _fadeController,
                  builder: (context, child) {
                    return Opacity(
                      opacity: _fadeAnimation.value,
                      child: child,
                    );
                  },
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Spacer(flex: 1),

                      // App title
                      Text(
                        'האותיות של ליאו',
                        style: GoogleFonts.rubik(
                          fontSize: 32,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textDark,
                        ),
                        textDirection: TextDirection.rtl,
                      ),

                      const SizedBox(height: 40),

                      // Leo mascot in circular frame
                      AnimatedBuilder(
                        animation: _bounceController,
                        builder: (context, child) {
                          return Transform.scale(
                            scale: _scaleAnimation.value,
                            child: child,
                          );
                        },
                        child: Container(
                          width: 220,
                          height: 220,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: Colors.white,
                            border: Border.all(
                              color: AppColors.primaryOrange,
                              width: 6,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.primaryOrange.withOpacity(0.3),
                                blurRadius: 20,
                                spreadRadius: 5,
                              ),
                            ],
                          ),
                          child: ClipOval(
                            child: Container(
                              padding: const EdgeInsets.all(16),
                              child: const Center(
                                child: Text(
                                  '🦁',
                                  style: TextStyle(fontSize: 120),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),

                      const Spacer(flex: 2),

                      // Play button
                      AnimatedBuilder(
                        animation: _fadeController,
                        builder: (context, child) {
                          return Opacity(
                            opacity: _buttonAnimation.value,
                            child: Transform.translate(
                              offset: Offset(0, 30 * (1 - _buttonAnimation.value)),
                              child: child,
                            ),
                          );
                        },
                        child: GestureDetector(
                          onTap: () => context.go(AppRoutes.home),
                          child: Container(
                            width: 200,
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
                                const Icon(
                                  Icons.play_arrow_rounded,
                                  color: Colors.white,
                                  size: 28,
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  '!בוא נשחק',
                                  style: GoogleFonts.rubik(
                                    fontSize: 20,
                                    fontWeight: FontWeight.w700,
                                    color: Colors.white,
                                  ),
                                  textDirection: TextDirection.rtl,
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(height: 60),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _BackgroundDecorations extends StatelessWidget {
  const _BackgroundDecorations();

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Floating number "1"
        Positioned(
          top: 80,
          right: 30,
          child: Text(
            '1',
            style: GoogleFonts.rubik(
              fontSize: 48,
              fontWeight: FontWeight.w700,
              color: Colors.white.withOpacity(0.3),
            ),
          ),
        ),
        // Star decorations
        Positioned(
          top: 60,
          left: 40,
          child: Icon(
            Icons.star_rounded,
            size: 24,
            color: AppColors.starYellow.withOpacity(0.8),
          ),
        ),
        Positioned(
          top: 120,
          left: 80,
          child: Icon(
            Icons.star_rounded,
            size: 16,
            color: Colors.white.withOpacity(0.6),
          ),
        ),
        Positioned(
          bottom: 150,
          right: 50,
          child: Icon(
            Icons.star_rounded,
            size: 20,
            color: AppColors.starYellow.withOpacity(0.7),
          ),
        ),
        Positioned(
          bottom: 200,
          left: 60,
          child: Icon(
            Icons.star_rounded,
            size: 18,
            color: Colors.white.withOpacity(0.5),
          ),
        ),
      ],
    );
  }
}
