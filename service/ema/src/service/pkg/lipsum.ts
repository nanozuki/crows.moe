// generate lipsum works' name

// character range:
//    1. 4E00-62FF, 5376 characters
//    2. 6300-77FF, 5376 characters
//    So, random number from 0 to 10752, then convert to character
// length range:
//    2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 7, 8, 9, 10
export function chineseLipsum(): string {
  const wordLength = [2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 8, 9, 10];
  const length = wordLength[Math.floor(Math.random() * wordLength.length)];
  const characters = [
    { min: 0x4e00, max: 0x62ff },
    { min: 0x6300, max: 0x77ff },
  ];
  const charactersCount = characters.reduce((acc, cur) => acc + cur.max - cur.min + 1, 0);
  const generateChar = (): string => {
    let characterIndex = Math.floor(Math.random() * charactersCount);
    let character = '';
    for (const range of characters) {
      if (characterIndex >= range.max - range.min + 1) {
        characterIndex -= range.max - range.min + 1;
      } else {
        character = String.fromCharCode(range.min + characterIndex);
        break;
      }
    }
    return character;
  };
  const chars = [];
  for (let i = 0; i < length; i++) {
    chars.push(generateChar());
  }
  return chars.join('');
}

export function japaneseLipsum(): string {
  const wordLength = [2, 2, 3, 3, 3, 4, 4, 4, 5, 5];
  const length = wordLength[Math.floor(Math.random() * wordLength.length)];
  const characters = [
    { min: 0x3041, max: 0x3096 }, // hiragana
    { min: 0x30a1, max: 0x30fa }, // katakana
    { min: 0x4e00, max: 0x62ff },
    { min: 0x6300, max: 0x77ff },
  ];
  const generateChar = (): string => {
    const set = characters[Math.floor(Math.random() * characters.length)];
    const charCount = set.max - set.min + 1;
    const characterIndex = Math.floor(Math.random() * charCount);
    return String.fromCharCode(set.min + characterIndex);
  };
  const chars = [];
  for (let i = 0; i < length; i++) {
    chars.push(generateChar());
  }
  return chars.join('');
}

export function englishLipsum(): string {
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
