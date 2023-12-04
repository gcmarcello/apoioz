"use server";

import prisma from "prisma/prisma";
import { CreatePollDto } from "./dto";
import { Supporter } from "@prisma/client";

export async function listPolls(request) {
  const fetchPolls = await prisma.poll.findMany({
    where: { campaignId: request.campaignId },
    include: {
      PollQuestion: {
        where: { disabled: false },
        include: { PollOption: { where: { disabled: false } } },
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
        where: { disabled: false },
        include: { PollOption: { where: { disabled: false } } },
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

  // Update the main poll properties
  operations.push(
    prisma.poll.update({
      where: { id: rest.id },
      data: {
        activeAtSignUp: rest.activeAtSignUp,
        title: rest.title,
      },
    })
  );

  for (const question of rest.questions) {
    let questionOperation;
    if (question.id) {
      questionOperation = prisma.pollQuestion.update({
        where: { id: question.id },
        data: {
          allowFreeAnswer: question.allowFreeAnswer,
          allowMultipleAnswers: question.allowMultipleAnswers,
          question: question.question,
        },
      });
    } else {
      questionOperation = prisma.pollQuestion.create({
        data: {
          allowFreeAnswer: question.allowFreeAnswer,
          allowMultipleAnswers: question.allowMultipleAnswers,
          question: question.question,
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
            disabled: option.disabled,
          },
        });
      } else {
        optionOperation = prisma.pollOption.create({
          data: {
            name: option.name,
            disabled: false,
            questionId: question.id,
          },
        });
      }
      operations.push(optionOperation);
    }
  }

  // Execute all operations in a transaction
  const poll = await prisma.$transaction(operations);
  return poll;
}

export async function createPoll(
  request: CreatePollDto & { supporterSession: Supporter }
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
      PollQuestion: {
        create: request.questions.map((question) => ({
          allowFreeAnswer: question.allowFreeAnswer,
          allowMultipleAnswers: question.allowMultipleAnswers,
          question: question.question,
          PollOption: {
            create: question.options.map((option) => ({
              name: option.name,
              disabled: false,
            })),
          },
        })),
      },
    },
  });

  return poll;
}
