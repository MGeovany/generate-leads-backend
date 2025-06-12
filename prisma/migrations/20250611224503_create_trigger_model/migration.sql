-- CreateTable
CREATE TABLE "Trigger" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "responseType" TEXT NOT NULL,
    "responseText" TEXT,
    "responsePublic" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trigger_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
