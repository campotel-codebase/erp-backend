/*
  Warnings:

  - You are about to drop the column `employmentStatus` on the `Employee` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Employee] DROP COLUMN [employmentStatus];
ALTER TABLE [dbo].[Employee] ADD [employmentType] VARCHAR(255);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
