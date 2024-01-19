/*
  Warnings:

  - A unique constraint covering the columns `[announcementsGroupId]` on the table `Community` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Community" ADD COLUMN     "announcementsGroupId" TEXT;

-- CreateTable
CREATE TABLE "public"."QRCode" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "QRCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QRCode_code_key" ON "public"."QRCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Community_announcementsGroupId_key" ON "public"."Community"("announcementsGroupId");
