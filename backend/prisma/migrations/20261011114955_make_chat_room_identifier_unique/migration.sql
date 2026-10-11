/*
  Warnings:

  - A unique constraint covering the columns `[chatRoomUniqueIdentifier]` on the table `ChatRoom` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_chatRoomUniqueIdentifier_key" ON "ChatRoom"("chatRoomUniqueIdentifier");
