/*
  Warnings:

  - Added the required column `companyId` to the `EmploymentHistory` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[EmploymentHistory] ADD [companyId] INT NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[EmploymentHistory] ADD CONSTRAINT [EmploymentHistory_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[Company]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
