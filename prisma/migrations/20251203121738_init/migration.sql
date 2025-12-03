-- CreateTable
CREATE TABLE "ProductionRecord" (
    "id" SERIAL NOT NULL,
    "faccd" TEXT,
    "setsubicd" TEXT,
    "dateYmd" TIMESTAMP(3),
    "itemcd" TEXT,
    "planqty" INTEGER,
    "cmpqty" INTEGER,
    "rtqty" INTEGER,
    "worktime" DOUBLE PRECISION,
    "setuptime" DOUBLE PRECISION,
    "st" INTEGER,
    "nop" INTEGER,
    "nosp" INTEGER,
    "shift" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductionRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RuntimeEvent" (
    "id" SERIAL NOT NULL,
    "productionId" INTEGER NOT NULL,
    "rtcd" TEXT,
    "rtflg" TEXT,
    "excludeSn" TEXT,
    "rtmel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RuntimeEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RuntimeEvent" ADD CONSTRAINT "RuntimeEvent_productionId_fkey" FOREIGN KEY ("productionId") REFERENCES "ProductionRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
