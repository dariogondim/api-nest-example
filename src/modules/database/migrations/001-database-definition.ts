/*
* Array(Enum) type require special treatment.
* Whenever Sequelize will talk to database it has to typecast Array values with ENUM name.
* So this enum name must follow this pattern enum_<table_name>_<col_name>.
*/

export async function up(sequelize) {
    sequelize.query(`
        BEGIN;

        CREATE EXTENSION unaccent;

        CREATE TABLE "user" (
            "id" SERIAL UNIQUE PRIMARY KEY NOT NULL,
            "mail" VARCHAR(50) UNIQUE NOT NULL,
            "password" VARCHAR(100) NOT NULL,
            "createdAt" TIMESTAMPTZ NOT NULL,
            "updatedAt" TIMESTAMPTZ NOT NULL,
            "deletedAt" TIMESTAMPTZ
        );

        CREATE TYPE "enum_profile_relationType" AS ENUM('investor','employee','liberal_professional','startup_owner','company_owner');

        CREATE TABLE "profile" (
            "userId" INTEGER PRIMARY KEY UNIQUE NOT NULL,
            "name" VARCHAR(100) NOT NULL,
            "xperMentor" BOOL NOT NULL DEFAULT(false),
            "imgAvatar" VARCHAR(255),
            "phone" VARCHAR(13),
            "country" VARCHAR(50),
            "city" VARCHAR(50),
            "company" VARCHAR(50),
            "relationType" "enum_profile_relationType",
            "linkedinProfile" VARCHAR(100),
            "facebookProfile" VARCHAR(100),
            "twitterProfile" VARCHAR(100),
            "instagramProfile" VARCHAR(100),
            "nearbyRadiusDistance" INTEGER NOT NULL DEFAULT(5),
            "createdAt" TIMESTAMPTZ NOT NULL,
            "updatedAt" TIMESTAMPTZ NOT NULL,
            "deletedAt" TIMESTAMPTZ,
            CONSTRAINT "profile_user_id_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id")
        );

        CREATE TABLE "lastLocation" (
            "id" SERIAL UNIQUE PRIMARY KEY NOT NULL,
            "userId" INTEGER NOT NULL REFERENCES "user"("id"),
            "latitude" DECIMAL(10,6) NOT NULL,
            "longitude" DECIMAL(10,6) NOT NULL,
            "createdAt" TIMESTAMPTZ NOT NULL,
            "updatedAt" TIMESTAMPTZ NOT NULL,
            "deletedAt" TIMESTAMPTZ
        );

        CREATE TABLE "historyLocation" (
            "id" SERIAL UNIQUE PRIMARY KEY NOT NULL,
            "userId" INTEGER NOT NULL REFERENCES "user"("id"),
            "latitude" DECIMAL(10,6) NOT NULL,
            "longitude" DECIMAL(10,6) NOT NULL,
            "createdAt" TIMESTAMPTZ NOT NULL,
            "updatedAt" TIMESTAMPTZ NOT NULL,
            "deletedAt" TIMESTAMPTZ
        );

        CREATE TABLE "btModel" (
            "id" SERIAL UNIQUE PRIMARY KEY NOT NULL,
            "userId" INTEGER NOT NULL REFERENCES "user"("id"),
            "purpose" TEXT NOT NULL,
            "valueOffer" TEXT,
            "problemsOpportunities" TEXT,
            "channels" TEXT,
            "journey" TEXT,
            "clients" TEXT,
            "ecosystem" TEXT,
            "processes" TEXT,
            "assets" TEXT,
            "revenue" TEXT,
            "positiveImpacts" TEXT,
            "costs" TEXT,
            "negativeExternalities" TEXT,
            "insights" TEXT,
            "createdAt" TIMESTAMPTZ NOT NULL,
            "updatedAt" TIMESTAMPTZ NOT NULL,
            "deletedAt" TIMESTAMPTZ
        );

        CREATE TABLE "relationship" (
            "id" SERIAL UNIQUE PRIMARY KEY NOT NULL,
            "userId" INTEGER NOT NULL REFERENCES "user"("id"),
            "affiliationId" INTEGER NOT NULL REFERENCES "user"("id"),
            "isActive" BOOLEAN NOT NULL DEFAULT(false),
            "createdAt" TIMESTAMPTZ NOT NULL,
            "updatedAt" TIMESTAMPTZ NOT NULL,
            "deletedAt" TIMESTAMPTZ
        );

        CREATE TABLE "message" (
            "id" BIGSERIAL UNIQUE PRIMARY KEY NOT NULL,
            "senderId" INTEGER NOT NULL REFERENCES "user"("id"),
            "receiverId" INTEGER NOT NULL REFERENCES "user"("id"),
            "content" TEXT NOT NULL,
            "isRead" BOOL NOT NULL DEFAULT(false),
            "createdAt" TIMESTAMPTZ NOT NULL,
            "updatedAt" TIMESTAMPTZ NOT NULL,
            "deletedAt" TIMESTAMPTZ
        );

        CREATE TABLE "ignoredUser" (
            "id" BIGSERIAL UNIQUE PRIMARY KEY NOT NULL,
            "userId" INTEGER NOT NULL REFERENCES "user"("id"),
            "ignoredUserId" INTEGER NOT NULL REFERENCES "user"("id"),
            "createdAt" TIMESTAMPTZ NOT NULL,
            "updatedAt" TIMESTAMPTZ NOT NULL,
            "deletedAt" TIMESTAMPTZ
        );

        CREATE TABLE "userPrivacy" (
            "userId" INTEGER PRIMARY KEY UNIQUE NOT NULL,
            "imgAvatarPublic" BOOL NOT NULL DEFAULT(true),
            "cityPublic" BOOL NOT NULL DEFAULT(true),
            "companyPublic" BOOL NOT NULL DEFAULT(true),
            "relationTypePublic" BOOL NOT NULL DEFAULT(true),
            "linkedinProfilePublic" BOOL NOT NULL DEFAULT(false),
            "facebookProfilePublic" BOOL NOT NULL DEFAULT(false),
            "twitterProfilePublic" BOOL NOT NULL DEFAULT(false),
            "instagramProfilePublic" BOOL NOT NULL DEFAULT(false),
            "createdAt" TIMESTAMPTZ NOT NULL,
            "updatedAt" TIMESTAMPTZ NOT NULL,
            "deletedAt" TIMESTAMPTZ,
            CONSTRAINT "user_privacy_user_id_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id")
        );

        CREATE TABLE "btModelPrivacy" (
            "btModelId" INTEGER PRIMARY KEY UNIQUE NOT NULL,
            "userId" INTEGER NOT NULL REFERENCES "user"("id"),
            "valueOfferPublic" BOOL NOT NULL DEFAULT(false),
            "problemsOpportunitiesPublic" BOOL NOT NULL DEFAULT(false),
            "channelsPublic" BOOL NOT NULL DEFAULT(false),
            "journeyPublic" BOOL NOT NULL DEFAULT(false),
            "clientsPublic" BOOL NOT NULL DEFAULT(false),
            "ecosystemPublic" BOOL NOT NULL DEFAULT(false),
            "processesPublic" BOOL NOT NULL DEFAULT(false),
            "assetsPublic" BOOL NOT NULL DEFAULT(false),
            "revenuePublic" BOOL NOT NULL DEFAULT(false),
            "positiveImpactsPublic" BOOL NOT NULL DEFAULT(false),
            "costsPublic" BOOL NOT NULL DEFAULT(false),
            "negativeExternalitiesPublic" BOOL NOT NULL DEFAULT(false),
            "insightsPublic" BOOL NOT NULL DEFAULT(false),
            "createdAt" TIMESTAMPTZ NOT NULL,
            "updatedAt" TIMESTAMPTZ NOT NULL,
            "deletedAt" TIMESTAMPTZ,
            CONSTRAINT "bt_model_privacy_bt_model_id_fkey" FOREIGN KEY ("btModelId") REFERENCES "btModel"("id")
        );

        CREATE TABLE "notificationUser" (
            "userId" INTEGER PRIMARY KEY UNIQUE NOT NULL,
            "token" TEXT NOT NULL,
            "createdAt" TIMESTAMPTZ NOT NULL,
            "updatedAt" TIMESTAMPTZ NOT NULL,
            "deletedAt" TIMESTAMPTZ,
            CONSTRAINT "user_notification_user_id_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id")
        );

        COMMIT;
    `);
}

export async function down(sequelize) {
    sequelize.query(`
        BEGIN;

        DROP TABLE "notificationUser"
        DROP TABLE "btModelPrivacy";
        DROP TABLE "userPrivacy";
        DROP TABLE "ignoredUser";
        DROP TABLE "messageRecipient";
        DROP TABLE "message";
        DROP TABLE "relationship";
        DROP TABLE "btModel";
        DROP TABLE "lastLocation";
        DROP TABLE "profile";
        DROP TYPE "enum_profile_relationType";
        DROP TABLE "user";

        COMMIT;
    `);
}