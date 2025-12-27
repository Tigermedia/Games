import '../../shared/models/hebrew_letter.dart';

/// All Hebrew letters data
class HebrewLetters {
  HebrewLetters._();

  static const List<HebrewLetter> all = [
    // א - Alef
    HebrewLetter(
      letter: 'א',
      name: 'אָלֶף',
      sound: 'אָ',
      order: 1,
      examples: [
        WordExample(word: 'אַרְיֵה', translation: 'Lion', imageAsset: 'lion.png'),
        WordExample(word: 'אֲבַטִּיחַ', translation: 'Watermelon', imageAsset: 'watermelon.png'),
        WordExample(word: 'אָבָּא', translation: 'Dad', imageAsset: 'dad.png'),
      ],
    ),

    // ב - Bet
    HebrewLetter(
      letter: 'ב',
      name: 'בֵּית',
      sound: 'בְּ',
      order: 2,
      examples: [
        WordExample(word: 'בָּלוֹן', translation: 'Balloon', imageAsset: 'balloon.png'),
        WordExample(word: 'בָּנָנָה', translation: 'Banana', imageAsset: 'banana.png'),
        WordExample(word: 'בַּיִת', translation: 'House', imageAsset: 'house.png'),
      ],
    ),

    // ג - Gimel
    HebrewLetter(
      letter: 'ג',
      name: 'גִּימֶל',
      sound: 'גְּ',
      order: 3,
      examples: [
        WordExample(word: 'גְּלִידָה', translation: 'Ice cream', imageAsset: 'icecream.png'),
        WordExample(word: 'גִּירָפָה', translation: 'Giraffe', imageAsset: 'giraffe.png'),
        WordExample(word: 'גֶּשֶׁם', translation: 'Rain', imageAsset: 'rain.png'),
      ],
    ),

    // ד - Dalet
    HebrewLetter(
      letter: 'ד',
      name: 'דָּלֶת',
      sound: 'דְּ',
      order: 4,
      examples: [
        WordExample(word: 'דְּבוֹרָה', translation: 'Bee', imageAsset: 'bee.png'),
        WordExample(word: 'דֶּלֶת', translation: 'Door', imageAsset: 'door.png'),
        WordExample(word: 'דָּג', translation: 'Fish', imageAsset: 'fish.png'),
      ],
    ),

    // ה - He
    HebrewLetter(
      letter: 'ה',
      name: 'הֵא',
      sound: 'הְ',
      order: 5,
      examples: [
        WordExample(word: 'הַר', translation: 'Mountain', imageAsset: 'mountain.png'),
        WordExample(word: 'הֵלִיקוֹפְּטֶר', translation: 'Helicopter', imageAsset: 'helicopter.png'),
        WordExample(word: 'הוֹרִים', translation: 'Parents', imageAsset: 'parents.png'),
      ],
    ),

    // ו - Vav
    HebrewLetter(
      letter: 'ו',
      name: 'וָו',
      sound: 'וְ',
      order: 6,
      examples: [
        WordExample(word: 'וֶרֶד', translation: 'Rose', imageAsset: 'rose.png'),
        WordExample(word: 'וִילוֹן', translation: 'Curtain', imageAsset: 'curtain.png'),
        WordExample(word: 'וָו', translation: 'Hook', imageAsset: 'hook.png'),
      ],
    ),

    // ז - Zayin
    HebrewLetter(
      letter: 'ז',
      name: 'זַיִן',
      sound: 'זְ',
      order: 7,
      examples: [
        WordExample(word: 'זֶבְּרָה', translation: 'Zebra', imageAsset: 'zebra.png'),
        WordExample(word: 'זִיקוּקִים', translation: 'Fireworks', imageAsset: 'fireworks.png'),
        WordExample(word: 'זָהָב', translation: 'Gold', imageAsset: 'gold.png'),
      ],
    ),

    // ח - Chet
    HebrewLetter(
      letter: 'ח',
      name: 'חֵית',
      sound: 'חְ',
      order: 8,
      examples: [
        WordExample(word: 'חֲמוֹר', translation: 'Donkey', imageAsset: 'donkey.png'),
        WordExample(word: 'חָלָב', translation: 'Milk', imageAsset: 'milk.png'),
        WordExample(word: 'חַלּוֹן', translation: 'Window', imageAsset: 'window.png'),
      ],
    ),

    // ט - Tet
    HebrewLetter(
      letter: 'ט',
      name: 'טֵית',
      sound: 'טְ',
      order: 9,
      examples: [
        WordExample(word: 'טַבָּעַת', translation: 'Ring', imageAsset: 'ring.png'),
        WordExample(word: 'טֵלֶפוֹן', translation: 'Telephone', imageAsset: 'telephone.png'),
        WordExample(word: 'טוֹס', translation: 'Peacock', imageAsset: 'peacock.png'),
      ],
    ),

    // י - Yod
    HebrewLetter(
      letter: 'י',
      name: 'יוֹד',
      sound: 'יְ',
      order: 10,
      examples: [
        WordExample(word: 'יָד', translation: 'Hand', imageAsset: 'hand.png'),
        WordExample(word: 'יֶלֶד', translation: 'Boy', imageAsset: 'boy.png'),
        WordExample(word: 'יַעַר', translation: 'Forest', imageAsset: 'forest.png'),
      ],
    ),

    // כ - Kaf
    HebrewLetter(
      letter: 'כ',
      name: 'כַּף',
      sound: 'כְּ',
      order: 11,
      finalForm: 'ך',
      examples: [
        WordExample(word: 'כֶּלֶב', translation: 'Dog', imageAsset: 'dog.png'),
        WordExample(word: 'כִּיסֵּא', translation: 'Chair', imageAsset: 'chair.png'),
        WordExample(word: 'כּוֹכָב', translation: 'Star', imageAsset: 'star.png'),
      ],
    ),

    // ל - Lamed
    HebrewLetter(
      letter: 'ל',
      name: 'לָמֶד',
      sound: 'לְ',
      order: 12,
      examples: [
        WordExample(word: 'לֵב', translation: 'Heart', imageAsset: 'heart.png'),
        WordExample(word: 'לֶחֶם', translation: 'Bread', imageAsset: 'bread.png'),
        WordExample(word: 'לַיְלָה', translation: 'Night', imageAsset: 'night.png'),
      ],
    ),

    // מ - Mem
    HebrewLetter(
      letter: 'מ',
      name: 'מֵם',
      sound: 'מְ',
      order: 13,
      finalForm: 'ם',
      examples: [
        WordExample(word: 'מַיִם', translation: 'Water', imageAsset: 'water.png'),
        WordExample(word: 'מְכוֹנִית', translation: 'Car', imageAsset: 'car.png'),
        WordExample(word: 'מִטָּה', translation: 'Bed', imageAsset: 'bed.png'),
      ],
    ),

    // נ - Nun
    HebrewLetter(
      letter: 'נ',
      name: 'נוּן',
      sound: 'נְ',
      order: 14,
      finalForm: 'ן',
      examples: [
        WordExample(word: 'נָמֵר', translation: 'Tiger', imageAsset: 'tiger.png'),
        WordExample(word: 'נַעַל', translation: 'Shoe', imageAsset: 'shoe.png'),
        WordExample(word: 'נֵר', translation: 'Candle', imageAsset: 'candle.png'),
      ],
    ),

    // ס - Samech
    HebrewLetter(
      letter: 'ס',
      name: 'סָמֶך',
      sound: 'סְ',
      order: 15,
      examples: [
        WordExample(word: 'סוּס', translation: 'Horse', imageAsset: 'horse.png'),
        WordExample(word: 'סֵפֶר', translation: 'Book', imageAsset: 'book.png'),
        WordExample(word: 'סִירָה', translation: 'Boat', imageAsset: 'boat.png'),
      ],
    ),

    // ע - Ayin
    HebrewLetter(
      letter: 'ע',
      name: 'עַיִן',
      sound: 'עְ',
      order: 16,
      examples: [
        WordExample(word: 'עוּגָה', translation: 'Cake', imageAsset: 'cake.png'),
        WordExample(word: 'עֵץ', translation: 'Tree', imageAsset: 'tree.png'),
        WordExample(word: 'עַכְבָּר', translation: 'Mouse', imageAsset: 'mouse.png'),
      ],
    ),

    // פ - Pe
    HebrewLetter(
      letter: 'פ',
      name: 'פֵּא',
      sound: 'פְּ',
      order: 17,
      finalForm: 'ף',
      examples: [
        WordExample(word: 'פֶּרַח', translation: 'Flower', imageAsset: 'flower.png'),
        WordExample(word: 'פִּיל', translation: 'Elephant', imageAsset: 'elephant.png'),
        WordExample(word: 'פַּרְפַּר', translation: 'Butterfly', imageAsset: 'butterfly.png'),
      ],
    ),

    // צ - Tsadi
    HebrewLetter(
      letter: 'צ',
      name: 'צָדִי',
      sound: 'צְ',
      order: 18,
      finalForm: 'ץ',
      examples: [
        WordExample(word: 'צִפּוֹר', translation: 'Bird', imageAsset: 'bird.png'),
        WordExample(word: 'צָב', translation: 'Turtle', imageAsset: 'turtle.png'),
        WordExample(word: 'צֶבַע', translation: 'Color', imageAsset: 'color.png'),
      ],
    ),

    // ק - Qof
    HebrewLetter(
      letter: 'ק',
      name: 'קוֹף',
      sound: 'קְ',
      order: 19,
      examples: [
        WordExample(word: 'קוֹף', translation: 'Monkey', imageAsset: 'monkey.png'),
        WordExample(word: 'קַשְׁת', translation: 'Rainbow', imageAsset: 'rainbow.png'),
        WordExample(word: 'קִיפּוֹד', translation: 'Hedgehog', imageAsset: 'hedgehog.png'),
      ],
    ),

    // ר - Resh
    HebrewLetter(
      letter: 'ר',
      name: 'רֵישׁ',
      sound: 'רְ',
      order: 20,
      examples: [
        WordExample(word: 'רַכֶּבֶת', translation: 'Train', imageAsset: 'train.png'),
        WordExample(word: 'רֹאשׁ', translation: 'Head', imageAsset: 'head.png'),
        WordExample(word: 'רֶגֶל', translation: 'Leg', imageAsset: 'leg.png'),
      ],
    ),

    // ש - Shin
    HebrewLetter(
      letter: 'ש',
      name: 'שִׁין',
      sound: 'שְׁ',
      order: 21,
      examples: [
        WordExample(word: 'שֶׁמֶשׁ', translation: 'Sun', imageAsset: 'sun.png'),
        WordExample(word: 'שׁוּלְחָן', translation: 'Table', imageAsset: 'table.png'),
        WordExample(word: 'שַׁעַר', translation: 'Gate', imageAsset: 'gate.png'),
      ],
    ),

    // ת - Tav
    HebrewLetter(
      letter: 'ת',
      name: 'תָּו',
      sound: 'תְּ',
      order: 22,
      examples: [
        WordExample(word: 'תַּפּוּחַ', translation: 'Apple', imageAsset: 'apple.png'),
        WordExample(word: 'תּוּת', translation: 'Strawberry', imageAsset: 'strawberry.png'),
        WordExample(word: 'תַּרְנְגוֹל', translation: 'Rooster', imageAsset: 'rooster.png'),
      ],
    ),
  ];

  /// Get a letter by its character
  static HebrewLetter? getByLetter(String letter) {
    try {
      return all.firstWhere((l) => l.letter == letter);
    } catch (e) {
      return null;
    }
  }

  /// Get a letter by its order (1-22)
  static HebrewLetter? getByOrder(int order) {
    try {
      return all.firstWhere((l) => l.order == order);
    } catch (e) {
      return null;
    }
  }

  /// Get letters in a specific range (for unlocking)
  static List<HebrewLetter> getRange(int start, int end) {
    return all.where((l) => l.order >= start && l.order <= end).toList();
  }

  /// Get first N letters (for progressive unlocking)
  static List<HebrewLetter> getFirst(int count) {
    return all.take(count).toList();
  }
}
