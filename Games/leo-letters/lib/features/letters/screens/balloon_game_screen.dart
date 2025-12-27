import 'dart:math';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../../../shared/widgets/celebration_overlay.dart';

class BalloonGameScreen extends StatefulWidget {
  final String letter;

  const BalloonGameScreen({super.key, required this.letter});

  @override
  State<BalloonGameScreen> createState() => _BalloonGameScreenState();
}

class _BalloonGameScreenState extends State<BalloonGameScreen>
    with TickerProviderStateMixin {
  final Random _random = Random();
  late List<_BalloonData> _balloons;
  int _score = 0;
  int _round = 1;
  final int _totalRounds = 5;
  bool _isCorrectAnswer = false;
  bool _showFeedback = false;

  // Sample Hebrew letters for the game
  static const List<String> _hebrewLetters = [
    'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י'
  ];

  static const List<Color> _balloonColors = [
    AppColors.primaryOrange,
    AppColors.turquoise,
    AppColors.purple,
    AppColors.successGreen,
    AppColors.softPink,
    AppColors.balloonYellow,
  ];

  @override
  void initState() {
    super.initState();
    _generateBalloons();
  }

  void _generateBalloons() {
    _balloons = [];

    // Always include the target letter
    _balloons.add(_BalloonData(
      letter: widget.letter,
      color: _balloonColors[_random.nextInt(_balloonColors.length)],
      position: Offset(
        0.15 + _random.nextDouble() * 0.7,
        0.2 + _random.nextDouble() * 0.4,
      ),
      isTarget: true,
    ));

    // Add 3-4 distractor letters
    final distractors = _hebrewLetters
        .where((l) => l != widget.letter)
        .toList()
      ..shuffle();

    for (int i = 0; i < 4; i++) {
      _balloons.add(_BalloonData(
        letter: distractors[i],
        color: _balloonColors[_random.nextInt(_balloonColors.length)],
        position: Offset(
          0.1 + _random.nextDouble() * 0.8,
          0.15 + _random.nextDouble() * 0.5,
        ),
        isTarget: false,
      ));
    }

    // Shuffle positions
    _balloons.shuffle();
  }

  void _onBalloonTap(_BalloonData balloon) {
    if (_showFeedback) return;

    setState(() {
      _showFeedback = true;
      _isCorrectAnswer = balloon.isTarget;
    });

    if (balloon.isTarget) {
      _score += 10;

      if (_round >= _totalRounds) {
        // Game complete
        Future.delayed(const Duration(milliseconds: 500), () {
          showCelebrationOverlay(
            context,
            achievementText: '!סיימת את משחק הבלונים',
            stars: _score >= 40 ? 3 : (_score >= 20 ? 2 : 1),
            onContinue: () => context.pop(),
            onPlayAgain: () {
              setState(() {
                _score = 0;
                _round = 1;
                _showFeedback = false;
                _generateBalloons();
              });
            },
          );
        });
      } else {
        // Next round
        Future.delayed(const Duration(milliseconds: 800), () {
          setState(() {
            _round++;
            _showFeedback = false;
            _generateBalloons();
          });
        });
      }
    } else {
      // Wrong answer - try again
      Future.delayed(const Duration(milliseconds: 800), () {
        setState(() {
          _showFeedback = false;
        });
      });
    }
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
              Color(0xFFB8E4F0), // Light blue
            ],
          ),
        ),
        child: SafeArea(
          child: Stack(
            children: [
              // Cloud decorations
              const _CloudDecorations(),

              // Main content
              Column(
                children: [
                  // Top bar
                  _buildTopBar(),

                  // Game area with balloons
                  Expanded(
                    child: Stack(
                      children: [
                        // Balloons
                        ..._balloons.map((balloon) => _buildBalloon(balloon)),

                        // Feedback overlay
                        if (_showFeedback)
                          Center(
                            child: Container(
                              padding: const EdgeInsets.all(24),
                              decoration: BoxDecoration(
                                color: _isCorrectAnswer
                                    ? AppColors.successGreen.withOpacity(0.9)
                                    : AppColors.errorRed.withOpacity(0.9),
                                shape: BoxShape.circle,
                              ),
                              child: Icon(
                                _isCorrectAnswer
                                    ? Icons.check_rounded
                                    : Icons.close_rounded,
                                color: Colors.white,
                                size: 60,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),

                  // Leo asking
                  _buildLeoQuestion(),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTopBar() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          // Back button
          GestureDetector(
            onTap: () => context.pop(),
            child: Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 8,
                  ),
                ],
              ),
              child: const Icon(
                Icons.arrow_forward_rounded,
                color: AppColors.primaryOrange,
              ),
            ),
          ),

          const Spacer(),

          // Title
          Text(
            'בלון האותיות',
            style: GoogleFonts.rubik(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: AppColors.textDark,
            ),
            textDirection: TextDirection.rtl,
          ),

          const Spacer(),

          // Progress indicator
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.star_rounded,
                  color: AppColors.starYellow,
                  size: 20,
                ),
                const SizedBox(width: 4),
                Text(
                  '$_round/$_totalRounds',
                  style: GoogleFonts.lexend(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textDark,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBalloon(_BalloonData balloon) {
    final screenSize = MediaQuery.of(context).size;

    return Positioned(
      left: balloon.position.dx * screenSize.width - 50,
      top: balloon.position.dy * (screenSize.height * 0.5),
      child: GestureDetector(
        onTap: () => _onBalloonTap(balloon),
        child: _AnimatedBalloon(
          color: balloon.color,
          letter: balloon.letter,
        ),
      ),
    );
  }

  Widget _buildLeoQuestion() {
    return Container(
      padding: const EdgeInsets.all(16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Leo avatar
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.white,
              border: Border.all(
                color: AppColors.primaryOrange,
                width: 3,
              ),
            ),
            child: const Center(
              child: Text('🦁', style: TextStyle(fontSize: 50)),
            ),
          ),

          const SizedBox(width: 16),

          // Speech bubble
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  '?',
                  style: GoogleFonts.rubik(
                    fontSize: 24,
                    fontWeight: FontWeight.w700,
                    color: AppColors.turquoise,
                  ),
                ),
                const SizedBox(width: 4),
                Text(
                  widget.letter,
                  style: GoogleFonts.rubik(
                    fontSize: 32,
                    fontWeight: FontWeight.w900,
                    color: AppColors.primaryOrange,
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  'איפה',
                  style: GoogleFonts.rubik(
                    fontSize: 24,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textDark,
                  ),
                  textDirection: TextDirection.rtl,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _BalloonData {
  final String letter;
  final Color color;
  final Offset position;
  final bool isTarget;

  _BalloonData({
    required this.letter,
    required this.color,
    required this.position,
    required this.isTarget,
  });
}

class _AnimatedBalloon extends StatefulWidget {
  final Color color;
  final String letter;

  const _AnimatedBalloon({
    required this.color,
    required this.letter,
  });

  @override
  State<_AnimatedBalloon> createState() => _AnimatedBalloonState();
}

class _AnimatedBalloonState extends State<_AnimatedBalloon>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _floatAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(milliseconds: 2000 + Random().nextInt(1000)),
      vsync: this,
    )..repeat(reverse: true);

    _floatAnimation = Tween<double>(begin: -10, end: 10).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(0, _floatAnimation.value),
          child: child,
        );
      },
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Balloon body
          Container(
            width: 80,
            height: 100,
            decoration: BoxDecoration(
              color: widget.color,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(40),
                topRight: Radius.circular(40),
                bottomLeft: Radius.circular(40),
                bottomRight: Radius.circular(40),
              ),
              boxShadow: [
                BoxShadow(
                  color: widget.color.withOpacity(0.3),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  widget.color.withOpacity(0.9),
                  widget.color,
                  HSLColor.fromColor(widget.color)
                      .withLightness(
                        (HSLColor.fromColor(widget.color).lightness - 0.1)
                            .clamp(0, 1),
                      )
                      .toColor(),
                ],
              ),
            ),
            child: Center(
              child: Text(
                widget.letter,
                style: GoogleFonts.rubik(
                  fontSize: 40,
                  fontWeight: FontWeight.w900,
                  color: Colors.white,
                  shadows: [
                    Shadow(
                      color: Colors.black.withOpacity(0.2),
                      offset: const Offset(1, 1),
                      blurRadius: 2,
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Balloon knot
          Container(
            width: 12,
            height: 12,
            decoration: BoxDecoration(
              color: HSLColor.fromColor(widget.color)
                  .withLightness(
                    (HSLColor.fromColor(widget.color).lightness - 0.15)
                        .clamp(0, 1),
                  )
                  .toColor(),
              shape: BoxShape.circle,
            ),
          ),

          // Balloon string
          Container(
            width: 2,
            height: 30,
            color: Colors.grey.shade400,
          ),
        ],
      ),
    );
  }
}

class _CloudDecorations extends StatelessWidget {
  const _CloudDecorations();

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned(
          top: 50,
          right: 20,
          child: _buildCloud(80),
        ),
        Positioned(
          top: 100,
          left: 30,
          child: _buildCloud(60),
        ),
        Positioned(
          top: 200,
          right: 60,
          child: _buildCloud(50),
        ),
      ],
    );
  }

  Widget _buildCloud(double size) {
    return Container(
      width: size,
      height: size * 0.6,
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.8),
        borderRadius: BorderRadius.circular(size),
      ),
    );
  }
}
