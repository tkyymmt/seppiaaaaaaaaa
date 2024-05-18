-- CreateTable
CREATE TABLE "Clients" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoriesToClients" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoriesToClients_AB_unique" ON "_CategoriesToClients"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoriesToClients_B_index" ON "_CategoriesToClients"("B");

-- AddForeignKey
ALTER TABLE "_CategoriesToClients" ADD CONSTRAINT "_CategoriesToClients_A_fkey" FOREIGN KEY ("A") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriesToClients" ADD CONSTRAINT "_CategoriesToClients_B_fkey" FOREIGN KEY ("B") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
