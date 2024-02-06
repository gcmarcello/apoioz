-- AlterTable
ALTER TABLE "elections"."Address" ADD COLUMN     "zoneId" UUID;

-- AlterTable
ALTER TABLE "public"."Supporter" ADD COLUMN     "addressId" UUID;

-- AlterTable
ALTER TABLE "public"."UserInfo" ADD COLUMN     "addressId" UUID;

-- AddForeignKey
ALTER TABLE "public"."UserInfo" ADD CONSTRAINT "UserInfo_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "elections"."Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Supporter" ADD CONSTRAINT "Supporter_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "elections"."Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "elections"."Address" ADD CONSTRAINT "FK_3c6b0b0b0b2c4c0f2f2f2f2f2f2" FOREIGN KEY ("zoneId") REFERENCES "elections"."Zone"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
