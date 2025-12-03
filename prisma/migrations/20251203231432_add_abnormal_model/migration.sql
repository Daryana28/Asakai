-- CreateTable
CREATE TABLE "Abnormal" (
    "id" SERIAL NOT NULL,
    "problem" TEXT NOT NULL,
    "temporary" TEXT NOT NULL,
    "fix" TEXT NOT NULL,
    "fourM" TEXT NOT NULL,
    "rule" TEXT NOT NULL,
    "repair" TEXT NOT NULL,
    "why1" TEXT NOT NULL,
    "why2" TEXT NOT NULL,
    "why3" TEXT NOT NULL,
    "why4" TEXT NOT NULL,
    "why5" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Abnormal_pkey" PRIMARY KEY ("id")
);
