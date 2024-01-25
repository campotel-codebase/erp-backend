/*
  Warnings:

  - Added the required column `companyId` to the `BankAccount` table without a default value. This is not possible if the table is not empty.
  - Made the column `employeeId` on table `BankAccount` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[BankAccount] ALTER COLUMN [employeeId] INT NOT NULL;
ALTER TABLE [dbo].[BankAccount] ADD [companyId] INT NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[BankAccount] ADD CONSTRAINT [BankAccount_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[Company]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
