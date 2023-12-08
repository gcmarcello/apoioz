"use server";

import prisma from "prisma/prisma";
import { Poll, Supporter } from "@prisma/client";
import { PollAnswerDto, UpsertPollDto } from "./dto";

export async function readPolls(request) {
  const fetchPolls = await prisma.poll.findMany({
    where: { campaignId: request.campaignId },
    include: {
      PollQuestion: {
        where: { active: true },
        include: { PollOption: { where: { active: true } } },
      },
      PollAnswer: true,
    },
  });
  const polls = fetchPolls.map((poll) => ({
    ...poll,
    PollQuestion: poll.PollQuestion.length,
    PollAnswer: poll.PollAnswer.length / poll.PollQuestion.length,
  }));
  return polls;
}

export async function readPoll(request: { id: string }) {
  const poll = await prisma.poll.findUnique({
    where: { id: request.id },
    include: {
      PollQuestion: {
        where: { active: true },
        include: {
          PollOption: { where: { active: true } },
          PollAnswer: {
            include: {
              supporter: { select: { id: true, user: { select: { name: true } } } },
            },
          },
        },
      },
    },
  });

  if (!poll) {
    throw new Error("Pesquisa não encontrada");
  }

  const questionAnswers = poll.PollQuestion.map((question) => {
    const answers = question.PollAnswer.map((answer) => {
      return {
        supporter: { id: answer.supporter?.id, name: answer.supporter?.user.name },
        options: (answer.answer as any).options.map((option) => ({
          id: option,
          name: question.PollOption.find((o) => o.id === option)?.name,
        })),
      };
    });

    return {
      questionId: question.id,
      question: question.question,
      options: question.PollOption.map((option) => ({
        id: option.id,
        name: option.name,
      })),
      answers: answers,
    };
  });

  return {
    title: poll.title,
    questions: questionAnswers,
  };
}

export async function readPollAnswers(request: { id: string }) {
  const poll = await prisma.poll.findUnique({
    where: { id: request.id },
    include: { PollQuestion: { include: { PollOption: true } } },
  });
  const answers = await prisma.pollAnswer.findMany({
    where: { pollId: request.id },
    include: {
      PollQuestion: { select: { question: true } },
      supporter: {
        select: {
          id: true,
          level: true,
          user: {
            select: {
              name: true,
              info: {
                select: {
                  Section: {
                    select: { Address: { select: { neighborhood: true } } },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const joinedAnswers = answers.reduce((acc, answer) => {
    const supporterId = answer.supporter?.id;
    const questionId = answer.questionId;
    if (!acc[supporterId]) {
      acc[supporterId] = {
        supporter: answer.supporter || {
          user: {
            name: "Anônimo",
            info: { Section: { Address: { neighborhood: "Anônimo" } } },
          },
        },
        answers: [],
        parsedAnswers: {},
      };
    }
    acc[supporterId].answers.push(answer);
    const answerString = (answer.answer as any).options
      .map(
        (option) =>
          poll.PollQuestion.find((q) => q.id === questionId)?.PollOption.find(
            (o) => o.id === option
          )?.name
      )
      .join(", ");
    acc[supporterId].parsedAnswers[questionId] = answerString;
    acc[supporterId].parsedAnswers[`${questionId}_freeAnswer`] =
      (answer.answer as any).freeAnswer || "";
    return acc;
  }, {});

  return Object.values(joinedAnswers);
}

export async function readPollToUpdate(request: { id: string }) {
  const poll = await prisma.poll.findUnique({
    where: { id: request.id },
    include: {
      PollQuestion: {
        where: { active: true },
        include: {
          PollOption: { where: { active: true } },
        },
      },
    },
  });
  return poll;
}

export async function readActivePoll(request) {
  const poll = await prisma.poll.findFirst({
    where: {
      campaignId: request.campaignId,
      active: true,
      activeAtSignUp: true,
    },
    include: {
      PollQuestion: {
        where: { active: true },
        include: { PollOption: { where: { active: true } } },
      },
    },
  });

  return poll;
}

export async function deletePoll(request) {
  const poll = await prisma.poll.delete({ where: { id: request.id } });
  return poll;
}

export async function updatePoll(request) {
  const { userSession, supporterSession, ...rest } = request;
  const operations = [];
  let whereCondition: any = { campaignId: rest.campaignId };

  if (rest.activeAtSignUp && rest.id) {
    whereCondition.id = { not: rest.id };
  }

  if (rest.activeAtSignUp) {
    operations.push(
      prisma.poll.updateMany({
        where: whereCondition,
        data: { activeAtSignUp: false },
      })
    );
  }

  for (const question of rest.questions) {
    let questionUUID: string | undefined;
    let questionOperation: any;
    if (question.id) {
      questionOperation = prisma.pollQuestion.update({
        where: { id: question.id },
        data: {
          allowFreeAnswer: question.allowFreeAnswer,
          allowMultipleAnswers: question.allowMultipleAnswers,
          question: question.question,
          active: question.active,
        },
      });
    } else {
      questionUUID = crypto.randomUUID();
      questionOperation = prisma.pollQuestion.create({
        data: {
          id: questionUUID,
          allowFreeAnswer: question.allowFreeAnswer,
          allowMultipleAnswers: question.allowMultipleAnswers,
          question: question.question,
          active: true,
          pollId: rest.id,
        },
      });
    }
    operations.push(questionOperation);

    for (const option of question.options) {
      let optionOperation;
      if (option.id) {
        optionOperation = prisma.pollOption.update({
          where: { id: option.id },
          data: {
            name: option.name,
            active: option.active,
          },
        });
      } else {
        optionOperation = prisma.pollOption.create({
          data: {
            name: option.name,
            active: true,
            questionId: question.id || questionUUID,
          },
        });
      }
      operations.push(optionOperation);
    }
  }
  // Execute all operations in a transaction
  const poll = await prisma.$transaction<Poll>(operations as any);
  return poll;
}

export async function createPoll(
  request: UpsertPollDto & { supporterSession: Supporter }
) {
  if (request.activeAtSignUp) {
    await prisma.poll.updateMany({
      where: { campaignId: request.supporterSession.campaignId },
      data: { activeAtSignUp: false },
    });
  }

  const poll = await prisma.poll.create({
    data: {
      campaignId: request.supporterSession.campaignId,
      title: request.title,
      activeAtSignUp: request.activeAtSignUp,
      PollQuestion: {
        create: request.questions.map((question) => ({
          allowFreeAnswer: question.allowFreeAnswer,
          allowMultipleAnswers: question.allowMultipleAnswers,
          question: question.question,
          PollOption: {
            create: question.options.map((option) => ({
              name: option.name,
              active: false,
            })),
          },
        })),
      },
    },
  });

  return poll;
}

export async function answerPoll(request: PollAnswerDto) {
  const poll = await prisma.poll.findUnique({
    where: { id: request.pollId },
    include: { PollQuestion: true },
  });

  if (!poll) {
    throw new Error("Pesquisa não encontrada");
  }

  const parseAnswer =
    typeof request.answers.options === "string"
      ? [request.answers.options]
      : Object.keys(request.answers.options).filter(
          (key) => request.answers.options[key]
        );

  const pollAnswer = await prisma.pollAnswer.create({
    data: {
      pollId: request.pollId,
      questionId: request.questionId,
      supporterId: request.supporterId,
      answer: { ...request.answers, options: parseAnswer },
    },
  });

  return pollAnswer;
}
