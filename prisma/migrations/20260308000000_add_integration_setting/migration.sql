-- CreateTable
CREATE TABLE IF NOT EXISTS "IntegrationSetting" (
    "id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "apiKey" TEXT,
    "clientId" TEXT,
    "extraConfig" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntegrationSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "IntegrationSetting_service_key" ON "IntegrationSetting"("service");
