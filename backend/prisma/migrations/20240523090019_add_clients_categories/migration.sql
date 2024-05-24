/*
  Warnings:

  - You are about to drop the `_CategoryToClient` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToClient" DROP CONSTRAINT "_CategoryToClient_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToClient" DROP CONSTRAINT "_CategoryToClient_B_fkey";

-- DropTable
DROP TABLE "_CategoryToClient";

-- CreateTable
CREATE TABLE "clients_categories" (
    "clientId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "clients_categories_pkey" PRIMARY KEY ("clientId","categoryId")
);

-- AddForeignKey
ALTER TABLE "clients_categories" ADD CONSTRAINT "clients_categories_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients_categories" ADD CONSTRAINT "clients_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
