/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `EmploymentHistory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uuid` to the `EmploymentHistory` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[EmploymentHistory] ADD [uuid] NVARCHAR(1000) NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[EmploymentHistory] ADD CONSTRAINT [EmploymentHistory_uuid_key] UNIQUE NONCLUSTERED ([uuid]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
