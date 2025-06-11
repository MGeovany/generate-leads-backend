/*
  Modified migration to handle existing data:
  
  - Add columns as nullable first
  - Set default values for existing rows
  - Make columns NOT NULL
*/

-- Step 1: Add columns as nullable
ALTER TABLE "User" ADD COLUMN "igUserId" TEXT;
ALTER TABLE "User" ADD COLUMN "pageAccessToken" TEXT;
ALTER TABLE "User" ADD COLUMN "pageId" TEXT;

-- Step 2: Update existing rows with placeholder values
UPDATE "User" SET 
  "igUserId" = 'placeholder_ig_user_id',
  "pageAccessToken" = 'placeholder_page_access_token',
  "pageId" = 'placeholder_page_id'
WHERE "igUserId" IS NULL OR "pageAccessToken" IS NULL OR "pageId" IS NULL;

-- Step 3: Make columns NOT NULL
ALTER TABLE "User" ALTER COLUMN "igUserId" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "pageAccessToken" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "pageId" SET NOT NULL;
