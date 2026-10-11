/*
  Warnings:

  - Added the required column `chatRoomUniqueIdentifier` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "chatRoomUniqueIdentifier" TEXT NOT NULL;
