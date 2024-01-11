/*
  Warnings:

  - The primary key for the `UserInfo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `UserInfo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[infoId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `infoId` to the `User` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `UserInfo` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "public"."UserInfo" DROP CONSTRAINT "UserInfo_userId_fkey";

-- DropIndex
DROP INDEX "public"."UserInfo_userId_key";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "infoId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "public"."UserInfo" DROP CONSTRAINT "UserInfo_pkey",
DROP COLUMN "userId",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "UserInfo_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_infoId_key" ON "public"."User"("infoId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_infoId_fkey" FOREIGN KEY ("infoId") REFERENCES "public"."UserInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
