-- Migration: Make IntegrationSetting per-user instead of global (idempotent)

-- Step 1: Delete all existing global integration settings (they were admin-level, now moved to per-user)
DELETE FROM "IntegrationSetting";

-- Step 2: Drop the old unique constraint on service alone
DROP INDEX IF EXISTS "IntegrationSetting_service_key";

-- Step 3: Add userId column if it does not already exist
-- Table is empty after Step 1, so NOT NULL without a default is safe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'IntegrationSetting' AND column_name = 'userId'
  ) THEN
    ALTER TABLE "IntegrationSetting" ADD COLUMN "userId" TEXT NOT NULL;
  END IF;
END $$;

-- Step 4: Add foreign key constraint to User if it does not already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'IntegrationSetting_userId_fkey'
  ) THEN
    ALTER TABLE "IntegrationSetting" ADD CONSTRAINT "IntegrationSetting_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Step 5: Add new composite unique constraint if it does not already exist
CREATE UNIQUE INDEX IF NOT EXISTS "IntegrationSetting_service_userId_key"
  ON "IntegrationSetting"("service", "userId");
