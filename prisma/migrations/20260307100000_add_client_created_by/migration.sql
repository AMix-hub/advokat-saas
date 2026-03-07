-- AlterTable: Add createdById to Client for user-level data isolation
ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "createdById" TEXT;

-- DropIndex: Remove global email uniqueness constraint
DROP INDEX IF EXISTS "Client_email_key";

-- CreateIndex: Add user-scoped email uniqueness (each user can't have duplicate emails)
CREATE UNIQUE INDEX IF NOT EXISTS "Client_email_createdById_key" ON "Client"("email", "createdById");

-- AddForeignKey: Link createdById to User
ALTER TABLE "Client" ADD CONSTRAINT "Client_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
