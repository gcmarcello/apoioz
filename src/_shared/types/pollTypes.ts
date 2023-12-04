export interface PollQuestionOptionType {
  id?: string;
  name: string;
  disabled: boolean;
}

export interface PollQuestionType {
  id?: string;
  question: string;
  allowMultipleAnswers: boolean;
  allowFreeAnswer: boolean;
  disabled: boolean;
  options: PollQuestionOptionType[];
}
export interface PollType {
  title: string;
  activeAtSignUp: boolean;
  questions: PollQuestionType[];
  id: string;
}
