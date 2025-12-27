/// Model for a Hebrew letter
class HebrewLetter {
  final String letter;
  final String name;
  final String sound;
  final int order;
  final List<WordExample> examples;
  final String? finalForm; // For letters with final forms (ך, ם, ן, ף, ץ)

  const HebrewLetter({
    required this.letter,
    required this.name,
    required this.sound,
    required this.order,
    required this.examples,
    this.finalForm,
  });

  String get nameAudioPath => 'assets/audio/letters/${letter}_name.mp3';
  String get soundAudioPath => 'assets/audio/letters/${letter}_sound.mp3';
  String get imagePath => 'assets/images/letters/$letter.png';

  /// Check if this letter has a final form
  bool get hasFinalForm => finalForm != null;
}

/// Example word for a letter
class WordExample {
  final String word;
  final String translation;
  final String imageAsset;

  const WordExample({
    required this.word,
    required this.translation,
    required this.imageAsset,
  });

  String get imagePath => 'assets/images/words/$imageAsset';
  String get audioPath => 'assets/audio/words/$word.mp3';
}
