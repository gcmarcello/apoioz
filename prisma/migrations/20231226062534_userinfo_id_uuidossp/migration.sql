-- AlterTable
ALTER TABLE "public"."UserInfo" ALTER COLUMN "id" SET DEFAULT extensions.uuid_generate_v4();
