/*
  Warnings:

  - You are about to drop the column `videoFileUrl` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the `AboutPageSection` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "public"."MusicTrack" ADD COLUMN     "audioFilePath" TEXT;

-- AlterTable
ALTER TABLE "public"."Video" DROP COLUMN "videoFileUrl";

-- DropTable
DROP TABLE "public"."AboutPageSection";
