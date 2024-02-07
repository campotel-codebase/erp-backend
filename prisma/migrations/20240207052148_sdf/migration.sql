/*
  Warnings:

  - Made the column `bloodType` on table `Employee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `employmentType` on table `Employee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `employeeCompanyId` on table `Employee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `jobTitle` on table `Employee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `department` on table `Employee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `talentSegment` on table `Employee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `benefits` on table `Employee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `taxId` on table `Employee` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Company] ADD [absenceTypes] VARCHAR(255);

-- AlterTable
ALTER TABLE [dbo].[Employee] ALTER COLUMN [bloodType] VARCHAR(20) NOT NULL;
ALTER TABLE [dbo].[Employee] ALTER COLUMN [employmentType] VARCHAR(255) NOT NULL;
ALTER TABLE [dbo].[Employee] ALTER COLUMN [employeeCompanyId] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Employee] ALTER COLUMN [jobTitle] VARCHAR(255) NOT NULL;
ALTER TABLE [dbo].[Employee] ALTER COLUMN [department] VARCHAR(255) NOT NULL;
ALTER TABLE [dbo].[Employee] ALTER COLUMN [talentSegment] VARCHAR(255) NOT NULL;
ALTER TABLE [dbo].[Employee] ALTER COLUMN [benefits] VARCHAR(255) NOT NULL;
ALTER TABLE [dbo].[Employee] ALTER COLUMN [taxId] VARCHAR(100) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
