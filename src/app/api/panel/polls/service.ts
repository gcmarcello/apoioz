"use server";

import prisma from "prisma/prisma";
import { CreatePollDto } from "./dto";
import { Supporter } from "@prisma/client";

export async function listPolls(request) {
  const fetchPolls = await prisma.poll.findMany({
    where: { campaignId: request.campaignId },
    include: { PollQuestion: { include: { PollOption: true } }, PollAnswer: true },
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
    include: { PollQuestion: { include: { PollOption: true } } },
  });

  return poll;
}

export async function deletePoll(request) {
  const poll = await prisma.poll.delete({ where: { id: request.id } });
  return poll;
}

export async function updatePoll(request) {
  const poll = await prisma.poll.update({
    where: { id: request.id },
    data: request,
  });
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
            })),
          },
        })),
      },
    },
  });

  return poll;
}
