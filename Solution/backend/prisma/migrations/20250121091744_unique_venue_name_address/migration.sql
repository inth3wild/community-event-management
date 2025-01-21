/*
  Warnings:

  - A unique constraint covering the columns `[name,address]` on the table `Venue` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Venue_name_idx" ON "Venue"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Venue_name_address_key" ON "Venue"("name", "address");
