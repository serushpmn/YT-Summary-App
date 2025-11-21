export enum Language {
  PERSIAN = 'Persian',
  ENGLISH = 'English',
  GERMAN = 'German',
}

export enum ProficiencyLevel {
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
}

export enum WordCount {
  SHORT = 100,
  MEDIUM = 300,
  LONG = 600, // Interpreting the 3rd option as a longer format since "100" was repeated in prompt
}

export interface GenerationRequest {
  text: string;
  language: Language;
  level: ProficiencyLevel;
  wordCount: WordCount;
}

export interface LanguageOption {
  id: Language;
  label: string;
  isDefault?: boolean;
}