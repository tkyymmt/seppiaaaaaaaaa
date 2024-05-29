/*
  Warnings:

  - You are about to drop the `clients_categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "clients_categories" DROP CONSTRAINT "clients_categories_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "clients_categories" DROP CONSTRAINT "clients_categories_clientId_fkey";

-- DropTable
DROP TABLE "clients_categories";

-- CreateTable
CREATE TABLE "_CategoryToClient" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToClient_AB_unique" ON "_CategoryToClient"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToClient_B_index" ON "_CategoryToClient"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToClient" ADD CONSTRAINT "_CategoryToClient_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToClient" ADD CONSTRAINT "_CategoryToClient_B_fkey" FOREIGN KEY ("B") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
