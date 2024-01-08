/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `BankAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uuid` to the `BankAccount` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[BankAccount] ADD [uuid] NVARCHAR(1000) NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[BankAccount] ADD CONSTRAINT [BankAccount_uuid_key] UNIQUE NONCLUSTERED ([uuid]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
