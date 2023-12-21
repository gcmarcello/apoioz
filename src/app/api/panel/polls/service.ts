"use server";

import { prisma } from "prisma/prisma";
import { Poll, PollAnswer, Supporter } from "@prisma/client";
import { PollAnswerDto, ReadPollsStats, UpsertPollDto } from "./dto";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { headers } from "next/headers";

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
              active: true,
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

  const pollsVotes = joinPollVotes(polls.flatMap((poll) => poll.PollAnswer)).length;
  const pollsVotesLastWeek = joinPollVotes(
    polls.flatMap((poll) =>
      poll.PollAnswer.filter((answer) =>
        dayjs(answer.createdAt).isBetween(dayjs().subtract(1, "week"), dayjs())
      )
    )
  ).length;

  const pollsVotesChange =
    Math.round(((pollsVotes - pollsVotesLastWeek) / pollsVotesLastWeek) * 100) || 0;
  const pollVotesChangeDirection =
    pollsVotesChange > 0 ? "increase" : pollsVotesChange < 0 ? "decrease" : false;

  const pollNumber = polls.filter((poll) => poll.active).length;
  const pollsLastWeek = polls.filter(
    (poll) =>
      dayjs(poll.createdAt).isBetween(dayjs().subtract(1, "week"), dayjs()) && poll.active
  ).length;
  const pollsChange =
    Math.round(((pollNumber - pollsLastWeek) / pollsLastWeek) * 100) || 0;
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
  const commentsInPollsChange =
    Math.round(
      ((commentsInPolls - commentsInPollsLastWeek) / commentsInPollsLastWeek) * 100
    ) || 0;
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
    orderBy: { createdAt: "desc" },
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
    PollAnswer: joinPollVotes(poll.PollAnswer).length,
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

export async function answerPoll(
  request: PollAnswerDto & { ip?: string; bypassIpCheck?: boolean }
) {
  const poll = await prisma.poll.findUnique({
    where: { id: request.pollId },
    include: { PollQuestion: true },
  });

  if (
    !request.bypassIpCheck &&
    (await verifyExistingVote({
      ip: headers().get("X-Forwarded-For"),
      pollId: request.pollId,
    }))
  ) {
    throw new Error("Você já respondeu esta pesquisa!");
  }

  if (!poll) {
    throw new Error("Pesquisa não encontrada");
  }

  const parsedAnswers = request.questions.map((question) => {
    const questionInfo = poll.PollQuestion.find(
      (item) => item.id === question.questionId
    );

    if (!questionInfo) {
      throw new Error("Pergunta não encontrada");
    }

    if (typeof question.answers.options === "object") {
      const filteredAnswers = Object.keys(question.answers.options).filter(
        (key) => question.answers.options[key]
      );
      if (filteredAnswers.length > 1 && !questionInfo.allowMultipleAnswers) {
        throw new Error("Você só pode selecionar uma opção para essa pergunta");
      }
      question.answers.options = filteredAnswers;
    } else {
      question.answers.options = [question.answers.options];
    }

    return {
      pollId: request.pollId,
      questionId: question.questionId,
      supporterId: question.supporterId,
      answer: question.answers,
      ip: request.ip,
    };
  });

  const pollAnswer = await prisma.pollAnswer.createMany({
    data: parsedAnswers,
  });

  return pollAnswer;
}

function joinPollVotes(pollAnswers: PollAnswer[]): PollAnswer[] {
  return pollAnswers.reduce((acc, curr) => {
    const existingAnswer = acc.find(
      (answer) =>
        answer.pollId === curr.pollId &&
        (answer.supporterId === curr.supporterId || answer.ip === curr.ip)
    );
    if (existingAnswer) {
      existingAnswer.answer += curr.answer;
    } else {
      acc.push(curr);
    }
    return acc;
  }, []);
}
