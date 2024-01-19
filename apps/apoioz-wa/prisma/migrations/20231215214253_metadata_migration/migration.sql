/*
  Warnings:

  - You are about to drop the `QRCode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."QRCode";

-- CreateTable
CREATE TABLE "public"."Metadata" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Metadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Metadata_slug_key" ON "public"."Metadata"("key");
