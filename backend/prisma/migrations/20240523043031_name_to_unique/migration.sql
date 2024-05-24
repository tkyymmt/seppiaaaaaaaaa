/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `clients` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "clients_name_key" ON "clients"("name");
