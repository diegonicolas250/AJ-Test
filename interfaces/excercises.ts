export interface Answer {
  word: string;
  correct: boolean;
}

export interface Exercise {
  sentenceEnglish: string;
  sentenceGerman: string;
  answer: Answer[];
}
