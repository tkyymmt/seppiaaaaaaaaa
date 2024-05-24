/*
  Warnings:

  - You are about to drop the `Categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Clients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CategoriesToClients` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CategoriesToClients" DROP CONSTRAINT "_CategoriesToClients_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoriesToClients" DROP CONSTRAINT "_CategoriesToClients_B_fkey";

-- DropTable
DROP TABLE "Categories";

-- DropTable
DROP TABLE "Clients";

-- DropTable
DROP TABLE "_CategoriesToClients";

-- CreateTable
CREATE TABLE "clients" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToClient" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToClient_AB_unique" ON "_CategoryToClient"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToClient_B_index" ON "_CategoryToClient"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToClient" ADD CONSTRAINT "_CategoryToClient_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToClient" ADD CONSTRAINT "_CategoryToClient_B_fkey" FOREIGN KEY ("B") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
