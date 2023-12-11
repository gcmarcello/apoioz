"use server";

import prisma from "prisma/prisma";
import { Poll, Supporter } from "@prisma/client";
import { PollAnswerDto, ReadPollsStats, UpsertPollDto } from "./dto";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { ActionResponse } from "../../_shared/utils/ActionResponse";

dayjs.extend(isBetween);

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

export async function readPoll(request: { id: string }) {
  const poll = await prisma.poll.findFirst({
    where: {
      id: request.id,
      active: true,
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

export async function readPollsStats(request: {
  campaignId: string;
}): Promise<ReadPollsStats> {
  const polls = await prisma.poll.findMany({
    where: { campaignId: request.campaignId },
    include: {
      PollAnswer: true,
      PollQuestion: true,
    },
  });

  const pollsVotes =
    polls.flatMap((poll) => poll.PollAnswer).length /
    polls.flatMap((poll) => poll.PollQuestion).length;
  const pollsVotesLastWeek =
    polls.flatMap((poll) =>
      poll.PollAnswer.filter((answer) =>
        dayjs(answer.createdAt).isBetween(dayjs().subtract(1, "week"), dayjs())
      )
    ).length / polls.flatMap((poll) => poll.PollQuestion).length;
  const pollsVotesChange = Math.round(
    ((pollsVotes - pollsVotesLastWeek) / pollsVotesLastWeek) * 100
  );
  const pollVotesChangeDirection =
    pollsVotesChange > 0 ? "increase" : pollsVotesChange < 0 ? "decrease" : false;

  const pollNumber = polls.filter((poll) => poll.active).length;
  const pollsLastWeek = polls.filter(
    (poll) =>
      dayjs(poll.createdAt).isBetween(dayjs().subtract(1, "week"), dayjs()) && poll.active
  ).length;
  const pollsChange = Math.round(((pollNumber - pollsLastWeek) / pollsLastWeek) * 100);
  const pollsChangeDirection =
    pollsChange > 0 ? "increase" : pollsChange < 0 ? "decrease" : false;

  const commentsInPolls = polls
    .flatMap((poll) => poll.PollAnswer)
    .filter((answer) => (answer.answer as any).freeAnswer).length;
  const commentsInPollsLastWeek = polls
    .flatMap((poll) =>
      poll.PollAnswer.filter((answer) =>
        dayjs(answer.createdAt).isBetween(dayjs().subtract(1, "week"), dayjs())
      )
    )
    .filter((answer) => (answer.answer as any).freeAnswer).length;
  const commentsInPollsChange = Math.round(
    ((commentsInPolls - commentsInPollsLastWeek) / commentsInPollsLastWeek) * 100
  );
  const commentsInPollsChangeDirection =
    commentsInPollsChange > 0
      ? "increase"
      : commentsInPollsChange < 0
      ? "decrease"
      : false;

  return [
    {
      name: "Votos",
      stat: pollsVotes,
      previousStat: pollsVotesLastWeek,
      change: pollsVotesChange,
      changeType: pollVotesChangeDirection,
      changeText: "na última semana",
    },
    {
      name: "Pesquisas Ativas",
      stat: pollNumber,
      previousStat: pollsLastWeek,
      change: pollsChange,
      changeType: pollsChangeDirection,
      changeText: "na última semana",
    },
    {
      name: "Comentários",
      stat: commentsInPolls,
      previousStat: commentsInPollsLastWeek,
      change: commentsInPollsChange,
      changeType: commentsInPollsChangeDirection,
      changeText: "na última semana",
    },
  ];
}

export async function readPollWithAnswers(request: { id: string }) {
  const poll = await prisma.poll.findFirst({
    where: {
      id: request.id,
      active: true,
    },
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

  return { poll, answers };
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

export async function deletePoll(request) {
  const poll = await prisma.poll.delete({ where: { id: request.id } });
  return poll;
}

export async function answerPoll(request: PollAnswerDto[]) {
  try {
    const poll = await prisma.poll.findUnique({
      where: { id: request[0].pollId },
      include: { PollQuestion: true },
    });

    if (!poll) {
      throw new Error("Pesquisa não encontrada");
    }

    const parseAnswer = request.map((item) => {
      const options = item.answers.options;
      if (!options) {
        return [];
      }
      return typeof options === "string"
        ? [options]
        : Object.keys(options).filter((key) => options[key]);
    });

    const pollAnswer = await prisma.pollAnswer.createMany({
      data: request.map((item, index) => ({
        pollId: item.pollId,
        questionId: item.questionId,
        supporterId: item.supporterId,
        answer: { ...item.answers, options: parseAnswer[index] },
      })),
    });

    return ActionResponse.success({
      data: pollAnswer,
    });
  } catch (err) {
    return ActionResponse.error(err);
  }
}
