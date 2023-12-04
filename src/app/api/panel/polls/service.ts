"use server";

import prisma from "prisma/prisma";
import { Poll, Supporter } from "@prisma/client";
import { UpsertPollDto } from "./dto";

export async function listPolls(request) {
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
    PollAnswer: poll.PollAnswer.length,
  }));
  return polls;
}

export async function getPoll(request) {
  const poll = await prisma.poll.findUnique({
    where: { id: request.id },
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
  let whereCondition: { campaignId: string; id?: { not: string } };

  if (rest.activeAtSignUp) {
    whereCondition = rest.id
      ? {
          campaignId: supporterSession.campaignId,
          id: { not: rest.id },
        }
      : {
          campaignId: supporterSession.campaignId,
        };
  }

  operations.push(
    prisma.poll.updateMany({
      where: whereCondition,
      data: { activeAtSignUp: false },
    })
  );

  operations.push(
    prisma.poll.update({
      where: { id: rest.id },
      data: {
        activeAtSignUp: rest.activeAtSignUp,
        title: rest.title,
        active: rest.active,
      },
    })
  );

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
            questionId: questionUUID,
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
