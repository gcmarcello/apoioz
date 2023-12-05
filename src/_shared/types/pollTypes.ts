export interface PollQuestionOptionType {
  id?: string;
  name: string;
  active: boolean;
}

export interface PollQuestionType {
  id?: string;
  question: string;
  allowMultipleAnswers: boolean;
  allowFreeAnswer: boolean;
  active: boolean;
  options: PollQuestionOptionType[];
}
export interface PollType {
  title: string;
  activeAtSignUp: boolean;
  questions: PollQuestionType[];
  active: boolean;
  id?: string;
}
