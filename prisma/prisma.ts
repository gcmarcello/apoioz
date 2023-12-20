import { hashInfo } from "@/_shared/utils/bCrypt";
import { compareEnv } from "@/_shared/utils/settings";
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
    query: {
      user: {
        async create({ model, operation, args, query }) {
          const password = args.data.password;
          if (password) {
            args.data.password = await hashInfo(password);
          }
          return query(args);
        },
        async findFirst({ model, operation, args, query }) {
          const user = await query(args);

          if (user && user.password !== undefined) {
            user.password = "******";
          }

          return user;
        },
      },
    },
  });
};

declare global {
  var prisma: ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma! ?? prismaClientSingleton()!;

if (!compareEnv("NODE_ENV", "production")) globalThis.prisma = prisma;
