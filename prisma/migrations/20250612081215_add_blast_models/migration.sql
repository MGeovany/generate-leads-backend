-- CreateTable
CREATE TABLE "Blast" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Blast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlastTarget" (
    "id" TEXT NOT NULL,
    "blastId" TEXT NOT NULL,
    "interactionId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlastTarget_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Blast" ADD CONSTRAINT "Blast_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlastTarget" ADD CONSTRAINT "BlastTarget_blastId_fkey" FOREIGN KEY ("blastId") REFERENCES "Blast"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlastTarget" ADD CONSTRAINT "BlastTarget_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "Interaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
