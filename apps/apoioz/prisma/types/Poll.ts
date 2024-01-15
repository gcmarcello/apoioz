import { Prisma } from "@prisma/client";

export type PollWithQuestionsWithOptions = Prisma.PollGetPayload<{
  include: { PollQuestion: { include: { PollOption: true } } };
}>;

export type PollQuestionWithOptions = Prisma.PollQuestionGetPayload<{
  include: { PollOption: true };
}>;

export type PollWithAnswers = Prisma.PollGetPayload<{
  include: { PollAnswer: true };
}>;
