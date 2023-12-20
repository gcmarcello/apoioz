-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "elections";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "extensions";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "polls";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

-- CreateEnum
CREATE TYPE "public"."CampaignTypes" AS ENUM ('conselheiro_tutelar', 'vereador', 'prefeito', 'deputado_estadual', 'deputado_federal', 'senador', 'governador', 'presidente');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserInfo" (
    "userId" UUID NOT NULL,
    "partyId" TEXT,
    "zoneId" UUID,
    "sectionId" UUID,
    "birthDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserInfo_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "elections"."Party" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "ideology" TEXT NOT NULL,

    CONSTRAINT "Party_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Campaign" (
    "id" UUID NOT NULL,
    "options" JSONB,
    "name" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,
    "cityId" VARCHAR,
    "stateId" VARCHAR,
    "type" "public"."CampaignTypes" NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Supporter" (
    "id" UUID NOT NULL,
    "campaignId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "referralId" UUID,
    "level" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sectionId" UUID,
    "zoneId" UUID,

    CONSTRAINT "Supporter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SupporterGroup" (
    "id" UUID NOT NULL,
    "ownerId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupporterGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SupporterGroupMembership" (
    "supporterId" UUID NOT NULL,
    "supporterGroupId" UUID NOT NULL,
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupporterGroupMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" TEXT NOT NULL,
    "location" VARCHAR NOT NULL,
    "dateStart" TIMESTAMPTZ(3) NOT NULL,
    "dateEnd" TIMESTAMPTZ(3) NOT NULL,
    "campaignId" UUID NOT NULL,
    "hostId" UUID NOT NULL,
    "status" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "observations" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InviteCode" (
    "id" UUID NOT NULL,
    "campaignId" UUID NOT NULL,
    "referralId" UUID NOT NULL,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "enteredAt" TIMESTAMPTZ(3),
    "submittedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InviteCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elections"."Address" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "lat" VARCHAR,
    "lng" VARCHAR,
    "address" VARCHAR,
    "location" VARCHAR,
    "neighborhood" VARCHAR,
    "zipcode" VARCHAR,
    "cityId" VARCHAR NOT NULL,

    CONSTRAINT "PK_2a6880f71a7f8d1c677bb2a32a8" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elections"."City" (
    "id" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "stateId" VARCHAR NOT NULL,

    CONSTRAINT "PK_74346041a3332b7880d76c610f3" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elections"."City_To_Zone" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "cityId" VARCHAR NOT NULL,
    "zoneId" UUID NOT NULL,

    CONSTRAINT "PK_a48d0744c1d2890620d19665086" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elections"."Section" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "number" INTEGER NOT NULL,
    "addressId" UUID,
    "zoneId" UUID NOT NULL,

    CONSTRAINT "PK_c4cd691e8a76eaaffa862f0fb25" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elections"."State" (
    "id" VARCHAR NOT NULL,
    "code" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "PK_be2ef64a21d36522aa1ecb24886" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elections"."Zone" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "number" INTEGER NOT NULL,
    "stateId" VARCHAR NOT NULL,
    "geoJSON" JSONB,

    CONSTRAINT "PK_3a6cfcf317ea20ea08421eab0a5" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elections"."Neighborhood" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "name" VARCHAR NOT NULL,
    "cityId" VARCHAR NOT NULL,
    "geoJSON" JSONB,

    CONSTRAINT "Neighborhood_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PasswordRecovery" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordRecovery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "polls"."Poll" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "title" VARCHAR NOT NULL,
    "campaignId" UUID NOT NULL,
    "activeAtSignUp" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "polls"."PollQuestion" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "pollId" UUID,
    "question" VARCHAR NOT NULL,
    "allowMultipleAnswers" BOOLEAN NOT NULL DEFAULT false,
    "allowFreeAnswer" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PollQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "polls"."PollOption" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "questionId" UUID,
    "name" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PollOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "polls"."PollAnswer" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "answer" JSONB,
    "pollId" UUID NOT NULL,
    "questionId" UUID NOT NULL,
    "supporterId" UUID,
    "ip" VARCHAR,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PollAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "public"."User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "UserInfo_userId_key" ON "public"."UserInfo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Party_id_key" ON "elections"."Party"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Party_number_key" ON "elections"."Party"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_slug_key" ON "public"."Campaign"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SupporterGroup_ownerId_key" ON "public"."SupporterGroup"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Neighborhood_id_key" ON "elections"."Neighborhood"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Poll_id_key" ON "polls"."Poll"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PollQuestion_id_key" ON "polls"."PollQuestion"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PollOption_id_key" ON "polls"."PollOption"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PollAnswer_id_key" ON "polls"."PollAnswer"("id");

-- AddForeignKey
ALTER TABLE "public"."UserInfo" ADD CONSTRAINT "UserInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserInfo" ADD CONSTRAINT "UserInfo_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "elections"."Party"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserInfo" ADD CONSTRAINT "UserInfo_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "elections"."Zone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserInfo" ADD CONSTRAINT "UserInfo_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "elections"."Section"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Campaign" ADD CONSTRAINT "Campaign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Campaign" ADD CONSTRAINT "Campaign_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "elections"."City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Campaign" ADD CONSTRAINT "Campaign_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "elections"."State"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Supporter" ADD CONSTRAINT "Supporter_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Supporter" ADD CONSTRAINT "Supporter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Supporter" ADD CONSTRAINT "Supporter_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "public"."Supporter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Supporter" ADD CONSTRAINT "Supporter_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "elections"."Section"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Supporter" ADD CONSTRAINT "Supporter_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "elections"."Zone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupporterGroup" ADD CONSTRAINT "SupporterGroup_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."Supporter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupporterGroupMembership" ADD CONSTRAINT "SupporterGroupMembership_supporterId_fkey" FOREIGN KEY ("supporterId") REFERENCES "public"."Supporter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupporterGroupMembership" ADD CONSTRAINT "SupporterGroupMembership_supporterGroupId_fkey" FOREIGN KEY ("supporterGroupId") REFERENCES "public"."SupporterGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "public"."Supporter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InviteCode" ADD CONSTRAINT "InviteCode_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InviteCode" ADD CONSTRAINT "InviteCode_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "public"."Supporter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "elections"."Address" ADD CONSTRAINT "FK_3624b3085165071df70276a4000" FOREIGN KEY ("cityId") REFERENCES "elections"."City"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "elections"."City" ADD CONSTRAINT "FK_e99de556ee56afe72154f3ed04a" FOREIGN KEY ("stateId") REFERENCES "elections"."State"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "elections"."City_To_Zone" ADD CONSTRAINT "FK_1408688a13ad486e02cf6a50a03" FOREIGN KEY ("cityId") REFERENCES "elections"."City"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "elections"."City_To_Zone" ADD CONSTRAINT "FK_ef5c307ae0af73209fd208026a5" FOREIGN KEY ("zoneId") REFERENCES "elections"."Zone"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "elections"."Section" ADD CONSTRAINT "FK_3ff69a4fa9a649daf3fa869bcbc" FOREIGN KEY ("addressId") REFERENCES "elections"."Address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "elections"."Section" ADD CONSTRAINT "FK_deab69c6c23c07560c03943b6aa" FOREIGN KEY ("zoneId") REFERENCES "elections"."Zone"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "elections"."Zone" ADD CONSTRAINT "FK_943d589a985354af23c8330abde" FOREIGN KEY ("stateId") REFERENCES "elections"."State"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "elections"."Neighborhood" ADD CONSTRAINT "Neighborhood_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "elections"."City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PasswordRecovery" ADD CONSTRAINT "PasswordRecovery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "polls"."Poll" ADD CONSTRAINT "Poll_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "polls"."PollQuestion" ADD CONSTRAINT "PollQuestion_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "polls"."Poll"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "polls"."PollOption" ADD CONSTRAINT "PollOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "polls"."PollQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "polls"."PollAnswer" ADD CONSTRAINT "PollAnswer_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "polls"."Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "polls"."PollAnswer" ADD CONSTRAINT "PollAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "polls"."PollQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "polls"."PollAnswer" ADD CONSTRAINT "PollAnswer_supporterId_fkey" FOREIGN KEY ("supporterId") REFERENCES "public"."Supporter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
