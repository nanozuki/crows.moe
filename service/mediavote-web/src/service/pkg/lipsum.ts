// generate lipsum works' name

// charactor range:
//    1. 4E00-62FF, 5376 characters
//    2. 6300-77FF, 5376 characters
//    So, random number from 0 to 10752, then convert to charactor
// length range:
//    2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 7, 8, 9, 10
function chineseLipsum(): string {
  const wordLength = [2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 8, 9, 10];
  const length = wordLength[Math.floor(Math.random() * wordLength.length)];
  const charactors = [
    { min: 0x4e00, max: 0x62ff },
    { min: 0x6300, max: 0x77ff },
  ];
  const charactorsCount = charactors.reduce((acc, cur) => acc + cur.max - cur.min + 1, 0);
  const generateChar = (): string => {
    let charactorIndex = Math.floor(Math.random() * charactorsCount);
    let charactor = '';
    for (const range of charactors) {
      if (charactorIndex >= range.max - range.min + 1) {
        charactorIndex -= range.max - range.min + 1;
      } else {
        charactor = String.fromCharCode(range.min + charactorIndex);
        break;
      }
    }
    return charactor;
  };
  const chars = [];
  for (let i = 0; i < length; i++) {
    chars.push(generateChar());
  }
  return chars.join('');
}

function japaneseLipsum(): string {
  const wordLength = [2, 2, 3, 3, 3, 4, 4, 4, 5, 5];
  const length = wordLength[Math.floor(Math.random() * wordLength.length)];
  const charactors = [
    { min: 0x3041, max: 0x3096 }, // hiragana
    { min: 0x30a1, max: 0x30fa }, // katakana
    { min: 0x4e00, max: 0x62ff },
    { min: 0x6300, max: 0x77ff },
  ];
  const generateChar = (): string => {
    const set = charactors[Math.floor(Math.random() * charactors.length)];
    const charCount = set.max - set.min + 1;
    const charactorIndex = Math.floor(Math.random() * charCount);
    return String.fromCharCode(set.min + charactorIndex);
  };
  const chars = [];
  for (let i = 0; i < length; i++) {
    chars.push(generateChar());
  }
  return chars.join('');
}

function englishLipsum(): string {
  const wordsCountTable = [1, 1, 1, 1, 2, 2, 2, 3];
  const wordLengthTable = [3, 4, 5, 6, 7, 8];
  const charsTable = 'abcdefghijklmnopqrstuvwxyz';
  const wordsCount = wordsCountTable[Math.floor(Math.random() * wordsCountTable.length)];
  const words = [];
  for (let i = 0; i < wordsCount; i++) {
    const wordLength = wordLengthTable[Math.floor(Math.random() * wordLengthTable.length)];
    const chars = [];
    for (let j = 0; j < wordLength; j++) {
      const charIndex = Math.floor(Math.random() * charsTable.length);
      if (j === 0) {
        chars.push(charsTable[charIndex].toUpperCase());
      } else {
        chars.push(charsTable[charIndex]);
      }
    }
    words.push(chars.join(''));
  }
  return words.join(' ');
}
