const englishToPersianDigitMap: {[key: string]: string} = {
  '0': '\u06F0',
  '1': '\u06F1',
  '2': '\u06F2',
  '3': '\u06F3',
  '4': '\u06F4',
  '5': '\u06F5',
  '6': '\u06F6',
  '7': '\u06F7',
  '8': '\u06F8',
  '9': '\u06F9',
};

export function convertToPersianDigit(str: string) {
  return str.replace(/\d/g, numChar => englishToPersianDigitMap[numChar]);
}
