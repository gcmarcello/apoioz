import prisma from "prisma/prisma";

export async function listPolls(request) {
  return await prisma.poll.findMany({ where: { campaignId: request.campaignId } });
}

export async function createPoll(request) {
  const poll = await prisma.poll.create({
    data: {
      ...request.data.poll,
      campaignId: request.supporterSession.campaignId,
    },
  });

  if (request.questions) {
    await prisma.pollQuestion.createMany({
      data: request.questions,
    });
  }

  if (request.options) {
    await prisma.pollOption.createMany({
      data: request.options,
    });
  }

  return poll;
}
