-- Migration: Make IntegrationSetting per-user instead of global

-- Step 1: Delete all existing global integration settings (they were admin-level, now moved to per-user)
DELETE FROM "IntegrationSetting";

-- Step 2: Drop the old unique constraint on service alone
DROP INDEX IF EXISTS "IntegrationSetting_service_key";

-- Step 3: Add userId column (required)
ALTER TABLE "IntegrationSetting" ADD COLUMN "userId" TEXT NOT NULL;

-- Step 4: Add foreign key constraint to User
ALTER TABLE "IntegrationSetting" ADD CONSTRAINT "IntegrationSetting_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 5: Add new composite unique constraint
CREATE UNIQUE INDEX "IntegrationSetting_service_userId_key"
  ON "IntegrationSetting"("service", "userId");
