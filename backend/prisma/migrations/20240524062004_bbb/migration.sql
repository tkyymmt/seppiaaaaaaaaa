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
