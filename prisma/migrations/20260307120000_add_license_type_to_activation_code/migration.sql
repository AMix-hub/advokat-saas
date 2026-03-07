-- AlterTable: Add licenseType to ActivationCode (SOLO | BYRA)
ALTER TABLE "ActivationCode" ADD COLUMN IF NOT EXISTS "licenseType" TEXT NOT NULL DEFAULT 'SOLO';
