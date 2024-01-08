/*
  Warnings:

  - You are about to drop the column `employeecompanyId` on the `Employee` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Employee] DROP COLUMN [employeecompanyId];
ALTER TABLE [dbo].[Employee] ADD [employeeCompanyId] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
