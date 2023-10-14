-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "address" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
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
CREATE TABLE "city" (
    "id" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "stateId" VARCHAR NOT NULL,

    CONSTRAINT "PK_74346041a3332b7880d76c610f3" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "city_to_zone" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "cityId" VARCHAR NOT NULL,
    "zoneId" UUID NOT NULL,

    CONSTRAINT "PK_a48d0744c1d2890620d19665086" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "section" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "number" VARCHAR NOT NULL,
    "addressId" UUID,
    "zoneId" UUID NOT NULL,

    CONSTRAINT "PK_c4cd691e8a76eaaffa862f0fb25" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "state" (
    "id" VARCHAR NOT NULL,
    "code" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "PK_be2ef64a21d36522aa1ecb24886" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zone" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "number" VARCHAR NOT NULL,
    "stateId" VARCHAR NOT NULL,

    CONSTRAINT "PK_3a6cfcf317ea20ea08421eab0a5" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "FK_3624b3085165071df70276a4000" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "city" ADD CONSTRAINT "FK_e99de556ee56afe72154f3ed04a" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "city_to_zone" ADD CONSTRAINT "FK_1408688a13ad486e02cf6a50a03" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "city_to_zone" ADD CONSTRAINT "FK_ef5c307ae0af73209fd208026a5" FOREIGN KEY ("zoneId") REFERENCES "zone"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "section" ADD CONSTRAINT "FK_3ff69a4fa9a649daf3fa869bcbc" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "section" ADD CONSTRAINT "FK_deab69c6c23c07560c03943b6aa" FOREIGN KEY ("zoneId") REFERENCES "zone"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "zone" ADD CONSTRAINT "FK_943d589a985354af23c8330abde" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

